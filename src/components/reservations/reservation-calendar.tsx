"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReservationCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

const HOURS = [
  "10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00",
]

// Mock yoğunluk verisi (0-10)
const MOCK_COUNTS: Record<string, number> = {
  "10:00": 0, "11:00": 1, "12:00": 3, "13:00": 5,
  "14:00": 2, "15:00": 0, "16:00": 1, "17:00": 2,
  "18:00": 4, "19:00": 7, "20:00": 9, "21:00": 3,
}

const TURKISH_DAYS = ["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"]
const TURKISH_MONTHS = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"
]

function getWeekDays(date: Date): Date[] {
  const d = new Date(date)
  const day = d.getDay()
  const monday = new Date(d)
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const nd = new Date(monday)
    nd.setDate(monday.getDate() + i)
    return nd
  })
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
}

function getIntensityClass(count: number, max: number) {
  if (count === 0) return { bar: "bg-neutral-800", text: "text-neutral-600", label: "text-neutral-600" }
  const r = count / max
  if (r < 0.2) return { bar: "bg-emerald-500/40", text: "text-emerald-400", label: "text-emerald-400" }
  if (r < 0.4) return { bar: "bg-emerald-500/70", text: "text-emerald-300", label: "text-emerald-300" }
  if (r < 0.6) return { bar: "bg-amber-500/70", text: "text-amber-300", label: "text-amber-300" }
  if (r < 0.8) return { bar: "bg-orange-500/80", text: "text-orange-300", label: "text-orange-300" }
  return { bar: "bg-red-500/90", text: "text-red-300", label: "text-red-300" }
}

export function ReservationCalendar({ selectedDate, onDateSelect }: ReservationCalendarProps) {
  const today = new Date()
  const weekDays = getWeekDays(selectedDate)
  const maxCount = Math.max(...Object.values(MOCK_COUNTS), 1)

  const navigateWeek = (dir: number) => {
    const next = new Date(selectedDate)
    next.setDate(next.getDate() + dir * 7)
    onDateSelect(next)
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-neutral-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div>
          <h3 className="text-base font-bold text-white">Takvim</h3>
          <p className="text-xs text-neutral-500">
            {TURKISH_MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateWeek(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateWeek(1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 transition-all hover:bg-white/10 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Week Day Selector */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const selected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, today)
            return (
              <motion.button
                key={i}
                onClick={() => onDateSelect(day)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl py-3 px-1 transition-all duration-200 cursor-pointer",
                  selected
                    ? "bg-amber-500 shadow-lg shadow-amber-500/20"
                    : isToday
                    ? "bg-white/10 border border-white/10"
                    : "hover:bg-white/5"
                )}
              >
                <span className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider",
                  selected ? "text-amber-950" : "text-neutral-500"
                )}>
                  {TURKISH_DAYS[i]}
                </span>
                <span className={cn(
                  "text-xl font-black leading-none",
                  selected ? "text-amber-950" : isToday ? "text-white" : "text-neutral-300"
                )}>
                  {day.getDate()}
                </span>
                {isToday && (
                  <div className={cn("h-1 w-1 rounded-full", selected ? "bg-amber-900" : "bg-amber-500")} />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Heatmap */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Saatlik Yoğunluk
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-600">Az</span>
              <div className="flex gap-1">
                {["bg-neutral-800","bg-emerald-500/40","bg-emerald-500/70","bg-amber-500/70","bg-orange-500/80","bg-red-500/90"].map((c,i) => (
                  <div key={i} className={cn("h-2 w-3 rounded-sm", c)} />
                ))}
              </div>
              <span className="text-[10px] text-neutral-600">Çok</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1.5">
            {HOURS.map((hour) => {
              const count = MOCK_COUNTS[hour] ?? 0
              const cls = getIntensityClass(count, maxCount)
              const height = count === 0 ? 8 : 8 + Math.round((count / maxCount) * 40)

              return (
                <motion.div
                  key={hour}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.4, delay: HOURS.indexOf(hour) * 0.03 }}
                  className="flex flex-col items-center gap-1.5"
                  style={{ transformOrigin: "bottom" }}
                >
                  {/* Count badge */}
                  <span className={cn("text-[11px] font-bold", count === 0 ? "text-neutral-700" : cls.text)}>
                    {count}
                  </span>
                  {/* Bar container */}
                  <div className="relative flex h-12 w-full items-end justify-center">
                    <motion.div
                      className={cn("w-full rounded-t-lg transition-all", cls.bar)}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: HOURS.indexOf(hour) * 0.04, ease: "easeOut" }}
                    />
                  </div>
                  {/* Time label */}
                  <span className="text-[9px] font-medium text-neutral-600">
                    {hour.slice(0, 2)}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
