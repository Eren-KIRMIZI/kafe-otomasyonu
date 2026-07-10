"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  UtensilsCrossed,
  ReceiptText,
  StickyNote,
  ArrowRightLeft,
  Merge,
  Scissors,
  CreditCard,
  Users,
  Clock,
  MapPin,
  QrCode,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { statusConfig } from "./table-card"
import { TableStatus } from "@/types"
import type { Table, Order } from "@/types"

interface TableDetailProps {
  table: Table
  onClose: () => void
  onStatusChange?: (tableId: string, status: Table["status"]) => void
  onMoveTable?: (table: Table) => void
  onMergeTable?: (table: Table) => void
  onSplitTable?: (table: Table) => void
  onPayment?: (table: Table) => void
}

function getOccupiedDuration(createdAt: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(createdAt).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}sa ${minutes}dk`
  return `${minutes}dk`
}

export function TableDetail({
  table,
  onClose,
  onStatusChange,
  onMoveTable,
  onMergeTable,
  onSplitTable,
  onPayment,
}: TableDetailProps) {
  const router = useRouter()
  const [note, setNote] = React.useState("")
  const [isEditingNote, setIsEditingNote] = React.useState(false)

  const config = statusConfig[table.status]
  const isActive = table.status !== "EMPTY" && table.status !== "RESERVED"
  const orders = table.orders ?? []
  const activeOrders = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
  )
  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <span className={cn("text-2xl font-bold", config.labelColor)}>
              Masa {table.number}
            </span>
            <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", config.border, config.labelColor, "bg-white/5")}>{config.label}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <Users className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Kapasite</p>
                  <p className="text-sm font-semibold">{table.capacity} Kişi</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                <MapPin className="h-4 w-4 text-neutral-500" />
                <div>
                  <p className="text-xs text-neutral-500">Konum</p>
                  <p className="text-sm font-semibold">{table.location || "Tanımsız"}</p>
                </div>
              </div>
              {isActive && table.createdAt && (
                <div className="col-span-2 flex items-center gap-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
                  <Clock className="h-4 w-4 text-neutral-500" />
                  <div>
                    <p className="text-xs text-neutral-500">Süre</p>
                    <p className="text-sm font-semibold">
                      {getOccupiedDuration(table.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {activeOrders.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Aktif Siparişler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeOrders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-3 dark:border-neutral-700">
                    <span className="text-sm font-medium text-neutral-500">Toplam</span>
                    <span className="text-lg font-bold">{formatCurrency(totalAmount)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Müşteri Notu</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingNote(!isEditingNote)}
                  >
                    {isEditingNote ? "Kaydet" : "Düzenle"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingNote ? (
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Müşteri notu ekleyin..."
                    className="min-h-[80px]"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">
                    {note || "Henüz not eklenmemiş."}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                İşlemler
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => router.push(`/orders?table=${table.id}`)}
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Sipariş Ver
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => {}}
                >
                  <ReceiptText className="h-4 w-4" />
                  Adisyon Gör
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => {
                    // Open the public QR menu for this table
                    window.open(`/qr/masa-${table.number}`, "_blank")
                  }}
                >
                  <QrCode className="h-4 w-4" />
                  QR Menü
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => onMoveTable?.(table)}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Masa Taşı
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => onMergeTable?.(table)}
                >
                  <Merge className="h-4 w-4" />
                  Masa Birleştir
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => onSplitTable?.(table)}
                >
                  <Scissors className="h-4 w-4" />
                  Masa Böl
                </Button>
                {table.status !== "WAITING_BILL" && isActive && (
                  <Button
                    variant="outline"
                    className="justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => onStatusChange?.(table.id, TableStatus.WAITING_BILL)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Hesap İste
                  </Button>
                )}
                {table.status === "WAITING_BILL" && (
                  <Button
                    className="justify-start gap-2 col-span-2 bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => onPayment?.(table)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Ödeme Al — {formatCurrency(totalAmount)}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Durum Değiştir
              </h3>
              <div className="flex flex-wrap gap-2">
                {([TableStatus.EMPTY, TableStatus.ORDERED, TableStatus.WAITING_BILL, TableStatus.RESERVED]).map(
                  (status) => {
                    const cfg = statusConfig[status as keyof typeof statusConfig]
                    return (
                      <Button
                        key={status}
                        variant={table.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => onStatusChange?.(table.id, status)}
                      >
                        {cfg.label}
                      </Button>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function OrderRow({ order }: { order: Order }) {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PREPARING: "bg-orange-100 text-orange-700",
    READY: "bg-green-100 text-green-700",
    SERVED: "bg-emerald-100 text-emerald-700",
    COMPLETED: "bg-neutral-100 text-neutral-700",
    CANCELLED: "bg-red-100 text-red-700",
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-900">
      <div>
        <p className="text-sm font-medium">#{order.orderNumber}</p>
        <p className="text-xs text-neutral-500">
          {order.items?.length ?? 0} ürün
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold">{formatCurrency(order.totalAmount)}</p>
        <span
          className={cn(
            "inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold",
            statusColors[order.status] ?? "bg-neutral-100 text-neutral-700"
          )}
        >
          {order.status}
        </span>
      </div>
    </div>
  )
}
