"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Star,
  Cake,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  totalVisits: number
  totalSpent: number
  loyaltyPoints: number
  birthDate: string
  favoriteProducts: string[]
  recentOrders: { id: string; date: string; amount: number }[]
}

interface CustomerDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
}

const loyaltyHistory = [
  { date: "2026-07-10", action: "Sipariş puanı eklendi", points: 27 },
  { date: "2026-07-08", action: "Sipariş puanı eklendi", points: 24 },
  { date: "2026-07-05", action: "Puan kullanıldı", points: -100 },
  { date: "2026-07-01", action: "Sipariş puanı eklendi", points: 18 },
  { date: "2026-06-28", action: "Doğum günü bonusu", points: 50 },
]

export function CustomerDetailDialog({
  open,
  onOpenChange,
  customer,
}: CustomerDetailDialogProps) {
  const [birthdayDiscount, setBirthdayDiscount] = React.useState(true)

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Müşteri Detayları</DialogTitle>
          <DialogDescription>
            Müşteri bilgileri ve sipariş geçmişi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-xl font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              {customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {customer.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> {customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {customer.email}
                </span>
                <span className="flex items-center gap-1">
                  <Cake className="h-3.5 w-3.5" /> {customer.birthDate}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <ShoppingBag className="mx-auto h-5 w-5 text-blue-500" />
              <p className="mt-2 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                {customer.totalVisits}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Toplam Ziyaret
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <TrendingUp className="mx-auto h-5 w-5 text-emerald-500" />
              <p className="mt-2 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                {new Intl.NumberFormat("tr-TR", {
                  style: "currency",
                  currency: "TRY",
                }).format(customer.totalSpent)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Toplam Harcama
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <Star className="mx-auto h-5 w-5 fill-amber-400 text-amber-400" />
              <p className="mt-2 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                {customer.loyaltyPoints}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Sadakat Puanı
              </p>
            </div>
          </div>

          {/* Birthday Discount */}
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                Doğum Günü İndirimi
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Doğum gününde %20 indirim uygula
              </p>
            </div>
            <Switch
              checked={birthdayDiscount}
              onCheckedChange={setBirthdayDiscount}
            />
          </div>

          {/* Favorite Products */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Favori Ürünler
            </h4>
            <div className="flex flex-wrap gap-2">
              {customer.favoriteProducts.map((product) => (
                <Badge key={product} variant="secondary">
                  {product}
                </Badge>
              ))}
            </div>
          </div>

          {/* Loyalty History */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Puan Geçmişi
            </h4>
            <div className="space-y-2">
              {loyaltyHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 dark:border-neutral-800"
                >
                  <div>
                    <p className="text-sm text-neutral-900 dark:text-neutral-50">
                      {item.action}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.date}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      item.points > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.points > 0 ? "+" : ""}
                    {item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Son Siparişler
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sipariş No</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">Tutar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(order.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
