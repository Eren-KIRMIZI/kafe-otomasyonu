"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  TableProperties,
  ShoppingCart,
  ChefHat,
  Coffee,
  CreditCard,
  UtensilsCrossed,
  Package,
  Users,
  UserCheck,
  Calendar,
  BarChart3,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { UserRole } from "@/types"
import { useSession } from "next-auth/react"

interface SidebarItem {
  label: string
  icon: React.ReactNode
  href: string
  roles: UserRole[]
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard", roles: [UserRole.ADMIN] },
  { label: "Masa Yönetimi", icon: <TableProperties size={20} />, href: "/tables", roles: [UserRole.ADMIN, UserRole.WAITER] },
  { label: "Siparişler", icon: <ShoppingCart size={20} />, href: "/orders", roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER] },
  { label: "Mutfak", icon: <ChefHat size={20} />, href: "/kitchen", roles: [UserRole.ADMIN, UserRole.KITCHEN] },
  { label: "Barista", icon: <Coffee size={20} />, href: "/barista", roles: [UserRole.ADMIN, UserRole.BARISTA] },
  { label: "Kasiyer", icon: <CreditCard size={20} />, href: "/cashier", roles: [UserRole.ADMIN, UserRole.CASHIER] },
  { label: "Menü", icon: <UtensilsCrossed size={20} />, href: "/menu", roles: [UserRole.ADMIN] },
  { label: "Stok Yönetimi", icon: <Package size={20} />, href: "/inventory", roles: [UserRole.ADMIN] },
  { label: "Personel", icon: <Users size={20} />, href: "/staff", roles: [UserRole.ADMIN] },
  { label: "Müşteriler", icon: <UserCheck size={20} />, href: "/customers", roles: [UserRole.ADMIN, UserRole.CASHIER] },
  { label: "Rezervasyonlar", icon: <Calendar size={20} />, href: "/reservations", roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER] },
  { label: "Raporlar", icon: <BarChart3 size={20} />, href: "/reports", roles: [UserRole.ADMIN] },
  { label: "Ayarlar", icon: <Settings size={20} />, href: "/settings", roles: [UserRole.ADMIN] },
]

const roleBadgeColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  [UserRole.CASHIER]: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  [UserRole.WAITER]: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  [UserRole.KITCHEN]: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  [UserRole.BARISTA]: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
}

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Yönetici",
  [UserRole.CASHIER]: "Kasiyer",
  [UserRole.WAITER]: "Garson",
  [UserRole.KITCHEN]: "Aşçıbaşı",
  [UserRole.BARISTA]: "Barista",
}

interface SidebarProps {
  open: boolean
  onClose: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ open, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user as { name?: string; email?: string; role?: UserRole; image?: string } | undefined
  const role = user?.role || UserRole.ADMIN

  const filteredItems = sidebarItems.filter((item) => item.roles.includes(role))

  const linkContent = (item: SidebarItem, isActive: boolean) => (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
          : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        collapsed && "justify-center px-2"
      )}
    >
      {item.icon}
      {!collapsed && <span>{item.label}</span>}
    </div>
  )

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-950">
      <div className={cn("flex h-20 items-center gap-3 border-b border-neutral-200 px-4 dark:border-neutral-800", collapsed && "justify-center px-2")}>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white/5">
          <img src="/images/AnaLogo.png" alt="Coppie Logo" className="h-full w-full object-contain drop-shadow-lg" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-base font-bold text-neutral-900 dark:text-white leading-tight">Kafe Otomasyon</p>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Yönetim Paneli</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          if (collapsed) {
            return (
              <Link key={item.href} href={item.href} onClick={onClose} title={item.label}>
                {linkContent(item, isActive)}
              </Link>
            )
          }
          return (
            <Link key={item.href} href={item.href} onClick={onClose}>
              {linkContent(item, isActive)}
            </Link>
          )
        })}
      </nav>

      {!collapsed && user && (
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Avatar src={user.image} alt={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate dark:text-white">{user.name || "Kullanıcı"}</p>
              <p className="text-xs text-neutral-500 truncate dark:text-neutral-400">{user.email}</p>
            </div>
            <Badge className={cn("text-[10px] px-2 py-0.5", roleBadgeColors[role])}>
              {roleLabels[role]}
            </Badge>
          </div>
        </div>
      )}

      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center h-10 border-t border-neutral-200 text-neutral-400 hover:text-neutral-900 dark:border-neutral-800 dark:hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      )}
    </div>
  )

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen sticky top-0 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
          "transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-64 shadow-xl lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
