"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Database, Download, Upload, RefreshCw, HardDrive, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const frequencyOptions = [
  { value: "daily", label: "Günlük" },
  { value: "weekly", label: "Haftalık" },
]

export function BackupSettings() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [frequency, setFrequency] = useState("daily")
  const [backingUp, setBackingUp] = useState(false)
  const [lastBackup] = useState("14 Ocak 2024, 03:00")

  const handleManualBackup = () => {
    setBackingUp(true)
    setTimeout(() => setBackingUp(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Yedekleme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <HardDrive className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-50">Son Yedekleme</p>
              <p className="mt-0.5 text-xs text-neutral-400">{lastBackup}</p>
            </div>
          </div>
          <Badge variant="success">Tamamlandı</Badge>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleManualBackup} loading={backingUp} className="gap-2">
            <Download className="h-4 w-4" />
            {backingUp ? "Yedekleniyor..." : "Manuel Yedekle"}
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Yedekten Geri Yükle
          </Button>
          <Button variant="outline" className="gap-2">
            <Database className="h-4 w-4" />
            Veritabanını Dışa Aktar
          </Button>
        </div>

        <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Otomatik Yedekleme
                </p>
                <p className="text-xs text-neutral-400">
                  Belirli aralıklarla otomatik yedekleme yap
                </p>
              </div>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>

          {autoBackup && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <Select
                options={frequencyOptions}
                value={frequency}
                onValueChange={setFrequency}
                label="Yedekleme Sıklığı"
              />
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
