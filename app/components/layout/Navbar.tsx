"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/context/CartContext"

export function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="hidden md:flex items-center justify-between px-10 py-5 border-b border-border bg-surface sticky top-0 z-50">
      <Link href="/" className="font-serif text-2xl text-primary tracking-tight">
        orachie
      </Link>

      <nav className="flex items-center gap-8 text-sm text-foreground/70">
        <Link href="/" className="hover:text-primary transition-colors">
          Accueil
        </Link>
        <Link href="/boutique" className="hover:text-primary transition-colors">
          Boutique
        </Link>
        <Link href="/about" className="hover:text-primary transition-colors">
          À propos
        </Link>
        <Link href="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
      </nav>

      <Link href="/panier" className="relative">
        <ShoppingBag size={22} className="text-foreground/80" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-medium rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
    </header>
  )
}