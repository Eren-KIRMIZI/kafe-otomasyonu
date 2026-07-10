"use client"

import { motion } from "framer-motion"
import {
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

const topByQuantity = [
  { name: "Türk Kahvesi", quantity: 245 },
  { name: "Espresso", quantity: 212 },
  { name: "Cappuccino", quantity: 198 },
  { name: "Latte", quantity: 176 },
  { name: "Patates Kızartması", quantity: 165 },
  { name: "Kruvasan", quantity: 142 },
  { name: "Cheesecake", quantity: 138 },
  { name: "Klasik Burger", quantity: 124 },
  { name: "Ice Latte", quantity: 118 },
  { name: "Brownie", quantity: 105 },
]

const topByRevenue = [
  { name: "Klasik Burger", revenue: 27280 },
  { name: "Cappuccino", revenue: 18810 },
  { name: "Latte", revenue: 17600 },
  { name: "Serbest Kahvaltı", revenue: 17500 },
  { name: "Cheesecake", revenue: 16330 },
  { name: "Türk Kahvesi", revenue: 13475 },
  { name: "Ice Latte", revenue: 12980 },
  { name: "Tiramisu", revenue: 12880 },
  { name: "Margherita Pizza", revenue: 12400 },
  { name: "Mocha", revenue: 11800 },
]

const categoryData = [
  { name: "Kahveler", value: 38, color: "#6366f1" },
  { name: "Soğuk İçecekler", value: 18, color: "#06b6d4" },
  { name: "Tatlılar", value: 15, color: "#f59e0b" },
  { name: "Pastalar", value: 8, color: "#10b981" },
  { name: "Kahvaltı", value: 7, color: "#ef4444" },
  { name: "Hamburger", value: 6, color: "#8b5cf6" },
  { name: "Pizza", value: 5, color: "#ec4899" },
  { name: "Atıştırmalıklar", value: 3, color: "#14b8a6" },
]

const productPerformance = [
  { name: "Türk Kahvesi", quantity: 245, revenue: 13475, avg: 55, rating: 4.8 },
  { name: "Espresso", quantity: 212, revenue: 12720, avg: 60, rating: 4.6 },
  { name: "Cappuccino", quantity: 198, revenue: 18810, avg: 95, rating: 4.7 },
  { name: "Latte", quantity: 176, revenue: 17600, avg: 100, rating: 4.5 },
  { name: "Patates Kızartması", quantity: 165, revenue: 13200, avg: 80, rating: 4.3 },
  { name: "Kruvasan", quantity: 142, revenue: 9940, avg: 70, rating: 4.4 },
  { name: "Cheesecake", quantity: 138, revenue: 18630, avg: 135, rating: 4.9 },
  { name: "Klasik Burger", quantity: 124, revenue: 27280, avg: 220, rating: 4.6 },
  { name: "Ice Latte", quantity: 118, revenue: 12980, avg: 110, rating: 4.2 },
  { name: "Brownie", quantity: 105, revenue: 9975, avg: 95, rating: 4.5 },
]

function QuantityTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-50">
        {payload[0].value} adet
      </p>
    </div>
  )
}

function RevenueTooltip({ active, payload, label }: any) {
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

export function ProductAnalysis() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">En Çok Satan Ürünler (Adet)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topByQuantity}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} width={85} />
                    <Tooltip content={<QuantityTooltip />} />
                    <Bar dataKey="quantity" radius={[0, 6, 6, 0]} maxBarSize={20} fill="#6366f1" />
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
              <CardTitle className="text-base">En Çok Gelir Getiren Ürünler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topByRevenue}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} width={85} />
                    <Tooltip content={<RevenueTooltip />} />
                    <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={20} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kategori Dağılımı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categoryData.map((entry, idx) => (
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ürün Performans Tablosu</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün Adı</TableHead>
                    <TableHead className="text-right">Adet</TableHead>
                    <TableHead className="text-right">Gelir</TableHead>
                    <TableHead className="text-right">Birim Fiyat</TableHead>
                    <TableHead className="text-right">Puan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(product.revenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.avg)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.rating >= 4.5 ? "success" : "secondary"}>
                          {product.rating.toFixed(1)}
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
    </div>
  )
}
