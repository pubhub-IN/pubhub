// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// This function runs on a cron schedule at 2am each day
// to delete chat messages older than 48 hours
serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      // @ts-ignore
      Deno.env.get("SUPABASE_URL") ?? "",
      // @ts-ignore
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Delete messages older than 48 hours
    const { error } = await supabaseClient
      .from("chat_messages")
      .delete()
      .lt(
        "created_at",
        new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      );

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Deleted chat messages older than 48 hours",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

/* To set up the Edge Function:
 * 1. Deploy this function to Supabase Edge Functions
 * 2. Schedule it to run daily with:
 *    - supabase functions schedule cleanup-chat-messages --cron "0 2 * * *"
 */