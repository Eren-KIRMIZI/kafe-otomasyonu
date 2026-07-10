"use client"

import * as React from "react"
import {
  User,
  Clock,
  Users,
  Hash,
  CheckCircle,
  XCircle,
  StickyNote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

interface ReservationCardProps {
  reservation: Reservation
  onStatusChange: (
    id: string,
    status: ReservationStatus.CONFIRMED | ReservationStatus.CANCELLED
  ) => void
}

const statusConfig: Record<
  ReservationStatus,
  { label: string; className: string }
> = {
  [ReservationStatus.PENDING]: {
    label: "Beklemede",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  [ReservationStatus.CONFIRMED]: {
    label: "Onaylandı",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  [ReservationStatus.CANCELLED]: {
    label: "İptal",
    className:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  [ReservationStatus.COMPLETED]: {
    label: "Tamamlandı",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  [ReservationStatus.NO_SHOW]: {
    label: "Gelmedi",
    className:
      "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  },
}

export function ReservationCard({
  reservation,
  onStatusChange,
}: ReservationCardProps) {
  const config = statusConfig[reservation.status]

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            {reservation.customerName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-50">
              {reservation.customerName}
            </p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
            >
              {config.label}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5" />
            Masa {reservation.tableNumber}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {reservation.time}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {reservation.partySize} kişi
          </span>
        </div>

        {reservation.notes && (
          <div className="flex items-start gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{reservation.notes}</span>
          </div>
        )}
      </div>

      {reservation.status === ReservationStatus.PENDING && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onStatusChange(reservation.id, ReservationStatus.CONFIRMED)}
          >
            <CheckCircle className="h-4 w-4" />
            Onayla
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onStatusChange(reservation.id, ReservationStatus.CANCELLED)}
          >
            <XCircle className="h-4 w-4" />
            İptal Et
          </Button>
        </div>
      )}
    </div>
  )
}
