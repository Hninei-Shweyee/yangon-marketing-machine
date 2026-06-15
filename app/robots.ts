import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ymm-dash", "/api/"]
    },
    sitemap: "https://yangonmarketingmachine.com/sitemap.xml"
  };
}
