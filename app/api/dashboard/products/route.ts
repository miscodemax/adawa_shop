import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { isDashboardAuthenticated } from "@/lib/dashboard/auth-check"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, price, category_id, stock, image_url } = body

  if (!name?.trim() || !price || price <= 0) {
    return NextResponse.json({ error: "Nom et prix valides requis" }, { status: 400 })
  }

  // Garantit un slug unique même si deux produits ont un nom proche
  const baseSlug = slugify(name)
  const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      name: name.trim(),
      slug: uniqueSlug,
      description: description?.trim() || null,
      price,
      category_id: category_id || null,
      stock: stock ?? 0,
      image_url: image_url || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

export async function PUT(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updates } = body

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

export async function DELETE(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await request.json()
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}