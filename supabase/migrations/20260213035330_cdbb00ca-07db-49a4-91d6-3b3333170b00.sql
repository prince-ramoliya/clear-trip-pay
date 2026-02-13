-- Make start_date and end_date optional with sensible defaults
ALTER TABLE public.trips ALTER COLUMN start_date SET DEFAULT CURRENT_DATE;
ALTER TABLE public.trips ALTER COLUMN end_date SET DEFAULT CURRENT_DATE;