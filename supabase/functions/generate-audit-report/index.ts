import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the user
    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const auditorId = claims.claims.sub as string;

    // Use service role for data aggregation
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Get auditor's assignments
    const { data: assignments } = await adminClient
      .from("audit_assignments")
      .select("farm_id")
      .eq("auditor_id", auditorId)
      .eq("status", "active");

    if (!assignments || assignments.length === 0) {
      return new Response(
        JSON.stringify({ error: "No active assignments found" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const farmIds = assignments.map((a) => a.farm_id);

    // Aggregate farm data
    const { data: farms } = await adminClient
      .from("farms")
      .select("id, name, area_hectares, crop_type, user_id")
      .in("id", farmIds);

    // Get photos summary per farm
    const { data: photos } = await adminClient
      .from("farm_photos")
      .select("farm_id, verification_status, captured_at, latitude, longitude")
      .in("farm_id", farmIds);

    // Get NDVI data per farm
    const { data: ndviData } = await adminClient
      .from("ndvi_readings")
      .select("farm_id, ndvi_value, health_score, reading_date")
      .in("farm_id", farmIds)
      .order("reading_date", { ascending: false });

    // Build report data
    const reportData = {
      generated_at: new Date().toISOString(),
      auditor_id: auditorId,
      total_farms: farms?.length ?? 0,
      total_photos: photos?.length ?? 0,
      farms: (farms ?? []).map((farm) => {
        const farmPhotos = (photos ?? []).filter((p) => p.farm_id === farm.id);
        const farmNdvi = (ndviData ?? []).filter((n) => n.farm_id === farm.id);
        const latestNdvi = farmNdvi[0];

        return {
          id: farm.id,
          name: farm.name,
          area_hectares: farm.area_hectares,
          crop_type: farm.crop_type,
          photo_summary: {
            total: farmPhotos.length,
            verified: farmPhotos.filter((p) => p.verification_status === "verified").length,
            pending: farmPhotos.filter((p) => p.verification_status === "pending").length,
            rejected: farmPhotos.filter((p) => p.verification_status === "rejected").length,
          },
          ndvi_summary: {
            latest_value: latestNdvi?.ndvi_value ?? null,
            latest_health: latestNdvi?.health_score ?? null,
            latest_date: latestNdvi?.reading_date ?? null,
            total_readings: farmNdvi.length,
            alert: latestNdvi?.ndvi_value !== null && (latestNdvi?.ndvi_value ?? 0) < 0.3,
          },
        };
      }),
      summary: {
        farms_with_alerts: (farms ?? []).filter((farm) => {
          const farmNdvi = (ndviData ?? []).filter((n) => n.farm_id === farm.id);
          return farmNdvi[0]?.ndvi_value !== null && (farmNdvi[0]?.ndvi_value ?? 1) < 0.3;
        }).length,
        photos_pending: (photos ?? []).filter((p) => p.verification_status === "pending").length,
        avg_health: (() => {
          const scores = (ndviData ?? [])
            .filter((n) => n.health_score !== null)
            .map((n) => n.health_score as number);
          return scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : null;
        })(),
      },
    };

    // Save report to database
    const { data: report, error: insertError } = await adminClient
      .from("audit_reports")
      .insert({
        auditor_id: auditorId,
        report_type: "seasonal",
        status: "generated",
        farm_ids: farmIds,
        report_data: reportData,
        generated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        report_id: report.id,
        summary: reportData.summary,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error generating report:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate report" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
