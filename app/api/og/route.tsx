import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Reyy · Portfolio";
    const subtitle = searchParams.get("subtitle") || "AI/ML Engineer & Full-Stack Developer";
    const tags = searchParams.get("tags") || "Applied AI · Next.js · FastAPI · TensorFlow · Supabase";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#0b0c0e",
            backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.03) 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "60px 80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Top Brand Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: 900,
                }}
              >
                R
              </div>
              <span style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.03em" }}>Reyy.</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontSize: "16px",
                color: "#4ade80",
                fontWeight: 600,
              }}
            >
              ● PORTFOLIO 2026
            </div>
          </div>

          {/* Center Main Copy */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "980px" }}>
            <div style={{ fontSize: "20px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              {subtitle}
            </div>
            <div
              style={{
                fontSize: "52px",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.04em",
                color: "#ffffff",
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom Tags */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              {tags.split("·").map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    fontSize: "16px",
                    color: "#e5e7eb",
                  }}
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
            <div style={{ fontSize: "16px", color: "#6b7280" }}>portoreyy.vercel.app</div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
