"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Receipt, CreditCard } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  OpenOrdersTable,
} from "@/components/cashier/open-orders-table"
import { PaymentPanel } from "@/components/cashier/payment-panel"
import { Order, OrderStatus, OrderType } from "@/types"

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "S-20260710-1001",
    orderType: OrderType.DINE_IN,
    status: "SERVED" as OrderStatus,
    subtotal: 520,
    discountAmount: 0,
    taxAmount: 93.6,
    totalAmount: 639.6,
    tableId: "t-1",
    waiterId: "w-1",
    createdAt: new Date(Date.now() - 15 * 60000),
    updatedAt: new Date(),
    table: { id: "t-1", number: 5, capacity: 4, status: "ORDERED" as any, createdAt: new Date(), updatedAt: new Date() },
    waiter: { id: "w-1", name: "Ahmet Yılmaz", email: "ahmet@kafe.com", role: "WAITER" as any, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    items: [
      { id: "oi-1", orderId: "ord-1", productId: "p-1", quantity: 2, unitPrice: 100, totalPrice: 200, discountAmount: 0, status: "SERVED" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-1", name: "Latte", price: 100, costPrice: 25, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
      { id: "oi-2", orderId: "ord-1", productId: "p-2", quantity: 1, unitPrice: 120, totalPrice: 120, discountAmount: 0, status: "SERVED" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-2", name: "Smoothie", price: 120, costPrice: 35, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
      { id: "oi-3", orderId: "ord-1", productId: "p-3", quantity: 1, unitPrice: 200, totalPrice: 200, discountAmount: 0, status: "SERVED" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-3", name: "Klasik Burger", price: 200, costPrice: 65, categoryId: "cat-6", isActive: true, stockQuantity: 30, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "S-20260710-1002",
    orderType: OrderType.DINE_IN,
    status: "CONFIRMED" as OrderStatus,
    subtotal: 310,
    discountAmount: 0,
    taxAmount: 55.8,
    totalAmount: 381.3,
    tableId: "t-2",
    waiterId: "w-2",
    createdAt: new Date(Date.now() - 32 * 60000),
    updatedAt: new Date(),
    table: { id: "t-2", number: 3, capacity: 2, status: "ORDERED" as any, createdAt: new Date(), updatedAt: new Date() },
    waiter: { id: "w-2", name: "Zeynep Koç", email: "zeynep@kafe.com", role: "WAITER" as any, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    items: [
      { id: "oi-4", orderId: "ord-2", productId: "p-4", quantity: 1, unitPrice: 95, totalPrice: 95, discountAmount: 0, status: "CONFIRMED" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-4", name: "Cappuccino", price: 95, costPrice: 22, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
      { id: "oi-5", orderId: "ord-2", productId: "p-5", quantity: 1, unitPrice: 135, totalPrice: 135, discountAmount: 0, status: "CONFIRMED" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-5", name: "Cheesecake", price: 135, costPrice: 42, categoryId: "cat-3", isActive: true, stockQuantity: 20, minStockLevel: 5, createdAt: new Date(), updatedAt: new Date() } },
      { id: "oi-6", orderId: "ord-2", productId: "p-6", quantity: 1, unitPrice: 80, totalPrice: 80, discountAmount: 0, status: "CONFIRMED" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-6", name: "Patates Kızartması", price: 80, costPrice: 15, categoryId: "cat-8", isActive: true, stockQuantity: 50, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
    ],
  },
  {
    id: "ord-3",
    orderNumber: "S-20260710-1003",
    orderType: OrderType.DINE_IN,
    status: "READY" as OrderStatus,
    subtotal: 440,
    discountAmount: 0,
    taxAmount: 79.2,
    totalAmount: 541.2,
    tableId: "t-3",
    waiterId: "w-1",
    createdAt: new Date(Date.now() - 45 * 60000),
    updatedAt: new Date(),
    table: { id: "t-3", number: 8, capacity: 6, status: "ORDERED" as any, createdAt: new Date(), updatedAt: new Date() },
    waiter: { id: "w-1", name: "Ahmet Yılmaz", email: "ahmet@kafe.com", role: "WAITER" as any, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    items: [
      { id: "oi-7", orderId: "ord-3", productId: "p-7", quantity: 2, unitPrice: 110, totalPrice: 220, discountAmount: 0, status: "READY" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-7", name: "Ice Latte", price: 110, costPrice: 28, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
      { id: "oi-8", orderId: "ord-3", productId: "p-8", quantity: 1, unitPrice: 220, totalPrice: 220, discountAmount: 0, status: "READY" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-8", name: "Klasik Burger", price: 220, costPrice: 65, categoryId: "cat-6", isActive: true, stockQuantity: 30, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
    ],
  },
  {
    id: "ord-4",
    orderNumber: "S-20260710-1004",
    orderType: OrderType.DINE_IN,
    status: "PENDING" as OrderStatus,
    subtotal: 175,
    discountAmount: 0,
    taxAmount: 31.5,
    totalAmount: 215.25,
    tableId: "t-4",
    waiterId: "w-2",
    createdAt: new Date(Date.now() - 8 * 60000),
    updatedAt: new Date(),
    table: { id: "t-4", number: 2, capacity: 4, status: "ORDERED" as any, createdAt: new Date(), updatedAt: new Date() },
    waiter: { id: "w-2", name: "Zeynep Koç", email: "zeynep@kafe.com", role: "WAITER" as any, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    items: [
      { id: "oi-9", orderId: "ord-4", productId: "p-9", quantity: 1, unitPrice: 60, totalPrice: 60, discountAmount: 0, status: "PENDING" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-9", name: "Espresso", price: 60, costPrice: 15, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
      { id: "oi-10", orderId: "ord-4", productId: "p-10", quantity: 1, unitPrice: 115, totalPrice: 115, discountAmount: 0, status: "PENDING" as OrderStatus, createdAt: new Date(), updatedAt: new Date(), product: { id: "p-10", name: "Matcha Latte", price: 115, costPrice: 32, categoryId: "cat-1", isActive: true, stockQuantity: 50, minStockLevel: 10, createdAt: new Date(), updatedAt: new Date() } },
    ],
  },
]

export default function CashierPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [tab, setTab] = useState("orders")

  const handleSelectOrder = useCallback(
    (order: Order) => {
      setSelectedOrder(order)
      setTab("payment")
    },
    []
  )

  const handleBackToOrders = useCallback(() => {
    setTab("orders")
  }, [])

  const handlePaymentComplete = useCallback(() => {
    setSelectedOrder(null)
    setTab("orders")
  }, [])

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Kasiyer Paneli
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Adisyonları görüntüleyin ve ödeme alın
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="flex flex-1 flex-col">
          <TabsList className="self-start">
            <TabsTrigger value="orders" className="gap-2">
              <Receipt className="h-4 w-4" />
              Açık Adisyonlar
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Ödeme
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="orders" className="h-full overflow-y-auto">
              <OpenOrdersTable
                orders={MOCK_ORDERS}
                selectedOrderId={selectedOrder?.id ?? null}
                onSelectOrder={handleSelectOrder}
              />
            </TabsContent>

            <TabsContent value="payment" className="h-full">
              <div className="h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                <PaymentPanel
                  order={selectedOrder}
                  onBack={handleBackToOrders}
                  onPaymentComplete={handlePaymentComplete}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  )
}
