import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#050505",
        color: "#f5f5f2",
        display: "flex",
        fontSize: 30,
        fontWeight: 800,
        height: "100%",
        justifyContent: "center",
        letterSpacing: "-0.08em",
        width: "100%",
      }}
    >
      R.
    </div>,
    size,
  );
}
