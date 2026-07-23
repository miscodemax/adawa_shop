"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import { CategoryManager } from "../CategoryManager"
import { ProductForm } from "../ProductForm"
import { ProductList } from "../ProductList"

type Category = { id: string; name: string; slug: string }
type Product = {
  id: string
  name: string
  price: number
  stock: number
  image_url: string | null
  is_active: boolean
  category_id: string | null
}

export function ProductsTab() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("id, name, slug").order("name"),
      supabase
        .from("products")
        .select("id, name, price, stock, image_url, is_active, category_id")
        .order("created_at", { ascending: false }),
    ])
    setCategories(cats ?? [])
    setProducts(prods ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading) {
    return <p className="text-sm text-foreground/40">Chargement...</p>
  }

  return (
    <div className="max-w-3xl">
      <CategoryManager categories={categories} onChange={fetchData} />
      <ProductForm categories={categories} onSuccess={fetchData} />

      <h3 className="font-serif text-lg text-primary mb-3">
        Produits ({products.length})
      </h3>
      <ProductList products={products} categories={categories} onChange={fetchData} />
    </div>
  )
}