-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create trips table
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Create trip_members table (join table for users and trips)
CREATE TABLE public.trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  is_registered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, user_id),
  UNIQUE(trip_id, display_name)
);

-- Enable RLS on trip_members
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  paid_by UUID REFERENCES public.trip_members(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create expense_participants table (which members share this expense)
CREATE TABLE public.expense_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.trip_members(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(expense_id, member_id)
);

-- Enable RLS on expense_participants
ALTER TABLE public.expense_participants ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is a trip member
CREATE OR REPLACE FUNCTION public.is_trip_member(trip_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_members.trip_id = is_trip_member.trip_id
    AND trip_members.user_id = auth.uid()
  )
$$;

-- Trips policies
CREATE POLICY "Users can view trips they are members of"
ON public.trips FOR SELECT
USING (public.is_trip_member(id) OR created_by = auth.uid());

CREATE POLICY "Authenticated users can create trips"
ON public.trips FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Trip creators can update their trips"
ON public.trips FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Trip creators can delete their trips"
ON public.trips FOR DELETE
USING (created_by = auth.uid());

-- Trip members policies
CREATE POLICY "Trip members can view all members of their trips"
ON public.trip_members FOR SELECT
USING (public.is_trip_member(trip_id));

CREATE POLICY "Trip members can add members to their trips"
ON public.trip_members FOR INSERT
WITH CHECK (public.is_trip_member(trip_id) OR EXISTS (
  SELECT 1 FROM public.trips WHERE id = trip_id AND created_by = auth.uid()
));

CREATE POLICY "Trip members can update their own membership"
ON public.trip_members FOR UPDATE
USING (user_id = auth.uid() OR public.is_trip_member(trip_id));

CREATE POLICY "Trip creators can delete members"
ON public.trip_members FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND created_by = auth.uid())
  OR user_id = auth.uid()
);

-- Expenses policies
CREATE POLICY "Trip members can view expenses"
ON public.expenses FOR SELECT
USING (public.is_trip_member(trip_id));

CREATE POLICY "Trip members can add expenses"
ON public.expenses FOR INSERT
WITH CHECK (public.is_trip_member(trip_id));

CREATE POLICY "Trip members can update expenses"
ON public.expenses FOR UPDATE
USING (public.is_trip_member(trip_id));

CREATE POLICY "Trip members can delete expenses"
ON public.expenses FOR DELETE
USING (public.is_trip_member(trip_id));

-- Expense participants policies
CREATE POLICY "Trip members can view expense participants"
ON public.expense_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.expenses e
    WHERE e.id = expense_id AND public.is_trip_member(e.trip_id)
  )
);

CREATE POLICY "Trip members can add expense participants"
ON public.expense_participants FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.expenses e
    WHERE e.id = expense_id AND public.is_trip_member(e.trip_id)
  )
);

CREATE POLICY "Trip members can delete expense participants"
ON public.expense_participants FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.expenses e
    WHERE e.id = expense_id AND public.is_trip_member(e.trip_id)
  )
);

-- Function to handle new user signup (create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expense_participants;