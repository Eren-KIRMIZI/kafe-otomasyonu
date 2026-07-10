"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  color: "green" | "blue" | "purple" | "orange"
}

const colorMap = {
  green: {
    bg: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    iconGlow: "shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    changePositive: "text-emerald-400",
    changeNegative: "text-red-400",
  },
  blue: {
    bg: "from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20",
    iconBg: "bg-blue-500/20 text-blue-400",
    iconGlow: "shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    changePositive: "text-emerald-400",
    changeNegative: "text-red-400",
  },
  purple: {
    bg: "from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20",
    iconBg: "bg-purple-500/20 text-purple-400",
    iconGlow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
    changePositive: "text-emerald-400",
    changeNegative: "text-red-400",
  },
  orange: {
    bg: "from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/20",
    iconBg: "bg-orange-500/20 text-orange-400",
    iconGlow: "shadow-[0_0_20px_rgba(249,115,22,0.3)]",
    changePositive: "text-emerald-400",
    changeNegative: "text-red-400",
  },
}

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  const colors = colorMap[color]
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 backdrop-blur-xl transition-all duration-300",
          "dark:bg-neutral-950/50",
          colors.bg
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              {title}
            </p>
            <p className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
              {value}
            </p>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold",
                  isPositive ? "bg-emerald-500/10" : "bg-red-500/10",
                  isPositive ? colors.changePositive : colors.changeNegative
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {change}%
                </span>
              </div>
              <span className="text-xs font-medium text-neutral-500">dünden beri</span>
            </div>
          </div>
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all",
              colors.iconBg,
              colors.iconGlow
            )}
          >
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

