"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Sun, Moon, Monitor, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const themes = [
  { value: "light", label: "Açık", icon: Sun },
  { value: "dark", label: "Koyu", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
]

const presetColors = [
  { name: "İndigo", value: "#6366f1" },
  { name: "Mavi", value: "#3b82f6" },
  { name: "Yeşil", value: "#10b981" },
  { name: "Kırmızı", value: "#ef4444" },
  { name: "Mor", value: "#8b5cf6" },
  { name: "Pembe", value: "#ec4899" },
  { name: "Turuncu", value: "#f97316" },
  { name: "Zümrüt", value: "#14b8a6" },
]

export function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const [primaryColor, setPrimaryColor] = useState("#6366f1")
  const [mounted, setMounted] = useState(false)

  useState(() => setMounted(true))

  if (!mounted) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tema Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Tema Seçimi
          </p>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon
              const isActive = theme === t.value
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer",
                    isActive
                      ? "border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900"
                      : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                  )}
                >
                  <Icon className={cn("h-6 w-6", isActive ? "text-neutral-900 dark:text-white" : "text-neutral-400")} />
                  <span className={cn("text-sm font-medium", isActive ? "text-neutral-900 dark:text-white" : "text-neutral-500")}>
                    {t.label}
                  </span>
                  {isActive && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 dark:bg-white">
                      <Check className="h-3 w-3 text-white dark:text-neutral-900" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Ana Renk
          </p>
          <div className="flex flex-wrap gap-3">
            {presetColors.map((color) => {
              const isActive = primaryColor === color.value
              return (
                <button
                  key={color.value}
                  onClick={() => setPrimaryColor(color.value)}
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer",
                    isActive && "ring-2 ring-offset-2 ring-neutral-900 dark:ring-white"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {isActive && <Check className="h-4 w-4 text-white" />}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Önizleme
          </p>
          <div
            className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800"
            style={{ borderColor: primaryColor + "40" }}
          >
            <div className="p-4" style={{ backgroundColor: primaryColor + "10" }}>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                <span className="text-xs font-semibold" style={{ color: primaryColor }}>
                  Kafe Otomasyonu
                </span>
              </div>
              <div className="mb-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-2 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="mt-3 flex gap-2">
                <span className="rounded-md px-2 py-1 text-[10px] font-medium text-white" style={{ backgroundColor: primaryColor }}>
                  Buton
                </span>
                <span className="rounded-md border px-2 py-1 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                  Çıkış
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
