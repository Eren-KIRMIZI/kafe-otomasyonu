"use client"

import * as React from "react"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface AddItemFormData {
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

interface AddItemDialogProps {
  item?: AddItemFormData & { id: string }
  onSave: (data: AddItemFormData) => void
  trigger?: React.ReactNode
}

const unitOptions = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "lt", label: "Litre (lt)" },
  { value: "adet", label: "Adet" },
  { value: "paket", label: "Paket" },
]

const categoryOptions = [
  { value: "İçecek", label: "İçecek" },
  { value: "Süt Ürünleri", label: "Süt Ürünleri" },
  { value: "Malzeme", label: "Malzeme" },
  { value: "Şurup", label: "Şurup" },
  { value: "Sarf Malzemesi", label: "Sarf Malzemesi" },
  { value: "Diğer", label: "Diğer" },
]

const defaultFormData: AddItemFormData = {
  name: "",
  unit: "kg",
  currentStock: 0,
  minStock: 0,
  maxStock: 100,
  unitCost: 0,
  supplier: "",
  supplierPhone: "",
  expiryDate: "",
  category: "Malzeme",
}

export function AddItemDialog({ item, onSave, trigger }: AddItemDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<AddItemFormData>(
    item || defaultFormData
  )
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const isEditing = !!item

  React.useEffect(() => {
    if (open) {
      setFormData(item || defaultFormData)
      setErrors({})
    }
  }, [open, item])

  const updateField = (field: keyof AddItemFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Malzeme adı gerekli"
    if (formData.currentStock < 0) newErrors.currentStock = "Stok negatif olamaz"
    if (formData.minStock < 0) newErrors.minStock = "Min stok negatif olamaz"
    if (formData.maxStock <= formData.minStock)
      newErrors.maxStock = "Max stok, min stoktan büyük olmalı"
    if (formData.unitCost <= 0) newErrors.unitCost = "Birim maliyet sıfırdan büyük olmalı"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSave(formData)
    setOpen(false)
    if (!isEditing) {
      setFormData(defaultFormData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 cursor-pointer">
          <Plus className="h-4 w-4" />
          Yeni Malzeme
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Malzeme Düzenle" : "Yeni Malzeme Ekle"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Malzeme bilgilerini güncelleyin."
              : "Envantere yeni bir malzeme eklemek için formu doldurun."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <Input
            label="Malzeme Adı"
            placeholder="Örn: Türk Kahvesi"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Birim"
              options={unitOptions}
              value={formData.unit}
              onValueChange={(val) => updateField("unit", val)}
            />
            <Select
              label="Kategori"
              options={categoryOptions}
              value={formData.category || "Malzeme"}
              onValueChange={(val) => updateField("category", val)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Mevcut Stok"
              type="number"
              value={formData.currentStock}
              onChange={(e) => updateField("currentStock", parseFloat(e.target.value) || 0)}
              error={errors.currentStock}
              min={0}
            />
            <Input
              label="Min Stok"
              type="number"
              value={formData.minStock}
              onChange={(e) => updateField("minStock", parseFloat(e.target.value) || 0)}
              error={errors.minStock}
              min={0}
            />
            <Input
              label="Max Stok"
              type="number"
              value={formData.maxStock}
              onChange={(e) => updateField("maxStock", parseFloat(e.target.value) || 0)}
              error={errors.maxStock}
              min={0}
            />
          </div>

          <Input
            label="Birim Maliyet (₺)"
            type="number"
            placeholder="0.00"
            value={formData.unitCost}
            onChange={(e) => updateField("unitCost", parseFloat(e.target.value) || 0)}
            error={errors.unitCost}
            min={0}
            step={0.01}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tedarikçi Adı"
              placeholder="Örn: Kahve Dünyası"
              value={formData.supplier}
              onChange={(e) => updateField("supplier", e.target.value)}
            />
            <Input
              label="Tedarikçi Telefon"
              placeholder="Örn: 0212 555 1234"
              value={formData.supplierPhone}
              onChange={(e) => updateField("supplierPhone", e.target.value)}
            />
          </div>

          <Input
            label="Son Kullanma Tarihi"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => updateField("expiryDate", e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4" />
            {isEditing ? "Güncelle" : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
