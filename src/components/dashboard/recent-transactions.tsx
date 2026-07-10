"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const transactions = [
  { id: 1, table: "Masa 4", time: "14:32", amount: 345, method: "Kredi Kartı", status: "completed" },
  { id: 2, table: "Masa 7", time: "14:18", amount: 180, method: "Nakit", status: "completed" },
  { id: 3, table: "Masa 1", time: "14:05", amount: 520, method: "Kredi Kartı", status: "completed" },
  { id: 4, table: "Masa 11", time: "13:52", amount: 95, method: "Mobil Ödeme", status: "completed" },
  { id: 5, table: "Masa 3", time: "13:40", amount: 275, method: "Kredi Kartı", status: "pending" },
  { id: 6, table: "Masa 9", time: "13:28", amount: 410, method: "Nakit", status: "completed" },
  { id: 7, table: "Masa 6", time: "13:15", amount: 155, method: "Kredi Kartı", status: "completed" },
  { id: 8, table: "Masa 2", time: "13:02", amount: 680, method: "Kredi Kartı", status: "completed" },
  { id: 9, table: "Masa 5", time: "12:48", amount: 230, method: "Nakit", status: "completed" },
  { id: 10, table: "Masa 8", time: "12:35", amount: 365, method: "Mobil Ödeme", status: "completed" },
]

const methodBadge: Record<string, "default" | "secondary" | "outline"> = {
  "Kredi Kartı": "default",
  "Nakit": "secondary",
  "Mobil Ödeme": "outline",
}

export function RecentTransactions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/50 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/50">
        <div className="border-b border-neutral-200/60 p-6 dark:border-neutral-800/60">
          <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
            Son İşlemler
          </h3>
        </div>
        <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.6 + index * 0.04 }}
                className="group flex items-center justify-between rounded-2xl border border-transparent p-4 transition-all hover:border-neutral-200/60 hover:bg-white hover:shadow-sm dark:hover:border-neutral-800/60 dark:hover:bg-neutral-900/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-sm font-bold text-neutral-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-neutral-900/80 dark:text-neutral-400 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400 transition-colors">
                    {tx.table.replace('Masa ', 'M')}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {tx.table}
                    </p>
                    <p className="text-xs font-medium text-neutral-500">
                      {tx.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      }).format(tx.amount)}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                      {tx.method}
                    </p>
                  </div>
                  <Badge
                    variant={tx.status === "completed" ? "success" : "warning"}
                    className="w-24 justify-center"
                  >
                    {tx.status === "completed" ? "Tamamlandı" : "Bekliyor"}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

