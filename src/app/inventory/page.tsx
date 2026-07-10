"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Package } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { InventoryList } from "@/components/inventory/inventory-list"
import { MovementHistory } from "@/components/inventory/movement-history"
import { LowStockAlerts } from "@/components/inventory/low-stock-alerts"

export default function InventoryPage() {
  const [activeTab, setActiveTab] = React.useState("list")

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Stok Yönetimi
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Envanter takibi ve stok hareketleri
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="list">Stok Listesi</TabsTrigger>
              <TabsTrigger value="movements">Stok Hareketleri</TabsTrigger>
              <TabsTrigger value="alerts">Uyarılar</TabsTrigger>
            </TabsList>

            <TabsContent value="list">
              <InventoryList />
            </TabsContent>

            <TabsContent value="movements">
              <MovementHistory />
            </TabsContent>

            <TabsContent value="alerts">
              <LowStockAlerts />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  )
}
