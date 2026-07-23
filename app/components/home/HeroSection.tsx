"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 md:px-10 pt-20 pb-24 md:pt-28 md:pb-36 min-h-[85vh] md:min-h-[75vh] flex items-center">
      {/* Motifs organiques en fond */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <motion.path
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          d="M620 40C700 90 740 190 700 280C660 370 550 400 470 360C390 320 370 220 420 150C470 80 540 -10 620 40Z"
          fill="var(--color-accent)"
          fillOpacity="0.18"
        />
        <motion.path
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: "easeOut" }}
          d="M40 380C120 340 220 370 260 450C300 530 250 610 160 620C70 630 -30 570 -20 480C-10 390 -40 420 40 380Z"
          fill="var(--color-primary)"
          fillOpacity="0.12"
        />
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          cx="680"
          cy="480"
          r="6"
          fill="var(--color-sage)"
        />
        <motion.circle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.55 }}
          cx="710"
          cy="450"
          r="3"
          fill="var(--color-accent)"
        />
        {/* Pétale stylisé */}
        <motion.path
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 0.5, rotate: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
          d="M140 60C170 30 220 30 240 70C260 110 230 150 190 150C150 150 110 90 140 60Z"
          stroke="var(--color-primary)"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative max-w-2xl mx-auto md:mx-0 text-center md:text-left">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-primary/70 mb-5 bg-surface/80 px-3 py-1.5 rounded-full border border-border"
        >
          <Sparkles size={13} />
          Cosmétiques & bien-être
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-primary mb-6"
        >
          Le soin, dans sa
          <br />
          <span className="italic text-accent-dark">forme la plus douce</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-foreground/70 text-base md:text-lg mb-9 max-w-md mx-auto md:mx-0"
        >
          Une sélection de produits pensés pour prendre soin de vous,
          sans détour ni superflu.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Link
            href="/boutique"
            className="inline-block bg-primary text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            Découvrir la boutique
          </Link>
        </motion.div>
      </div>
    </section>
  )
}