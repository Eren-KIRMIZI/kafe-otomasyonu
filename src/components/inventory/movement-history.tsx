"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Trash2,
  Settings2,
  Download,
  Calendar,
  Filter,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { cn, formatDateTime } from "@/lib/utils"
import { InventoryMovementType } from "@/types"

interface Movement {
  id: string
  productName: string
  type: InventoryMovementType
  quantity: number
  reason: string
  performedBy: string
  date: Date
}

const typeConfig: Record<
  InventoryMovementType,
  {
    label: string
    icon: React.ElementType
    color: string
    bg: string
    variant: "success" | "destructive" | "warning" | "default"
  }
> = {
  [InventoryMovementType.PURCHASE]: {
    label: "Giriş",
    icon: ArrowDownToLine,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    variant: "success",
  },
  [InventoryMovementType.USAGE]: {
    label: "Çıkış",
    icon: ArrowUpFromLine,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
    variant: "destructive",
  },
  [InventoryMovementType.WASTE]: {
    label: "Fire",
    icon: Trash2,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    variant: "warning",
  },
  [InventoryMovementType.ADJUSTMENT]: {
    label: "Ayarlama",
    icon: Settings2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    variant: "default",
  },
  [InventoryMovementType.RETURN]: {
    label: "İade",
    icon: ArrowUpFromLine,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    variant: "default",
  },
}

const mockMovements: Movement[] = [
  {
    id: "1",
    productName: "Türk Kahvesi",
    type: InventoryMovementType.PURCHASE,
    quantity: 10,
    reason: "Haftalık sipariş",
    performedBy: "Ahmet Yılmaz",
    date: new Date("2026-07-10T10:30:00"),
  },
  {
    id: "2",
    productName: "Süt",
    type: InventoryMovementType.USAGE,
    quantity: 5,
    reason: "Günlük kullanım",
    performedBy: "Mehmet Kaya",
    date: new Date("2026-07-10T09:15:00"),
  },
  {
    id: "3",
    productName: "Espresso Çekirdeği",
    type: InventoryMovementType.WASTE,
    quantity: 2,
    reason: "Bozulma tespit edildi",
    performedBy: "Ali Demir",
    date: new Date("2026-07-09T16:45:00"),
  },
  {
    id: "4",
    productName: "Şeker",
    type: InventoryMovementType.PURCHASE,
    quantity: 15,
    reason: "Depo yenileme",
    performedBy: "Ahmet Yılmaz",
    date: new Date("2026-07-09T11:00:00"),
  },
  {
    id: "5",
    productName: "Vanilya Şurubu",
    type: InventoryMovementType.ADJUSTMENT,
    quantity: 0.5,
    reason: "Sayım düzeltmesi",
    performedBy: "Ayşe Çelik",
    date: new Date("2026-07-09T08:30:00"),
  },
  {
    id: "6",
    productName: "Portakal Suyu",
    type: InventoryMovementType.USAGE,
    quantity: 3,
    reason: "Sipariş hazırlık",
    performedBy: "Mehmet Kaya",
    date: new Date("2026-07-08T14:20:00"),
  },
  {
    id: "7",
    productName: "Çikolata Shurbu",
    type: InventoryMovementType.PURCHASE,
    quantity: 5,
    reason: "Yeni tedarikçi ilk sipariş",
    performedBy: "Ahmet Yılmaz",
    date: new Date("2026-07-08T10:00:00"),
  },
  {
    id: "8",
    productName: "Zeytinyağı",
    type: InventoryMovementType.WASTE,
    quantity: 1,
    reason: "Son kullanma tarihi geçmiş",
    performedBy: "Ali Demir",
    date: new Date("2026-07-07T17:00:00"),
  },
  {
    id: "9",
    productName: "Bardak Peçete",
    type: InventoryMovementType.PURCHASE,
    quantity: 30,
    reason: "Aylık stok yenileme",
    performedBy: "Ahmet Yılmaz",
    date: new Date("2026-07-07T09:30:00"),
  },
  {
    id: "10",
    productName: "Temizlik Mendili",
    type: InventoryMovementType.USAGE,
    quantity: 5,
    reason: "Günlük temizlik",
    performedBy: "Mehmet Kaya",
    date: new Date("2026-07-06T15:45:00"),
  },
]

