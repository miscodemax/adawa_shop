"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { CheckoutModal } from "../components/cart/CheckoutModal"

export default function PanierPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBag size={32} className="text-sage/40 mb-4" />
        <h1 className="font-serif text-2xl text-primary mb-2">
          Votre panier est vide
        </h1>
        <p className="text-sm text-foreground/50 mb-6">
          Parcourez la boutique pour trouver votre bonheur.
        </p>
        <Link
          href="/boutique"
          className="inline-block bg-primary text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Voir la boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 px-6 md:px-10 pb-40 md:pb-8">
      <h1 className="font-serif text-3xl text-primary mb-6">Mon panier</h1>

      <div className="max-w-2xl space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 border border-border rounded-2xl p-4 bg-surface">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-primary font-serif text-sm mt-0.5">
                    {item.price.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>

                <div className="flex items-center border border-border rounded-full shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-primary"
                    aria-label="Diminuer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-7 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-primary"
                    aria-label="Augmenter"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
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

      <div className="hidden md:block max-w-2xl mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-foreground/60">Total</span>
          <span className="font-serif text-2xl text-primary">
            {totalPrice.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
        <button
          onClick={() => setCheckoutOpen(true)}
          className="inline-block bg-primary text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Commander
        </button>
      </div>

      <div className="md:hidden fixed bottom-[64px] left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-foreground/60">Total</span>
          <span className="font-serif text-xl text-primary">
            {totalPrice.toLocaleString("fr-FR")} FCFA
          </span>
        </div>
        <button
          onClick={() => setCheckoutOpen(true)}
          className="block w-full text-center bg-primary text-white py-3.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          Commander
        </button>
      </div>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  )
}