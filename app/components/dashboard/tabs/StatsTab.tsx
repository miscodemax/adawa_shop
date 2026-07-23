"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Package, ShoppingCart } from "lucide-react"

type Stats = {
  totalOrders: number
  totalRevenue: number
  ordersByStatus: { status: string; count: number }[]
  topProducts: { name: string; quantity: number; revenue: number }[]
  salesByDay: { day: string; commandes: number }[]
}

const STATUS_LABELS: Record<string, string> = {
  nouvelle: "Nouvelles",
  contactee: "Contactées",
  confirmee: "Confirmées",
  annulee: "Annulées",
}

const STATUS_COLORS: Record<string, string> = {
  nouvelle: "#d9a98c",
  contactee: "#6b4d74",
  confirmee: "#9caf88",
  annulee: "#e8e0e4",
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof TrendingUp
  label: string
  value: string
}) {
  return (
    <div className="border border-border rounded-2xl p-5 bg-surface">
      <Icon size={18} className="text-primary mb-3" />
      <p className="text-2xl font-serif text-primary">{value}</p>
      <p className="text-xs text-foreground/50 mt-1">{label}</p>
    </div>
  )
}

export function StatsTab() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <p className="text-sm text-foreground/40">Chargement des statistiques...</p>
  }

  if (!stats) {
    return <p className="text-sm text-foreground/40">Impossible de charger les statistiques.</p>
  }

  const hasOrders = stats.totalOrders > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl space-y-6"
    >
      {/* Cartes résumé */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          icon={ShoppingCart}
          label="Commandes totales"
          value={stats.totalOrders.toString()}
        />
        <StatCard
          icon={TrendingUp}
          label="Chiffre d'affaires confirmé"
          value={`${stats.totalRevenue.toLocaleString("fr-FR")} FCFA`}
        />
        <StatCard
          icon={Package}
          label="Produits distincts vendus"
          value={stats.topProducts.length.toString()}
        />
      </div>

      {!hasOrders ? (
        <div className="border border-border rounded-2xl p-10 bg-surface text-center">
          <p className="text-sm text-foreground/40">
            Les statistiques apparaîtront ici dès vos premières commandes.
          </p>
        </div>
      ) : (
        <>
          {/* Commandes des 7 derniers jours */}
          <div className="border border-border rounded-2xl p-5 bg-surface">
            <h3 className="font-serif text-lg text-primary mb-4">
              Commandes — 7 derniers jours
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.salesByDay}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#2e2630" }}
                  axisLine={{ stroke: "#e8e0e4" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "#2e2630" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e8e0e4",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="commandes" fill="#4a3350" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top produits */}
            <div className="border border-border rounded-2xl p-5 bg-surface">
              <h3 className="font-serif text-lg text-primary mb-4">
                Produits les plus vendus
              </h3>
              <div className="space-y-3">
                {stats.topProducts.map((product, i) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <span className="text-xs text-foreground/40 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{product.name}</p>
                      <div className="h-1.5 bg-background rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{
                            width: `${(product.quantity / stats.topProducts[0].quantity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-foreground/50 shrink-0">
                      {product.quantity} vendus
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Répartition par statut */}
            <div className="border border-border rounded-2xl p-5 bg-surface">
              <h3 className="font-serif text-lg text-primary mb-4">
                Répartition des commandes
              </h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie
                      data={stats.ordersByStatus.filter((s) => s.count > 0)}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {stats.ordersByStatus
                        .filter((s) => s.count > 0)
                        .map((entry) => (
                          <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                        ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {stats.ordersByStatus.map((s) => (
                    <div key={s.status} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: STATUS_COLORS[s.status] }}
                      />
                      <span className="text-foreground/60">
                        {STATUS_LABELS[s.status]} — {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}