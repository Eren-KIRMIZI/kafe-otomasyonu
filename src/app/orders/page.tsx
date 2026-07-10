"use client"

import { useState, useCallback } from "react"
import { Hash, TableProperties } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { ProductGrid, type CartItem } from "@/components/orders/product-grid"
import { OrderSummary } from "@/components/orders/order-summary"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { generateOrderNumber } from "@/lib/utils"
import type { Product, Category } from "@/types"

const MOCK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Kahveler",        sortOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-2", name: "Soğuk İçecekler", sortOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-3", name: "Tatlılar",        sortOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-4", name: "Pastalar",        sortOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-5", name: "Kahvaltı",        sortOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-6", name: "Hamburger",       sortOrder: 6, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-7", name: "Pizza",           sortOrder: 7, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-8", name: "Atıştırmalıklar", sortOrder: 8, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

const MOCK_PRODUCTS: Product[] = [
  // Kahveler
  { id: "p-1",  name: "Espresso",       price: 60,  costPrice: 15, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Tek shot yoğun espresso",              preparationTime: 3,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-2",  name: "Americano",      price: 75,  costPrice: 18, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Espresso + sıcak su",                  preparationTime: 4,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-3",  name: "Cappuccino",     price: 95,  costPrice: 22, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Espresso, süt köpüğü ile",            preparationTime: 5,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-4",  name: "Latte",          price: 100, costPrice: 25, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Kremsi sütlü latte",                   preparationTime: 5,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-5",  name: "Mocha",          price: 110, costPrice: 28, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Espresso + çikolata sosu",            preparationTime: 7,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-6",  name: "Flat White",     price: 105, costPrice: 26, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Double ristretto ile",                 preparationTime: 5,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-7",  name: "Macchiato",      price: 85,  costPrice: 20, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Espresso + köpüklü süt",              preparationTime: 5,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-8",  name: "Türk Kahvesi",   price: 55,  costPrice: 12, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Geleneksel Türk kahvesi",             preparationTime: 10, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-9",  name: "Filtre Kahve",   price: 85,  costPrice: 20, categoryId: "cat-1", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Özel çekirdeklerden filtre kahve",    preparationTime: 5,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-10", name: "Matcha Latte",   price: 115, costPrice: 32, categoryId: "cat-1", isActive: true, stockQuantity: 50,  minStockLevel: 10, description: "Japon yeşil çay latte",               preparationTime: 6,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  // Soğuk İçecekler
  { id: "p-11", name: "Ice Latte",      price: 110, costPrice: 28, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Soğuk sütlü latte",                   preparationTime: 4,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-12", name: "Cold Brew",      price: 95,  costPrice: 22, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "24 saat soğuk demleme",               preparationTime: 2,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-13", name: "Smoothie",       price: 120, costPrice: 35, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Günün taze meyvesiyle",               preparationTime: 5,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-14", name: "Milkshake",      price: 130, costPrice: 38, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Dondurmalı milkshake",                preparationTime: 5,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-15", name: "Soğuk Çikolata", price: 105, costPrice: 28, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Kremalı soğuk çikolata",             preparationTime: 4,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-16", name: "Taze Limonata",  price: 70,  costPrice: 15, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Taze sıkılmış limon ile",            preparationTime: 3,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-17", name: "Ayran",          price: 40,  costPrice: 8,  categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Ev yapımı taze ayran",                preparationTime: 1,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-18", name: "Kola",           price: 50,  costPrice: 12, categoryId: "cat-2", isActive: true, stockQuantity: 100, minStockLevel: 10, description: "Coca-Cola 330ml",                     preparationTime: 1,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  // Tatlılar
  { id: "p-19", name: "Tiramisu",       price: 140, costPrice: 45, categoryId: "cat-3", isActive: true, stockQuantity: 20, minStockLevel: 5, description: "İtalyan tarifi mascarpone kremalı",    preparationTime: 2,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-20", name: "Cheesecake",     price: 135, costPrice: 42, categoryId: "cat-3", isActive: true, stockQuantity: 20, minStockLevel: 5, description: "New York usulü çilek soslu",           preparationTime: 2,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-21", name: "Brownie",        price: 95,  costPrice: 25, categoryId: "cat-3", isActive: true, stockQuantity: 30, minStockLevel: 10, description: "Sıcak çikolatalı, dondurma ile",      preparationTime: 3,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  // Pastalar
  { id: "p-22", name: "Kruvasan",       price: 70,  costPrice: 18, categoryId: "cat-4", isActive: true, stockQuantity: 25, minStockLevel: 10, description: "Tereyağlı Fransız kruvasan",          preparationTime: 1,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-23", name: "Muffin",         price: 65,  costPrice: 15, categoryId: "cat-4", isActive: true, stockQuantity: 20, minStockLevel: 8,  description: "Çikolatalı veya yaban mersinli",     preparationTime: 1,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  // Kahvaltı
  { id: "p-24", name: "Serpme Kahvaltı", price: 350, costPrice: 100, categoryId: "cat-5", isActive: true, stockQuantity: 15, minStockLevel: 5, description: "2 kişilik zengin serpme kahvaltı",  preparationTime: 15, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-25", name: "Menemen",        price: 95,  costPrice: 22, categoryId: "cat-5", isActive: true, stockQuantity: 30, minStockLevel: 10, description: "Domates, biber ve yumurta",          preparationTime: 10, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-26", name: "Simit Tabağı",   price: 80,  costPrice: 15, categoryId: "cat-5", isActive: true, stockQuantity: 30, minStockLevel: 10, description: "Simit, peynir, zeytin ve reçel",    preparationTime: 5,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  // Hamburger
  { id: "p-27", name: "Klasik Burger",  price: 220, costPrice: 65, categoryId: "cat-6", isActive: true, stockQuantity: 30, minStockLevel: 10, description: "180gr dana eti, marul, domates",     preparationTime: 15, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-28", name: "Cheeseburger",   price: 240, costPrice: 70, categoryId: "cat-6", isActive: true, stockQuantity: 30, minStockLevel: 10, description: "Cheddar peyniri ve turşu",           preparationTime: 15, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-29", name: "Chicken Burger", price: 210, costPrice: 58, categoryId: "cat-6", isActive: true, stockQuantity: 30, minStockLevel: 10, description: "Izgara tavuk göğsü, coleslaw",       preparationTime: 12, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  // Pizza
  { id: "p-30", name: "Margarita Pizza", price: 200, costPrice: 55, categoryId: "cat-7", isActive: true, stockQuantity: 20, minStockLevel: 5, description: "San Marzano domates, mozzarella",    preparationTime: 20, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-31", name: "Karışık Pizza",  price: 240, costPrice: 68, categoryId: "cat-7", isActive: true, stockQuantity: 20, minStockLevel: 5, description: "Sucuk, tavuk, mantar, biber",         preparationTime: 20, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  // Atıştırmalıklar
  { id: "p-32", name: "Patates Kızartması", price: 80, costPrice: 15, categoryId: "cat-8", isActive: true, stockQuantity: 50, minStockLevel: 10, description: "Çıtır patates kızartması",       preparationTime: 8,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "p-33", name: "Soğan Halkaları",   price: 75, costPrice: 12, categoryId: "cat-8", isActive: true, stockQuantity: 40, minStockLevel: 10, description: "Ballı hardal ile",                preparationTime: 8,  imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
]

export default function OrdersPage() {
  const { addToast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [tableNumber, setTableNumber] = useState<number | null>(null)
  const [discount, setDiscount] = useState(0)

  const handleAddToCart = useCallback((item: CartItem) => {
    setCartItems((prev) => [...prev, item])
  }, [])

  const handleUpdateQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    )
  }, [])

  const handleRemoveItem = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }, [])

  const handleClearOrder = useCallback(() => {
    setCartItems([])
    setTableNumber(null)
    setDiscount(0)
  }, [])

  const handleSubmitOrder = useCallback(async () => {
    if (cartItems.length === 0) return

    const orderNumber = generateOrderNumber()
    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0)

    // Sipariş API'ye gönderilir (şimdilik mock başarı)
    addToast(
      `${orderNumber} nolu sipariş başarıyla gönderildi. (${totalItems} ürün${tableNumber ? ` - Masa ${tableNumber}` : " - Paket"})`,
      "success"
    );

    handleClearOrder()
  }, [cartItems, tableNumber, handleClearOrder, addToast])

  return (
    <AppLayout>
      <div className="flex h-screen flex-col">
        {/* Başlık */}
        <header className="border-b border-neutral-100 bg-white/80 px-6 py-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                Yeni Sipariş
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Ürün seçip siparişi oluşturun
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Masa numarası */}
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900 focus-within:border-amber-400 transition-colors">
                <TableProperties className="h-4 w-4 text-neutral-400" />
                <input
                  type="number"
                  min={1}
                  max={99}
                  placeholder="Masa No"
                  value={tableNumber || ""}
                  onChange={(e) =>
                    setTableNumber(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-20 bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
                />
              </div>
              {cartItems.length > 0 && (
                <Badge className="bg-amber-600 text-white hover:bg-amber-700">
                  {cartItems.reduce((sum, i) => sum + i.quantity, 0)} ürün
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* İçerik */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <ProductGrid
              products={MOCK_PRODUCTS}
              categories={MOCK_CATEGORIES}
              onAddToCart={handleAddToCart}
            />
          </div>

          <div className="w-[400px] shrink-0 border-l border-neutral-100 dark:border-neutral-800">
            <OrderSummary
              items={cartItems}
              tableNumber={tableNumber}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearOrder={handleClearOrder}
              onSubmitOrder={handleSubmitOrder}
              discount={discount}
              onDiscountChange={setDiscount}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
