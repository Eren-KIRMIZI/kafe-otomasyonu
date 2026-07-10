"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Clock,
  Star,
  ShoppingCart,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

interface StaffPerformance {
  id: string
  name: string
  role: string
  totalOrders: number
  avgTime: string
  rating: number
  tips: number
}

const mockPerformance: StaffPerformance[] = [
  { id: "1", name: "Ahmet Yılmaz", role: "Yönetici", totalOrders: 0, avgTime: "-", rating: 4.8, tips: 0 },
  { id: "2", name: "Elif Demir", role: "Kasiyer", totalOrders: 142, avgTime: "2.3 dk", rating: 4.6, tips: 2450 },
  { id: "3", name: "Murat Kaya", role: "Garson", totalOrders: 256, avgTime: "3.1 dk", rating: 4.9, tips: 5800 },
  { id: "4", name: "Zeynep Çelik", role: "Mutfak", totalOrders: 198, avgTime: "8.5 dk", rating: 4.7, tips: 0 },
]

const summaryStats = [
  {
    title: "Toplam Sipariş",
    value: "796",
    icon: ShoppingCart,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Ortalama Süre",
    value: "4.2 dk",
    icon: Clock,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    title: "Müşteri Puanı",
    value: "4.75",
    icon: Star,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
]

export function PerformanceReport() {
  const [period, setPeriod] = React.useState("monthly")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Personel Performansı</CardTitle>
            <Tabs value={period} onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="weekly">Haftalık</TabsTrigger>
                <TabsTrigger value="monthly">Aylık</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personel</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Toplam Sipariş</TableHead>
                <TableHead>Ort. Süre</TableHead>
                <TableHead>Puan</TableHead>
                <TableHead>Bahşiş</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPerformance.map((staff, index) => (
                <motion.tr
                  key={staff.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {staff.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">
                        {staff.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 dark:text-neutral-400">
                    {staff.role}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {staff.totalOrders}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 dark:text-neutral-400">
                    {staff.avgTime}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                        {staff.rating}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {staff.tips > 0
                      ? new Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        }).format(staff.tips)
                      : "-"}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
