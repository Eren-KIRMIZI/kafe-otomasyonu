"use client"

import * as React from "react"
import { Save, Upload, X, Plus, Minus, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Product, Category } from "@/types"

interface ProductSize {
  name: string
  priceModifier: number
}

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  categories: Category[]
  onSave: (data: ProductFormData) => void
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  categoryId: string
  preparationTime: number
  isActive: boolean
  isFood: boolean
  isBeverage: boolean
  sizes: ProductSize[]
  imageUrl: string | null
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSave,
}: ProductFormDialogProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [categoryId, setCategoryId] = React.useState("")
  const [preparationTime, setPreparationTime] = React.useState("")
  const [isActive, setIsActive] = React.useState(true)
  const [isFood, setIsFood] = React.useState(false)
  const [isBeverage, setIsBeverage] = React.useState(true)
  const [sizes, setSizes] = React.useState<ProductSize[]>([])
  const [imageUrl, setImageUrl] = React.useState<string | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      if (product) {
        setName(product.name)
        setDescription(product.description || "")
        setPrice(String(product.price))
        setCategoryId(product.categoryId)
        setPreparationTime(product.preparationTime ? String(product.preparationTime) : "")
        setIsActive(product.isActive)
        // isFood / isBeverage varsa product'tan al, yoksa isBeverage true
        setIsFood((product as any).isFood ?? false)
        setIsBeverage((product as any).isBeverage ?? true)
        setSizes((product as any).sizes ?? [])
        setImageUrl(product.imageUrl || null)
        setImagePreview(product.imageUrl || null)
      } else {
        setName("")
        setDescription("")
        setPrice("")
        setCategoryId("")
        setPreparationTime("")
        setIsActive(true)
        setIsFood(false)
        setIsBeverage(true)
        setSizes([])
        setImageUrl(null)
        setImagePreview(null)
      }
    }
  }, [product, open])

  const handleAddSize = () => {
    setSizes((prev) => [...prev, { name: "", priceModifier: 0 }])
  }

  const handleRemoveSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSizeChange = (index: number, field: keyof ProductSize, value: string | number) => {
    setSizes((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    )
  }

  // ── Görsel Yükleme ──────────────────────────────────────
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    if (file.size > 5 * 1024 * 1024) {
      alert("Dosya boyutu 5MB'dan küçük olmalıdır.")
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setImagePreview(dataUrl)
      setImageUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleImageFile(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageFile(file)
    // reset so same file can be re-selected
    e.target.value = ""
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageUrl(null)
  }
  // ────────────────────────────────────────────────────────

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) return
    onSave({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      categoryId,
      preparationTime: preparationTime ? Number(preparationTime) : 0,
      isActive,
      isFood,
      isBeverage,
      sizes,
      imageUrl,
    })
    onOpenChange(false)
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Plus className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            </div>
            {product ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* İsim + Fiyat */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Ürün Adı"
              placeholder="Örn: Cappuccino"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Fiyat (₺)"
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Açıklama */}
          <Textarea
            label="Açıklama"
            placeholder="Ürün açıklaması (isteğe bağlı)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />

          {/* Kategori + Hazırlık */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Kategori"
              options={categoryOptions}
              value={categoryId}
              onValueChange={setCategoryId}
              placeholder="Kategori seçin..."
            />
            <Input
              label="Hazırlık Süresi (dk)"
              type="number"
              min={0}
              placeholder="Örn: 10"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
            />
          </div>

          {/* Görsel Yükleme */}
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <img
                src={imagePreview}
                alt="Ürün görseli"
                className="h-48 w-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-colors cursor-pointer",
                isDragOver
                  ? "border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/10"
                  : "border-neutral-300 hover:border-amber-400 hover:bg-amber-50/50 dark:border-neutral-700 dark:hover:border-amber-600 dark:hover:bg-amber-900/5"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <ImageIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Görsel seçmek için tıklayın veya sürükleyin
              </p>
              <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                PNG, JPG veya WEBP · Maks. 5 MB
              </p>
            </div>
          )}

          {/* Ürün Türü */}
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Ürün Türü
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Yiyecek</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Mutfakta hazırlanır</p>
                </div>
                <Switch checked={isFood} onCheckedChange={setIsFood} />
              </div>
              <div className="flex flex-1 items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">İçecek</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Barista tarafından yapılır</p>
                </div>
                <Switch checked={isBeverage} onCheckedChange={setIsBeverage} />
              </div>
            </div>
          </div>

          {/* Boyut Seçenekleri */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Boyut / Gramaj Seçenekleri
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500">
                  Fiyat farkı negatif olabilir (indirim)
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddSize}>
                <Plus className="h-3.5 w-3.5" />
                Boyut Ekle
              </Button>
            </div>

            {sizes.length === 0 && (
              <p className="rounded-xl bg-neutral-50 py-4 text-center text-sm text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500">
                Boyut eklenmemiş — tüm müşteriler standart fiyat öder
              </p>
            )}

            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  {/* Boyut adı */}
                  <div className="flex-1 min-w-0">
                    <Input
                      placeholder="Boyut adı (Örn: Büyük / 33cm)"
                      value={size.name}
                      onChange={(e) => handleSizeChange(index, "name", e.target.value)}
                    />
                  </div>

                  {/* Fiyat farkı */}
                  <div className="w-32 shrink-0">
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-neutral-500">
                        ₺
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={size.priceModifier === 0 ? "" : size.priceModifier}
                        onChange={(e) =>
                          handleSizeChange(index, "priceModifier", Number(e.target.value))
                        }
                        className="flex h-10 w-full rounded-lg border border-neutral-200 bg-white pl-8 pr-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 focus-visible:border-amber-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => handleRemoveSize(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Aktif / Pasif */}
          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Ürün Aktif
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Kapalıysa menüde ve siparişlerde görünmez
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={!name.trim() || !price || !categoryId}>
              <Save className="h-4 w-4" />
              {product ? "Güncelle" : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
