"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Store } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AddBranchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch?: {
    id: string
    name: string
    address: string
    phone: string
    openingTime: string
    closingTime: string
  } | null
  onSave: (data: {
    name: string
    address: string
    phone: string
    openingTime: string
    closingTime: string
  }) => void
}

export function AddBranchDialog({ open, onOpenChange, branch, onSave }: AddBranchDialogProps) {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [openingTime, setOpeningTime] = useState("09:00")
  const [closingTime, setClosingTime] = useState("23:00")

  useEffect(() => {
    if (branch) {
      setName(branch.name)
      setAddress(branch.address)
      setPhone(branch.phone)
      setOpeningTime(branch.openingTime)
      setClosingTime(branch.closingTime)
    } else {
      setName("")
      setAddress("")
      setPhone("")
      setOpeningTime("09:00")
      setClosingTime("23:00")
    }
  }, [branch, open])

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave({ name, address, phone, openingTime, closingTime })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
              <Store className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <DialogTitle>{branch ? "Şubeyi Düzenle" : "Yeni Şube Ekle"}</DialogTitle>
              <DialogDescription>
                {branch ? "Şube bilgilerini güncelleyin" : "Yeni bir şube eklemek için bilgileri doldurun"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input label="Şube Adı" value={name} onChange={(e) => setName(e.target.value)} placeholder="Örn: Kadıköy Şubesi" />
          <Textarea label="Adres" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adres bilgisi" />
          <Input label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+90 5XX XXX XX XX" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Açılış Saati" type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
            <Input label="Kapanış Saati" type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {branch ? "Güncelle" : "Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
