"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

interface AddCouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (coupon: {
    code: string
    type: "percentage" | "fixed"
    value: number
    minOrder: number
    usageLimit: number
    expiryDate: string
    isActive: boolean
  }) => void
}

const discountTypeOptions = [
  { value: "percentage", label: "Yüzde (%)" },
  { value: "fixed", label: "Sabit Tutar" },
]

function generateCouponCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function AddCouponDialog({
  open,
  onOpenChange,
  onSave,
}: AddCouponDialogProps) {
  const [code, setCode] = React.useState("")
  const [type, setType] = React.useState<"percentage" | "fixed">("percentage")
  const [value, setValue] = React.useState("")
  const [minOrder, setMinOrder] = React.useState("")
  const [usageLimit, setUsageLimit] = React.useState("")
  const [expiryDate, setExpiryDate] = React.useState("")

  const handleGenerateCode = () => {
    setCode(generateCouponCode())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      code: code.toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      usageLimit: Number(usageLimit),
      expiryDate,
      isActive: true,
    })
    resetForm()
  }

  const resetForm = () => {
    setCode("")
    setType("percentage")
    setValue("")
    setMinOrder("")
    setUsageLimit("")
    setExpiryDate("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Kupon Oluştur</DialogTitle>
          <DialogDescription>
            Müşteriler için yeni bir indirim kuponu oluşturun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Kupon Kodu
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="KUPON-KODU"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 font-mono"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGenerateCode}
                title="Otomatik kod oluştur"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="İndirim Türü"
              options={discountTypeOptions}
              value={type}
              onValueChange={(v) => setType(v as "percentage" | "fixed")}
            />

            <Input
              label={type === "percentage" ? "İndirim (%)" : "İndirim (₺)"}
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <Input
            label="Minimum Sipariş Tutarı (₺)"
            type="number"
            placeholder="0"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Maksimum Kullanım"
              type="number"
              placeholder="0"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              required
            />

            <Input
              label="Son Kullanma Tarihi"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit">Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
