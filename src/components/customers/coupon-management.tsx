"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { AddCouponDialog } from "@/components/customers/add-coupon-dialog"

interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrder: number
  usageLimit: number
  usedCount: number
  expiryDate: string
  isActive: boolean
}

const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "HOŞGELDİN20",
    type: "percentage",
    value: 20,
    minOrder: 100,
    usageLimit: 500,
    usedCount: 234,
    expiryDate: "2026-12-31",
    isActive: true,
  },
  {
    id: "2",
    code: "50TLİNDİRİM",
    type: "fixed",
    value: 50,
    minOrder: 200,
    usageLimit: 200,
    usedCount: 156,
    expiryDate: "2026-09-30",
    isActive: true,
  },
  {
    id: "3",
    code: "YAZ2026",
    type: "percentage",
    value: 15,
    minOrder: 75,
    usageLimit: 1000,
    usedCount: 0,
    expiryDate: "2026-08-31",
    isActive: false,
  },
  {
    id: "4",
    code: "VIP100",
    type: "fixed",
    value: 100,
    minOrder: 500,
    usageLimit: 50,
    usedCount: 42,
    expiryDate: "2026-10-15",
    isActive: true,
  },
]

export function CouponManagement() {
  const [coupons, setCoupons] = React.useState<Coupon[]>(mockCoupons)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    )
  }

  const handleAddCoupon = (coupon: Omit<Coupon, "id" | "usedCount">) => {
    setCoupons((prev) => [
      ...prev,
      { ...coupon, id: String(prev.length + 1), usedCount: 0 },
    ])
    setAddDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Kupon Yönetimi</CardTitle>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Kupon Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kod</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Değer</TableHead>
                <TableHead>Min Sipariş</TableHead>
                <TableHead>Kullanım</TableHead>
                <TableHead>Son Tarih</TableHead>
                <TableHead>Aktif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {coupons.map((coupon, index) => (
                  <motion.tr
                    key={coupon.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                  >
                    <TableCell>
                      <Badge variant="default" className="font-mono">
                        {coupon.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {coupon.type === "percentage" ? "Yüzde (%)" : "Sabit Tutar"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                      {coupon.type === "percentage"
                        ? `%${coupon.value}`
                        : new Intl.NumberFormat("tr-TR", {
                            style: "currency",
                            currency: "TRY",
                          }).format(coupon.value)}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(coupon.minOrder)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <div
                            className="h-full rounded-full bg-neutral-900 dark:bg-neutral-50"
                            style={{
                              width: `${
                                coupon.usageLimit > 0
                                  ? (coupon.usedCount / coupon.usageLimit) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {coupon.usedCount}/{coupon.usageLimit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-500 dark:text-neutral-400">
                      {coupon.expiryDate}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => toggleCoupon(coupon.id)}
                      />
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCouponDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleAddCoupon}
      />
    </>
  )
}