export function MovementHistory() {
  const [movements] = React.useState<Movement[]>(mockMovements)
  const [search, setSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<string>("all")
  const [dateFrom, setDateFrom] = React.useState("")
  const [dateTo, setDateTo] = React.useState("")

  const filtered = React.useMemo(() => {
    return movements.filter((m) => {
      const matchesSearch =
        m.productName.toLowerCase().includes(search.toLowerCase()) ||
        m.performedBy.toLowerCase().includes(search.toLowerCase()) ||
        m.reason.toLowerCase().includes(search.toLowerCase())

      const matchesType = typeFilter === "all" || m.type === typeFilter

      const matchesDateFrom = !dateFrom || new Date(m.date) >= new Date(dateFrom)
      const matchesDateTo =
        !dateTo || new Date(m.date) <= new Date(dateTo + "T23:59:59")

      return matchesSearch && matchesType && matchesDateFrom && matchesDateTo
    })
  }, [movements, search, typeFilter, dateFrom, dateTo])

  const handleExport = () => {
    const header = "Tarih,Malzeme,Tür,Miktar,Neden,Gerçekleştiren\n"
    const rows = filtered
      .map(
        (m) =>
          `${formatDateTime(m.date)},${m.productName},${typeConfig[m.type].label},${m.quantity},"${m.reason}",${m.performedBy}`
      )
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `stok-hareketleri-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Malzeme veya kişi ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800">
              <Filter className="h-3.5 w-3.5 text-neutral-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-sm text-neutral-700 outline-none dark:text-neutral-300 cursor-pointer"
              >
                <option value="all">Tüm Türler</option>
                <option value={InventoryMovementType.PURCHASE}>Giriş</option>
                <option value={InventoryMovementType.USAGE}>Çıkış</option>
                <option value={InventoryMovementType.WASTE}>Fire</option>
                <option value={InventoryMovementType.ADJUSTMENT}>Ayarlama</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800">
              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-transparent text-xs text-neutral-700 outline-none dark:text-neutral-300 cursor-pointer"
                placeholder="Başlangıç"
              />
            </div>
            <span className="text-xs text-neutral-400">-</span>
            <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800">
              <Calendar className="h-3.5 w-3.5 text-neutral-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-transparent text-xs text-neutral-700 outline-none dark:text-neutral-300 cursor-pointer"
                placeholder="Bitiş"
              />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" />
            Dışa Aktar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Malzeme</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Miktar</TableHead>
                <TableHead>Neden</TableHead>
                <TableHead>Gerçekleştiren</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((movement, index) => {
                const config = typeConfig[movement.type]
                const Icon = config.icon
                return (
                  <motion.tr
                    key={movement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                  >
                    <TableCell>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDateTime(movement.date)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-neutral-900 dark:text-neutral-50">
                        {movement.productName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant}>
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-semibold tabular-nums",
                          movement.type === InventoryMovementType.PURCHASE
                            ? "text-emerald-600 dark:text-emerald-400"
                            : movement.type === InventoryMovementType.USAGE ||
                              movement.type === InventoryMovementType.WASTE
                            ? "text-red-600 dark:text-red-400"
                            : "text-blue-600 dark:text-blue-400"
                        )}
                      >
                        {movement.type === InventoryMovementType.PURCHASE
                          ? "+"
                          : "-"}
                        {movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {movement.reason}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {movement.performedBy}
                      </span>
                    </TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                <ArrowDownToLine className="h-7 w-7 text-neutral-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                Hareket bulunamadı
              </p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Seçilen filtrelerle eşleşen stok hareketi yok
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
