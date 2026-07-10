"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const topProducts = [
  { rank: 1, name: "Türk Kahvesi", quantity: 142, revenue: 5680 },
  { rank: 2, name: "Latte", quantity: 118, revenue: 8260 },
  { rank: 3, name: "Tiramisu", quantity: 96, revenue: 5760 },
  { rank: 4, name: "Sucuklu Tost", quantity: 87, revenue: 6090 },
  { rank: 5, name: "Ayran", quantity: 74, revenue: 1850 },
]

const maxQuantity = Math.max(...topProducts.map((p) => p.quantity))

const barColors = [
  "from-indigo-500 to-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]",
  "from-violet-500 to-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.5)]",
  "from-purple-500 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]",
  "from-fuchsia-500 to-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.5)]",
  "from-pink-500 to-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]",
]

export function TopProducts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200/60 bg-white/50 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/50">
        <div className="border-b border-neutral-200/60 p-6 dark:border-neutral-800/60">
          <h3 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
            En Çok Satan Ürünler
          </h3>
        </div>
        <div className="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
          <div className="space-y-6">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
                className="group space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 text-xs font-black text-neutral-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-neutral-900 dark:text-neutral-400 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-400">
                      {product.rank}
                    </span>
                    <div>
                      <p className="font-bold text-neutral-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs font-medium text-neutral-500">
                        {product.quantity} adet satıldı
                      </p>
                    </div>
                  </div>
                  <p className="font-bold tracking-tight text-neutral-900 dark:text-white">
                    {new Intl.NumberFormat("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    }).format(product.revenue)}
                  </p>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", barColors[index])}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(product.quantity / maxQuantity) * 100}%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1, type: "spring", stiffness: 100 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

