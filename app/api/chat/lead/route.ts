import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { checkLeadRateLimit, getClientRateLimitIdentifier } from "@/lib/chat-rate-limit";

export const runtime = "nodejs";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const NOTIFY_EMAIL = process.env.NOTIFICATION_EMAIL || "reyyhadri@gmail.com";
const MAX_LEAD_BYTES = 16 * 1024; // 16 KB maximum payload size
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

async function sendLeadEmail(name: string, email: string, message: string | null) {
  if (!resend) return;

  const timeWib = new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "medium",
  });

  try {
    await resend.emails.send({
      from: "Reyy Portfolio <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `🎉 Pesan Baru Rekruter: ${name} (${email})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d0e; color: #f3f4f6; margin: 0; padding: 24px;">
          <div style="max-width: 560px; margin: 0 auto; background: #17181c; border: 1px solid #2e3038; border-radius: 12px; padding: 28px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
            
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #2e3038; padding-bottom: 16px; margin-bottom: 20px;">
              <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.1em; color: #4ade80; text-transform: uppercase;">● REYY.AI LEAD ALERT</span>
              <span style="font-size: 12px; color: #9ca3af;">${timeWib} WIB</span>
            </div>

            <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px; color: #ffffff;">
              Seorang rekruter/pengunjung baru saja meninggalkan kontak:
            </h2>

            <div style="background: #0f1013; border: 1px solid #282a32; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
              <div style="margin-bottom: 12px;">
                <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Nama</span>
                <p style="margin: 2px 0 0; font-size: 16px; font-weight: 600; color: #ffffff;">${name}</p>
              </div>

              <div style="margin-bottom: 12px;">
                <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Email Kontak</span>
                <p style="margin: 2px 0 0; font-size: 15px; font-weight: 500;">
                  <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a>
                </p>
              </div>

              <div>
                <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em;">Pesan / Catatan</span>
                <p style="margin: 4px 0 0; font-size: 14px; line-height: 1.5; color: #e5e7eb; font-style: italic; background: rgba(255,255,255,0.03); padding: 10px 12px; border-radius: 6px;">
                  "${message || "Tidak ada pesan tambahan."}"
                </p>
              </div>
            </div>

            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="mailto:${email}?subject=Halo%20${encodeURIComponent(name)}%20-%20Salam%20dari%20Reyy%20(Portofolio)" 
                 style="display: inline-block; background: #ffffff; color: #000000; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; text-align: center;">
                ✉️ Balas ke ${name}
              </a>
              <a href="https://portoreyy.vercel.app/id/admin" 
                 style="display: inline-block; background: #282a32; color: #e5e7eb; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-weight: 500; font-size: 14px; text-align: center;">
                📊 Buka Dashboard Admin
              </a>
            </div>

            <p style="margin-top: 24px; font-size: 11px; color: #6b7280; text-align: center; border-top: 1px solid #2e3038; padding-top: 14px;">
              Notifikasi otomatis dari portoreyy.vercel.app · Powered by Resend
            </p>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("[resend-email-error]", err);
  }
}

export async function POST(request: Request) {
  // 1. Origin verification
  if (!hasValidOrigin(request)) {
    return Response.json({ error: "Forbidden request origin." }, { status: 403 });
  }

  // 2. Rate-limiting check (executed before parsing/DB/email to protect resources)
  const identifier = await getClientRateLimitIdentifier(request);
  const rate = await checkLeadRateLimit(identifier);
  if (!rate.allowed) {
    return Response.json(
      { error: "Too many contact submissions. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfter),
        },
      }
    );
  }

  // 3. Content-Type and payload size validation
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return Response.json({ error: "Expected application/json request." }, { status: 415 });
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_LEAD_BYTES) {
    return Response.json({ error: "Payload exceeds size limit." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_LEAD_BYTES) {
      return Response.json({ error: "Payload exceeds size limit." }, { status: 413 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON format." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // 4. Server-side Honeypot validation (Authoritative silent drop)
  // If the honeypot field is populated by an automated bot, return fake success without Supabase write or Resend email
  const honeypot = body.company_site_hp ?? body.honeypot ?? body.website;
  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return Response.json({ success: true });
  }

  // 5. Field validation & sanitization
  const { name, email, message, sessionId } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return Response.json({ error: "Name is required." }, { status: 400 });
  }

  if (name.trim().length > 100) {
    return Response.json({ error: "Name must be 100 characters or fewer." }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return Response.json({ error: "Valid email address is required." }, { status: 400 });
  }

  if (email.trim().length > 120) {
    return Response.json({ error: "Email must be 120 characters or fewer." }, { status: 400 });
  }

  if (message !== undefined && message !== null) {
    if (typeof message !== "string") {
      return Response.json({ error: "Message must be a string." }, { status: 400 });
    }
    if (message.length > 2000) {
      return Response.json({ error: "Message exceeds maximum length of 2000 characters." }, { status: 400 });
    }
  }

  if (!supabase) {
    return Response.json({ error: "Service temporarily unavailable." }, { status: 503 });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanMessage = typeof message === "string" && message.trim() ? message.trim() : null;
  const validSessionId = typeof sessionId === "string" && UUID_REGEX.test(sessionId.trim()) ? sessionId.trim() : null;

  try {
    // 6. Save to Supabase for persistence and Admin Dashboard display
    const { error } = await supabase.from("chat_leads").insert({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      session_id: validSessionId,
    });

    if (error) {
      console.error("[lead-db-error]", error);
      return Response.json({ error: "Failed to record contact." }, { status: 500 });
    }

    // 7. Fire instant email alert via Resend in the background
    sendLeadEmail(cleanName, cleanEmail, cleanMessage).catch((e) => {
      console.error("[sendLeadEmail-async-error]", e);
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("[lead-route-error]", err);
    return Response.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
