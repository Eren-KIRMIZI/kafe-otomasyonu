"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CustomerList } from "@/components/customers/customer-list"
import { LoyaltyPanel } from "@/components/customers/loyalty-panel"
import { CouponManagement } from "@/components/customers/coupon-management"

export default function CustomersPage() {
  const [activeTab, setActiveTab] = React.useState("customers")

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
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                Müşteri Yönetimi
              </h1>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                Müşteriler, sadakat puanları ve kupon yönetimi
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
              <TabsTrigger value="customers">Müşteriler</TabsTrigger>
              <TabsTrigger value="loyalty">Sadakat</TabsTrigger>
              <TabsTrigger value="coupons">Kuponlar</TabsTrigger>
            </TabsList>

            <TabsContent value="customers">
              <CustomerList />
            </TabsContent>

            <TabsContent value="loyalty">
              <LoyaltyPanel />
            </TabsContent>

            <TabsContent value="coupons">
              <CouponManagement />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  )
}
