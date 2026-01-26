// supabase/functions/join-trip-by-code/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type JoinTripRequest = {
  inviteCode?: string;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    console.log("Auth header present:", !!authHeader);

    // Create admin client with service role key (bypasses RLS)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Create user client to validate JWT
    const userClient = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Validate user
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      console.error("User auth failed");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("User authenticated successfully");

    const { inviteCode }: JoinTripRequest = await req.json().catch(() => ({}));

    const normalized = (inviteCode ?? "").trim().toLowerCase();
    console.log("Processing invite code request");

    if (!normalized) {
      return new Response(JSON.stringify({ error: "Invite code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lookup trip by invite code using admin client (bypasses RLS)
    const { data: trip, error: tripError } = await adminClient
      .from("trips")
      .select("id,name,invite_code")
      .ilike("invite_code", normalized)
      .maybeSingle();

    if (tripError) {
      console.error("Trip lookup failed");
      return new Response(JSON.stringify({ error: "Failed to lookup trip" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!trip) {
      console.log("Invalid invite code provided");
      return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    console.log("Checking trip membership");

    // Check if already a member using admin client
    const { data: existingMember, error: memberLookupError } = await adminClient
      .from("trip_members")
      .select("id")
      .eq("trip_id", trip.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (memberLookupError) {
      console.error("Membership check failed");
      return new Response(JSON.stringify({ error: "Failed to check membership" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existingMember) {
      console.log("User already a member");
      return new Response(JSON.stringify({ tripId: trip.id, alreadyMember: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get display name using admin client
    const { data: profile } = await adminClient
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .maybeSingle();

    const displayName = profile?.display_name ?? "New Member";
    console.log("Adding new member to trip");

    const { error: insertError } = await adminClient.from("trip_members").insert({
      trip_id: trip.id,
      user_id: userId,
      display_name: displayName,
      is_registered: true,
    });

    if (insertError) {
      console.error("Failed to add member to trip");
      return new Response(JSON.stringify({ error: "Failed to join trip" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Member successfully added to trip");
    return new Response(JSON.stringify({ tripId: trip.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unhandled join-trip-by-code error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
