"use client"

import { motion } from "framer-motion"
import { Clock, AlertTriangle, ArrowRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency } from "@/lib/utils"
import { OrderStatus } from "@/types"
import type { Order } from "@/types"

interface KitchenOrderCardProps {
  order: Order
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void
}

function getElapsedMinutes(createdAt: Date): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
}

function getElapsedTimeLabel(minutes: number): string {
  if (minutes < 1) return "Az önce"
  if (minutes < 60) return `${minutes} dk`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}sa ${mins}dk`
}

function getTimerColor(minutes: number): string {
  if (minutes < 5) return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950"
  if (minutes < 15) return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
  return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
}

function getPriorityBorder(minutes: number): string {
  if (minutes >= 15) return "border-l-red-500"
  if (minutes >= 5) return "border-l-amber-500"
  return "border-l-emerald-500"
}

const STATUS_CONFIG: Record<string, { next: OrderStatus | null; buttonLabel: string }> = {
  [OrderStatus.PENDING]: { next: OrderStatus.PREPARING, buttonLabel: "Hazırlamaya Başla" },
  [OrderStatus.CONFIRMED]: { next: OrderStatus.PREPARING, buttonLabel: "Hazırlamaya Başla" },
  [OrderStatus.PREPARING]: { next: OrderStatus.READY, buttonLabel: "Hazır İşaretle" },
  [OrderStatus.READY]: { next: OrderStatus.SERVED, buttonLabel: "Teslim Et" },
}

export function KitchenOrderCard({ order, onStatusChange }: KitchenOrderCardProps) {
  const elapsed = getElapsedMinutes(order.createdAt)
  const config = STATUS_CONFIG[order.status] || { next: null, buttonLabel: "" }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950",
        "border-l-4",
        getPriorityBorder(elapsed)
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-neutral-900 dark:text-white">
              #{order.orderNumber}
            </span>
            {elapsed >= 15 && (
              <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Masa {order.table?.number || "?"}</span>
            <span>·</span>
            <span>{order.items?.length || 0} ürün</span>
          </div>
        </div>
        <div className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold", getTimerColor(elapsed))}>
          <Clock className="h-3 w-3" />
          {getElapsedTimeLabel(elapsed)}
        </div>
      </div>

      <div className="mb-3 space-y-1.5">
        {order.items?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-900"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-neutral-200 px-1 text-[10px] font-bold text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                {item.quantity}
              </span>
              <span className="text-sm text-neutral-800 dark:text-neutral-200">
                {item.product?.name || "Ürün"}
              </span>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatCurrency(item.totalPrice)}
            </span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950/30">
          <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
            {order.notes}
          </p>
        </div>
      )}

      {config.next && (
        <Button
          onClick={() => onStatusChange(order.id, config.next!)}
          className="w-full rounded-lg h-9 text-xs font-semibold"
          variant={order.status === OrderStatus.READY ? "default" : "secondary"}
        >
          {config.buttonLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      )}
    </motion.div>
  )
}
