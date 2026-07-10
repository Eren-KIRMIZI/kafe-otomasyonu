"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Pencil, Trash2, GripVertical, Tag, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { AddCategoryDialog } from "./add-category-dialog"
import type { Category } from "@/types"

interface CategoryListProps {
  onCategorySelect?: (categoryId: string | null) => void
}

export function CategoryList({ onCategorySelect }: CategoryListProps) {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [productCounts, setProductCounts] = React.useState<Record<string, number>>({})
  const [loading, setLoading] = React.useState(true)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null)

  // ── Veri Yükleme ────────────────────────────────────────
  const fetchCategories = React.useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("/api/categories?take=100"),
        fetch("/api/products?take=200"),
      ])
      if (catRes.ok) {
        const catData = await catRes.json()
        const list: Category[] = Array.isArray(catData) ? catData : (catData.data ?? [])
        setCategories(list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)))
      }
      if (prodRes.ok) {
        const prodData = await prodRes.json()
        const products: any[] = prodData.data ?? prodData ?? []
        const counts: Record<string, number> = {}
        products.forEach((p) => {
          counts[p.categoryId] = (counts[p.categoryId] ?? 0) + 1
        })
        setProductCounts(counts)
      }
    } catch (err) {
      console.error("Kategoriler yüklenirken hata:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // ── Filtreleme ──────────────────────────────────────────
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categories, searchQuery])

  // ── CRUD İşlemleri ──────────────────────────────────────
  const handleSave = async (data: { name: string; description: string; sortOrder: number; isActive: boolean }) => {
    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          const updated = await res.json()
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated } : c))
          )
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (res.ok) {
          await fetchCategories()
        }
      }
    } catch (err) {
      console.error("Kategori kaydedilirken hata:", err)
    }
    setEditingCategory(null)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id))
      }
    } catch (err) {
      console.error("Kategori silinirken hata:", err)
    }
    setDeleteConfirm(null)
  }

  const handleToggleActive = async (id: string) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return
    const newActive = !category.isActive
    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: newActive, updatedAt: new Date() } : c))
    )
    try {
      await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      })
    } catch {
      // revert on error
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !newActive } : c))
      )
    }
  }

  // ── Yükleniyor ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-10 w-72 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Kategori ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Tag className="h-4 w-4" />}
          className="sm:w-72"
        />
        <Button
          onClick={() => {
            setEditingCategory(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Yeni Kategori
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={cn(
                  "group relative overflow-hidden",
                  !category.isActive && "opacity-60"
                )}
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-700" />
                <CardContent className="p-5 pl-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab dark:text-neutral-600" />
                        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 truncate">
                          {category.name}
                        </h3>
                      </div>
                      {category.description && (
                        <p className="mt-1 ml-6 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="mt-3 ml-6 flex items-center gap-2">
                        <Badge variant="secondary">
                          {productCounts[category.id] ?? 0} ürün
                        </Badge>
                        <span className="text-xs text-neutral-400">
                          Sıra: {category.sortOrder ?? 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={() => handleToggleActive(category.id)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 ml-6 flex items-center gap-1 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Düzenle
                    </Button>
                    {deleteConfirm === category.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                        >
                          Onayla
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Vazgeç
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => setDeleteConfirm(category.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Sil
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCategories.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 py-16 dark:border-neutral-700">
          <Tag className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
          <p className="mt-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {searchQuery ? "Aramanıza uygun kategori bulunamadı" : "Henüz kategori eklenmemiş"}
          </p>
        </div>
      )}

      <AddCategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSave}
      />
    </div>
  )
}
