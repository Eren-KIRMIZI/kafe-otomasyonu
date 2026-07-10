"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Search, MoreHorizontal, Phone, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { AddStaffDialog } from "@/components/staff/add-staff-dialog"
import { UserRole } from "@/types/index"

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  shift: string
  startDate: string
  isActive: boolean
  hourlyRate: number
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet@kafe.com",
    phone: "+90 532 123 4567",
    role: UserRole.ADMIN,
    shift: "08:00 - 16:00",
    startDate: "2023-01-15",
    isActive: true,
    hourlyRate: 150,
  },
  {
    id: "2",
    name: "Elif Demir",
    email: "elif@kafe.com",
    phone: "+90 535 234 5678",
    role: UserRole.CASHIER,
    shift: "09:00 - 17:00",
    startDate: "2023-03-20",
    isActive: true,
    hourlyRate: 100,
  },
  {
    id: "3",
    name: "Murat Kaya",
    email: "murat@kafe.com",
    phone: "+90 536 345 6789",
    role: UserRole.WAITER,
    shift: "10:00 - 18:00",
    startDate: "2023-06-10",
    isActive: true,
    hourlyRate: 90,
  },
  {
    id: "4",
    name: "Zeynep Çelik",
    email: "zeynep@kafe.com",
    phone: "+90 537 456 7890",
    role: UserRole.KITCHEN,
    shift: "08:00 - 16:00",
    startDate: "2023-02-01",
    isActive: true,
    hourlyRate: 110,
  },
  {
    id: "5",
    name: "Can Özkan",
    email: "can@kafe.com",
    phone: "+90 538 567 8901",
    role: UserRole.BARISTA,
    shift: "14:00 - 22:00",
    startDate: "2023-08-05",
    isActive: false,
    hourlyRate: 95,
  },
]

const roleBadgeColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  [UserRole.CASHIER]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  [UserRole.WAITER]: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  [UserRole.KITCHEN]: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  [UserRole.BARISTA]: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
}

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Yönetici",
  [UserRole.CASHIER]: "Kasiyer",
  [UserRole.WAITER]: "Garson",
  [UserRole.KITCHEN]: "Mutfak",
  [UserRole.BARISTA]: "Barista",
}

export function StaffList() {
  const [staff, setStaff] = React.useState<StaffMember[]>(mockStaff)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [showActiveOnly, setShowActiveOnly] = React.useState(true)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)

  const filteredStaff = React.useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.includes(searchQuery) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesActive = showActiveOnly ? member.isActive : true
      return matchesSearch && matchesActive
    })
  }, [staff, searchQuery, showActiveOnly])

  const handleAddStaff = (newStaff: Omit<StaffMember, "id">) => {
    setStaff((prev) => [
      ...prev,
      { ...newStaff, id: String(prev.length + 1) },
    ])
    setAddDialogOpen(false)
  }

  const toggleActive = (id: string) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, isActive: !member.isActive } : member
      )
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Personel Listesi</CardTitle>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={showActiveOnly}
                onCheckedChange={setShowActiveOnly}
              />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Sadece aktif
              </span>
            </div>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Personel Ekle
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <Input
            placeholder="İsim, telefon veya e-posta ile ara..."
            icon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İsim</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Vardiya</TableHead>
              <TableHead>Başlangıç</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlem</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredStaff.map((member, index) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                          {member.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadgeColors[member.role]}`}
                    >
                      {roleLabels[member.role]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                      <Phone className="h-3.5 w-3.5" />
                      {member.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 dark:text-neutral-400">
                    {member.shift}
                  </TableCell>
                  <TableCell className="text-sm text-neutral-600 dark:text-neutral-400">
                    {member.startDate}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={member.isActive ? "success" : "secondary"}
                    >
                      {member.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActive(member.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {filteredStaff.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Personel bulunamadı.
            </p>
          </div>
        )}
      </CardContent>

      <AddStaffDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleAddStaff}
      />
    </Card>
  )
}
