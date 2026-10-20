import { createHash, timingSafeEqual } from "node:crypto";
import { getServiceRoleSupabaseClient } from "@/lib/supabase-admin";

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

function hasValidAdminSecret(candidate: string | undefined): boolean {
  const expected = process.env.ADMIN_SECRET;

  if (!candidate || !expected || candidate.length > 1024) {
    return false;
  }

  // Compare fixed-length digests so a request cannot learn the secret through
  // byte-by-byte comparison timing.
  const candidateDigest = createHash("sha256").update(candidate).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "")?.trim();

  if (!hasValidAdminSecret(token)) {
    return jsonError("Unauthorized", 401);
  }

  const supabase = getServiceRoleSupabaseClient();
  if (!supabase) {
    return jsonError("Analytics service is not configured", 503);
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
