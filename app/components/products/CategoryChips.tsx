"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Category = { id: string; name: string; slug: string }

export function CategoryChips({ categories }: { categories: Category[] }) {
  const pathname = usePathname()

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-6 md:px-10 no-scrollbar">
      <Link
        href="/boutique"
        className={cn(
          "shrink-0 px-4 py-2 rounded-full text-sm border transition-colors",
          pathname === "/boutique"
            ? "bg-primary text-white border-primary"
            : "border-border text-foreground/70 hover:border-accent"
        )}
      >
        Tout
      </Link>
      {categories.map((cat) => {
        const isActive = pathname === `/boutique/${cat.slug}`
        return (
          <Link
            key={cat.id}
            href={`/boutique/${cat.slug}`}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full text-sm border transition-colors",
              isActive
                ? "bg-primary text-white border-primary"
                : "border-border text-foreground/70 hover:border-accent"
            )}
          >
            {cat.name}
          </Link>
        )
      })}
    </div>
  )
}