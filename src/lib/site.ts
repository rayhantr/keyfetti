// Single source of truth for the site's public identity. Reused across
// metadata, the OG card, the manifest, robots, sitemap and JSON-LD so the
// production URL only ever needs to change in one place (set NEXT_PUBLIC_SITE_URL
// at deploy time; the fallback covers local dev and previews).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://keyfetti.app";

export const SITE_NAME = "Keyfetti";

export const SITE_TITLE = "Keyfetti — a playful keyboard toy for kids";

export const SITE_DESCRIPTION =
  "Keyfetti is a free, kid-safe keyboard toy: press any letter or number and watch it burst into confetti, float up, and be spoken aloud. No ads, no setup — perfect for toddlers learning their letters.";
