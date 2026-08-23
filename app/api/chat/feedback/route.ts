import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

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
    return Response.json({ error: "Forbidden request origin." }, { status: 403 });
  }

  if (!supabase) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { messageId, messageContent, sessionId, rating } = body;

    if (!messageId || !rating || (rating !== "up" && rating !== "down")) {
      return Response.json({ error: "Invalid feedback payload" }, { status: 400 });
    }

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const validSessionId = typeof sessionId === "string" && UUID_REGEX.test(sessionId.trim()) ? sessionId.trim() : null;

    // Upsert feedback
    const { error } = await supabase.from("chat_feedback").upsert(
      {
        message_id: String(messageId),
        message_content: typeof messageContent === "string" ? messageContent.slice(0, 1000) : null,
        session_id: validSessionId,
        rating,
      },
      { onConflict: "message_id" },
    );

    if (error) {
      console.error("[feedback-db-error]", error);
      return Response.json({ error: "Failed to record feedback" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[feedback-route-error]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
