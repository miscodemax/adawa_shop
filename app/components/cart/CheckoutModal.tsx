"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, CheckCircle2, User, Phone } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/context/CartContext"
import { supabase } from "@/lib/supabase/client"

type Step = "form" | "success"

export function CheckoutModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { items, totalPrice, clearCart } = useCart()

  const [step, setStep] = useState<Step>("form")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<{
    name: string
    phone: string
    items: typeof items
    total: number
  } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedPhone = phone.trim()

    if (trimmedName.length < 2) {
      toast.error("Merci d'indiquer votre nom")
      return
    }
    if (trimmedPhone.length < 8) {
      toast.error("Merci d'indiquer un numéro de téléphone valide")
      return
    }

    setIsSubmitting(true)

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: trimmedName,
          customer_phone: trimmedPhone,
          total_amount: totalPrice,
        })
        .select("id")
        .single()

      if (orderError || !order) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) throw itemsError

      setConfirmedOrder({ name: trimmedName, phone: trimmedPhone, items, total: totalPrice })
      clearCart()
      setStep("success")
    } catch (err) {
      console.error(err)
      toast.error("Une erreur est survenue, merci de réessayer")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    onOpenChange(false)
    // reset après la fermeture pour éviter un flash de contenu vide pendant l'animation de sortie
    setTimeout(() => {
      setStep("form")
      setName("")
      setPhone("")
      setConfirmedOrder(null)
    }, 250)

    if (step === "success") {
      toast.success("Commande envoyée, merci pour votre confiance !")
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[100]"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild aria-describedby={undefined}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[92vw] max-w-md bg-background rounded-3xl p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="font-serif text-xl text-primary">
                {step === "form" ? "Finaliser ma commande" : "Commande confirmée"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-foreground/40 hover:text-foreground transition-colors"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>

            <AnimatePresence mode="wait">
              {step === "form" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Récap panier lecture seule */}
                  <div className="border border-border rounded-2xl p-4 mb-5 bg-surface">
                    <div className="space-y-2 mb-3">
                      {items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-foreground/70">
                            {item.quantity} × {item.name}
                          </span>
                          <span className="text-foreground">
                            {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between border-t border-border pt-3">
                      <span className="font-medium text-foreground text-sm">Total</span>
                      <span className="font-serif text-lg text-primary">
                        {totalPrice.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm text-foreground/70 mb-1.5">
                        Nom complet
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Votre nom"
                          className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm text-foreground/70 mb-1.5">
                        Numéro de téléphone
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="77 123 45 67"
                          className="w-full border border-border rounded-xl pl-10 pr-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white py-3.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        "Confirmer ma commande"
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="flex justify-center mb-4"
                  >
                    <CheckCircle2 size={48} className="text-sage" strokeWidth={1.5} />
                  </motion.div>

                  <p className="text-sm text-foreground/60 mb-5 max-w-xs mx-auto">
                    Merci {confirmedOrder?.name.split(" ")[0]}, nous vous contacterons
                    très prochainement au{" "}
                    <span className="text-foreground font-medium">{confirmedOrder?.phone}</span>
                    {" "}pour finaliser votre commande.
                  </p>

                  <div className="border border-border rounded-2xl p-4 mb-5 text-left bg-surface">
                    <div className="space-y-2 mb-3">
                      {confirmedOrder?.items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-foreground/70">
                            {item.quantity} × {item.name}
                          </span>
                          <span className="text-foreground">
                            {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between border-t border-border pt-3">
                      <span className="font-medium text-foreground text-sm">Total</span>
                      <span className="font-serif text-lg text-primary">
                        {confirmedOrder?.total.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full bg-primary text-white py-3.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Continuer mes achats
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}