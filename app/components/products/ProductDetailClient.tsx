"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Minus, Plus, Leaf } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/context/CartContext"

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  stock: number
  category_id: string | null
}

export function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  function handleAdd() {
    addItem(
      { productId: product.id, name: product.name, price: product.price },
      quantity
    )
    toast.success(`${product.name} ajouté au panier`)
    setQuantity(1)
  }

  const outOfStock = product.stock <= 0

  return (
    <div className="pb-24 md:pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="aspect-square bg-surface flex items-center justify-center"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Leaf size={48} className="text-sage/40" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-6 md:px-10 py-6 max-w-2xl mx-auto"
      >
        <h1 className="font-serif text-2xl md:text-3xl text-primary mb-2">
          {product.name}
        </h1>
        <p className="text-xl text-foreground mb-4">
          {product.price.toLocaleString("fr-FR")} FCFA
        </p>

        {product.description && (
          <p className="text-sm text-foreground/60 leading-relaxed mb-6">
            {product.description}
          </p>
        )}

        {outOfStock ? (
          <p className="text-sm text-accent-dark font-medium">
            Actuellement en rupture de stock
          </p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-foreground/60">Quantité</span>
              <div className="flex items-center border border-border rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-foreground/60 hover:text-primary"
                  aria-label="Diminuer la quantité"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-9 flex items-center justify-center text-foreground/60 hover:text-primary"
                  aria-label="Augmenter la quantité"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Bouton desktop inline */}
            <button
              onClick={handleAdd}
              className="hidden md:block bg-primary text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Ajouter au panier
            </button>
          </>
        )}
      </motion.div>

      {/* Bouton mobile sticky en bas */}
      {!outOfStock && (
        <div className="md:hidden fixed bottom-[64px] left-0 right-0 p-4 bg-background border-t border-border">
          <button
            onClick={handleAdd}
            className="w-full bg-primary text-white py-3.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      )}
    </div>
  )
}