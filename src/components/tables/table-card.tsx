"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Users, Clock, Coffee, Receipt, Lock, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Table } from "@/types"
import { TableStatus } from "@/types"

const STATUS_CONFIG = {
  EMPTY: {
    label: "Boş",
    labelColor: "text-emerald-400",
    bg: "from-neutral-950 to-neutral-900",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/10",
    dot: "bg-emerald-400",
    icon: Wifi,
    iconColor: "text-emerald-400",
    pulse: false,
  },
  ORDERED: {
    label: "Sipariş Alındı",
    labelColor: "text-amber-400",
    bg: "from-amber-950/40 to-neutral-900",
    border: "border-amber-500/40",
    glow: "shadow-amber-500/15",
    dot: "bg-amber-400",
    icon: Coffee,
    iconColor: "text-amber-400",
    pulse: true,
  },
  WAITING_BILL: {
    label: "Hesap Bekleniyor",
    labelColor: "text-red-400",
    bg: "from-red-950/40 to-neutral-900",
    border: "border-red-500/40",
    glow: "shadow-red-500/15",
    dot: "bg-red-400",
    icon: Receipt,
    iconColor: "text-red-400",
    pulse: true,
  },
  RESERVED: {
    label: "Rezerve",
    labelColor: "text-purple-400",
    bg: "from-purple-950/30 to-neutral-900",
    border: "border-purple-500/30",
    glow: "shadow-purple-500/10",
    dot: "bg-purple-400",
    icon: Lock,
    iconColor: "text-purple-400",
    pulse: false,
  },
}

interface TableCardProps {
  table: Table
  onClick?: (table: Table) => void
  selected?: boolean
}

function getOccupiedDuration(createdAt: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(createdAt).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}sa ${minutes}dk`
  return `${minutes}dk`
}

export function TableCard({ table, onClick, selected }: TableCardProps) {
  const cfg = STATUS_CONFIG[table.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.EMPTY
  const isActive = table.status === TableStatus.ORDERED || table.status === TableStatus.WAITING_BILL
  const orderCount = table.orders?.length ?? 0
  const Icon = cfg.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={() => onClick?.(table)}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-3xl border bg-gradient-to-br",
        "shadow-xl transition-shadow duration-300",
        cfg.bg,
        cfg.border,
        cfg.glow,
        selected && "ring-2 ring-white/50 ring-offset-2 ring-offset-neutral-950"
      )}
    >
      {/* Subtle glow effect at top */}
      <div className={cn("absolute -top-10 left-1/2 h-20 w-32 -translate-x-1/2 rounded-full blur-2xl opacity-20", cfg.dot)} />

      {/* Status indicator pulse dot */}
      {cfg.pulse && (
        <span className="absolute right-3 top-3 flex h-2.5 w-2.5">
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", cfg.dot)} />
          <span className={cn("relative inline-flex h-2.5 w-2.5 rounded-full", cfg.dot)} />
        </span>
      )}
      {!cfg.pulse && (
        <span className={cn("absolute right-3 top-3 h-2.5 w-2.5 rounded-full", cfg.dot)} />
      )}

      <div className="relative p-5">
        {/* Table number */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Masa</p>
            <p className="text-5xl font-black leading-none text-white">{table.number}</p>
          </div>
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl border",
            cfg.border,
            "bg-white/5 backdrop-blur-sm"
          )}>
            <Icon className={cn("h-5 w-5", cfg.iconColor)} />
          </div>
        </div>

        {/* Status label */}
        <div className={cn("mb-4 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", cfg.border, cfg.labelColor, "bg-white/5")}>
          {cfg.label}
        </div>

        {/* Details row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-400">{table.capacity} kişi</span>
          </div>
          {isActive && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-neutral-500" />
              <span className="text-xs text-neutral-400">{getOccupiedDuration(table.createdAt)}</span>
            </div>
          )}
        </div>

        {orderCount > 0 && (
          <div className="mt-3 border-t border-white/5 pt-3">
            <p className="text-xs text-neutral-500">{orderCount} aktif sipariş</p>
          </div>
        )}

        {table.location && (
          <p className="mt-1 text-[11px] text-neutral-600">{table.location}</p>
        )}
      </div>
    </motion.div>
  )
}

export { STATUS_CONFIG as statusConfig }
