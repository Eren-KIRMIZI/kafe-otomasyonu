"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CategoryList } from "@/components/menu/category-list"
import { ProductList } from "@/components/menu/product-list"

export default function MenuPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 dark:bg-white">
            <UtensilsCrossed className="h-5 w-5 text-white dark:text-neutral-900" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Menü Yönetimi
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Kategorilerinizi ve ürünlerinizi yönetin
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Tabs defaultValue="products">
            <TabsList className="mb-6">
              <TabsTrigger value="categories">Kategoriler</TabsTrigger>
              <TabsTrigger value="products">Ürünler</TabsTrigger>
            </TabsList>
            <TabsContent value="categories">
              <CategoryList />
            </TabsContent>
            <TabsContent value="products">
              <ProductList />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  )
}
