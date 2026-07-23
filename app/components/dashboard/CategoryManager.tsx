"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type Category = { id: string; name: string; slug: string }

const SUGGESTED = [
  "Soins visage",
  "Soins du corps",
  "Soins dentaires",
  "Soins cheveux",
  "Bien-être",
  "Parfums",
  "Maquillage",
  "Accessoires",
]

export function CategoryManager({
  categories,
  onChange,
}: {
  categories: Category[]
  onChange: () => void
}) {
  const [customValue, setCustomValue] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const existingNames = new Set(categories.map((c) => c.name.toLowerCase()))
  const availableSuggestions = SUGGESTED.filter(
    (s) => !existingNames.has(s.toLowerCase())
  )

  async function addCategory(name: string) {
    setIsAdding(true)
    try {
      const res = await fetch("/api/dashboard/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'ajout")
        return
      }

      toast.success(`Catégorie "${name}" ajoutée`)
      setCustomValue("")
      onChange()
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setIsAdding(false)
    }
  }

  async function removeCategory(id: string, name: string) {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return

    try {
      const res = await fetch("/api/dashboard/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        toast.error("Erreur lors de la suppression")
        return
      }

      toast.success("Catégorie supprimée")
      onChange()
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <div className="border border-border rounded-2xl p-5 bg-surface mb-6">
      <h3 className="font-serif text-lg text-primary mb-4">Catégories</h3>

      {/* Catégories actives */}
      <div className="flex flex-wrap gap-2 mb-4">
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.span
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-1.5 bg-primary text-white text-xs px-3 py-1.5 rounded-full"
            >
              {cat.name}
              <button
                onClick={() => removeCategory(cat.id, cat.name)}
                className="hover:opacity-70"
                aria-label={`Supprimer ${cat.name}`}
              >
                <X size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {categories.length === 0 && (
          <p className="text-xs text-foreground/40">Aucune catégorie pour l'instant</p>
        )}
      </div>

      {/* Suggestions cliquables */}
      {availableSuggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-foreground/50 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => addCategory(s)}
                disabled={isAdding}
                className="inline-flex items-center gap-1 border border-dashed border-border text-foreground/60 text-xs px-3 py-1.5 rounded-full hover:border-accent hover:text-accent-dark transition-colors disabled:opacity-50"
              >
                <Plus size={11} />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Champ libre */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && customValue.trim()) {
              addCategory(customValue.trim())
            }
          }}
          placeholder="Ajouter une catégorie personnalisée"
          className="flex-1 border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
        <button
          onClick={() => customValue.trim() && addCategory(customValue.trim())}
          disabled={isAdding || !customValue.trim()}
          className="bg-primary text-white px-4 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40"
          aria-label="Ajouter"
        >
          <Check size={16} />
        </button>
      </div>
    </div>
  )
}