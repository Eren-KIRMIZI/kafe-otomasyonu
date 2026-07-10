"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Percent, Tag, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { DiscountType } from "@/types"

interface DiscountPanelProps {
  subtotal: number
  discountType: DiscountType
  discountValue: number
  onDiscountTypeChange: (type: DiscountType) => void
  onDiscountValueChange: (value: number) => void
  onClearDiscount: () => void
}

const TAX_RATE = 0.18
const SERVICE_FEE_RATE = 0.05

export function DiscountPanel({
  subtotal,
  discountType,
  discountValue,
  onDiscountTypeChange,
  onDiscountValueChange,
  onClearDiscount,
}: DiscountPanelProps) {
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState("")

  const calculatedDiscount =
    discountType === "PERCENTAGE"
      ? Math.min(subtotal * (discountValue / 100), subtotal)
      : Math.min(discountValue, subtotal)

  const taxAmount = subtotal * TAX_RATE
  const serviceFee = subtotal * SERVICE_FEE_RATE
  const totalAfterDiscount = subtotal - calculatedDiscount + taxAmount + serviceFee

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Kupon kodu giriniz")
      return
    }
    if (couponCode.trim().toLowerCase() === "indirim10") {
      setCouponApplied(true)
      setCouponError("")
      onDiscountTypeChange(DiscountType.PERCENTAGE)
      onDiscountValueChange(10)
    } else {
      setCouponError("Geçersiz kupon kodu")
      setCouponApplied(false)
    }
  }

  const handleClearCoupon = () => {
    setCouponCode("")
    setCouponApplied(false)
    setCouponError("")
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
          İndirim Uygula
        </h4>

        <div className="mb-3 flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
          <button
            type="button"
            onClick={() => onDiscountTypeChange(DiscountType.PERCENTAGE)}
            className={[
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
              discountType === "PERCENTAGE"
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-950 dark:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
            ].join(" ")}
          >
            Yüzde (%)
          </button>
          <button
            type="button"
            onClick={() => onDiscountTypeChange(DiscountType.FIXED)}
            className={[
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
              discountType === "FIXED"
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-950 dark:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
            ].join(" ")}
          >
            Tutar (₺)
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Percent className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <Input
              type="number"
              placeholder={
                discountType === "PERCENTAGE" ? "İndirim yüzdesi" : "İndirim tutarı"
              }
              value={discountValue || ""}
              onChange={(e) => onDiscountValueChange(Number(e.target.value) || 0)}
              className="h-9 rounded-lg border-neutral-200 bg-white pl-9 text-xs dark:border-neutral-700 dark:bg-neutral-800"
              min={0}
              max={discountType === "PERCENTAGE" ? 100 : subtotal}
            />
          </div>
          {discountValue > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearDiscount}
              className="h-9 w-9 shrink-0 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {discountValue > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <Badge
              variant="success"
              className="text-xs"
            >
              İndirim: {formatCurrency(calculatedDiscount)}
              {discountType === "PERCENTAGE" && ` (%${discountValue})`}
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
          Kupon Kodu
        </h4>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Kupon kodunu girin"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value)
                setCouponError("")
              }}
              disabled={couponApplied}
              className="h-9 rounded-lg border-neutral-200 bg-white pl-9 text-xs dark:border-neutral-700 dark:bg-neutral-800"
            />
          </div>
          {couponApplied ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearCoupon}
              className="h-9 w-9 shrink-0 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyCoupon}
              className="h-9 shrink-0 rounded-lg text-xs"
            >
              <Check className="h-3.5 w-3.5" />
              Uygula
            </Button>
          )}
        </div>

        <AnimatePresence>
          {couponApplied && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-2"
            >
              <Badge variant="success" className="text-xs">
                %10 indirim uygulandı
              </Badge>
            </motion.div>
          )}
          {couponError && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-1.5 text-xs text-red-500"
            >
              {couponError}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>Ara Toplam</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>KDV (%18)</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
          <span>Hizmet Bedeli (%5)</span>
          <span>{formatCurrency(serviceFee)}</span>
        </div>
        {calculatedDiscount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
            <span>İndirim</span>
            <span>-{formatCurrency(calculatedDiscount)}</span>
          </div>
        )}
        <div className="border-t border-neutral-200 pt-2 dark:border-neutral-700">
          <div className="flex justify-between">
            <span className="text-base font-bold text-neutral-900 dark:text-white">
              Genel Toplam
            </span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatCurrency(totalAfterDiscount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
