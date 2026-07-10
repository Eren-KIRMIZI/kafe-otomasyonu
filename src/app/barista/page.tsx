"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Coffee, RefreshCw } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { BaristaOrderCard } from "@/components/barista/barista-order-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OrderStatus, OrderType, TableStatus } from "@/types"
import type { Order } from "@/types"
import { cn } from "@/lib/utils"

const BARISTA_COLUMNS: { status: string; title: string; color: "blue" | "orange" | "green" }[] = [
  { status: "pending", title: "Yeni Siparişler", color: "blue" },
  { status: "preparing", title: "Hazırlanıyor", color: "orange" },
  { status: "ready", title: "Hazır", color: "green" },
]

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
}

export default function BaristaPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?take=100")
      if (res.ok) {
        const { data } = await res.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Siparişler yüklenirken hata:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const handleStatusChange = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date() } : o))
      )
    },
    []
  )

  const getOrdersForColumn = (columnStatus: string) => {
    if (columnStatus === "pending") {
      return orders.filter((o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.CONFIRMED)
    }
    if (columnStatus === "preparing") {
      return orders.filter((o) => o.status === OrderStatus.PREPARING)
    }
    if (columnStatus === "ready") {
      return orders.filter((o) => o.status === OrderStatus.READY)
    }
    return []
  }

  return (
    <AppLayout>
      <div className="flex h-screen flex-col">
        <header className="border-b border-neutral-100 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Barista Paneli
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  İçecek siparişleri · {orders.length} sipariş
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Coffee className="mr-1 h-3 w-3" />
                Sadece İçecekler
              </Badge>
              <Button variant="outline" size="sm" className="rounded-xl">
                <RefreshCw className="h-4 w-4" />
                Yenile
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 gap-4 overflow-x-auto p-4">
          {BARISTA_COLUMNS.map((col) => {
            const columnOrders = getOrdersForColumn(col.status)
            const colors = COLOR_MAP[col.color]

            return (
              <div key={col.status} className="flex flex-1 flex-col min-w-[320px]">
                <div className={cn("flex items-center justify-between rounded-t-xl px-4 py-3", colors.header)}>
                  <div className="flex items-center gap-2.5">
                    <div className={cn("h-2.5 w-2.5 rounded-full", colors.dot)} />
                    <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {col.title}
                    </h3>
                  </div>
                  <Badge className={cn("text-xs font-bold", colors.badge)}>
                    {columnOrders.length}
                  </Badge>
                </div>

                <div className="flex-1 overflow-y-auto rounded-b-xl border border-t-0 border-neutral-200 bg-neutral-50/50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/30">
                  <div className="space-y-2.5">
                    <AnimatePresence mode="popLayout">
                      {columnOrders.map((order) => (
                        <BaristaOrderCard
                          key={order.id}
                          order={order}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </AnimatePresence>

                    {columnOrders.length === 0 && (
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
          })}
        </div>
      </div>
    </AppLayout>
  )
}
