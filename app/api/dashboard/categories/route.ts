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

  const { name } = await request.json()
  const trimmed = name?.trim()

  if (!trimmed || trimmed.length < 2) {
    return NextResponse.json({ error: "Nom invalide" }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ name: trimmed, slug: slugify(trimmed) })
    .select()
    .single()

  if (error) {
    // Cas fréquent : la catégorie existe déjà (contrainte unique)
    return NextResponse.json({ error: "Cette catégorie existe déjà" }, { status: 409 })
  }

  return NextResponse.json({ category: data })
}

export async function DELETE(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await request.json()
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}