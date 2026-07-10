"use client"

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
import { cn } from "@/lib/utils"

const salesData = [
  { day: "Pzt", sales: 12400 },
  { day: "Sal", sales: 15200 },
  { day: "Çar", sales: 13800 },
  { day: "Per", sales: 16500 },
  { day: "Cum", sales: 21300 },
  { day: "Cmt", sales: 24800 },
  { day: "Paz", sales: 19200 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-2xl border border-white/20 bg-black/60 p-4 shadow-xl backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tracking-tight text-white">
        {new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
        }).format(payload[0].value)}
      </p>
    </div>
  )
}

export function SalesChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/50 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/50">
        <div className="border-b border-neutral-200/60 p-6 dark:border-neutral-800/60">
          <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
            Haftalık Satış Grafiği
          </h3>
        </div>
        <div className="flex-1 p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#3f3f46"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#71717a", fontWeight: 600 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#71717a", fontWeight: 600 }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  dx={-15}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  fill="url(#salesGradient)"
                  dot={false}
                  activeDot={{
                    r: 8,
                    strokeWidth: 0,
                    fill: "#8b5cf6",
                    style: { filter: "drop-shadow(0px 0px 8px rgba(139, 92, 246, 0.6))" }
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

