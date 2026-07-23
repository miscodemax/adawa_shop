"use client"

import { motion } from "framer-motion"
import { Plus, Leaf } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/context/CartContext"

type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  function handleAdd() {
    addItem({ productId: product.id, name: product.name, price: product.price })
    toast.success(`${product.name} ajouté au panier`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border bg-surface overflow-hidden group"
    >
      <div className="aspect-square bg-background flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Leaf size={28} className="text-sage/50" />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-primary font-serif text-base">
            {product.price.toLocaleString("fr-FR")} FCFA
          </span>
          <button
            onClick={handleAdd}
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
            aria-label="Ajouter au panier"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}