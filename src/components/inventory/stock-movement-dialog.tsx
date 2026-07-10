"use client"

import * as React from "react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Trash2,
  Settings2,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { InventoryMovementType } from "@/types"

interface StockMovementDialogProps {
  itemId: string
  itemName: string
  currentStock: number
  unit: string
  onConfirm: (type: InventoryMovementType, quantity: number, reason?: string) => void
  trigger?: React.ReactNode
}

const movementTypes = [
  {
    type: InventoryMovementType.PURCHASE as const,
    label: "Giriş",
    description: "Stoka malzeme girişi",
    icon: ArrowDownToLine,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    activeBg: "bg-emerald-600 dark:bg-emerald-600",
    ring: "ring-emerald-500",
  },
  {
    type: InventoryMovementType.USAGE as const,
    label: "Çıkış",
    description: "Stoktan kullanım",
    icon: ArrowUpFromLine,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    activeBg: "bg-red-600 dark:bg-red-600",
    ring: "ring-red-500",
  },
  {
    type: InventoryMovementType.WASTE as const,
    label: "Fire",
    description: "Bozulma / israf",
    icon: Trash2,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    activeBg: "bg-amber-600 dark:bg-amber-600",
    ring: "ring-amber-500",
  },
  {
    type: InventoryMovementType.ADJUSTMENT as const,
    label: "Ayarlama",
    description: "Stok düzeltme",
    icon: Settings2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    activeBg: "bg-blue-600 dark:bg-blue-600",
    ring: "ring-blue-500",
  },
]

export function StockMovementDialog({
  itemName,
  currentStock,
  unit,
  onConfirm,
  trigger,
}: StockMovementDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState<InventoryMovementType>(
    InventoryMovementType.PURCHASE
  )
  const [quantity, setQuantity] = React.useState("")
  const [reason, setReason] = React.useState("")
  const [error, setError] = React.useState("")

  const selectedType = movementTypes.find((m) => m.type === type)!

  const handleSubmit = () => {
    const qty = parseFloat(quantity)
    if (!qty || qty <= 0) {
      setError("Geçerli bir miktar girin.")
      return
    }
    if (
      (type === InventoryMovementType.USAGE || type === InventoryMovementType.WASTE) &&
      qty > currentStock
    ) {
      setError(`Mevcut stoktan fazla (${currentStock} ${unit})`)
      return
    }
    setError("")
    onConfirm(type, qty, reason || undefined)
    setOpen(false)
    setQuantity("")
    setReason("")
    setType(InventoryMovementType.PURCHASE)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 cursor-pointer">
          <Package className="h-4 w-4" />
          Stok Hareketi
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stok Hareketi</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-neutral-900 dark:text-neutral-50">
              {itemName}
            </span>{" "}
            için stok hareketi girin. Mevcut stok:{" "}
            <span className="font-semibold">
              {currentStock} {unit}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Hareket Türü
            </label>
            <div className="grid grid-cols-2 gap-2">
              {movementTypes.map((mt) => {
                const Icon = mt.icon
                const isSelected = type === mt.type
                return (
                  <button
                    key={mt.type}
                    type="button"
                    onClick={() => setType(mt.type)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 cursor-pointer",
                      isSelected
                        ? cn("border-current shadow-sm", mt.color, "bg-white dark:bg-neutral-950")
                        : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        isSelected ? mt.bg : "bg-neutral-100 dark:bg-neutral-800"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isSelected ? mt.color : "text-neutral-500"
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          isSelected
                            ? mt.color
                            : "text-neutral-900 dark:text-neutral-50"
                        )}
                      >
                        {mt.label}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {mt.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <Input
            label={`Miktar (${unit})`}
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value)
              setError("")
            }}
            error={error}
            min={0}
            step={0.1}
          />

          {quantity && parseFloat(quantity) > 0 && (
            <div
              className={cn(
                "rounded-xl border p-3",
                type === InventoryMovementType.PURCHASE
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                  : type === InventoryMovementType.USAGE
                  ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                  : type === InventoryMovementType.WASTE
                  ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
                  : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
              )}
            >
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {type === InventoryMovementType.PURCHASE ? (
                  <>
                    Yeni stok:{" "}
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {currentStock + parseFloat(quantity)} {unit}
                    </span>
                  </>
                ) : (
                  <>
                    Yeni stok:{" "}
                    <span
                      className={cn(
                        "font-bold",
                        currentStock - parseFloat(quantity) < 0
                          ? "text-red-600"
                          : "text-neutral-900 dark:text-neutral-50"
                      )}
                    >
                      {Math.max(currentStock - parseFloat(quantity), 0)} {unit}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          <Textarea
            label="Neden / Not"
            placeholder="İsteğe bağlı açıklama..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit}>
            <selectedType.icon className="h-4 w-4" />
            Onayla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
