"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  AlertOctagon,
  Package,
  Phone,
  ShoppingCart,
  TrendingDown,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StockMovementDialog } from "@/components/inventory/stock-movement-dialog"

interface LowStockItem {
  id: string
  name: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  supplier: string
  supplierPhone: string
  category?: string
}

const mockLowStockItems: LowStockItem[] = [
  {
    id: "5",
    name: "Portakal Suyu",
    unit: "lt",
    currentStock: 2,
    minStock: 8,
    maxStock: 40,
    supplier: "Cappy",
    supplierPhone: "0212 111 7890",
    category: "İçecek",
  },
  {
    id: "10",
    name: "Zeytinyağı",
    unit: "lt",
    currentStock: 0.5,
    minStock: 3,
    maxStock: 20,
    supplier: "Köyüm",
    supplierPhone: "0232 444 2233",
    category: "Malzeme",
  },
  {
    id: "2",
    name: "Espresso Çekirdeği",
    unit: "kg",
    currentStock: 3.2,
    minStock: 5,
    maxStock: 30,
    supplier: "Lavazza Türkiye",
    supplierPhone: "0216 444 5678",
    category: "İçecek",
  },
  {
    id: "9",
    name: "Temizlik Mendili",
    unit: "paket",
    currentStock: 12,
    minStock: 15,
    maxStock: 50,
    supplier: "Hizix",
    supplierPhone: "0312 999 7788",
    category: "Sarf Malzemesi",
  },
  {
    id: "7",
    name: "Vanilya Şurubu",
    unit: "lt",
    currentStock: 1.8,
    minStock: 2,
    maxStock: 10,
    supplier: "Monin",
    supplierPhone: "0216 777 3344",
    category: "Şurup",
  },
]

function getSeverity(item: LowStockItem) {
  const ratio = item.currentStock / item.minStock
  if (ratio <= 0.3) return "critical"
  if (ratio <= 0.6) return "high"
  if (ratio <= 0.8) return "medium"
  return "low"
}

const severityConfig = {
  critical: {
    label: "Kritik",
    variant: "destructive" as const,
    icon: AlertOctagon,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    ring: "ring-red-500/20",
  },
  high: {
    label: "Yüksek",
    variant: "destructive" as const,
    icon: AlertTriangle,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50/60 dark:bg-red-900/15",
    borderColor: "border-red-200/80 dark:border-red-800/60",
    ring: "ring-red-500/15",
  },
  medium: {
    label: "Orta",
    variant: "warning" as const,
    icon: TrendingDown,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    ring: "ring-amber-500/20",
  },
  low: {
    label: "Düşük",
    variant: "warning" as const,
    icon: TrendingDown,
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-50/60 dark:bg-amber-900/15",
    borderColor: "border-amber-200/80 dark:border-amber-800/60",
    ring: "ring-amber-500/15",
  },
}

export function LowStockAlerts() {
  const [items] = React.useState<LowStockItem[]>(mockLowStockItems)

  const handleStockMove = (itemId: string, qty: number) => {
    console.log(`Restock ${itemId}: +${qty}`)
  }

  const sortedItems = [...items].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return severityOrder[getSeverity(a)] - severityOrder[getSeverity(b)]
  })

  const criticalCount = items.filter((i) => getSeverity(i) === "critical").length
  const highCount = items.filter(
    (i) => getSeverity(i) === "high" || getSeverity(i) === "medium"
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
            <Bell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              Stok Uyarıları
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {items.length} malzeme minimum stok seviyesinin altında
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-900/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertOctagon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {criticalCount}
              </p>
              <p className="text-xs font-medium text-red-500/80 dark:text-red-400/80">
                Kritik Seviye
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-900/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <TrendingDown className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {highCount}
              </p>
              <p className="text-xs font-medium text-amber-500/80 dark:text-amber-400/80">
                Düşük / Orta Seviye
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <Package className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {items.length}
              </p>
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                Toplam Uyarı
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {sortedItems.map((item, index) => {
          const severity = getSeverity(item)
          const config = severityConfig[severity]
          const Icon = config.icon
          const stockPercentage = Math.min(
            (item.currentStock / item.minStock) * 100,
            100
          )

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <Card
                className={cn(
                  "transition-shadow hover:shadow-md",
                  config.borderColor
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          config.bg
                        )}
                      >
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                          {item.name}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {item.category}
                        </p>
                        <div className="mt-2 flex items-baseline gap-1.5">
                          <span
                            className={cn(
                              "text-xl font-bold tabular-nums",
                              config.color
                            )}
                          >
                            {item.currentStock}
                          </span>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            / {item.minStock} {item.unit} minimum
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>

                  <div className="mt-4">
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className={cn(
                          "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
                          severity === "critical" || severity === "high"
                            ? "bg-red-500"
                            : "bg-amber-500"
                        )}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                      {Math.round(stockPercentage)}% doluluk
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900/50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <Package className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                        {item.supplier}
                      </p>
                      {item.supplierPhone && (
                        <a
                          href={`tel:${item.supplierPhone}`}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Phone className="h-3 w-3" />
                          {item.supplierPhone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <StockMovementDialog
                      itemId={item.id}
                      itemName={item.name}
                      currentStock={item.currentStock}
                      unit={item.unit}
                      onConfirm={(type, qty) => handleStockMove(item.id, qty)}
                      trigger={
                        <Button className="w-full" size="sm">
                          <ShoppingCart className="h-4 w-4" />
                          Sipariş Ver
                        </Button>
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
              <Package className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-neutral-50">
              Tüm stoklar yeterli
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Herhangi bir stok uyarısı bulunmuyor
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
