"use client"

import { useState } from "react"
import { Minus, Plus, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"

interface CartItem {
  id: string
  product: Product
  quantity: number
  size: "small" | "medium" | "large"
  extras: string[]
  sugar: string
  note: string
}

interface OrderCustomizationDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (item: CartItem) => void
}

// Ürün türüne göre boyut seçeneklerini belirle
function getSizes(product: Product) {
  const name = product.name.toLowerCase()
  const catId = product.categoryId

  // Pizza
  if (name.includes("pizza")) {
    return [
      { value: "small" as const, label: "26 cm",  description: "Küçük boy",  modifier: 0  },
      { value: "large"  as const, label: "33 cm",  description: "Büyük boy",  modifier: 50 },
    ]
  }
  // Türk kahvesi
  if (name.includes("türk kahvesi")) {
    return [
      { value: "small"  as const, label: "Tek",    description: "1 fincan",   modifier: 0  },
      { value: "large"  as const, label: "Çift",   description: "2 fincan",   modifier: 20 },
    ]
  }
  // Espresso
  if (name.includes("espresso")) {
    return [
      { value: "small"  as const, label: "Single", description: "Tek shot",   modifier: 0  },
      { value: "large"  as const, label: "Double", description: "Çift shot",  modifier: 15 },
    ]
  }
  // Burger
  if (name.includes("burger")) {
    return [
      { value: "small"  as const, label: "Normal",       description: "Tek patty",   modifier: 0  },
      { value: "large"  as const, label: "Double Patty", description: "Çift patty",  modifier: 60 },
    ]
  }
  // Standart içecek (kahve, smoothie, latte...)
  if (catId === "cat-1" || catId === "cat-2" || name.includes("kahve") || name.includes("latte") || name.includes("smoothie") || name.includes("milkshake")) {
    return [
      { value: "small"  as const, label: "Küçük (S)", description: "~250 ml", modifier: 0  },
      { value: "medium" as const, label: "Orta (M)",  description: "~350 ml", modifier: 20 },
      { value: "large"  as const, label: "Büyük (L)", description: "~480 ml", modifier: 35 },
    ]
  }
  // Yiyecek / tatlı — tek porsiyon, boyut seçeneği yok
  return null
}

// Ürün türüne uygun extra seçenekleri
function getExtras(product: Product) {
  const name = product.name.toLowerCase()
  const catId = product.categoryId

  if (name.includes("burger")) {
    return [
      { id: "extra-cheese",  name: "Ekstra Peynir",      price: 20 },
      { id: "extra-patty",   name: "Ekstra Et",           price: 40 },
      { id: "jalapeno",      name: "Jalapeno",            price: 10 },
      { id: "gf-bread",      name: "Glütensiz Ekmek",    price: 15 },
      { id: "no-sauce",      name: "Sossuz",              price: 0  },
    ]
  }
  if (name.includes("pizza")) {
    return [
      { id: "extra-mozzarella", name: "Ekstra Mozarella", price: 25 },
      { id: "extra-sucuk",      name: "Ekstra Sucuk",     price: 30 },
      { id: "mushroom",         name: "Mantar Ekle",      price: 15 },
      { id: "no-gluten",        name: "Glütensiz Hamur",  price: 20 },
    ]
  }
  if (catId === "cat-1" || catId === "cat-2" || name.includes("latte") || name.includes("kahve") || name.includes("mocha")) {
    return [
      { id: "oat-milk",     name: "Yulaf Sütü",    price: 15 },
      { id: "extra-shot",   name: "Ek Shot",       price: 15 },
      { id: "hazelnut",     name: "Fındık Şurubu", price: 10 },
      { id: "vanilla",      name: "Vanilya Şurubu",price: 10 },
      { id: "choc-powder",  name: "Çikolata Tozu", price: 5  },
      { id: "extra-ice",    name: "Buz Ekstra",    price: 0  },
    ]
  }
  // Yiyecek
  return [
    { id: "extra-portion", name: "Ekstra Porsiyon", price: 30 },
    { id: "no-nut",        name: "Fındıksız",        price: 0  },
    { id: "takeaway-box",  name: "Paket Kutusu",     price: 5  },
  ]
}

const SUGAR_OPTIONS = [
  { value: "none",   label: "Şekersiz" },
  { value: "low",    label: "Az"       },
  { value: "medium", label: "Orta"     },
  { value: "high",   label: "Çok"      },
]

