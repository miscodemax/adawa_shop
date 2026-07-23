"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Flower2, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5 },
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        }}
        className="mb-6"
      >
        <Flower2 size={44} className="text-accent" strokeWidth={1.4} />
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="text-xs tracking-widest uppercase text-primary/50 mb-3"
      >
        Erreur 404
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="font-serif text-3xl md:text-4xl text-primary mb-3"
      >
        Cette page s'est égarée
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="text-foreground/60 text-sm md:text-base mb-8 max-w-sm"
      >
        Le produit ou la page que vous cherchez n'existe plus,
        ou a changé d'adresse.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  )
}