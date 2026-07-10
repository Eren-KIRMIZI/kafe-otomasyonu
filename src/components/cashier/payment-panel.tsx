"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Printer,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  User,
  Table2,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatCurrency, formatTime } from "@/lib/utils"
import { PaymentMethodButton } from "@/components/cashier/payment-method-button"
import { DiscountPanel } from "@/components/cashier/discount-panel"
import { DiscountType } from "@/types"
import type { Order, PaymentMethod } from "@/types"

interface SplitPayment {
  id: string
  method: PaymentMethod
  amount: number
}

interface PaymentPanelProps {
  order: Order | null
  onBack: () => void
  onPaymentComplete: () => void
}

export function PaymentPanel({
  order,
  onBack,
  onPaymentComplete,
}: PaymentPanelProps) {
  const [discountType, setDiscountType] = useState<DiscountType>(DiscountType.PERCENTAGE)
  const [discountValue, setDiscountValue] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null
  )
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const subtotal = order?.subtotal ?? 0

  const calculatedDiscount =
    discountType === "PERCENTAGE"
      ? Math.min(subtotal * (discountValue / 100), subtotal)
      : Math.min(discountValue, subtotal)

  const taxAmount = order?.taxAmount ?? subtotal * 0.18
  const serviceFee = subtotal * 0.05
  const totalAfterDiscount =
    subtotal - calculatedDiscount + taxAmount + serviceFee

  const totalPaid = splitPayments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = Math.max(0, totalAfterDiscount - totalPaid)

  const handleAddSplit = useCallback(() => {
    if (!selectedPayment) return
    const existing = splitPayments.find(
      (p) => p.method === selectedPayment
    )
    if (existing) {
      setSplitPayments((prev) =>
        prev.map((p) =>
          p.method === selectedPayment
            ? { ...p, amount: p.amount + remaining }
            : p
        )
      )
    } else {
      setSplitPayments((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          method: selectedPayment,
          amount: remaining,
        },
      ])
    }
    setSelectedPayment(null)
  }, [selectedPayment, splitPayments, remaining])

  const handleRemoveSplit = (id: string) => {
    setSplitPayments((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSplitAmountChange = (id: string, amount: number) => {
    setSplitPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, amount: Math.max(0, amount) } : p))
    )
  }

  const handleProcessPayment = useCallback(() => {
    if (remaining > 0) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onPaymentComplete()
      }, 2000)
    }, 1500)
  }, [remaining, onPaymentComplete])

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
          <ShoppingBag className="h-7 w-7 text-neutral-400" />
        </div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Adisyon seçilmedi
        </p>
        <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
          Sol taraftan bir adisyon seçin
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-1 flex-col items-center justify-center gap-4 py-24"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
            </motion.div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                Ödeme Başarılı
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Toplam {formatCurrency(totalAfterDiscount)} tahsil edildi
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="h-8 w-8 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Ödeme
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    #{order.orderNumber}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                Fiş Yazdır
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                  <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <Table2 className="h-3 w-3" />
                    Masa
                  </div>
                  <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                    {order.table?.number ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                  <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <User className="h-3 w-3" />
                    Garson
                  </div>
                  <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                    {order.waiter?.name ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                  <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <Clock className="h-3 w-3" />
                    Süre
                  </div>
                  <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">
                    {formatTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mb-5 space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Ürünler
                </h4>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-400">
                        {item.quantity}x
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {item.product?.name ?? "Ürün"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>

              <DiscountPanel
                subtotal={subtotal}
                discountType={discountType}
                discountValue={discountValue}
                onDiscountTypeChange={setDiscountType}
                onDiscountValueChange={setDiscountValue}
                onClearDiscount={() => {
                  setDiscountValue(0)
                  setDiscountType(DiscountType.PERCENTAGE)
                }}
              />

              <div className="mt-5">
                <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
                  Ödeme Yöntemi
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {(
                    [
                      "CASH",
                      "CREDIT_CARD",
                      "DEBIT_CARD",
                      "MOBILE_PAYMENT",
                    ] as PaymentMethod[]
                  ).map((method) => (
                    <PaymentMethodButton
                      key={method}
                      method={method}
                      selected={selectedPayment === method}
                      onClick={() =>
                        setSelectedPayment(
                          selectedPayment === method ? null : method
                        )
                      }
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleAddSplit}
                  disabled={!selectedPayment || remaining <= 0}
                  className="mt-3 h-10 w-full rounded-xl text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Ekle
                </Button>
              </div>

              <AnimatePresence>
                {splitPayments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2"
                  >
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Bölüşülmüş Ödemeler
                    </h4>
                    {splitPayments.map((split) => (
                      <motion.div
                        key={split.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950"
                      >
                        <div className="flex-1">
                          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            {split.method === "CASH"
                              ? "Nakit"
                              : split.method === "CREDIT_CARD"
                                ? "Kredi Kartı"
                                : split.method === "DEBIT_CARD"
                                  ? "Yemek Kartı"
                                  : "QR Ödeme"}
                          </p>
                          <Input
                            type="number"
                            value={split.amount || ""}
                            onChange={(e) =>
                              handleSplitAmountChange(
                                split.id,
                                Number(e.target.value) || 0
                              )
                            }
                            className="mt-1 h-8 rounded-lg text-sm font-semibold"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveSplit(split.id)}
                          className="h-8 w-8 shrink-0 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </motion.div>
                    ))}

                    <div className="flex items-center justify-between rounded-xl bg-neutral-100 px-4 py-2 dark:bg-neutral-800">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Kalan
                      </span>
                      <span
                        className={[
                          "text-lg font-bold",
                          remaining > 0
                            ? "text-red-500"
                            : "text-emerald-600 dark:text-emerald-400",
                        ].join(" ")}
                      >
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-neutral-100 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Tahsil Edilecek
                </span>
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(totalAfterDiscount)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl text-sm"
                >
                  <Printer className="h-4 w-4" />
                  Fiş Yazdır
                </Button>
                <Button
                  onClick={handleProcessPayment}
                  disabled={remaining > 0 || splitPayments.length === 0}
                  loading={isProcessing}
                  className="flex-1 h-12 rounded-xl text-base font-semibold"
                >
                  <CreditCard className="h-4 w-4" />
                  Ödeme Al
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
