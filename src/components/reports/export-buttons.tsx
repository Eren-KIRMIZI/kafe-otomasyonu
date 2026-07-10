"use client"

import { FileText, FileSpreadsheet, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExportButtonsProps {
  onExportPDF?: () => void
  onExportExcel?: () => void
  onPrint?: () => void
}

export function ExportButtons({ onExportPDF, onExportExcel, onPrint }: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onExportPDF}
        className="gap-1.5"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onExportExcel}
        className="gap-1.5"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onPrint}
        className="gap-1.5"
      >
        <Printer className="h-4 w-4" />
        Yazdır
      </Button>
    </div>
  )
}
