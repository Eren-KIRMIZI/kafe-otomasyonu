"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  Trash2,
  Edit,
  AlertTriangle,
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
import { formatCurrency, cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { AddItemDialog } from "@/components/inventory/add-item-dialog"
import { StockMovementDialog } from "@/components/inventory/stock-movement-dialog"
import { InventoryCard } from "@/components/inventory/inventory-card"

interface InventoryItem {
  id: string
  name: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  unitCost: number
  supplier: string
  supplierPhone: string
  expiryDate: string
  category?: string
}

type SortField = keyof InventoryItem
type SortDirection = "asc" | "desc"

const mockItems: InventoryItem[] = [
  {
    id: "1",
    name: "Türk Kahvesi",
    unit: "kg",
    currentStock: 12.5,
    minStock: 5,
    maxStock: 50,
    unitCost: 320,
    supplier: "Kahve Dünyası",
    supplierPhone: "0212 555 1234",
    expiryDate: "2026-12-15",
    category: "İçecek",
  },
  {
    id: "2",
    name: "Espresso Çekirdeği",
    unit: "kg",
    currentStock: 3.2,
    minStock: 5,
    maxStock: 30,
    unitCost: 450,
    supplier: "Lavazza Türkiye",
    supplierPhone: "0216 444 5678",
    expiryDate: "2026-09-20",
    category: "İçecek",
  },
  {
    id: "3",
    name: "Süt",
    unit: "lt",
    currentStock: 25,
    minStock: 10,
    maxStock: 60,
    unitCost: 42,
    supplier: "Sütaş",
    supplierPhone: "0312 333 9012",
    expiryDate: "2026-07-18",
    category: "Süt Ürünleri",
  },
  {
    id: "4",
    name: "Şeker",
    unit: "kg",
    currentStock: 8,
    minStock: 5,
    maxStock: 30,
    unitCost: 28,
    supplier: "Türk Şeker",
    supplierPhone: "0312 222 3456",
    expiryDate: "2027-06-01",
    category: "Malzeme",
  },
  {
    id: "5",
    name: "Portakal Suyu",
    unit: "lt",
    currentStock: 2,
    minStock: 8,
    maxStock: 40,
    unitCost: 35,
    supplier: "Cappy",
    supplierPhone: "0212 111 7890",
    expiryDate: "2026-08-10",
    category: "İçecek",
  },
  {
    id: "6",
    name: "Çikolata Shurbu",
    unit: "kg",
    currentStock: 4.5,
    minStock: 3,
    maxStock: 20,
    unitCost: 180,
    supplier: "Godiva",
    supplierPhone: "0212 666 1122",
    expiryDate: "2026-11-30",
    category: "Malzeme",
  },
  {
    id: "7",
    name: "Vanilya Şurubu",
    unit: "lt",
    currentStock: 1.8,
    minStock: 2,
    maxStock: 10,
    unitCost: 95,
    supplier: "Monin",
    supplierPhone: "0216 777 3344",
    expiryDate: "2027-03-15",
    category: "Şurup",
  },
  {
    id: "8",
    name: "Bardak Peçete",
    unit: "paket",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unitCost: 15,
    supplier: "Pastavilla",
    supplierPhone: "0212 888 5566",
    expiryDate: "2028-01-01",
    category: "Sarf Malzemesi",
  },
  {
    id: "9",
    name: "Temizlik Mendili",
    unit: "paket",
    currentStock: 12,
    minStock: 15,
    maxStock: 50,
    unitCost: 22,
    supplier: "Hizix",
    supplierPhone: "0312 999 7788",
    expiryDate: "2027-09-01",
    category: "Sarf Malzemesi",
  },
  {
    id: "10",
    name: "Zeytinyağı",
    unit: "lt",
    currentStock: 0.5,
    minStock: 3,
    maxStock: 20,
    unitCost: 210,
    supplier: "Köyüm",
    supplierPhone: "0232 444 2233",
    expiryDate: "2027-05-20",
    category: "Malzeme",
  },
]

function getStockStatus(item: InventoryItem) {
  const ratio = item.currentStock / item.minStock
  if (ratio <= 0.5) return "critical"
  if (ratio <= 1) return "low"
  return "sufficient"
}

const statusConfig = {
  sufficient: {
    label: "Yeterli",
    variant: "success" as const,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  low: {
    label: "Düşük",
    variant: "warning" as const,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  critical: {
    label: "Kritik",
    variant: "destructive" as const,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
}

export function InventoryList() {
  const [items, setItems] = React.useState<InventoryItem[]>(mockItems)
  const [search, setSearch] = React.useState("")
  const [sortField, setSortField] = React.useState<SortField>("name")
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc")
  const [viewMode, setViewMode] = React.useState<"table" | "card">("table")

  const filteredItems = React.useMemo(() => {
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase())
    )

    filtered.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal
      }
      return 0
    })

    return filtered
  }, [items, search, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleAddItem = (newItem: Omit<InventoryItem, "id">) => {
    setItems((prev) => [...prev, { ...newItem, id: String(Date.now()) }])
  }

  const handleEditItem = (item: InventoryItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? item : i))
    )
  }

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const handleStockMove = (itemId: string, type: "in" | "out", quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item
        const newStock =
          type === "in"
            ? Math.min(item.currentStock + quantity, item.maxStock)
            : Math.max(item.currentStock - quantity, 0)
        return { ...item, currentStock: newStock }
      })
    )
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-neutral-900 dark:text-neutral-100" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-neutral-900 dark:text-neutral-100" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Malzeme veya tedarikçi ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors rounded-l-lg",
                viewMode === "table"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100",
                "cursor-pointer"
              )}
            >
              Tablo
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors rounded-r-lg",
                viewMode === "card"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100",
                "cursor-pointer"
              )}
            >
              Kart
            </button>
          </div>
          <AddItemDialog onSave={handleAddItem} />
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <InventoryCard
                item={item}
                onEdit={() => handleEditItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
                onStockMove={(type, qty) => handleStockMove(item.id, type, qty)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    { key: "name", label: "Malzeme Adı" },
                    { key: "unit", label: "Birim" },
                    { key: "currentStock", label: "Mevcut Stok" },
                    { key: "minStock", label: "Min Stok" },
                    { key: "unitCost", label: "Birim Maliyet" },
                    { key: "supplier", label: "Tedarikçi" },
                    { key: "expiryDate", label: "Son Kullanma" },
                    { key: "status", label: "Durum" },
                  ].map((col) => (
                    <TableHead
                      key={col.key}
                      className="cursor-pointer select-none hover:text-neutral-900 dark:hover:text-neutral-100"
                      onClick={() => col.key !== "status" && handleSort(col.key as SortField)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        {col.key !== "status" && <SortIcon field={col.key as SortField} />}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-24 text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const status = getStockStatus(item)
                  const config = statusConfig[status]
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              config.bg
                            )}
                          >
                            <Package className={cn("h-4 w-4", config.color)} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-50">
                              {item.name}
                            </p>
                            {item.category && (
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {item.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {item.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {item.minStock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {formatCurrency(item.unitCost)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {item.supplier}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDate(new Date(item.expiryDate))}
                          </span>
                          {new Date(item.expiryDate) <
                            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <StockMovementDialog
                            itemId={item.id}
                            itemName={item.name}
                            currentStock={item.currentStock}
                            unit={item.unit}
                            onConfirm={(type, qty) =>
                              handleStockMove(
                                item.id,
                                type === "PURCHASE" ? "in" : "out",
                                qty
                              )
                            }
                          />
                          <AddItemDialog
                            item={item}
                            onSave={(data) =>
                              handleEditItem({ ...item, ...data })
                            }
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <Package className="h-7 w-7 text-neutral-400" />
                </div>
                <p className="mt-4 text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  Sonuç bulunamadı
                </p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Arama kriterlerinize uygun malzeme bulunmuyor
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
