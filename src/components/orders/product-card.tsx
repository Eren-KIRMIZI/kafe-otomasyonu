"use client"

import { motion } from "framer-motion"
import { Coffee, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  onClick: () => void
}

// Map product names to local images
const IMAGE_MAP: Record<string, string> = {
  "Espresso": "/images/products/espresso.jpg",
  "Americano": "/images/products/americano.jpg",
  "Cappuccino": "/images/products/cappuccino.jpg",
  "Latte": "/images/products/latte.jpg",
  "Mocha": "/images/products/mocha.jpg",
  "Flat White": "/images/products/latte.jpg",
  "Macchiato": "/images/products/espresso.jpg",
  "Türk Kahvesi": "/images/products/t-rk-kahvesi.jpg",
  "Matcha Latte": "/images/products/latte.jpg",
  "Ice Latte": "/images/products/latte.jpg",
  "Cold Brew": "/images/products/americano.jpg",
  "Smoothie": "/images/products/smoothie.jpg",
  "Milkshake": "/images/products/smoothie.jpg",
  "Soğuk Çikolata": "/images/products/mocha.jpg",
  "Tiramisu": "/images/products/tiramisu.jpg",
  "Cheesecake": "/images/products/cheesecake.jpg",
  "Brownie": "/images/products/brownie.jpg",
  "Kruvasan": "/images/products/cheesecake.jpg",
  "Ayran": "/images/products/ayran.jpg",
  "Taze Limonata": "/images/products/meyve-suyu.jpg",
  "Filtre Kahve": "/images/products/filtre-kahve.jpg",
  "Kola": "/images/products/kola.jpg",
  "Meyve Suyu": "/images/products/meyve-suyu.jpg",
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const imageUrl = product.imageUrl || IMAGE_MAP[product.name]

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <div
        className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-200/60 bg-white transition-all duration-300 hover:border-neutral-300 hover:shadow-xl dark:border-neutral-800/60 dark:bg-neutral-950 dark:hover:border-neutral-700"
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Coffee className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Price chip */}
          <div className="absolute bottom-2 left-2 rounded-xl bg-white/90 px-2.5 py-1 text-xs font-bold text-neutral-900 backdrop-blur-sm shadow dark:bg-neutral-950/90 dark:text-white">
            {formatCurrency(product.price)}
          </div>
        </div>

        {/* Content */}
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {product.name}
            </h3>
            {product.description && (
              <p className="mt-0.5 truncate text-[11px] text-neutral-400 dark:text-neutral-500">
                {product.description}
              </p>
            )}
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-all group-hover:bg-neutral-900 group-hover:text-white dark:bg-neutral-800 dark:group-hover:bg-white dark:group-hover:text-neutral-900">
            <Plus className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
