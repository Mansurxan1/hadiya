import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.hadiya-travel.uz";
  const lastModified = "2025-03-11";

  return [
    { url: `${baseUrl}/`, lastModified, priority: 1.0 },

    // Internal tours
    { url: `${baseUrl}/tour/internal/xiva`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/tour/internal/samarkand`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/tour/internal/bukhara`, lastModified, priority: 0.8 },

    // World tours
    { url: `${baseUrl}/tour/world/saudiya`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/tour/world/vietnam`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/tour/world/sharm`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/tour/world/doha`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/tour/world/dubai`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/tour/world/abudhabi`, lastModified, priority: 0.8 },

    // Medical tours
    { url: `${baseUrl}/tour/medical/naftalan`, lastModified, priority: 0.8 },
    { url: `${baseUrl}/tour/medical/medical`, lastModified, priority: 0.8 },
  ];
}
