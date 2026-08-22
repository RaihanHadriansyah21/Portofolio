import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status: number) {
  return Response.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "")?.trim();

  if (!token) {
    return jsonError("Unauthorized", 401);
  }

  if (!supabase) {
    return jsonError("Database service is not configured", 503);
  }

  try {
    const { data, error } = await supabase.rpc("get_chat_analytics", {
      admin_key: token,
    });

    if (error) {
      if (error.message.includes("Unauthorized")) {
        return jsonError("Invalid credentials", 401);
      }
      console.error("[analytics-rpc-error]", error);
      return jsonError("Failed to fetch analytics", 500);
    }

    return Response.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (err) {
    console.error("[analytics-route-error]", err);
    return jsonError("Internal server error", 500);
  }
}
