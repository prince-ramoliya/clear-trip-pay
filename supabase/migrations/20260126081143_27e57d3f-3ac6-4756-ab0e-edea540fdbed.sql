-- Add UPDATE policy for payments table to allow trip members to update payment records
CREATE POLICY "Users can update payments for their trips" 
ON public.payments 
FOR UPDATE 
USING (EXISTS ( 
  SELECT 1 
  FROM trip_members 
  WHERE trip_members.trip_id = payments.trip_id 
    AND trip_members.user_id = auth.uid()
));