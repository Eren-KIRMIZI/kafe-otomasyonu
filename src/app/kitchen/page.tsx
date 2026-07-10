"use client"

import * as React from "react"
import { useState, useCallback } from "react"
import { UtensilsCrossed, RefreshCw } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { KanbanColumn } from "@/components/kitchen/kanban-column"
import { Button } from "@/components/ui/button"
import { OrderStatus, OrderType, TableStatus } from "@/types"
import type { Order } from "@/types"

import { cn } from "@/lib/utils"

const FILTER_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "food", label: "Yemek" },
  { value: "drinks", label: "İçecekler" },
]

const FOOD_CATEGORY_IDS = ["cat-3", "cat-4", "cat-5", "cat-6", "cat-7", "cat-8"]

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState("all")
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

  // Auto refresh every 30 seconds
  React.useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const playNotificationSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      oscillator.frequency.value = 800
      oscillator.type = "sine"
      gainNode.gain.value = 0.1
      oscillator.start()
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch {}
  }, [])

  const handleStatusChange = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date() } : o))
      )
      playNotificationSound()
    },
    [playNotificationSound]
  )

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true
    if (filter === "food") {
      return order.items?.some((item) => {
        const catId = item.product?.categoryId
        return catId && FOOD_CATEGORY_IDS.includes(catId)
      })
    }
    if (filter === "drinks") {
      return order.items?.some((item) => {
        const catId = item.product?.categoryId
        return catId && !FOOD_CATEGORY_IDS.includes(catId)
      })
    }
    return true
  })

  const pendingOrders = filteredOrders.filter((o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.CONFIRMED)
  const preparingOrders = filteredOrders.filter((o) => o.status === OrderStatus.PREPARING)
  const readyOrders = filteredOrders.filter((o) => o.status === OrderStatus.READY)
  const servedOrders = filteredOrders.filter((o) => o.status === OrderStatus.SERVED || o.status === OrderStatus.COMPLETED)

  return (
    <AppLayout>
      <div className="flex h-screen flex-col">
        <header className="border-b border-neutral-100 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Mutfak Ekranı
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Aktif siparişler · {filteredOrders.length} sipariş
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      filter === opt.value
                        ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                        : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => playNotificationSound()}
                className="rounded-xl"
              >
                <RefreshCw className="h-4 w-4" />
                Yenile
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 gap-4 overflow-x-auto p-4">
          <KanbanColumn
            title="Yeni"
            color="blue"
            orders={pendingOrders}
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn
            title="Hazırlanıyor"
            color="orange"
            orders={preparingOrders}
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn
            title="Hazır"
            color="green"
            orders={readyOrders}
            onStatusChange={handleStatusChange}
          />
          <KanbanColumn
            title="Teslim Edildi"
            color="gray"
            orders={servedOrders}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </AppLayout>
  )
}
