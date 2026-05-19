import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.hadiya-travel.uz";
  const lastModified = "2025-03-11";
  const langs = ["uz", "ru", "en"];

  const paths = [
    "",
    "/tour/internal/xiva",
    "/tour/internal/samarkand",
    "/tour/internal/bukhara",
    "/tour/world/saudiya",
    "/tour/world/vietnam",
    "/tour/world/sharm",
    "/tour/world/doha",
    "/tour/world/dubai",
    "/tour/world/abudhabi",
    "/tour/medical/naftalan",
    "/tour/medical/medical",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const lang of langs) {
      entries.push({
        url: `${baseUrl}/${lang}${path}`,
        lastModified,
        priority: path === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            uz: `${baseUrl}/uz${path}`,
            ru: `${baseUrl}/ru${path}`,
            en: `${baseUrl}/en${path}`,
          },
        },
      });
    }
  }

  return entries;
}
