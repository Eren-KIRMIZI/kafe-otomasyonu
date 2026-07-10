"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReservationCard } from "@/components/reservations/reservation-card"
import { AddReservationDialog } from "@/components/reservations/add-reservation-dialog"
import { ReservationStatus } from "@/types/index"

interface Reservation {
  id: string
  customerName: string
  tableNumber: number
  date: string
  time: string
  partySize: number
  status: ReservationStatus
  notes: string
}

const mockReservations: Reservation[] = [
  {
    id: "1",
    customerName: "Ayşe Korkmaz",
    tableNumber: 5,
    date: new Date().toISOString().split("T")[0],
    time: "19:00",
    partySize: 4,
    status: ReservationStatus.CONFIRMED,
    notes: "Pencere kenarı tercih ediyor",
  },
  {
    id: "2",
    customerName: "Mehmet Aydın",
    tableNumber: 2,
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    partySize: 2,
    status: ReservationStatus.PENDING,
    notes: "",
  },
  {
    id: "3",
    customerName: "Fatma Yıldız",
    tableNumber: 8,
    date: new Date().toISOString().split("T")[0],
    time: "20:00",
    partySize: 6,
    status: ReservationStatus.CONFIRMED,
    notes: "Doğum günü organizasyonu, pasta gelecek",
  },
  {
    id: "4",
    customerName: "Ali Çelik",
    tableNumber: 3,
    date: new Date().toISOString().split("T")[0],
    time: "21:00",
    partySize: 3,
    status: ReservationStatus.CANCELLED,
    notes: "İptal edildi",
  },
  {
    id: "5",
    customerName: "Zeynep Demir",
    tableNumber: 7,
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "18:00",
    partySize: 5,
    status: ReservationStatus.PENDING,
    notes: "Özel menü talebi",
  },
  {
    id: "6",
    customerName: "Hasan Yılmaz",
    tableNumber: 1,
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "19:30",
    partySize: 2,
    status: ReservationStatus.CONFIRMED,
    notes: "",
  },
  {
    id: "7",
    customerName: "Selin Aksoy",
    tableNumber: 4,
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "20:00",
    partySize: 8,
    status: ReservationStatus.PENDING,
    notes: "Kalabalık grup, iki masa birleştirilebilir",
  },
]

const statusLabels: Record<ReservationStatus, string> = {
  [ReservationStatus.PENDING]: "Beklemede",
  [ReservationStatus.CONFIRMED]: "Onaylandı",
  [ReservationStatus.CANCELLED]: "İptal",
  [ReservationStatus.COMPLETED]: "Tamamlandı",
  [ReservationStatus.NO_SHOW]: "Gelmedi",
}

interface ReservationListProps {
  selectedDate: Date
}

export function ReservationList({ selectedDate }: ReservationListProps) {
  const [reservations, setReservations] =
    React.useState<Reservation[]>(mockReservations)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)

  const dateStr = selectedDate.toISOString().split("T")[0]

  const filteredReservations = React.useMemo(() => {
    return reservations.filter((r) => {
      const matchesDate = r.date === dateStr
      const matchesStatus =
        statusFilter === "all" || r.status === statusFilter
      return matchesDate && matchesStatus
    })
  }, [reservations, dateStr, statusFilter])

  const handleStatusChange = (
    id: string,
    status: ReservationStatus.CONFIRMED | ReservationStatus.CANCELLED
  ) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  const todayReservations = filteredReservations.filter(
    (r) => r.date === dateStr
  )
  const pendingCount = todayReservations.filter(
    (r) => r.status === ReservationStatus.PENDING
  ).length
  const confirmedCount = todayReservations.filter(
    (r) => r.status === ReservationStatus.CONFIRMED
  ).length

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Summary Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
                  <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {pendingCount}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Bekleyen
                  </p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                    Rezervasyon
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {confirmedCount}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Onaylanan
                  </p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                    Rezervasyon
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {todayReservations.length}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Toplam
                  </p>
                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                    Rezervasyon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reservation List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Rezervasyon Listesi</CardTitle>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-neutral-400" />
                  <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                      <TabsTrigger value="all">Tümü</TabsTrigger>
                      <TabsTrigger value={ReservationStatus.PENDING}>
                        Bekleyen
                      </TabsTrigger>
                      <TabsTrigger value={ReservationStatus.CONFIRMED}>
                        Onaylı
                      </TabsTrigger>
                      <TabsTrigger value={ReservationStatus.CANCELLED}>
                        İptal
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation, index) => (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <ReservationCard
                          reservation={reservation}
                          onStatusChange={handleStatusChange}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 text-center"
                    >
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Bu tarihte rezervasyon bulunmuyor.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddReservationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </>
  )
}
