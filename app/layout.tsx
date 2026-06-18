import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://subsidysmejp.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Japan SME Subsidies and Employer Grants Guide",
    template: "%s | Japan SME Subsidies",
  },
  description:
    "Bilingual guide to Japan SME subsidies, Japanese government grants, employer subsidies, foreign employee support, and local business incentives.",
  keywords: [
    "Japan SME subsidies",
    "SME subsidies Japan",
    "Japanese government grants for SMEs",
    "Japan employer grants",
    "foreign employee subsidies Japan",
    "中小企業 補助金",
    "雇用 助成金",
    "外国人 雇用 助成金",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/en/sme-subsidies-japan",
      ja: "/ja/chusho-kigyo-hojokin",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Japan SME Subsidies and Employer Grants Guide",
    description:
      "Find official Japan SME subsidies, employer grants, foreign employee support, and local government incentive sources.",
    siteName: "Japan SME Subsidies",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Japan SME Subsidies and Employer Grants Guide",
    description:
      "Bilingual admin guide for Japan SME subsidies, employer grants, and local incentive sources.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Japan SME Subsidies",
    url: siteUrl,
    inLanguage: ["ja", "en"],
    creator: {
      "@type": "Person",
      name: "Shivankar Mehta",
      email: "shivankarmehta60@gmail.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ja">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
