"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const currencies = [
  { value: "TRY", label: "₺ - Türk Lirası" },
  { value: "USD", label: "$ - Dolar" },
  { value: "EUR", label: "€ - Euro" },
  { value: "GBP", label: "£ - Sterlin" },
]

const timezones = [
  { value: "Europe/Istanbul", label: "İstanbul (UTC+3)" },
  { value: "Europe/London", label: "Londra (UTC+0/+1)" },
  { value: "Europe/Berlin", label: "Berlin (UTC+1/+2)" },
  { value: "America/New_York", label: "New York (UTC-5/-4)" },
]

export function GeneralSettings() {
  const [taxRate, setTaxRate] = useState("20")
  const [serviceFee, setServiceFee] = useState("10")
  const [currency, setCurrency] = useState("TRY")
  const [timezone, setTimezone] = useState("Europe/Istanbul")
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Genel Ayarlar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Vergi Oranı (%)"
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            icon={<span className="text-xs">%</span>}
          />
          <Input
            label="Servis Ücreti (%)"
            type="number"
            value={serviceFee}
            onChange={(e) => setServiceFee(e.target.value)}
            icon={<span className="text-xs">%</span>}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            label="Para Birimi"
            options={currencies}
            value={currency}
            onValueChange={setCurrency}
          />
          <Select
            label="Saat Dilimi"
            options={timezones}
            value={timezone}
            onValueChange={setTimezone}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} loading={saving} className="gap-2">
            <Save className="h-4 w-4" />
            Kaydet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
