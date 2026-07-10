"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LayoutGrid, List, Plus, QrCode, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { FloorPlan } from "@/components/tables/floor-plan"
import { TableCard } from "@/components/tables/table-card"
import { TableDetail } from "@/components/tables/table-detail"
import { AddTableDialog } from "@/components/tables/add-table-dialog"
import { Table, TableStatus } from "@/types"

// MOCK_TABLES removed

const statusFilterOptions = [
  { value: "all", label: "Tüm Durumlar" },
  { value: "EMPTY", label: "Boş" },
  { value: "ORDERED", label: "Sipariş Alındı" },
  { value: "WAITING_BILL", label: "Hesap Bekleniyor" },
  { value: "RESERVED", label: "Rezerve" },
]

const legendItems = [
  { label: "Boş", color: "bg-emerald-400" },
  { label: "Sipariş Alındı", color: "bg-orange-400" },
  { label: "Hesap Bekleniyor", color: "bg-red-400" },
  { label: "Rezerve", color: "bg-neutral-400" },
]

export default function TablesPage() {
  const [tables, setTables] = React.useState<Table[]>([])
  const [selectedTable, setSelectedTable] = React.useState<Table | null>(null)
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [loading, setLoading] = React.useState(true)

  const fetchTables = React.useCallback(async () => {
    try {
      const res = await fetch("/api/tables")
      if (res.ok) {
        const { data } = await res.json()
        setTables(data)
      }
    } catch (error) {
      console.error("Masalar yüklenirken hata:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchTables()
    const interval = setInterval(fetchTables, 15000) // Poll every 15s
    return () => clearInterval(interval)
  }, [fetchTables])

  const filteredTables = React.useMemo(() => {
    if (statusFilter === "all") return tables
      return tables.filter((t) => t.status === (statusFilter as TableStatus))
  }, [tables, statusFilter])

  const stats = React.useMemo(() => {
    return {
      total: tables.length,
      empty: tables.filter((t) => t.status === TableStatus.EMPTY).length,
      ordered: tables.filter((t) => t.status === TableStatus.ORDERED).length,
      waitingBill: tables.filter((t) => t.status === TableStatus.WAITING_BILL).length,
      reserved: tables.filter((t) => t.status === TableStatus.RESERVED).length,
    }
  }, [tables])

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
  }

  const handleAddTable = (data: { number: number; capacity: number; location: string }) => {
    const newTable: Table = {
      id: String(tables.length + 1),
      number: data.number,
      capacity: data.capacity,
      status: TableStatus.EMPTY,
      location: data.location,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTables((prev) => [...prev, newTable])
  }

  const handleStatusChange = (tableId: string, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, status, updatedAt: new Date() } : t
      )
    )
    setSelectedTable((prev) =>
      prev && prev.id === tableId ? { ...prev, status, updatedAt: new Date() } : prev
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Masa Yönetimi
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Toplam {stats.total} masa · {stats.empty} boş · {stats.ordered} siparişli
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "rounded-l-lg p-2 transition-colors cursor-pointer",
                  viewMode === "grid"
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-100"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "rounded-r-lg p-2 transition-colors cursor-pointer",
                  viewMode === "list"
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-100"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <AddTableDialog onSave={handleAddTable} />
          </div>
        </div>

        {/* QR Tip Banner */}
        <div className="flex items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <QrCode className="h-4 w-4 text-amber-500" />
          </div>
          <p className="flex-1 text-sm text-neutral-400">
            Masaya tıklayıp <strong className="text-amber-400">&quot;QR Menü&quot;</strong> butonuna basarak müşteri menüsünü yeni sekmede açabilirsiniz.
            Örnek: <code className="rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-amber-300">/qr/masa-1</code>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            onClick={() => window.open("/qr/masa-1", "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Önizle
          </Button>
        </div>


        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={statusFilterOptions}
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-48"
          />
          <div className="flex items-center gap-3">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={cn("h-3 w-3 rounded-full", item.color)} />
                <span className="text-xs font-medium text-neutral-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {viewMode === "grid" ? (
          <FloorPlan
            tables={filteredTables}
            onTableClick={handleTableClick}
            selectedTableId={selectedTable?.id ?? null}
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredTables.map((table) => (
                <motion.div
                  key={table.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div
                    onClick={() => handleTableClick(table)}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl border-2 p-4 transition-all cursor-pointer",
                      "hover:shadow-md",
                      table.status === TableStatus.EMPTY && "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20",
                      table.status === TableStatus.ORDERED && "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20",
                      table.status === TableStatus.WAITING_BILL && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20",
                      table.status === TableStatus.RESERVED && "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900/50"
                    )}
                  >
                    <span className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                      {table.number}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {table.capacity} Kişilik · {table.location || "Tanımsız"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        table.status === TableStatus.EMPTY
                          ? "success"
                          : table.status === TableStatus.ORDERED
                            ? "warning"
                            : table.status === TableStatus.WAITING_BILL
                              ? "destructive"
                              : "secondary"
                      }
                    >
                      {table.status === TableStatus.EMPTY
                        ? "Boş"
                        : table.status === TableStatus.ORDERED
                          ? "Sipariş"
                          : table.status === TableStatus.WAITING_BILL
                            ? "Hesap Bekleniyor"
                            : "Rezerve"}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTable && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setSelectedTable(null)}
            />
            <TableDetail
              table={selectedTable}
              onClose={() => setSelectedTable(null)}
              onStatusChange={handleStatusChange}
            />
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  )
}
