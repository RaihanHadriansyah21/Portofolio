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
    const { name, email, message, sessionId } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return Response.json({ error: "Valid email is required" }, { status: 400 });
    }

    const { error } = await supabase.from("chat_leads").insert({
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 120),
      message: typeof message === "string" ? message.trim().slice(0, 500) : null,
      session_id: typeof sessionId === "string" ? sessionId : null,
    });

    if (error) {
      console.error("[lead-db-error]", error);
      return Response.json({ error: "Failed to record contact" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[lead-route-error]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
