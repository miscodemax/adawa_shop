import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { isDashboardAuthenticated } from "@/lib/dashboard/auth-check"


export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders })
}

export async function PUT(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id, status } = await request.json()

  if (!id || !status) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ order: data })
}