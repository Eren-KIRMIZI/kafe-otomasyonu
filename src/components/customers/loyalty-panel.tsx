"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, Gift, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const tierConfig = [
  {
    name: "Bronz",
    minPoints: 0,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: Award,
    multiplier: "1x",
    benefits: "Temel puan kazanımı",
  },
  {
    name: "Gümüş",
    minPoints: 500,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: Star,
    multiplier: "1.5x",
    benefits: "Özel indirimler, erken erişim",
  },
  {
    name: "Altın",
    minPoints: 1500,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Gift,
    multiplier: "2x",
    benefits: "Ücretsiz ürün, VIP hizmet",
  },
  {
    name: "Platin",
    minPoints: 5000,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: TrendingUp,
    multiplier: "3x",
    benefits: "Tüm avantajlar + özel etkinlikler",
  },
]

const pointsHistory = [
  { customer: "Fatma Yıldız", action: "Sipariş puanı", points: 275, date: "2026-07-10" },
  { customer: "Ali Çelik", action: "Sipariş puanı", points: 190, date: "2026-07-10" },
  { customer: "Ayşe Korkmaz", action: "Puan harcandı", points: -500, date: "2026-07-09" },
  { customer: "Mehmet Aydın", action: "Sipariş puanı", points: 320, date: "2026-07-09" },
  { customer: "Fatma Yıldız", action: "Doğum günü bonusu", points: 50, date: "2026-07-08" },
  { customer: "Ayşe Korkmaz", action: "Sipariş puanı", points: 245, date: "2026-07-08" },
]

export function LoyaltyPanel() {
  return (
    <div className="space-y-6">
      {/* Tier Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tierConfig.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tier.color}`}
                  >
                    <tier.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-50">
                      {tier.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {tier.minPoints}+ puan
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Çarpan
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-50">
                      {tier.multiplier}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {tier.benefits}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Points Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Puan Yapılandırması</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                TL Başına Puan
              </p>
              <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                1 puan
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Her ₺1 harcamada 1 puan
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Puan Değeri
              </p>
              <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                ₺0.10
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Her puan ₺0.10 değerinde
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Doğum Günü Bonusu
              </p>
              <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                50 puan
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                Doğum gününde ekstra puan
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points History */}
      <Card>
        <CardHeader>
          <CardTitle>Son Puan Hareketleri</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>İşlem</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">Puan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pointsHistory.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                >
                  <TableCell className="font-medium text-neutral-900 dark:text-neutral-50">
                    {item.customer}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.action}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500 dark:text-neutral-400">
                    {item.date}
                  </TableCell>
                  <TableCell className="text-right">
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
