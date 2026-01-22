-- Add UPDATE policy for expense_participants table
-- This restricts updates to trip members only, matching the existing INSERT and DELETE policies

CREATE POLICY "Trip members can update expense participants"
ON public.expense_participants
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.expenses e
    WHERE e.id = expense_participants.expense_id
    AND is_trip_member(e.trip_id)
  )
);