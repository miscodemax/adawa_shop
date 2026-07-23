
import { Suspense } from "react"
import { supabase } from "@/lib/supabase/client"
import { BoutiqueClient } from "../components/products/BoutiqueClient"

export const dynamic = "force-dynamic"

export default async function BoutiquePage() {
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("id, name, slug").order("name"),
    supabase
      .from("products")
      .select("id, name, price, image_url, category_id, slug")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ])

  return (
    <Suspense>
      <BoutiqueClient categories={categories ?? []} products={products ?? []} />
    </Suspense>
  )
}