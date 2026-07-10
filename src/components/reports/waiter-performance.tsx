"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from "@/components/reports/date-range-picker"
import { formatCurrency } from "@/lib/utils"

const waiters = [
  { id: "1", name: "Ahmet Yılmaz", orders: 142, revenue: 45200, avgTime: 12.5, rating: 4.8 },
  { id: "2", name: "Mehmet Demir", orders: 128, revenue: 38900, avgTime: 14.2, rating: 4.6 },
  { id: "3", name: "Ayşe Kaya", orders: 156, revenue: 52300, avgTime: 10.8, rating: 4.9 },
  { id: "4", name: "Fatma Şahin", orders: 115, revenue: 34100, avgTime: 15.7, rating: 4.3 },
  { id: "5", name: "Ali Öztürk", orders: 134, revenue: 41800, avgTime: 13.1, rating: 4.5 },
  { id: "6", name: "Zeynep Çelik", orders: 98, revenue: 28700, avgTime: 16.4, rating: 4.2 },
]

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-50">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  )
}

export function WaiterPerformance() {
  const [period, setPeriod] = useState("this-month")

  const sortedByRevenue = useMemo(() => [...waiters].sort((a, b) => b.revenue - a.revenue), [])

  return (
    <div className="space-y-6">
      <DateRangePicker onChange={({ preset }) => setPeriod(preset)} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Garson Performans Karşılaştırması</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedByRevenue}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} width={90} />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={22} fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sipariş & Hız Karşılaştırması</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedByRevenue}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} width={90} />
                    <Tooltip content={({ active, payload, label }: any) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
                          <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                            {payload[0].value} sipariş
                          </p>
                        </div>
                      )
                    }} />
                    <Bar dataKey="orders" radius={[0, 6, 6, 0]} maxBarSize={22} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Garson Performans Detayı</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Garson</TableHead>
                  <TableHead className="text-right">Toplam Sipariş</TableHead>
                  <TableHead className="text-right">Toplam Ciro</TableHead>
                  <TableHead className="text-right">Ortalama Süre</TableHead>
                  <TableHead className="text-right">Müşteri Puanı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedByRevenue.map((waiter, idx) => (
                  <TableRow key={waiter.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {waiter.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium">{waiter.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{waiter.orders}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(waiter.revenue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <span className="font-medium">{waiter.avgTime}</span>
                        <span className="text-xs text-neutral-400">dk</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={waiter.rating >= 4.5 ? "success" : "secondary"}>
                        {waiter.rating.toFixed(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
