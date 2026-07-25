import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase/client"

const BASE_URL = "https://orachie.store" // remplace par ton vrai domaine

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/boutique`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at")
    .eq("is_active", true)

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((product) => ({
    url: `${BASE_URL}/produit/${product.slug}`,
    lastModified: new Date(product.created_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}