"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddShiftDialog } from "@/components/staff/add-shift-dialog"

interface Shift {
  id: string
  staffName: string
  role: string
  date: string
  startTime: string
  endTime: string
  status: "active" | "completed" | "upcoming" | "absent"
}

const mockShifts: Shift[] = [
  {
    id: "1",
    staffName: "Ahmet Yılmaz",
    role: "Yönetici",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "16:00",
    status: "active",
  },
  {
    id: "2",
    staffName: "Elif Demir",
    role: "Kasiyer",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
    status: "active",
  },
  {
    id: "3",
    staffName: "Murat Kaya",
    role: "Garson",
    date: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "18:00",
    status: "upcoming",
  },
  {
    id: "4",
    staffName: "Zeynep Çelik",
    role: "Mutfak",
    date: new Date().toISOString().split("T")[0],
    startTime: "08:00",
    endTime: "16:00",
    status: "completed",
  },
]

const statusConfig: Record<
  Shift["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Aktif",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  completed: {
    label: "Tamamlandı",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  upcoming: {
    label: "Bekliyor",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  absent: {
    label: "Gelmedi",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
}

export function ShiftManagement() {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [shifts] = React.useState<Shift[]>(mockShifts)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDate = (direction: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + direction)
      return next
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const dateStr = selectedDate.toISOString().split("T")[0]
  const dayShifts = shifts.filter((s) => s.date === dateStr)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Vardiya Takvimi</CardTitle>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Vardiya Ekle
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            <span className="font-medium text-neutral-900 dark:text-neutral-50">
              {formatDate(selectedDate)}
            </span>
            {isToday(selectedDate) && (
              <Badge variant="default">Bugün</Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {dayShifts.length > 0 ? (
              dayShifts.map((shift, index) => {
                const config = statusConfig[shift.status]
                return (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {shift.staffName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                          {shift.staffName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {shift.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <Clock className="h-3.5 w-3.5" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
                      >
                        {config.label}
                      </span>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center"
              >
                <CalendarDays className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                  Bu tarihte vardiya bulunmuyor.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>

      <AddShiftDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        selectedDate={selectedDate}
      />
    </Card>
  )
}
