"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Share, PlusSquare, Download } from "lucide-react"

const DISMISSED_KEY = "adawa-pwa-install-dismissed"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Ne rien montrer si déjà installé ou déjà refusé récemment
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (isStandalone || dismissed) return

    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    setIsIOS(ios)

    if (ios) {
      // Pas d'événement natif possible sur iOS, on affiche direct les instructions
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }

    function handleBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setVisible(true), 2000)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall)
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
  }, [])

  function dismiss() {
    setVisible(false)
    localStorage.setItem(DISMISSED_KEY, "true")
  }

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      localStorage.setItem(DISMISSED_KEY, "true")
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-[76px] md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-40 bg-primary text-white rounded-2xl p-4 shadow-xl shadow-primary/30"
        >
          <button
            onClick={dismiss}
            className="absolute top-3 right-3 text-white/60 hover:text-white"
            aria-label="Fermer"
          >
            <X size={16} />
          </button>

          {isIOS ? (
            <div className="pr-5">
              <p className="text-sm font-medium mb-2">Installer Adawa Shop</p>
              <p className="text-xs text-white/75 leading-relaxed">
                Appuyez sur{" "}
                <Share size={13} className="inline mx-0.5 -mt-0.5" /> puis sur{" "}
                <span className="inline-flex items-center gap-1 font-medium">
                  <PlusSquare size={13} className="inline -mt-0.5" />
                  "Sur l'écran d'accueil"
                </span>
              </p>
            </div>
          ) : (
            <div className="pr-5">
              <p className="text-sm font-medium mb-1">Installer Adawa Shop</p>
              <p className="text-xs text-white/75 mb-3">
                Accédez à la boutique en un tap, même hors connexion.
              </p>
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-1.5 bg-white text-primary text-xs font-medium px-3.5 py-2 rounded-full hover:bg-white/90 transition-colors"
              >
                <Download size={13} />
                Installer l'application
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}