"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
  Calendar,
  CreditCard,
  Bell,
  X,
  CheckCheck,
  Trash2,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/useNotifications"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  new_order: { icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  order_ready: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  low_stock: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  reservation: { icon: Calendar, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  payment: { icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
}

export function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 px-4 py-3">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Bildirimler</span>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-blue-500 px-1.5 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Tümünü Okundu İşaretle
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 dark:border-zinc-600 border-t-blue-500" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mb-3" />
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Hiç bildirim yok</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Yeni bildirimler burada görünecek</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((notification) => {
                    const config = typeConfig[notification.type as keyof typeof typeConfig] || typeConfig.new_order
                    const Icon = config.icon
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "group relative flex items-start gap-3 border-b border-zinc-100 dark:border-zinc-800 px-4 py-3 transition-colors cursor-pointer",
                          notification.isRead
                            ? "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            : "bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        )}
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsRead(notification.id)
                          }
                        }}
                      >
                        {!notification.isRead && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-500" />
                        )}
                        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", config.bg)}>
                          <Icon className={cn("h-5 w-5", config.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm", notification.isRead ? "text-zinc-700 dark:text-zinc-300" : "font-semibold text-zinc-900 dark:text-zinc-100")}>
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: tr })}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="shrink-0 rounded-lg p-1 text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-zinc-200 dark:border-zinc-700 px-4 py-2">
                <button
                  type="button"
                  onClick={() => {
                    notifications.forEach((n) => deleteNotification(n.id))
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Tümünü Temizle
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
