"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CalendarCheck, Plus } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { ReservationCalendar } from "@/components/reservations/reservation-calendar"
import { ReservationList } from "@/components/reservations/reservation-list"
import { AddReservationDialog } from "@/components/reservations/add-reservation-dialog"

export default function ReservationsPage() {
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState(new Date())

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                  Rezervasyonlar
                </h1>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  Rezervasyon takibi ve yönetim
                </p>
              </div>
            </div>
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Rezervasyon Ekle
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <ReservationCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />

          <ReservationList selectedDate={selectedDate} />
        </motion.div>

        <AddReservationDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
      </div>
    </AppLayout>
  )
}
