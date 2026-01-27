-- Add member_mode column to trips table to track if trip uses automatic or manual member adding
ALTER TABLE public.trips
ADD COLUMN member_mode text NOT NULL DEFAULT 'manual';

-- Add a check constraint for valid values
ALTER TABLE public.trips
ADD CONSTRAINT trips_member_mode_check CHECK (member_mode IN ('automatic', 'manual'));

-- Update the handle_new_user function to better extract display names from OAuth providers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  extracted_name text;
BEGIN
  -- Try to get name from various OAuth provider metadata fields
  extracted_name := COALESCE(
    -- Google OAuth typically uses 'full_name' or 'name'
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    -- Custom display_name from email signup
    NEW.raw_user_meta_data->>'display_name',
    -- Fallback to email prefix
    split_part(NEW.email, '@', 1)
  );
  
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, extracted_name);
  
  RETURN NEW;
END;
$$;