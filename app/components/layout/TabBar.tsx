"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Store, ShoppingBag, Info } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/boutique", label: "Boutique", icon: Store },
  { href: "/panier", label: "Panier", icon: ShoppingBag },
  { href: "/about", label: "Infos", icon: Info },
]

export function TabBar() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  return (
    <nav
      className="
        md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-surface border-t border-border
        flex items-stretch
        pb-[env(safe-area-inset-bottom)]
      "
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href
        const Icon = tab.icon

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative"
          >
            <div className="relative">
              <Icon
                size={22}
                strokeWidth={isActive ? 2.4 : 1.8}
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "text-foreground/50"
                )}
              />
              {tab.href === "/panier" && totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="
                    absolute -top-1.5 -right-2
                    bg-accent text-white text-[10px] font-medium
                    rounded-full min-w-[16px] h-4 px-1
                    flex items-center justify-center
                  "
                >
                  {totalItems}
                </motion.span>
              )}
            </div>
            <span
              className={cn(
                "text-[11px] transition-colors",
                isActive ? "text-primary font-medium" : "text-foreground/50"
              )}
            >
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}