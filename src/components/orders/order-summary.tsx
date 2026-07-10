"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Trash2,
  ShoppingBag,
  Minus,
  Plus,
  MessageSquare,
  Percent,
  Send,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { CartItem } from "./product-grid"

interface OrderSummaryProps {
  items: CartItem[]
  tableNumber: number | null
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearOrder: () => void
  onSubmitOrder: () => void
  discount: number
  onDiscountChange: (value: number) => void
}

const TAX_RATE = 0.18
const SERVICE_FEE_RATE = 0.05

const SIZE_LABELS: Record<string, string> = {
  small: "Küçük",
  medium: "Orta",
  large: "Büyük",
}

export function OrderSummary({
  items,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onSubmitOrder,
  discount,
  onDiscountChange,
}: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => {
    const sizeModifier =
      item.size === "large" ? 10 : item.size === "small" ? 0 : 5
    const extrasTotal = item.extras.length * 8
    return (item.product.price + sizeModifier + extrasTotal) * item.quantity + sum
  }, 0)

  const taxAmount = subtotal * TAX_RATE
  const serviceFee = subtotal * SERVICE_FEE_RATE
  const grandTotal = subtotal + taxAmount + serviceFee - discount

  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Sipariş Özeti
            </h2>
            {tableNumber && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Masa {tableNumber}
              </p>
            )}
          </div>
        </div>
        {items.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {items.reduce((sum, i) => sum + i.quantity, 0)} ürün
          </Badge>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
              <ShoppingBag className="h-7 w-7 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Henüz ürün eklenmedi
            </p>
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
              Ürün seçerek siparişinizi oluşturun
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-2">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="group rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 transition-all hover:border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        {item.note && (
                          <MessageSquare className="h-3 w-3 shrink-0 text-amber-500" />
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {SIZE_LABELS[item.size]}
                        </Badge>
                        {item.sugar && item.sugar !== "medium" && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            Şeker: {item.sugar === "none" ? "Yok" : item.sugar === "low" ? "Az" : "Çok"}
                          </Badge>
                        )}
                        {item.extras.length > 0 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            +{item.extras.length} ek
                          </Badge>
                        )}
                      </div>
                      {item.note && (
                        <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 line-clamp-1 italic">
                          &ldquo;{item.note}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                      <div className="flex items-center gap-1 rounded-lg bg-white shadow-sm dark:bg-neutral-800">
                        <button
                          onClick={() =>
                            item.quantity <= 1
                              ? onRemoveItem(item.id)
                              : onUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[20px] text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-neutral-100 bg-neutral-50/30 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900/30">
          <div className="mb-3">
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              <Input
                type="number"
                placeholder="İndirim tutarı"
                value={discount || ""}
                onChange={(e) => onDiscountChange(Number(e.target.value) || 0)}
                className="h-9 rounded-lg border-neutral-200 bg-white pl-9 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Ara Toplam</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>KDV (%18)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Hizmet Bedeli (%5)</span>
              <span>{formatCurrency(serviceFee)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>İndirim</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="border-t border-neutral-200 pt-2 dark:border-neutral-700">
              <div className="flex justify-between">
                <span className="text-base font-bold text-neutral-900 dark:text-white">
                  Toplam
                </span>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onClearOrder}
              className="shrink-0 h-12 w-12 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={onSubmitOrder}
              className="flex-1 h-12 rounded-xl text-base font-semibold"
            >
              <Send className="h-4 w-4" />
              Siparişi Gönder
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
