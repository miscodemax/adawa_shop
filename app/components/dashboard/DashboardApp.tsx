"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipboardList, Package, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { OrdersTab } from "./tabs/OrdersTab"
import { ProductsTab } from "./tabs/ProductsTab"
import { StatsTab } from "./tabs/StatsTab"

type Tab = "orders" | "products" | "stats"

const tabs: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
  { id: "orders", label: "Commandes", icon: ClipboardList },
  { id: "products", label: "Produits", icon: Package },
  { id: "stats", label: "Statistiques", icon: BarChart3 },
]

export function DashboardApp() {
  const [activeTab, setActiveTab] = useState<Tab>("orders")

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="border-b border-border px-6 md:px-10 py-5 sticky top-0 bg-background/95 backdrop-blur z-20">
        <h1 className="font-serif text-2xl text-primary">Adawa Shop — Admin</h1>
      </header>

      <nav className="flex gap-1 px-6 md:px-10 py-4 overflow-x-auto no-scrollbar sticky top-[73px] bg-background/95 backdrop-blur z-10 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm shrink-0 transition-colors",
                isActive ? "bg-primary text-white" : "text-foreground/60 hover:bg-surface"
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </nav>

      <main className="px-6 md:px-10 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "products" && <ProductsTab />}
            {activeTab === "stats" && <StatsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}