import { MainApp } from "@/components/main-app";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

// Structured data for rich results. The UI is a client-rendered toy with no
// crawlable copy, so this server component supplies the indexable text: a
// schema.org graph, a screen-reader heading/intro, and a <noscript> fallback.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any (web browser)",
      browserRequirements: "Requires JavaScript and a modern browser",
      inLanguage: "en",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      audience: { "@type": "PeopleAudience", suggestedMinAge: 1, suggestedMaxAge: 6 },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" to keep the JSON-LD payload from breaking out of the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <h1 className="sr-only">{SITE_TITLE}</h1>
      <p className="sr-only">{SITE_DESCRIPTION}</p>
      <noscript>
        <p style={{ padding: 24 }}>
          {SITE_DESCRIPTION} Please enable JavaScript to play.
        </p>
      </noscript>
      <MainApp />
    </>
  );
}
