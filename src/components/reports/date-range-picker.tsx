"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const presets = [
  { label: "Bugün", value: "today" },
  { label: "Dün", value: "yesterday" },
  { label: "Bu Hafta", value: "this-week" },
  { label: "Geçen Hafta", value: "last-week" },
  { label: "Bu Ay", value: "this-month" },
  { label: "Geçen Ay", value: "last-month" },
] as const

interface DateRangePickerProps {
  onChange?: (range: { start: Date; end: Date; preset: string }) => void
  className?: string
}

export function DateRangePicker({ onChange, className }: DateRangePickerProps) {
  const [activePreset, setActivePreset] = useState("today")
  const [customOpen, setCustomOpen] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handlePreset = (preset: string) => {
    setActivePreset(preset)
    setCustomOpen(false)
    const now = new Date()
    let start: Date
    let end: Date = new Date(now)

    switch (preset) {
      case "today":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "yesterday":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        end = new Date(start)
        break
      case "this-week": {
        const day = now.getDay()
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (day === 0 ? 6 : day - 1))
        break
      }
      case "last-week": {
        const day = now.getDay()
        const monday = now.getDate() - (day === 0 ? 6 : day - 1)
        start = new Date(now.getFullYear(), now.getMonth(), monday - 7)
        end = new Date(now.getFullYear(), now.getMonth(), monday - 1)
        break
      }
      case "this-month":
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "last-month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        end = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      default:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    onChange?.({ start, end, preset })
  }

  const handleCustomApply = () => {
    if (!startDate || !endDate) return
    setActivePreset("custom")
    onChange?.({
      start: new Date(startDate),
      end: new Date(endDate),
      preset: "custom",
    })
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePreset(preset.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
              activePreset === preset.value
                ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            )}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setCustomOpen(!customOpen)}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
            activePreset === "custom" || customOpen
              ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          Özel Aralık
          <ChevronDown className={cn("h-3 w-3 transition-transform", customOpen && "rotate-180")} />
        </button>
      </div>

      {customOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-end gap-3 overflow-hidden"
        >
          <Input
            type="date"
            label="Başlangıç"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="Bitiş"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button size="sm" onClick={handleCustomApply} disabled={!startDate || !endDate}>
            Uygula
          </Button>
        </motion.div>
      )}
    </div>
  )
}
