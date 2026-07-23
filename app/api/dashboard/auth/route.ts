import { NextResponse } from "next/server"
import { COOKIE_NAME, SESSION_DAYS, getSessionToken } from "@/lib/dashboard/session"

export async function POST(request: Request) {
  const { code } = await request.json()

  if (code !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set(COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: "/",
  })
  return response
}