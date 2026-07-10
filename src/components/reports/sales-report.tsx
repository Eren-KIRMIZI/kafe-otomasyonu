"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, ShoppingCart, Receipt, Wallet, CreditCard, Banknote, Smartphone } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from "@/components/reports/date-range-picker"
import { ExportButtons } from "@/components/reports/export-buttons"
import { formatCurrency } from "@/lib/utils"

const dailySales = [
  { date: "2024-01-08", sales: 12400, orders: 42 },
  { date: "2024-01-09", sales: 15200, orders: 48 },
  { date: "2024-01-10", sales: 13800, orders: 45 },
  { date: "2024-01-11", sales: 16500, orders: 52 },
  { date: "2024-01-12", sales: 21300, orders: 68 },
  { date: "2024-01-13", sales: 24800, orders: 75 },
  { date: "2024-01-14", sales: 19200, orders: 58 },
]

const hourlyData = [
  { hour: "08:00", sales: 1200 },
  { hour: "09:00", sales: 3400 },
  { hour: "10:00", sales: 5200 },
  { hour: "11:00", sales: 6800 },
  { hour: "12:00", sales: 9200 },
  { hour: "13:00", sales: 11200 },
  { hour: "14:00", sales: 8400 },
  { hour: "15:00", sales: 5600 },
  { hour: "16:00", sales: 7100 },
  { hour: "17:00", sales: 9800 },
  { hour: "18:00", sales: 13400 },
  { hour: "19:00", sales: 15600 },
  { hour: "20:00", sales: 14200 },
  { hour: "21:00", sales: 8900 },
  { hour: "22:00", sales: 4500 },
]

const paymentData = [
  { name: "Kredi Kartı", value: 45, color: "#6366f1" },
  { name: "Nakit", value: 30, color: "#10b981" },
  { name: "Debit Kart", value: 15, color: "#f59e0b" },
  { name: "Mobil Ödeme", value: 10, color: "#ef4444" },
]

const dailyBreakdown = [
  { date: "14 Oca 2024", sales: 19200, orders: 58, avg: 331, cash: 5760, card: 10560, mobile: 2880 },
  { date: "13 Oca 2024", sales: 24800, orders: 75, avg: 330.67, cash: 7440, card: 13640, mobile: 3720 },
  { date: "12 Oca 2024", sales: 21300, orders: 68, avg: 313.24, cash: 6390, card: 11715, mobile: 3195 },
  { date: "11 Oca 2024", sales: 16500, orders: 52, avg: 317.31, cash: 4950, card: 9075, mobile: 2475 },
  { date: "10 Oca 2024", sales: 13800, orders: 45, avg: 306.67, cash: 4140, card: 7590, mobile: 2070 },
  { date: "09 Oca 2024", sales: 15200, orders: 48, avg: 316.67, cash: 4560, card: 8360, mobile: 2280 },
  { date: "08 Oca 2024", sales: 12400, orders: 42, avg: 295.24, cash: 3720, card: 6820, mobile: 1860 },
]

const summaryCards = [
  {
    title: "Toplam Satış",
    value: formatCurrency(123200),
    change: 14.5,
    icon: TrendingUp,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    title: "Ortalama Sipariş",
    value: formatCurrency(316.5),
    change: 3.2,
    icon: Receipt,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    title: "Sipariş Sayısı",
    value: "388",
    change: 8.7,
    icon: ShoppingCart,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    title: "Nakit & Kart Oranı",
    value: "%60 / %40",
    change: 0,
    icon: Wallet,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  },
]

function SalesTooltip({ active, payload, label }: any) {
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

function HourlyTooltip({ active, payload, label }: any) {
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

export function SalesReport() {
  const [period, setPeriod] = useState("today")

  const totalSales = useMemo(() => dailySales.reduce((sum, d) => sum + d.sales, 0), [])
  const totalOrders = useMemo(() => dailySales.reduce((sum, d) => sum + d.orders, 0), [])
  const avgOrder = useMemo(() => totalSales / totalOrders, [totalSales, totalOrders])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DateRangePicker onChange={({ preset }) => setPeriod(preset)} />
        <ExportButtons
          onExportPDF={() => alert("PDF export triggered")}
          onExportExcel={() => alert("Excel export triggered")}
          onPrint={() => window.print()}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    {card.value}
                  </p>
                  {card.change !== 0 && (
                    <div className="flex items-center gap-1">
                      <span className={`text-xs font-semibold ${card.change > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                        {card.change > 0 ? "+" : ""}{card.change}%
                      </span>
                      <span className="text-xs text-neutral-400">döneme göre</span>
                    </div>
                  )}
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Zamana Göre Satış</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySales} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dy={10} tickFormatter={(v) => v.slice(5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} dx={-10} />
                  <Tooltip content={<SalesTooltip />} />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2.5} fill="url(#salesG)" dot={false} activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff", fill: "#6366f1" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saate Göre Satış (En Yoğun Saatler)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} dx={-10} />
                  <Tooltip content={<HourlyTooltip />} />
                  <Bar dataKey="sales" radius={[6, 6, 0, 0]} maxBarSize={36}>
                    {hourlyData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.sales >= 10000 ? "#6366f1" : "#a5b4fc"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Ödeme Yöntemleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {paymentData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => (
                      <span className="text-xs text-neutral-600 dark:text-neutral-400">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Günlük Döküm</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">Satış</TableHead>
                  <TableHead className="text-right">Sipariş</TableHead>
                  <TableHead className="text-right">Ortalama</TableHead>
                  <TableHead className="text-right">Nakit</TableHead>
                  <TableHead className="text-right">Kart</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyBreakdown.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell className="font-medium">{row.date}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.sales)}</TableCell>
                    <TableCell className="text-right">{row.orders}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.avg)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.cash)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.card)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
