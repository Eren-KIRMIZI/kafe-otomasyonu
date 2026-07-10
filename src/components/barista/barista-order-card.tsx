"use client"

import { motion } from "framer-motion"
import { Clock, ArrowRight, Coffee, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatCurrency } from "@/lib/utils"
import { OrderStatus } from "@/types"
import type { Order } from "@/types"

interface BaristaOrderCardProps {
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
  return "border-l-blue-500"
}

export function BaristaOrderCard({ order, onStatusChange }: BaristaOrderCardProps) {
  const elapsed = getElapsedMinutes(order.createdAt)

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
            <Badge className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
              <Coffee className="mr-1 h-2.5 w-2.5" />
              İçecek
            </Badge>
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Masa {order.table?.number || "?"}</span>
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
            className="rounded-lg bg-blue-50/50 px-3 py-2.5 dark:bg-blue-950/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-blue-200 px-1 text-[10px] font-bold text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                  {item.quantity}
                </span>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {item.product?.name || "İçecek"}
                </span>
              </div>
            </div>
            {item.notes && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-neutral-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                  <Coffee className="h-2.5 w-2.5" />
                  Not: {item.notes}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950/30">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
            {order.notes}
          </p>
        </div>
      )}

      {order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED ? (
        <Button
          onClick={() => onStatusChange(order.id, OrderStatus.PREPARING)}
          className="w-full rounded-lg h-9 text-xs font-semibold"
          variant="secondary"
        >
          Hazırlamaya Başla
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      ) : order.status === OrderStatus.PREPARING ? (
        <Button
          onClick={() => onStatusChange(order.id, OrderStatus.READY)}
          className="w-full rounded-lg h-9 text-xs font-semibold"
        >
          Hazır İşaretle
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </motion.div>
  )
}
