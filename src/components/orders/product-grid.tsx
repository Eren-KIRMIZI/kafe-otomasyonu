"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProductCard } from "./product-card"
import { OrderCustomizationDialog } from "./order-customization-dialog"
import type { Product, Category } from "@/types"

interface CartItem {
  id: string
  product: Product
  quantity: number
  size: "small" | "medium" | "large"
  extras: string[]
  sugar: string
  note: string
}

interface ProductGridProps {
  products: Product[]
  categories: Category[]
  onAddToCart: (item: CartItem) => void
}

const CATEGORY_ICONS: Record<string, string> = {
  Kahveler: "☕",
  "Soğuk İçecekler": "🧊",
  Tatlılar: "🍰",
  Pastalar: "🎂",
  Kahvaltı: "🍳",
  Hamburger: "🍔",
  Pizza: "🍕",
  Atıştırmalıklar: "🍿",
}

export function ProductGrid({ products, categories, onAddToCart }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0].id : ""
  )
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => p.isActive)

    if (activeCategory) {
      filtered = filtered.filter((p) => p.categoryId === activeCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [products, activeCategory, searchQuery])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  const handleAddToCart = (item: CartItem) => {
    onAddToCart(item)
    setDialogOpen(false)
    setSelectedProduct(null)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-xl border-neutral-200 bg-white pl-10 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 -mx-1 overflow-x-auto px-1">
        <div className="flex gap-2 pb-1">
          <button
            onClick={() => setActiveCategory("")}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              activeCategory === ""
                ? "bg-neutral-900 text-white shadow-md dark:bg-white dark:text-neutral-900"
                : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-neutral-900 text-white shadow-md dark:bg-white dark:text-neutral-900"
                  : "bg-white text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{CATEGORY_ICONS[cat.name] || "📋"}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <ProductCard
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                <Search className="h-7 w-7 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Ürün bulunamadı
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <OrderCustomizationDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}

export type { CartItem }
