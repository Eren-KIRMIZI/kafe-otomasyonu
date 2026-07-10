"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface AddTableDialogProps {
  onSave: (data: { number: number; capacity: number; location: string }) => void
}

const capacityOptions = Array.from({ length: 20 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1} Kişi`,
}))

const floorOptions = [
  { value: "Zemin Kat", label: "Zemin Kat" },
  { value: "1. Kat", label: "1. Kat" },
  { value: "2. Kat", label: "2. Kat" },
  { value: "Bahçe", label: "Bahçe" },
  { value: "Teras", label: "Teras" },
]

export function AddTableDialog({ onSave }: AddTableDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [number, setNumber] = React.useState("")
  const [capacity, setCapacity] = React.useState("4")
  const [location, setLocation] = React.useState("Zemin Kat")
  const [error, setError] = React.useState("")

  const handleSubmit = () => {
    const num = parseInt(number, 10)
    if (!num || num <= 0) {
      setError("Geçerli bir masa numarası girin.")
      return
    }
    setError("")
    onSave({ number: num, capacity: parseInt(capacity, 10), location })
    setOpen(false)
    setNumber("")
    setCapacity("4")
    setLocation("Zemin Kat")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 cursor-pointer">
        <Plus className="h-4 w-4" />
        Yeni Masa
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yeni Masa Ekle</DialogTitle>
          <DialogDescription>
            Yeni bir masa eklemek için aşağıdaki bilgileri doldurun.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            label="Masa Numarası"
            type="number"
            placeholder="Örn: 12"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value)
              setError("")
            }}
            error={error}
            min={1}
          />
          <Select
            label="Kapasite"
            options={capacityOptions}
            value={capacity}
            onValueChange={setCapacity}
          />
          <Select
            label="Kat / Konum"
            options={floorOptions}
            value={location}
            onValueChange={setLocation}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit}>Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
