"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Store, Plus, Edit2, Trash2, Phone, MapPin, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AddBranchDialog } from "@/components/settings/add-branch-dialog"

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  openingTime: string
  closingTime: string
  isActive: boolean
}

const defaultBranches: Branch[] = [
  { id: "1", name: "Merkez Şube", address: "Bağdat Caddesi No:123, Kadıköy/İstanbul", phone: "+90 212 555 0101", openingTime: "08:00", closingTime: "23:00", isActive: true },
  { id: "2", name: "Moda Şubesi", address: "Moda Caddesi No:45, Kadıköy/İstanbul", phone: "+90 212 555 0102", openingTime: "09:00", closingTime: "22:00", isActive: true },
  { id: "3", name: "Beşiktaş Şubesi", address: "Çarşı Sokak No:78, Beşiktaş/İstanbul", phone: "+90 212 555 0103", openingTime: "08:30", closingTime: "23:30", isActive: false },
]

export function BranchSettings() {
  const [branches, setBranches] = useState<Branch[]>(defaultBranches)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)

  const handleAdd = () => {
    setEditingBranch(null)
    setDialogOpen(true)
  }

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id))
  }

  const handleToggle = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    )
  }

  const handleSave = (data: { name: string; address: string; phone: string; openingTime: string; closingTime: string }) => {
    if (editingBranch) {
      setBranches((prev) =>
        prev.map((b) => (b.id === editingBranch.id ? { ...b, ...data } : b))
      )
    } else {
      const newBranch: Branch = {
        id: String(Date.now()),
        ...data,
        isActive: true,
      }
      setBranches((prev) => [...prev, newBranch])
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Şubeler</CardTitle>
            <Button size="sm" onClick={handleAdd} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Şube Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {branches.map((branch, idx) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group rounded-xl border border-neutral-200 p-4 transition-all duration-200 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:hover:border-neutral-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                    <Store className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{branch.name}</h3>
                      <Badge variant={branch.isActive ? "success" : "secondary"}>
                        {branch.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {branch.address}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        {branch.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {branch.openingTime} - {branch.closingTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={branch.isActive}
                    onCheckedChange={() => handleToggle(branch.id)}
                  />
                  <button
                    onClick={() => handleEdit(branch)}
                    className="rounded-lg p-1.5 text-neutral-400 opacity-0 transition-all hover:bg-neutral-100 hover:text-neutral-900 group-hover:opacity-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(branch.id)}
                    className="rounded-lg p-1.5 text-neutral-400 opacity-0 transition-all hover:bg-red-100 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {branches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Store className="h-10 w-10 text-neutral-300 dark:text-neutral-600" />
              <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Henüz şube eklenmemiş
              </p>
              <Button size="sm" variant="outline" onClick={handleAdd} className="mt-3">
                İlk Şubeyi Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddBranchDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        branch={editingBranch ? { ...editingBranch } : null}
        onSave={handleSave}
      />
    </>
  )
}
