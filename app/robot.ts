import type { MetadataRoute } from "next"

const BASE_URL = "https://orachie.store" // même domaine que le sitemap

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}