import { cookies } from "next/headers"
import { COOKIE_NAME, getSessionToken } from "@/lib/dashboard/session"

export async function isDashboardAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  return session === getSessionToken()
}