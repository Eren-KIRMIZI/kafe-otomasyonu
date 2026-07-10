"use client"

import { motion } from "framer-motion"
import {
  Banknote,
  CreditCard,
  QrCode,
  Ticket,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/types"

const METHOD_CONFIG: Record<
  PaymentMethod,
  { icon: LucideIcon; label: string; color: string }
> = {
  CASH: {
    icon: Banknote,
    label: "Nakit",
    color:
      "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  },
  CREDIT_CARD: {
    icon: CreditCard,
    label: "Kredi Kartı",
    color:
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
  },
  DEBIT_CARD: {
    icon: Ticket,
    label: "Yemek Kartı",
    color:
      "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
  },
  MOBILE_PAYMENT: {
    icon: QrCode,
    label: "QR Ödeme",
    color:
      "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
  },
}

interface PaymentMethodButtonProps {
  method: PaymentMethod
  selected?: boolean
  onClick: () => void
  disabled?: boolean
}

export function PaymentMethodButton({
  method,
  selected = false,
  onClick,
  disabled = false,
}: PaymentMethodButtonProps) {
  const config = METHOD_CONFIG[method]
  const Icon = config.icon

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20",
        selected
          ? cn(config.color, "ring-2 ring-offset-2 ring-neutral-900 dark:ring-white")
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200",
          selected ? "bg-white/90 dark:bg-black/20" : "bg-neutral-100 dark:bg-neutral-800"
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-sm font-semibold">{config.label}</span>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white text-xs dark:bg-white dark:text-neutral-900"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  )
}
