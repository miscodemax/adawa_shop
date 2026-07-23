"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipboardList } from "lucide-react"
import { OrderCard } from "../OrderCard"
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

const FILTERS = [
  { id: "all", label: "Toutes" },
  { id: "nouvelle", label: "Nouvelles" },
  { id: "contactee", label: "Contactées" },
  { id: "confirmee", label: "Confirmées" },
  { id: "annulee", label: "Annulées" },
]

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/orders")
      const data = await res.json()
      setOrders(data.orders ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders
    return orders.filter((o) => o.status === filter)
  }, [filter, orders])

  if (isLoading) {
    return <p className="text-sm text-foreground/40">Chargement des commandes...</p>
  }

  return (
    <div className="max-w-3xl">
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "shrink-0 px-3.5 py-2 rounded-full text-xs border transition-colors",
              filter === f.id
                ? "bg-primary text-white border-primary"
                : "border-border text-foreground/60 hover:border-accent"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList size={28} className="text-sage/40 mb-3" />
          <p className="text-sm text-foreground/40">
            Aucune commande {filter !== "all" ? "dans ce statut" : "pour le moment"}.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <OrderCard order={order} onStatusChange={fetchOrders} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}