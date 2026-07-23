import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { isDashboardAuthenticated } from "@/lib/dashboard/auth-check"

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const [{ data: orders }, { data: items }] = await Promise.all([
    supabaseAdmin.from("orders").select("id, status, total_amount, created_at"),
    supabaseAdmin.from("order_items").select("product_name, quantity, unit_price"),
  ])

  const allOrders = orders ?? []
  const allItems = items ?? []

  // Ventes confirmées uniquement pour le CA (une commande annulée ne compte pas comme vente réelle)
  const confirmedOrders = allOrders.filter((o) => o.status === "confirmee")
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + Number(o.total_amount), 0)

  const ordersByStatus = ["nouvelle", "contactee", "confirmee", "annulee"].map((status) => ({
    status,
    count: allOrders.filter((o) => o.status === status).length,
  }))

  // Top produits par quantité vendue (toutes commandes confondues, pour donner une vraie vue tendance)
  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>()
  for (const item of allItems) {
    const existing = productMap.get(item.product_name)
    if (existing) {
      existing.quantity += item.quantity
      existing.revenue += item.quantity * Number(item.unit_price)
    } else {
      productMap.set(item.product_name, {
        name: item.product_name,
        quantity: item.quantity,
        revenue: item.quantity * Number(item.unit_price),
      })
    }
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

  // Ventes des 7 derniers jours (commandes créées, pas seulement confirmées, pour voir l'activité)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split("T")[0]
  })

  const salesByDay = last7Days.map((day) => {
    const count = allOrders.filter((o) => o.created_at.startsWith(day)).length
    return {
      day: new Date(day).toLocaleDateString("fr-FR", { weekday: "short" }),
      commandes: count,
    }
  })

  return NextResponse.json({
    totalOrders: allOrders.length,
    totalRevenue,
    ordersByStatus,
    topProducts,
    salesByDay,
  })
}