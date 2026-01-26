-- Add CHECK constraints to expenses table to validate amount is positive and within reasonable bounds
ALTER TABLE public.expenses 
ADD CONSTRAINT expenses_amount_positive CHECK (amount > 0 AND amount < 999999999);

-- Add CHECK constraints to payments table for consistency
ALTER TABLE public.payments 
ADD CONSTRAINT payments_amount_positive CHECK (amount > 0 AND amount < 999999999);