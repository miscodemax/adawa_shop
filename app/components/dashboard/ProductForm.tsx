"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ImagePlus, Loader2, X } from "lucide-react"
import { toast } from "sonner"

type Category = { id: string; name: string }

export function ProductForm({
  categories,
  onSuccess,
}: {
  categories: Category[]
  onSuccess: () => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function resetForm() {
    setName("")
    setDescription("")
    setPrice("")
    setStock("")
    setCategoryId("")
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmedName = name.trim()
    const numericPrice = parseFloat(price)

    if (trimmedName.length < 2) {
      toast.error("Merci d'indiquer un nom de produit")
      return
    }
    if (!numericPrice || numericPrice <= 0) {
      toast.error("Merci d'indiquer un prix valide")
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)
        const uploadRes = await fetch("/api/dashboard/upload", {
          method: "POST",
          body: formData,
        })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error)
        imageUrl = uploadData.url
      }

      const res = await fetch("/api/dashboard/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          description: description.trim(),
          price: numericPrice,
          stock: stock ? parseInt(stock) : 0,
          category_id: categoryId || null,
          image_url: imageUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success(`"${trimmedName}" ajouté à la boutique`)
      resetForm()
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="border border-border rounded-2xl p-5 bg-surface mb-6 space-y-4"
    >
      <h3 className="font-serif text-lg text-primary">Ajouter un produit</h3>

      {/* Upload image */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
          id="product-image"
        />
        {imagePreview ? (
          <div className="relative w-28 h-28">
            <img
              src={imagePreview}
              alt="Aperçu"
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null)
                setImagePreview(null)
              }}
              className="absolute -top-2 -right-2 bg-foreground text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="product-image"
            className="w-28 h-28 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-accent transition-colors"
          >
            <ImagePlus size={20} className="text-foreground/40" />
            <span className="text-[11px] text-foreground/40">Photo</span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-foreground/70 mb-1.5">Nom du produit</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Crème hydratante"
            className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-foreground/70 mb-1.5">Catégorie</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          >
            <option value="">Sans catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-foreground/70 mb-1.5">Prix (FCFA)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="5000"
            className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-foreground/70 mb-1.5">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="10"
            className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-foreground/70 mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Quelques mots sur le produit..."
          className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Ajout en cours...
          </>
        ) : (
          "Ajouter le produit"
        )}
      </button>
    </motion.form>
  )
}