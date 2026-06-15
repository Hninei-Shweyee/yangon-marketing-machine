import type { MetadataRoute } from "next";

const BASE_URL = "https://yangonmarketingmachine.com";

// All public-facing pages
const pages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/systems", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/process", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/pricing", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/portfolio", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "weekly" as const, priority: 0.9 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority
  }));
}
