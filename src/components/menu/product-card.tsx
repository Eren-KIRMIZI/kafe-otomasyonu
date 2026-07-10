"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Pencil, Trash2, ImageOff, Clock } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  categoryName?: string
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string) => void
}

export function ProductCard({
  product,
  categoryName,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductCardProps) {
  const [deleteConfirm, setDeleteConfirm] = React.useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-200",
          !product.isActive && "opacity-60"
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
            </div>
          )}
          <div className="absolute right-3 top-3">
            <Switch
              checked={product.isActive}
              onCheckedChange={() => onToggleActive(product.id)}
            />
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="rounded-xl bg-white/90 px-3 py-1.5 text-sm font-bold text-neutral-900 shadow-sm backdrop-blur-sm dark:bg-neutral-950/90 dark:text-white">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                {product.name}
              </h3>
              {product.description && (
                <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {product.description}
                </p>
              )}
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            {categoryName && (
              <Badge variant="secondary" className="text-[10px]">
                {categoryName}
              </Badge>
            )}
            {product.preparationTime && (
              <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                <Clock className="h-3 w-3" />
                {product.preparationTime} dk
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-1 border-t border-neutral-100 pt-3 dark:border-neutral-800">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-3 w-3" />
              Düzenle
            </Button>
            {deleteConfirm ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    onDelete(product.id)
                    setDeleteConfirm(false)
                  }}
                >
                  Sil
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setDeleteConfirm(false)}
                >
                  İptal
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={() => setDeleteConfirm(true)}
              >
                <Trash2 className="h-3 w-3" />
                Sil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
