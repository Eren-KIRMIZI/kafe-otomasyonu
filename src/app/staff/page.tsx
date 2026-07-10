"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { StaffList } from "@/components/staff/staff-list"
import { ShiftManagement } from "@/components/staff/shift-management"
import { PerformanceReport } from "@/components/staff/performance-report"

export default function StaffPage() {
  const [activeTab, setActiveTab] = React.useState("staff")

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
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Personel Yönetimi
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Çalışanlar, vardiyalar ve performans takibi
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
              <TabsTrigger value="staff">Personel</TabsTrigger>
              <TabsTrigger value="shifts">Vardiyalar</TabsTrigger>
              <TabsTrigger value="performance">Performans</TabsTrigger>
            </TabsList>

            <TabsContent value="staff">
              <StaffList />
            </TabsContent>

            <TabsContent value="shifts">
              <ShiftManagement />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceReport />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  )
}
