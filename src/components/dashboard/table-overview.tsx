"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { UtensilsCrossed, Users, Clock, BookmarkCheck } from "lucide-react"

const tableStats = [
  {
    label: "Aktif Masa",
    count: 8,
    icon: UtensilsCrossed,
    bg: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    iconGlow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  },
  {
    label: "Boş Masa",
    count: 6,
    icon: Users,
    bg: "from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20",
    iconBg: "bg-blue-500/20 text-blue-400",
    iconGlow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
  },
  {
    label: "Hesap Bekliyor",
    count: 3,
    icon: Clock,
    bg: "from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20",
    iconBg: "bg-amber-500/20 text-amber-400",
    iconGlow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
  },
  {
    label: "Rezerve",
    count: 2,
    icon: BookmarkCheck,
    bg: "from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20",
    iconBg: "bg-purple-500/20 text-purple-400",
    iconGlow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  },
]

export function TableOverview() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/50 p-6 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/50">
        <h3 className="mb-6 text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
          Masa Durumu
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {tableStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.08 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <div
                className={cn(
                  "cursor-pointer rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-lg",
                  stat.bg
                )}
                onClick={() => router.push("/tables")}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl font-black text-neutral-900 dark:text-white">
                      {stat.count}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      {stat.label}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all",
                      stat.iconBg,
                      stat.iconGlow
                    )}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

