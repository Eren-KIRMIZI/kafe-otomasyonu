"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Search, Eye, Phone, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { CustomerDetailDialog } from "@/components/customers/customer-detail-dialog"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  totalVisits: number
  totalSpent: number
  loyaltyPoints: number
  birthDate: string
  favoriteProducts: string[]
  recentOrders: { id: string; date: string; amount: number }[]
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Ayşe Korkmaz",
    phone: "+90 532 111 2233",
    email: "ayse@gmail.com",
    totalVisits: 48,
    totalSpent: 12450,
    loyaltyPoints: 623,
    birthDate: "1990-05-15",
    favoriteProducts: ["Cappuccino", "Tiramisu", "Croissant"],
    recentOrders: [
      { id: "S-1001", date: "2026-07-08", amount: 245 },
      { id: "S-0987", date: "2026-07-05", amount: 180 },
    ],
  },
  {
    id: "2",
    name: "Mehmet Aydın",
    phone: "+90 535 444 5566",
    email: "mehmet@outlook.com",
    totalVisits: 32,
    totalSpent: 8900,
    loyaltyPoints: 445,
    birthDate: "1985-11-22",
    favoriteProducts: ["Latte", "Poğaça"],
    recentOrders: [
      { id: "S-1002", date: "2026-07-09", amount: 320 },
      { id: "S-0998", date: "2026-07-06", amount: 150 },
    ],
  },
  {
    id: "3",
    name: "Fatma Yıldız",
    phone: "+90 536 777 8899",
    email: "fatma@yahoo.com",
    totalVisits: 65,
    totalSpent: 18200,
    loyaltyPoints: 910,
    birthDate: "1992-03-08",
    favoriteProducts: ["Espresso", "Simit", "Meyve Suyu"],
    recentOrders: [
      { id: "S-1003", date: "2026-07-10", amount: 275 },
      { id: "S-0999", date: "2026-07-07", amount: 195 },
    ],
  },
  {
    id: "4",
    name: "Ali Çelik",
    phone: "+90 537 222 3344",
    email: "ali@gmail.com",
    totalVisits: 15,
    totalSpent: 4350,
    loyaltyPoints: 218,
    birthDate: "1995-09-30",
    favoriteProducts: ["Americano", "Kruvasan"],
    recentOrders: [
      { id: "S-1004", date: "2026-07-10", amount: 190 },
    ],
  },
]

export function CustomerList() {
  const [customers] = React.useState<Customer[]>(mockCustomers)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  const filteredCustomers = React.useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    )
  }, [customers, searchQuery])

  const handleViewDetail = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDetailOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Müşteri Listesi</CardTitle>
            <Button size="sm">
              <UserPlus className="h-4 w-4" />
              Müşteri Ekle
            </Button>
          </div>
          <div className="mt-4">
            <Input
              placeholder="İsim veya telefon ile ara..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İsim</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Ziyaret</TableHead>
                <TableHead>Toplam Harcama</TableHead>
                <TableHead>Sadakat Puanı</TableHead>
                <TableHead className="text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50/50 dark:border-neutral-800 dark:hover:bg-neutral-800/50 cursor-pointer"
                    onClick={() => handleViewDetail(customer)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="font-medium text-neutral-900 dark:text-neutral-50">
                          {customer.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <Phone className="h-3.5 w-3.5" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                      {customer.totalVisits}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(customer.totalSpent)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="warning">
                        {customer.loyaltyPoints} puan
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetail(customer)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>

          {filteredCustomers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Müşteri bulunamadı.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        customer={selectedCustomer}
      />
    </>
  )
}
