"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  User,
  Table2,
  ShoppingBag,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { formatCurrency, formatTime } from "@/lib/utils"
import type { Order, OrderStatus } from "@/types"

interface OpenOrdersTableProps {
  orders: Order[]
  selectedOrderId: string | null
  onSelectOrder: (order: Order) => void
}

const STATUS_BADGE: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }
> = {
  PENDING: { label: "Bekliyor", variant: "warning" },
  CONFIRMED: { label: "Onaylandı", variant: "default" },
  PREPARING: { label: "Hazırlanıyor", variant: "warning" },
  READY: { label: "Hazır", variant: "success" },
  SERVED: { label: "Servis Edildi", variant: "secondary" },
  COMPLETED: { label: "Tamamlandı", variant: "success" },
  CANCELLED: { label: "İptal", variant: "destructive" },
}

type SortField = "tableNumber" | "waiter" | "itemCount" | "total" | "duration" | "status"
type SortDir = "asc" | "desc"

export function OpenOrdersTable({
  orders,
  selectedOrderId,
  onSelectOrder,
}: OpenOrdersTableProps) {
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("duration")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    )
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return orders.filter((o) => {
      const tableMatch = o.table?.number?.toString().includes(q)
      const waiterMatch = o.waiter?.name?.toLowerCase().includes(q)
      const statusMatch =
        STATUS_BADGE[o.status]?.label.toLowerCase().includes(q)
      return tableMatch || waiterMatch || statusMatch
    })
  }, [orders, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1
      switch (sortField) {
        case "tableNumber":
          return ((a.table?.number ?? 0) - (b.table?.number ?? 0)) * dir
        case "waiter":
          return ((a.waiter?.name ?? "").localeCompare(b.waiter?.name ?? "")) * dir
        case "itemCount":
          return ((a.items?.length ?? 0) - (b.items?.length ?? 0)) * dir
        case "total":
          return (a.totalAmount - b.totalAmount) * dir
        case "duration":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ) * dir
        case "status":
          return a.status.localeCompare(b.status) * dir
        default:
          return 0
      }
    })
  }, [filtered, sortField, sortDir])

  const getDuration = (createdAt: Date) => {
    const diff = Date.now() - new Date(createdAt).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} dk`
    const hours = Math.floor(mins / 60)
    const rem = mins % 60
    return `${hours}s ${rem}dk`
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Masa no, garson veya durum ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-xl border-neutral-200 bg-white pl-10 text-sm dark:border-neutral-800 dark:bg-neutral-950"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("tableNumber")}
              >
                <div className="flex items-center">
                  <Table2 className="mr-1.5 h-3.5 w-3.5" />
                  Masa No
                  <SortIcon field="tableNumber" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("waiter")}
              >
                <div className="flex items-center">
                  <User className="mr-1.5 h-3.5 w-3.5" />
                  Garson
                  <SortIcon field="waiter" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-center"
                onClick={() => handleSort("itemCount")}
              >
                <div className="flex items-center justify-center">
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                  Kalem
                  <SortIcon field="itemCount" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => handleSort("total")}
              >
                <div className="flex items-center justify-end">
                  Toplam
                  <SortIcon field="total" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-center"
                onClick={() => handleSort("duration")}
              >
                <div className="flex items-center justify-center">
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  Süre
                  <SortIcon field="duration" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-center"
                onClick={() => handleSort("status")}
              >
                Durum
                <SortIcon field="status" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-16 text-center text-sm text-neutral-400"
                >
                  {search
                    ? "Aramanızla eşleşen adisyon bulunamadı"
                    : "Açık adisyon bulunmuyor"}
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((order) => {
                const isSelected = order.id === selectedOrderId
                const itemCount = order.items?.length ?? 0
                const elapsed = getDuration(order.createdAt)

                return (
                  <TableRow
                    key={order.id}
                    className={[
                      "cursor-pointer transition-all duration-150",
                      isSelected
                        ? "bg-neutral-100 dark:bg-neutral-800"
                        : "hover:bg-neutral-50 dark:hover:bg-neutral-900/50",
                    ].join(" ")}
                    onClick={() => onSelectOrder(order)}
                  >
                    <TableCell className="font-bold text-neutral-900 dark:text-white">
                      {order.table?.number ?? "-"}
                    </TableCell>
                    <TableCell className="text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-neutral-400" />
                        {order.waiter?.name ?? "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {itemCount}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-neutral-900 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <Clock className="h-3 w-3" />
                        {elapsed}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={STATUS_BADGE[order.status].variant}>
                        {STATUS_BADGE[order.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>Toplam {orders.length} adisyon</span>
        <span>{filtered.length} gösteriliyor</span>
      </div>
    </div>
  )
}
