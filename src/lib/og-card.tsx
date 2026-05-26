import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_TITLE } from "./site";

// Shared renderer for the Open Graph and Twitter share cards. One source keeps
// the two routes identical. ImageResponse is flexbox-only (no CSS grid) and
// caps the bundle at 500KB, so this stays to layout primitives and inline SVG.
//
// The wordmark is the real cover logo (public/cover.png — the same file the
// README shows), embedded as a base64 data URI. ImageResponse runs on the
// Node.js runtime by default, and these routes are statically optimized, so the
// file is read once at build time. The logo's transparent background sits on
// the app gradient, which also fixes how it renders on platforms that don't
// honour transparency.
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;
export const OG_ALT = SITE_TITLE;

const TAGLINE = "A playful keyboard toy for kids";

// Source logo is 998×427; preserve that ratio while leaving generous padding
// inside the 1200×630 card.
const LOGO_WIDTH = 720;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 427) / 998);

export async function renderOgCard(): Promise<ImageResponse> {
  const logo = await readFile(join(process.cwd(), "public/cover.png"), "base64");
  const logoSrc = `data:image/png;base64,${logo}`;

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={LOGO_WIDTH} height={LOGO_HEIGHT} alt="" />

        <div style={{ fontSize: 46, fontWeight: 500, color: "#cdd6f4", marginTop: 48 }}>
          {TAGLINE}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
