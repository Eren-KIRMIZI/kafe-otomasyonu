"use client"

import * as React from "react"
import {
  Package,
  Minus,
  Plus,
  AlertTriangle,
  Edit,
  Trash2,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StockMovementDialog } from "@/components/inventory/stock-movement-dialog"

interface InventoryCardProps {
  item: {
    id: string
    name: string
    unit: string
    currentStock: number
    minStock: number
    maxStock: number
    unitCost: number
    supplier: string
    supplierPhone: string
    expiryDate: string
    category?: string
  }
  onEdit: () => void
  onDelete: () => void
  onStockMove: (type: "in" | "out", quantity: number) => void
}

function getStockStatus(item: InventoryCardProps["item"]) {
  const ratio = item.currentStock / item.minStock
  if (ratio <= 0.5) return "critical"
  if (ratio <= 1) return "low"
  return "sufficient"
}

const statusConfig = {
  sufficient: {
    label: "Yeterli",
    variant: "success" as const,
    barColor: "bg-emerald-500",
    trackColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  low: {
    label: "Düşük",
    variant: "warning" as const,
    barColor: "bg-amber-500",
    trackColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  critical: {
    label: "Kritik",
    variant: "destructive" as const,
    barColor: "bg-red-500",
    trackColor: "bg-red-100 dark:bg-red-900/30",
  },
}

export function InventoryCard({ item, onEdit, onDelete, onStockMove }: InventoryCardProps) {
  const status = getStockStatus(item)
  const config = statusConfig[status]
  const stockPercentage = Math.min((item.currentStock / item.maxStock) * 100, 100)
  const isExpiringSoon =
    new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                status === "sufficient"
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : status === "low"
                  ? "bg-amber-100 dark:bg-amber-900/30"
                  : "bg-red-100 dark:bg-red-900/30"
              )}
            >
              <Package
                className={cn(
                  "h-5 w-5",
                  status === "sufficient"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : status === "low"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
                )}
              />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">
                {item.name}
              </h3>
              {item.category && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {item.category}
                </p>
              )}
            </div>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">
              {item.currentStock}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {item.unit}
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className={cn(
                "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
                config.barColor
              )}
              style={{ width: `${stockPercentage}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
            <span>Min: {item.minStock}</span>
            <span>Max: {item.maxStock}</span>
          </div>
        </div>

        <div className="space-y-2 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Birim Maliyet</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-50">
              ₺{item.unitCost.toLocaleString("tr-TR")}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500 dark:text-neutral-400">Tedarikçi</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-50">
              {item.supplier}
            </span>
          </div>
          {item.supplierPhone && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">Telefon</span>
              <a
                href={`tel:${item.supplierPhone}`}
                className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Phone className="h-3 w-3" />
                {item.supplierPhone}
              </a>
            </div>
          )}
        </div>

        {isExpiringSoon && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Son kullanma:{" "}
              {new Date(item.expiryDate).toLocaleDateString("tr-TR")}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <StockMovementDialog
          itemId={item.id}
          itemName={item.name}
          currentStock={item.currentStock}
          unit={item.unit}
          onConfirm={(type, qty) =>
            onStockMove(type === "PURCHASE" ? "in" : "out", qty)
          }
          trigger={
            <Button variant="outline" size="sm" className="flex-1">
              <Package className="h-3.5 w-3.5" />
              Giriş / Çıkış
            </Button>
          }
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={onEdit}
        >
          <Edit className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
