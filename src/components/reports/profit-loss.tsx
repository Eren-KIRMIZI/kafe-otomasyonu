"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, UtensilsCrossed, Coffee, Package, Wrench, Zap, Percent } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn, formatCurrency } from "@/lib/utils"
import { DateRangePicker } from "@/components/reports/date-range-picker"

const trendData = [
  { month: "Ağu", revenue: 142000, cost: 85200, profit: 56800 },
  { month: "Eyl", revenue: 156000, cost: 93600, profit: 62400 },
  { month: "Eki", revenue: 138000, cost: 82800, profit: 55200 },
  { month: "Kas", revenue: 165000, cost: 99000, profit: 66000 },
  { month: "Ara", revenue: 189000, cost: 113400, profit: 75600 },
  { month: "Oca", revenue: 173000, cost: 103800, profit: 69200 },
]

const revenueCards = [
  { title: "Toplam Gelir", value: formatCurrency(173000), icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
  { title: "Yiyecek Geliri", value: formatCurrency(98500), icon: UtensilsCrossed, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { title: "İçecek Geliri", value: formatCurrency(74500), icon: Coffee, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
]

const expenseCards = [
  { title: "Malzeme", value: formatCurrency(48500), icon: Package, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
  { title: "İşçilik", value: formatCurrency(37500), icon: Wrench, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/30" },
  { title: "Giderler", value: formatCurrency(17800), icon: Zap, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
]

function ProfitTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} className="mt-1 text-sm font-bold" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function ProfitLoss() {
  const [period, setPeriod] = useState("this-month")

  const totalRevenue = 173000
  const totalExpenses = 48500 + 37500 + 17800
  const netProfit = totalRevenue - totalExpenses
  const margin = (netProfit / totalRevenue) * 100

  return (
    <div className="space-y-6">
      <DateRangePicker onChange={({ preset }) => setPeriod(preset)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {revenueCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{card.title}</p>
                  <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{card.value}</p>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.bg)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {expenseCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + idx * 0.08 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{card.title}</p>
                  <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{card.value}</p>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", card.bg)}>
                  <card.icon className={cn("h-5 w-5", card.color)} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Net Kâr</p>
                <p className={cn("text-3xl font-bold tracking-tight", netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500")}>
                  {formatCurrency(netProfit)}
                </p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", netProfit >= 0 ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30")}>
                {netProfit >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-500" />
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Kâr Marjı</p>
                <p className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  %{margin.toFixed(1)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                <Percent className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Toplam Gider</p>
                <p className="text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30">
                <TrendingDown className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kâr/Zarar Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="costG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="profitG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} dx={-10} />
                  <Tooltip content={<ProfitTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revG)" dot={false} name="Gelir" />
                  <Area type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2.5} fill="url(#costG)" dot={false} name="Gider" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} fill="url(#profitG)" dot={false} name="Kâr" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
