import type { MetadataRoute } from "next";
import { seoPages, siteUrl } from "./seo-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...seoPages.map((page) => ({
      url: `${siteUrl}${page.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page.slug.includes("sme") || page.slug.includes("chusho") ? 0.95 : 0.85,
    })),
  ];
}
