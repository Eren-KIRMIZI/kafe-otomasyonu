"use client"

import { motion } from "framer-motion"
import { TrendingUp, Calendar, CalendarDays, ShoppingCart, Users } from "lucide-react"
import { useSession } from "next-auth/react"
import { AppLayout } from "@/components/layout/app-layout"
import { StatCard } from "@/components/dashboard/stat-card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { TopProducts } from "@/components/dashboard/top-products"
import { TableOverview } from "@/components/dashboard/table-overview"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Günlük Ciro",
    value: "₺14,850",
    change: 12.5,
    icon: TrendingUp,
    color: "green" as const,
  },
  {
    title: "Haftalık Ciro",
    value: "₺87,240",
    change: 8.3,
    icon: Calendar,
    color: "blue" as const,
  },
  {
    title: "Aylık Ciro",
    value: "₺342,600",
    change: -2.1,
    icon: CalendarDays,
    color: "purple" as const,
  },
  {
    title: "Sipariş Sayısı",
    value: "284",
    change: 15.7,
    icon: ShoppingCart,
    color: "orange" as const,
  },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const userName = (session?.user as any)?.name || "Hoş Geldiniz"
  const firstName = userName.split(" ")[0]

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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
            Merhaba, {firstName}
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {today}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SalesChart />
          <TopProducts />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TableOverview />
          </div>

          <div className="lg:col-span-1">
            <RecentTransactions />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.6 }}
            className="h-full"
          >
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent p-8 text-center backdrop-blur-xl transition-all duration-300 dark:bg-neutral-950/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <Users className="h-8 w-8" />
              </div>
              <p className="mt-6 text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
                1,248
              </p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Toplam Müşteri
              </p>
              <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5">
                <span className="text-sm font-bold text-emerald-400">
                  +32
                </span>
                <span className="text-xs font-medium text-emerald-500/80">
                  bu ay yeni müşteri
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
