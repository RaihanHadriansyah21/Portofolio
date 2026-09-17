import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // 1. Verify Vercel Cron Secret (if configured in environment)
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. Check Supabase client initialization
  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        warning: "Supabase client not initialized or missing env variables (SUPABASE_URL, SUPABASE_ANON_KEY)",
      },
      { status: 503 }
    );
  }

  try {
    const startTime = Date.now();

    // 3. Perform a lightweight read query to register activity in Supabase PostgreSQL
    const { error: queryError } = await supabase
      .from("portfolio_events")
      .select("id")
      .limit(1);

    if (queryError) {
      console.error("[supabase-keep-alive-error]", queryError);
      return NextResponse.json(
        {
          success: false,
          error: queryError.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "Supabase keep-alive ping successful. Project is active and compute is warm.",
      durationMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("[supabase-keep-alive-exception]", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
