import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const VALID_EVENTS = [
  "cv_preview",
  "cv_download",
  "command_palette",
  "copy_email",
  "role_matcher",
  "voice_briefing",
  "project_click",
  "page_view",
  "external_link",
] as const;
type ValidEventType = (typeof VALID_EVENTS)[number];

function hasValidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!supabase) {
    return Response.json({ success: true, warning: "Database not configured" });
  }

  try {
    const body = await request.json();
    const { eventType, metadata } = body;

    if (!eventType || !VALID_EVENTS.includes(eventType as ValidEventType)) {
      return Response.json({ error: "Invalid event type" }, { status: 400 });
    }

    // ── Server-Side Filter for Admin & Synthetic Test Events ──────────────────
    const metaObj = typeof metadata === "object" && metadata !== null ? (metadata as Record<string, unknown>) : null;
    const path = typeof metaObj?.path === "string" ? metaObj.path : typeof metaObj?.pathname === "string" ? metaObj.pathname : "";
    const targetUrl = typeof metaObj?.url === "string" ? metaObj.url : "";
    const referer = request.headers.get("referer") || "";

    if (
      path.includes("/admin") ||
      referer.includes("/admin") ||
      targetUrl.includes("playwright-test.internal")
    ) {
      // Silently accept without writing to database to keep analytics clean
      return Response.json({ success: true, ignored: "admin_or_test_traffic" });
    }

    await supabase.from("portfolio_events").insert({
      event_type: eventType,
      metadata: metaObj,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[telemetry-error]", err);
    return Response.json({ error: "Failed to record event" }, { status: 500 });
  }
}
