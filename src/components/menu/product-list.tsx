"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, SlidersHorizontal, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { ProductCard } from "./product-card"
import { ProductFormDialog, type ProductFormData } from "./product-form-dialog"
import type { Product, Category } from "@/types"

interface ProductListProps {
  categories?: Category[]
}

// Image map for products that don't have imageUrl
const IMAGE_MAP: Record<string, string> = {
  "Cappuccino": "/images/products/cappuccino.jpg",
  "Latte": "/images/products/latte.jpg",
  "Espresso": "/images/products/espresso.jpg",
  "Americano": "/images/products/americano.jpg",
  "Mocha": "/images/products/mocha.jpg",
  "Macchiato": "/images/products/espresso.jpg",
  "Flat White": "/images/products/latte.jpg",
  "Türk Kahvesi": "/images/products/t-rk-kahvesi.jpg",
  "Filtre Kahve": "/images/products/filtre-kahve.jpg",
  "Matcha Latte": "/images/products/latte.jpg",
  "Tiramisu": "/images/products/tiramisu.jpg",
  "Cheesecake": "/images/products/cheesecake.jpg",
  "Brownie": "/images/products/brownie.jpg",
  "Ayran": "/images/products/ayran.jpg",
  "Smoothie": "/images/products/smoothie.jpg",
  "Kola": "/images/products/kola.jpg",
  "Meyve Suyu": "/images/products/meyve-suyu.jpg",
}

export function ProductList({ categories }: ProductListProps) {
  const [products, setProducts] = React.useState<Product[]>([])
  const [allCategories, setAllCategories] = React.useState<Category[]>(categories ?? [])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)

  const fetchData = React.useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products?take=200"),
        fetch("/api/categories?take=100"),
      ])
      if (prodRes.ok) {
        const prodData = await prodRes.json()
        const productsArray = prodData.data || prodData || []
        // Enrich with local images if no imageUrl
        const enriched = productsArray.map((p: Product) => ({
          ...p,
          imageUrl: p.imageUrl || IMAGE_MAP[p.name] || null,
        }))
        setProducts(enriched)
      }
      if (catRes.ok) {
        const catData = await catRes.json()
        setAllCategories(Array.isArray(catData) ? catData : (catData.data || []))
      }
    } catch (err) {
      console.error("Veri yüklenirken hata:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredProducts = React.useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  const categoryNameMap = React.useMemo(() => {
    const map: Record<string, string> = {}
    allCategories.forEach((c) => { map[c.id] = c.name })
    return map
  }, [allCategories])

  const categoryFilterOptions = [
    { value: "all", label: "Tüm Kategoriler" },
    ...allCategories.map((c) => ({ value: c.id, label: c.name })),
  ]

  const handleSave = async (data: ProductFormData) => {
    if (editingProduct) {
      try {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const updated = await res.json()
          setProducts((prev) =>
            prev.map((p) => p.id === editingProduct.id ? { ...updated, imageUrl: updated.imageUrl || IMAGE_MAP[updated.name] || null } : p)
          )
        }
      } catch {}
    } else {
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          await fetchData()
        }
      } catch {}
    }
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch {}
  }

  const handleToggleActive = async (id: string) => {
    const product = products.find((p) => p.id === id)
    if (!product) return
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      })
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date() } : p)
        )
      }
    } catch {
      // Optimistic fallback
      setProducts((prev) =>
        prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date() } : p)
      )
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
            <div className="aspect-[4/3] bg-neutral-800" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-neutral-800 rounded w-3/4" />
              <div className="h-3 bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="sm:w-72"
          />
          <Select
            options={categoryFilterOptions}
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-48"
          />
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Yeni Ürün
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryNameMap[product.categoryId]}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-700 py-16">
          <Package className="h-12 w-12 text-neutral-600" />
          <p className="mt-4 text-sm font-medium text-neutral-500">
            {searchQuery || selectedCategory !== "all"
              ? "Aramanıza uygun ürün bulunamadı"
              : "Henüz ürün eklenmemiş"}
          </p>
        </div>
      )}

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        categories={allCategories}
        onSave={handleSave}
      />
    </div>
  )
}
