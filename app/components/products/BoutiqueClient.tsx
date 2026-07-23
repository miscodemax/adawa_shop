"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Leaf } from "lucide-react"
import { ProductCard } from "./ProductCard"
import { cn } from "@/lib/utils"

type Category = { id: string; name: string; slug: string }
type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
  category_id: string | null
}

export function BoutiqueClient({
  categories,
  products,
}: {
  categories: Category[]
  products: Product[]
}) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>("all")

  // Pré-sélectionne l'onglet si on arrive avec ?categorie=slug depuis l'accueil
  useEffect(() => {
    const slug = searchParams.get("categorie")
    if (slug) {
      const match = categories.find((c) => c.slug === slug)
      if (match) setActiveTab(match.id)
    }
  }, [searchParams, categories])

  const filteredProducts = useMemo(() => {
    if (activeTab === "all") return products
    return products.filter((p) => p.category_id === activeTab)
  }, [activeTab, products])

  return (
    <div className="py-8">
      <div className="px-6 md:px-10 mb-6">
        <h1 className="font-serif text-3xl text-primary mb-2">Boutique</h1>
        <p className="text-sm text-foreground/60">
          Toute notre sélection de soins et cosmétiques
        </p>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 px-6 md:px-10 no-scrollbar">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm border transition-colors",
              activeTab === "all"
                ? "bg-primary text-white border-primary"
                : "border-border text-foreground/70 hover:border-accent"
            )}
          >
            Tout
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm border transition-colors",
                activeTab === cat.id
                  ? "bg-primary text-white border-primary"
                  : "border-border text-foreground/70 hover:border-accent"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="px-6 md:px-10 mt-6">
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <Leaf size={32} className="text-sage/40 mb-4" />
              <p className="text-foreground/50 text-sm">
                {activeTab === "all"
                  ? "Aucun produit disponible pour le moment."
                  : "Aucun produit dans cette catégorie pour le moment."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}