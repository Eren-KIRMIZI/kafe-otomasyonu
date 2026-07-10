"use client"

import { useState } from "react"
import { Printer, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const printerTypes = [
  { value: "kitchen", label: "Mutfak Fişi" },
  { value: "customer", label: "Müşteri Fişi" },
  { value: "report", label: "Rapor" },
]

export function PrinterSettings() {
  const [printers, setPrinters] = useState([
    { id: "1", name: "Mutfak Yazıcısı", type: "kitchen", ip: "192.168.1.100", isActive: true, testResult: null as boolean | null },
    { id: "2", name: "POS Yazıcı", type: "customer", ip: "192.168.1.101", isActive: true, testResult: null as boolean | null },
  ])

  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState("kitchen")
  const [newIp, setNewIp] = useState("")

  const handleToggle = (id: string) => {
    setPrinters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  const handleTest = (id: string) => {
    setPrinters((prev) =>
      prev.map((p) => (p.id === id ? { ...p, testResult: true } : p))
    )
    setTimeout(() => {
      setPrinters((prev) =>
        prev.map((p) => (p.id === id ? { ...p, testResult: null } : p))
      )
    }, 3000)
  }

  const handleAdd = () => {
    if (!newName.trim() || !newIp.trim()) return
    setPrinters((prev) => [
      ...prev,
      { id: String(Date.now()), name: newName, type: newType, ip: newIp, isActive: true, testResult: null },
    ])
    setNewName("")
    setNewIp("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Yazıcı Ayarları</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          {printers.map((printer) => (
            <div
              key={printer.id}
              className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  <Printer className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900 dark:text-neutral-50">{printer.name}</p>
                    <Badge variant="secondary" className="text-[10px]">
                      {printerTypes.find((t) => t.value === printer.type)?.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-400">{printer.ip}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => handleTest(printer.id)} className="gap-1.5">
                  {printer.testResult === true ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : printer.testResult === false ? (
                    <XCircle className="h-3.5 w-3.5 text-red-500" />
                  ) : null}
                  Test
                </Button>
                <Switch
                  checked={printer.isActive}
                  onCheckedChange={() => handleToggle(printer.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">
          <p className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Yeni Yazıcı Ekle
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Input
              placeholder="Yazıcı adı"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Select
              options={printerTypes}
              value={newType}
              onValueChange={setNewType}
            />
            <Input
              placeholder="IP Adresi"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
            />
            <Button onClick={handleAdd} disabled={!newName.trim() || !newIp.trim()}>
              Ekle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
