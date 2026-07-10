"use client"

import * as React from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface AddReservationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const customerOptions = [
  { value: "1", label: "Ayşe Korkmaz" },
  { value: "2", label: "Mehmet Aydın" },
  { value: "3", label: "Fatma Yıldız" },
  { value: "4", label: "Ali Çelik" },
  { value: "5", label: "Zeynep Demir" },
]

const tableOptions = [
  { value: "1", label: "Masa 1 (2 Kişilik)" },
  { value: "2", label: "Masa 2 (2 Kişilik)" },
  { value: "3", label: "Masa 3 (4 Kişilik)" },
  { value: "4", label: "Masa 4 (4 Kişilik)" },
  { value: "5", label: "Masa 5 (6 Kişilik)" },
  { value: "6", label: "Masa 6 (4 Kişilik)" },
  { value: "7", label: "Masa 7 (8 Kişilik)" },
  { value: "8", label: "Masa 8 (10 Kişilik)" },
]

const timeSlots = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
]

const timeOptions = timeSlots.map((t) => ({ value: t, label: t }))

export function AddReservationDialog({
  open,
  onOpenChange,
}: AddReservationDialogProps) {
  const [customerId, setCustomerId] = React.useState("")
  const [tableId, setTableId] = React.useState("")
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = React.useState("19:00")
  const [partySize, setPartySize] = React.useState("")
  const [notes, setNotes] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setCustomerId("")
    setTableId("")
    setDate(new Date().toISOString().split("T")[0])
    setTime("19:00")
    setPartySize("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Rezervasyon</DialogTitle>
          <DialogDescription>
            Yeni bir rezervasyon kaydı oluşturun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Müşteri"
            options={customerOptions}
            value={customerId}
            onValueChange={setCustomerId}
            placeholder="Müşteri seçiniz..."
          />

          <Select
            label="Masa"
            options={tableOptions}
            value={tableId}
            onValueChange={setTableId}
            placeholder="Masa seçiniz..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Tarih"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Select
              label="Saat"
              options={timeOptions}
              value={time}
              onValueChange={setTime}
            />
          </div>

          <Input
            label="Kişi Sayısı"
            type="number"
            min="1"
            max="20"
            placeholder="0"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            required
          />

          <Textarea
            label="Özel Notlar"
            placeholder="Rezervasyon ile ilgili özel notlarınız..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Availability Indicator */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              Müsaitlik Durumu
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Seçilen tarih ve saat için müsait masa bulunuyor
              </span>
            </div>
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
