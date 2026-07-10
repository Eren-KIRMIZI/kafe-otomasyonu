"use client"

import * as React from "react"
import { Save, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Category } from "@/types"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSave: (data: { name: string; description: string; sortOrder: number; isActive: boolean }) => void
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: AddCategoryDialogProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [sortOrder, setSortOrder] = React.useState(0)
  const [isActive, setIsActive] = React.useState(true)

  React.useEffect(() => {
    if (category) {
      setName(category.name)
      setDescription(category.description || "")
      setSortOrder(category.sortOrder)
      setIsActive(category.isActive)
    } else {
      setName("")
      setDescription("")
      setSortOrder(0)
      setIsActive(true)
    }
  }, [category, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), description: description.trim(), sortOrder, isActive })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Tag className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
            </div>
            {category ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Kategori Adı"
            placeholder="Örn: Kahveler, Tatlılar..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Açıklama"
            placeholder="Kategori açıklaması (isteğe bağlı)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <Input
            label="Sıralama"
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Aktif
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Menüde görünsün mü?
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              <Save className="h-4 w-4" />
              {category ? "Güncelle" : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
