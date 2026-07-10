"use client"

import { motion } from "framer-motion"
import { Settings2 } from "lucide-react"
import { AppLayout } from "@/components/layout/app-layout"
import { GeneralSettings } from "@/components/settings/general-settings"
import { BranchSettings } from "@/components/settings/branch-settings"
import { PrinterSettings } from "@/components/settings/printer-settings"
import { ThemeSettings } from "@/components/settings/theme-settings"
import { BackupSettings } from "@/components/settings/backup-settings"

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Ayarlar
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            İşletme ayarlarını yönetin
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <GeneralSettings />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <BranchSettings />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <PrinterSettings />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ThemeSettings />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <BackupSettings />
          </motion.div>
        </div>
      </div>
    </AppLayout>
  )
}
