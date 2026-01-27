// supabase/functions/join-trip-by-code/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type JoinTripRequest = {
  inviteCode?: string;
};

// In-memory rate limiting store (resets on function cold start)
// For production, consider using Redis/Upstash for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 attempts per minute per user

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(userId);

  if (!record || now > record.resetTime) {
    // Start new window
    rateLimitStore.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment count
  record.count++;
  return { allowed: true };
}

// Clean up old rate limit entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing environment configuration");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";

    // Create admin client with service role key (bypasses RLS)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Create user client to validate JWT
    const userClient = createClient(supabaseUrl, serviceRoleKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Validate user
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      console.log("Authentication failed");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;

    // Check rate limit for this user
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      console.log("Rate limit exceeded for user");
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Retry-After": String(rateCheck.retryAfter || 60)
        },
      });
    }

    // Periodic cleanup of rate limit store
    if (Math.random() < 0.1) {
      cleanupRateLimitStore();
    }

    console.log("Processing join request");

    const { inviteCode }: JoinTripRequest = await req.json().catch(() => ({}));

    const normalized = (inviteCode ?? "").trim().toLowerCase();

    if (!normalized) {
      return new Response(JSON.stringify({ error: "Invite code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate invite code format (should be 12 hex characters)
    if (!/^[a-f0-9]{12}$/.test(normalized)) {
      // Return same error as invalid code to prevent enumeration
      console.log("Invalid code format provided");
      return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
        status: 404,
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
      console.error("Database lookup error");
      // Return generic error to prevent enumeration
      return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!trip) {
      console.log("Code not found");
      return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Valid code, checking membership");

    // Check if already a member using admin client
    const { data: existingMember, error: memberLookupError } = await adminClient
      .from("trip_members")
      .select("id")
      .eq("trip_id", trip.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (memberLookupError) {
      console.error("Membership check error");
      // Return generic error to prevent enumeration
      return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
        status: 404,
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
      console.error("Failed to add member");
      // Return generic error to prevent enumeration
      return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Member successfully added");
    return new Response(JSON.stringify({ tripId: trip.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unhandled error in join-trip-by-code");
    // Return generic error to prevent enumeration
    return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
