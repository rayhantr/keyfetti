import { ImageResponse } from "next/og";

// Generated Apple touch icon — keeps the brand mark on-brand without shipping a
// binary asset. Next auto-links this as <link rel="apple-touch-icon">.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 35%, #1b2a4a, #0a0f1f 75%)",
          fontFamily: "sans-serif",
        }}
      >
        <span style={{ fontSize: 118, fontWeight: 700, color: "#FFD23D" }}>K</span>
      </div>
    ),
    { ...size },
  );
}
