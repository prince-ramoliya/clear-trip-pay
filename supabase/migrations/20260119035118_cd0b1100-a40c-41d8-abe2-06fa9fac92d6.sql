-- Tighten trip access: trips are only readable once you're a member/creator.
-- Remove the overly-permissive invite-code lookup policy.
DROP POLICY IF EXISTS "Anyone can lookup trips by invite code" ON public.trips;

-- Tighten membership inserts: only creators or existing members can add members.
-- Joining by invite code will be handled via a backend function (service-side validation).
DROP POLICY IF EXISTS "Trip members can add members or join via invite code" ON public.trip_members;

CREATE POLICY "Trip members can add members to their trips"
ON public.trip_members
FOR INSERT
WITH CHECK (
  -- Existing members can add other members
  is_trip_member(trip_id)
  OR
  -- Trip creators can add members
  (EXISTS (
    SELECT 1
    FROM public.trips
    WHERE trips.id = trip_members.trip_id
      AND trips.created_by = auth.uid()
  ))
);

-- (Keep existing trips SELECT policy: "Users can view trips they are members of".)
