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
import { UserRole } from "@/types/index"

interface AddStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (staff: {
    name: string
    email: string
    phone: string
    role: UserRole
    shift: string
    startDate: string
    isActive: boolean
    hourlyRate: number
  }) => void
}

const roleOptions = [
  { value: UserRole.CASHIER, label: "Kasiyer" },
  { value: UserRole.WAITER, label: "Garson" },
  { value: UserRole.KITCHEN, label: "Mutfak Personeli" },
  { value: UserRole.BARISTA, label: "Barista" },
]

export function AddStaffDialog({
  open,
  onOpenChange,
  onSave,
}: AddStaffDialogProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<UserRole>(UserRole.WAITER)
  const [hourlyRate, setHourlyRate] = React.useState("")
  const [startDate, setStartDate] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      email,
      phone,
      role,
      shift: "09:00 - 17:00",
      startDate,
      isActive: true,
      hourlyRate: Number(hourlyRate),
    })
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setPhone("")
    setPassword("")
    setRole(UserRole.WAITER)
    setHourlyRate("")
    setStartDate("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Personel Ekle</DialogTitle>
          <DialogDescription>
            Yeni bir personel hesabı oluşturun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Ad Soyad"
            placeholder="Ad Soyad giriniz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="E-posta"
            type="email"
            placeholder="ornek@kafe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Telefon"
            placeholder="+90 5XX XXX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Select
            label="Rol"
            options={roleOptions}
            value={role}
            onValueChange={(v) => setRole(v as UserRole)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Saatlik Ücret (₺)"
              type="number"
              placeholder="0.00"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              required
            />

            <Input
              label="Başlangıç Tarihi"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
