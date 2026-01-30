-- Add text field length constraints for security hardening

-- Expenses table: title max 200 chars
ALTER TABLE public.expenses
ADD CONSTRAINT expenses_title_length CHECK (char_length(title) <= 200);

-- Trips table: name max 100 chars, destination max 200 chars
ALTER TABLE public.trips
ADD CONSTRAINT trips_name_length CHECK (char_length(name) <= 100),
ADD CONSTRAINT trips_destination_length CHECK (char_length(destination) <= 200);

-- Trip members table: display_name max 100 chars
ALTER TABLE public.trip_members
ADD CONSTRAINT trip_members_display_name_length CHECK (char_length(display_name) <= 100);

-- Profiles table: display_name max 100 chars
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_display_name_length CHECK (char_length(display_name) <= 100);

-- Payments table: notes max 500 chars
ALTER TABLE public.payments
ADD CONSTRAINT payments_notes_length CHECK (notes IS NULL OR char_length(notes) <= 500);