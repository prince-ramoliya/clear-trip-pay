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

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Validate user
    const { data: userData, error: userError } = await admin.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { inviteCode }: JoinTripRequest = await req.json().catch(() => ({}));

    const normalized = (inviteCode ?? "").trim().toLowerCase();
    if (!normalized) {
      return new Response(JSON.stringify({ error: "Invite code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lookup trip by invite code (case-insensitive). This runs with service role.
    const { data: trip, error: tripError } = await admin
      .from("trips")
      .select("id,name,invite_code")
      .ilike("invite_code", normalized)
      .maybeSingle();

    if (tripError) {
      console.error("Trip lookup error", tripError);
      return new Response(JSON.stringify({ error: "Failed to lookup trip" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!trip) {
      return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // If already a member, just return trip id.
    const { data: existingMember, error: memberLookupError } = await admin
      .from("trip_members")
      .select("id")
      .eq("trip_id", trip.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (memberLookupError) {
      console.error("Member lookup error", memberLookupError);
      return new Response(JSON.stringify({ error: "Failed to check membership" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!existingMember) {
      // Get display name (best-effort)
      const { data: profile } = await admin
        .from("profiles")
        .select("display_name")
        .eq("id", userId)
        .maybeSingle();

      const displayName = profile?.display_name ?? "New Member";

      const { error: insertError } = await admin.from("trip_members").insert({
        trip_id: trip.id,
        user_id: userId,
        display_name: displayName,
        is_registered: true,
      });

      if (insertError) {
        console.error("Member insert error", insertError);
        return new Response(JSON.stringify({ error: "Failed to join trip" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

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
