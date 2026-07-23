import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { isDashboardAuthenticated } from "@/lib/dashboard/auth-check"

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 })
  }

  const ext = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from("products")
    .upload(fileName, file)

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from("products").getPublicUrl(fileName)

  return NextResponse.json({ url: data.publicUrl })
}