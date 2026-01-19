-- Allow authenticated users to view trips by invite code (for joining)
CREATE POLICY "Anyone can lookup trips by invite code" 
ON public.trips 
FOR SELECT 
USING (
  invite_code IS NOT NULL AND auth.uid() IS NOT NULL
);

-- Also need to allow users to insert themselves as members when joining via invite code
-- Update the existing INSERT policy to allow joining via invite code
DROP POLICY IF EXISTS "Trip members can add members to their trips" ON public.trip_members;

CREATE POLICY "Trip members can add members or join via invite code" 
ON public.trip_members 
FOR INSERT 
WITH CHECK (
  -- Existing members can add other members
  is_trip_member(trip_id) 
  OR 
  -- Trip creators can add members
  (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.created_by = auth.uid()))
  OR
  -- Users can add themselves when joining via a valid invite code
  (user_id = auth.uid() AND EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.invite_code IS NOT NULL))
);