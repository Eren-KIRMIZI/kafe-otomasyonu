"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/useNotifications"
import { NotificationPanel } from "./notification-panel"

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { unreadCount } = useNotifications()
  const [prevCount, setPrevCount] = useState(unreadCount)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (unreadCount > prevCount) {
      setAnimate(true)
      const timer = setTimeout(() => setAnimate(false), 600)
      return () => clearTimeout(timer)
    }
    setPrevCount(unreadCount)
  }, [unreadCount, prevCount])

  const displayCount = unreadCount > 99 ? "99+" : unreadCount

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer",
          open
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        )}
      >
        <AnimatePresence>
          {animate && (
            <motion.span
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.3, 1] }}
              exit={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-xl bg-blue-400/20 dark:bg-blue-500/20"
            />
          )}
        </AnimatePresence>
        <Bell className="h-5 w-5 relative z-10" />
        {unreadCount > 0 && (
          <motion.span
            key={displayCount}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white shadow-sm z-10"
          >
            {displayCount}
          </motion.span>
        )}
      </button>
      <NotificationPanel open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
