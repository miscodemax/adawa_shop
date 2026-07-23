"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { toast } from "sonner"

export function PasswordGate() {
  const router = useRouter()
  const [digits, setDigits] = useState(["", "", "", ""])
  const [isChecking, setIsChecking] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return

    const next = [...digits]
    next[index] = value
    setDigits(next)

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus()
    }
    if (value && index === 3) {
      submit(next.join(""))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  async function submit(code: string) {
    if (code.length < 4) return
    setIsChecking(true)

    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        toast.error("Code incorrect")
        setDigits(["", "", "", ""])
        inputsRef.current[0]?.focus()
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-xs text-center"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Lock size={20} className="text-primary" />
        </div>

        <h1 className="font-serif text-2xl text-primary mb-1">Espace admin</h1>
        <p className="text-sm text-foreground/50 mb-8">
          Entrez votre code à 4 chiffres
        </p>

        <div className="flex justify-center gap-3">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={isChecking}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl border border-border rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}