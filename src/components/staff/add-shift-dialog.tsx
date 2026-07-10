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
import { Select } from "@/components/ui/select"

interface AddShiftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
}

const staffOptions = [
  { value: "1", label: "Ahmet Yılmaz" },
  { value: "2", label: "Elif Demir" },
  { value: "3", label: "Murat Kaya" },
  { value: "4", label: "Zeynep Çelik" },
  { value: "5", label: "Can Özkan" },
]

export function AddShiftDialog({
  open,
  onOpenChange,
  selectedDate,
}: AddShiftDialogProps) {
  const [staffId, setStaffId] = React.useState("")
  const [date, setDate] = React.useState(
    selectedDate.toISOString().split("T")[0]
  )
  const [startTime, setStartTime] = React.useState("09:00")
  const [endTime, setEndTime] = React.useState("17:00")

  React.useEffect(() => {
    if (open) {
      setDate(selectedDate.toISOString().split("T")[0])
    }
  }, [open, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setStaffId("")
    setStartTime("09:00")
    setEndTime("17:00")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Vardiya Oluştur</DialogTitle>
          <DialogDescription>
            Personel için yeni bir vardiya oluşturun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Personel"
            options={staffOptions}
            value={staffId}
            onValueChange={setStaffId}
            placeholder="Personel seçiniz..."
          />

          <Input
            label="Tarih"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Başlangıç Saati"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <Input
              label="Bitiş Saati"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
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
