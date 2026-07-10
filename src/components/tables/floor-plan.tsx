"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TableCard } from "./table-card"
import type { Table } from "@/types"

interface FloorPlanProps {
  tables: Table[]
  onTableClick?: (table: Table) => void
  selectedTableId?: string | null
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

export function FloorPlan({ tables, onTableClick, selectedTableId }: FloorPlanProps) {
  const [zoom, setZoom] = React.useState(1)
  const [activeFloor, setActiveFloor] = React.useState("all")

  const floors = React.useMemo(() => {
    const floorSet = new Set<string>()
    tables.forEach((t) => floorSet.add(t.location || "Tanımsız"))
    return Array.from(floorSet)
  }, [tables])

  const filteredTables = React.useMemo(() => {
    if (activeFloor === "all") return tables
    return tables.filter((t) => (t.location || "Tanımsız") === activeFloor)
  }, [tables, activeFloor])

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 1.5))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5))
  const handleResetZoom = () => setZoom(1)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" onValueChange={setActiveFloor}>
          <TabsList>
            <TabsTrigger value="all">Tümü</TabsTrigger>
            {floors.map((floor) => (
              <TabsTrigger key={floor} value={floor}>
                {floor}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[3rem] text-center text-xs font-medium text-neutral-500">
            %{Math.round(zoom * 100)}
          </span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleResetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-auto rounded-3xl border border-white/5 bg-neutral-950 p-6">
        <motion.div
          style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="min-h-[400px]"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            >
              {filteredTables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onClick={onTableClick}
                  selected={selectedTableId === table.id}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredTables.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <p className="text-lg font-medium">Bu katta masa bulunmuyor</p>
              <p className="text-sm">Yeni masa ekleyerek başlayabilirsiniz.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
