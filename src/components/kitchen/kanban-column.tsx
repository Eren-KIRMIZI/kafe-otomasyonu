"use client"

import { AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { KitchenOrderCard } from "./order-card"
import type { Order, OrderStatus } from "@/types"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  title: string
  color: "blue" | "orange" | "green" | "gray"
  orders: Order[]
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void
}

const COLOR_MAP = {
  blue: {
    header: "bg-blue-50 dark:bg-blue-950/30",
    dot: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  orange: {
    header: "bg-amber-50 dark:bg-amber-950/30",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  green: {
    header: "bg-emerald-50 dark:bg-emerald-950/30",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  gray: {
    header: "bg-neutral-100 dark:bg-neutral-800/50",
    dot: "bg-neutral-400",
    badge: "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400",
  },
}

export function KanbanColumn({ title, color, orders, onStatusChange }: KanbanColumnProps) {
  const colors = COLOR_MAP[color]

  return (
    <div className="flex flex-1 flex-col min-w-[320px]">
      <div className={cn("flex items-center justify-between rounded-t-xl px-4 py-3", colors.header)}>
        <div className="flex items-center gap-2.5">
          <div className={cn("h-2.5 w-2.5 rounded-full", colors.dot)} />
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {title}
          </h3>
        </div>
        <Badge className={cn("text-xs font-bold", colors.badge)}>
          {orders.length}
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto rounded-b-xl border border-t-0 border-neutral-200 bg-neutral-50/50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/30">
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                onStatusChange={onStatusChange}
              />
            ))}
          </AnimatePresence>

          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Sipariş yok
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
