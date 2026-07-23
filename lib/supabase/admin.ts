import { createClient } from '@supabase/supabase-js'

// ⚠️ Ce fichier ne doit être importé QUE dans du code serveur
// (server actions, route handlers) — jamais dans un composant client ("use client")
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)