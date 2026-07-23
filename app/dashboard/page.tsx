import { cookies } from "next/headers"
import { COOKIE_NAME, getSessionToken } from "@/lib/dashboard/session"
import { PasswordGate } from "../components/dashboard/PasswordGate"
import { DashboardApp } from "../components/dashboard/DashboardApp"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)?.value
  const isAuthenticated = session === getSessionToken()

  if (!isAuthenticated) {
    return <PasswordGate />
  }

  return <DashboardApp />
}