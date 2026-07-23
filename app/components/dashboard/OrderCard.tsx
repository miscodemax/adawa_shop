"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Phone, User, Clock } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type OrderItem = {
  id: string
  product_name: string
  unit_price: number
  quantity: number
}

type Order = {
  id: string
  customer_name: string
  customer_phone: string
  status: string
  total_amount: number
  created_at: string
  order_items: OrderItem[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  nouvelle: { label: "Nouvelle", color: "bg-accent/20 text-accent-dark" },
  contactee: { label: "Contactée", color: "bg-primary/15 text-primary" },
  confirmee: { label: "Confirmée", color: "bg-sage/25 text-foreground" },
  annulee: { label: "Annulée", color: "bg-foreground/10 text-foreground/50" },
}

const STATUS_OPTIONS = ["nouvelle", "contactee", "confirmee", "annulee"]

export function OrderCard({
  order,
  onStatusChange,
}: {
  order: Order
  onStatusChange: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  async function updateStatus(status: string) {
    setIsUpdating(true)
    try {
      const res = await fetch("/api/dashboard/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status }),
      })
      if (!res.ok) throw new Error()
      toast.success("Statut mis à jour")
      onStatusChange()
    } catch {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setIsUpdating(false)
    }
  }

  const statusInfo = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.nouvelle
  const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="border border-border rounded-2xl bg-surface overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User size={13} className="text-foreground/40 shrink-0" />
            <p className="text-sm font-medium text-foreground truncate">
              {order.customer_name}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-foreground/50">
            <span className="flex items-center gap-1">
              <Phone size={11} />
              {order.customer_phone}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formattedDate}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "text-xs px-2.5 py-1 rounded-full font-medium shrink-0",
            statusInfo.color
          )}
        >
          {statusInfo.label}
        </span>

        <span className="text-primary font-serif text-sm shrink-0">
          {order.total_amount.toLocaleString("fr-FR")} FCFA
        </span>

        <ChevronDown
          size={16}
          className={cn(
            "text-foreground/40 shrink-0 transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="border-t border-border px-4 py-3 overflow-hidden"
        >
          <div className="space-y-1.5 mb-4">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground/70">
                  {item.quantity} × {item.product_name}
                </span>
                <span className="text-foreground">
                  {(item.unit_price * item.quantity).toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => updateStatus(status)}
                disabled={isUpdating || order.status === status}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40",
                  order.status === status
                    ? "bg-primary text-white border-primary"
                    : "border-border text-foreground/60 hover:border-accent"
                )}
              >
                {STATUS_CONFIG[status].label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}