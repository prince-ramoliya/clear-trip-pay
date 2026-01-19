-- Create payments table to track settlement payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  from_member_id UUID NOT NULL REFERENCES public.trip_members(id) ON DELETE CASCADE,
  to_member_id UUID NOT NULL REFERENCES public.trip_members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view payments for their trips"
ON public.payments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_members.trip_id = payments.trip_id
    AND trip_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create payments for their trips"
ON public.payments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_members.trip_id = payments.trip_id
    AND trip_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete payments for their trips"
ON public.payments
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_members.trip_id = payments.trip_id
    AND trip_members.user_id = auth.uid()
  )
);

-- Enable realtime for payments
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;

-- Create index for faster lookups
CREATE INDEX idx_payments_trip_id ON public.payments(trip_id);
CREATE INDEX idx_payments_from_member ON public.payments(from_member_id);
CREATE INDEX idx_payments_to_member ON public.payments(to_member_id);