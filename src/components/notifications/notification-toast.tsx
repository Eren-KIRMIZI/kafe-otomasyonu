"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createPortal } from "react-dom"
import { X, ShoppingCart, CheckCircle, AlertTriangle, Calendar, CreditCard, Info } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types"

const typeConfig = {
  new_order: { icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/50", border: "border-blue-200 dark:border-blue-800", path: "/orders" },
  order_ready: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/50", border: "border-green-200 dark:border-green-800", path: "/orders" },
  low_stock: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50", border: "border-amber-200 dark:border-amber-800", path: "/inventory" },
  reservation: { icon: Calendar, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/50", border: "border-purple-200 dark:border-purple-800", path: "/reservations" },
  payment: { icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/50", border: "border-emerald-200 dark:border-emerald-800", path: "/cashier" },
}

interface ToastNotification {
  id: string
  notification: Notification
  config: typeof typeConfig[keyof typeof typeConfig]
}

export function NotificationToast() {
  const router = useRouter()
  const { on, off } = useSocket()
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
    audioRef.current = new Audio("/notification.mp3")
  }, [])

  useEffect(() => {
    const handleNotification = (...args: unknown[]) => {
      const notification = args[0] as Notification
      const config = typeConfig[notification.type as keyof typeof typeConfig] || { icon: Info, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/50", border: "border-blue-200 dark:border-blue-800", path: "/" }

      const id = Math.random().toString(36).slice(2, 9)
      setToasts((prev) => [...prev, { id, notification, config }])

      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
      }

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    }

    on("notification", handleNotification)

    return () => {
      off("notification", handleNotification)
    }
  }, [on, off])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (!mounted) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map(({ id, notification, config }) => {
          const Icon = config.icon
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={() => {
                removeToast(id)
                router.push(config.path)
              }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm cursor-pointer",
                config.bg,
                config.border
              )}
            >
              <div className="mt-0.5 shrink-0">
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{notification.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{notification.message}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeToast(id)
                }}
                className="shrink-0 rounded-lg p-0.5 opacity-60 transition-opacity hover:opacity-100 cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body
  )
}

