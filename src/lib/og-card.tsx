import { ImageResponse } from "next/og";
import { LETTER_COLORS } from "./colors";
import { SITE_TITLE } from "./site";

// Shared renderer for the Open Graph and Twitter share cards. One source keeps
// the two routes identical. ImageResponse is flexbox-only (no CSS grid) and
// caps the bundle at 500KB, so this stays to layout primitives and inline SVG.
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;
export const OG_ALT = SITE_TITLE;

const WORD = "Keyfetti";
const TAGLINE = "A playful keyboard toy for kids";

export function renderOgCard(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // Mirrors the in-app background gradient from main-app.tsx.
          background: "radial-gradient(circle at 50% 32%, #1b2a4a, #0a0f1f 72%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Confetti scatter above the wordmark. */}
        <div style={{ display: "flex", gap: 22, marginBottom: 56 }}>
          {LETTER_COLORS.map((color, i) => (
            <div
              key={i}
              style={{
                width: 26,
                height: 26,
                borderRadius: 26,
                background: color,
                transform: `translateY(${[0, 18, 8, 24, 4][i % 5]}px)`,
              }}
            />
          ))}
        </div>

        {/* Wordmark — each letter takes a colour from the app palette. */}
        <div style={{ display: "flex" }}>
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                fontSize: 184,
                fontWeight: 700,
                letterSpacing: -6,
                color: LETTER_COLORS[i % LETTER_COLORS.length],
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        <div style={{ fontSize: 46, fontWeight: 500, color: "#cdd6f4", marginTop: 28 }}>
          {TAGLINE}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
