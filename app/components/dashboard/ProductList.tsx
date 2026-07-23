"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Leaf, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

type Product = {
  id: string
  name: string
  price: number
  stock: number
  image_url: string | null
  is_active: boolean
  category_id: string | null
}
type Category = { id: string; name: string }

export function ProductList({
  products,
  categories,
  onChange,
}: {
  products: Product[]
  categories: Category[]
  onChange: () => void
}) {
  const categoryName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? "Sans catégorie"

  async function toggleActive(product: Product) {
    const res = await fetch("/api/dashboard/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, is_active: !product.is_active }),
    })
    if (res.ok) {
      toast.success(product.is_active ? "Produit masqué" : "Produit visible")
      onChange()
    } else {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  async function deleteProduct(product: Product) {
    if (!confirm(`Supprimer "${product.name}" définitivement ?`)) return

    const res = await fetch("/api/dashboard/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id }),
    })
    if (res.ok) {
      toast.success("Produit supprimé")
      onChange()
    } else {
      toast.error("Erreur lors de la suppression")
    }
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-foreground/40 text-center py-10">
        Aucun produit pour le moment.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-4 border border-border rounded-2xl p-3 bg-surface">
              <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center shrink-0 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Leaf size={18} className="text-sage/40" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {product.name}
                </p>
                <p className="text-xs text-foreground/50">
                  {categoryName(product.category_id)} · Stock: {product.stock}
                </p>
              </div>

              <span className="text-primary font-serif text-sm shrink-0">
                {product.price.toLocaleString("fr-FR")} FCFA
              </span>

              <button
                onClick={() => toggleActive(product)}
                className="text-foreground/40 hover:text-primary shrink-0"
                aria-label={product.is_active ? "Masquer" : "Afficher"}
                title={product.is_active ? "Visible sur le site" : "Masqué du site"}
              >
                {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>

              <button
                onClick={() => deleteProduct(product)}
                className="text-foreground/30 hover:text-accent-dark shrink-0"
                aria-label="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}