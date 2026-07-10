"use client"

import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SalesReport } from "@/components/reports/sales-report"
import { ProductAnalysis } from "@/components/reports/product-analysis"
import { WaiterPerformance } from "@/components/reports/waiter-performance"
import { ProfitLoss } from "@/components/reports/profit-loss"

const tabs = [
  { value: "sales", label: "Satış Raporları", icon: BarChart3 },
  { value: "products", label: "Ürün Analizi", icon: TrendingUp },
  { value: "waiters", label: "Garson Performansı", icon: Users },
  { value: "profit", label: "Kâr/Zarar", icon: DollarSign },
]

export default function ReportsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Raporlama
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            İşletme performansını detaylı raporlarla analiz edin
          </p>
        </motion.div>

        <Tabs defaultValue="sales">
          <TabsList className="mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="sales">
            <SalesReport />
          </TabsContent>

          <TabsContent value="products">
            <ProductAnalysis />
          </TabsContent>

          <TabsContent value="waiters">
            <WaiterPerformance />
          </TabsContent>

          <TabsContent value="profit">
            <ProfitLoss />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
