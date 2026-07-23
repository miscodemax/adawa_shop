import crypto from "crypto"

export const COOKIE_NAME = "adawa_dashboard_session"
export const SESSION_DAYS = 7

// Token dérivé du mot de passe : vérifiable côté serveur sans être le mot de passe lui-même
export function getSessionToken() {
  const secret = process.env.DASHBOARD_PASSWORD!
  return crypto.createHash("sha256").update(`adawa-dashboard-${secret}`).digest("hex")
}