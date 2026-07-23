import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { ProductDetailClient } from "../../components/products/ProductDetailClient"

export default async function ProduitPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: product } = await supabase
    .from("products")
    .select("id, name, description, price, image_url, stock, category_id, slug")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}