export function OrderCustomizationDialog({
  product,
  open,
  onOpenChange,
  onAddToCart,
}: OrderCustomizationDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState<"small" | "medium" | "large">("medium")
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [sugar, setSugar] = useState("medium")
  const [note, setNote] = useState("")

  const resetForm = () => {
    setQuantity(1)
    setSize("medium")
    setSelectedExtras([])
    setSugar("medium")
    setNote("")
  }

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    )
  }

  const calculateTotal = () => {
    if (!product) return 0
    const sizes = getSizes(product)
    const sizeModifier = sizes?.find((s) => s.value === size)?.modifier ?? 0
    const extras = getExtras(product)
    const extrasTotal = extras
      .filter((e) => selectedExtras.includes(e.id))
      .reduce((sum, e) => sum + e.price, 0)
    return (product.price + sizeModifier + extrasTotal) * quantity
  }

  const handleAdd = () => {
    if (!product) return
    const item: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      quantity,
      size,
      extras: selectedExtras,
      sugar,
      note,
    }
    onAddToCart(item)
    resetForm()
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) resetForm()
    onOpenChange(value)
  }

  if (!product) return null

  const sizes   = getSizes(product)
  const extras  = getExtras(product)
  const isDrink = product.categoryId === "cat-1" || product.categoryId === "cat-2"

  // Varsayılan boyutu düzelt: sizes listesinde "medium" yoksa "small" seç
  const defaultSize = sizes?.find((s) => s.value === "medium") ? "medium"
    : sizes?.[0]?.value ?? "medium"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Başlık */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-6 pt-8 pb-4 dark:from-neutral-900 dark:to-neutral-800">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">{product.name}</DialogTitle>
            {product.description && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {product.description}
              </p>
            )}
            <p className="mt-2 text-lg font-bold text-amber-700 dark:text-amber-400">
              {formatCurrency(product.price)}
            </p>
          </DialogHeader>
        </div>

        <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
          <div className="space-y-6">

            {/* Boyut Seçimi */}
            {sizes && (
              <div>
                <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Boyut
                </label>
                <div className={`grid gap-2 ${sizes.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
                  {sizes.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSize(s.value)}
                      className={`relative rounded-xl border-2 px-3 py-3 text-center transition-all duration-200 ${
                        size === s.value
                          ? "border-amber-600 bg-amber-600 text-white shadow-md dark:border-amber-500 dark:bg-amber-600"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-amber-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                      }`}
                    >
                      <span className="block text-sm font-semibold">{s.label}</span>
                      <span className="block text-xs opacity-80 mt-0.5">{s.description}</span>
                      {s.modifier > 0 && (
                        <span className={`block text-xs mt-0.5 font-medium ${size === s.value ? "opacity-90" : "text-amber-600 dark:text-amber-400"}`}>
                          +{formatCurrency(s.modifier)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ekstralar */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Ekstralar
              </label>
              <div className="space-y-2">
                {extras.map((extra) => (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-2.5 transition-all duration-200 ${
                      selectedExtras.includes(extra.id)
                        ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/20"
                        : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
                          selectedExtras.includes(extra.id)
                            ? "border-amber-600 bg-amber-600 dark:border-amber-500 dark:bg-amber-500"
                            : "border-neutral-300 dark:border-neutral-600"
                        }`}
                      >
                        {selectedExtras.includes(extra.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {extra.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      {extra.price > 0 ? `+${formatCurrency(extra.price)}` : "Ücretsiz"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Şeker Tercihi (sadece içecekler için) */}
            {isDrink && (
              <div>
                <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Sekerleme
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SUGAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSugar(opt.value)}
                      className={`rounded-xl border-2 px-2 py-2.5 text-center text-sm font-medium transition-all duration-200 ${
                        sugar === opt.value
                          ? "border-amber-600 bg-amber-600 text-white shadow-md dark:border-amber-500 dark:bg-amber-600"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-amber-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Özel Not */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Siparis Notu
              </label>
              <Textarea
                placeholder="Özel talebiniz varsa yazınız..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[72px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Alt bar: adet + ekle */}
        <DialogFooter className="border-t border-neutral-100 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="flex w-full items-center gap-4">
            {/* Adet */}
            <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-l-xl text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[32px] text-center text-base font-bold text-neutral-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-r-xl text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Siparişe Ekle */}
            <Button
              onClick={handleAdd}
              className="flex-1 h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold"
            >
              Ekle — {formatCurrency(calculateTotal())}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
