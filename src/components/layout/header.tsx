"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { Search, Bell, LogOut, User, Settings, Menu, Sun, Moon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

const pageTitles: Record<string, string> = {
  "/dashboard":    "Genel Bakis",
  "/tables":       "Masa Yonetimi",
  "/orders":       "Siparis Olustur",
  "/kitchen":      "Mutfak Ekrani",
  "/barista":      "Barista Ekrani",
  "/cashier":      "Kasa Islemleri",
  "/menu":         "Menu Yonetimi",
  "/inventory":    "Stok Yonetimi",
  "/staff":        "Personel Yonetimi",
  "/customers":    "Musteriler",
  "/reservations": "Rezervasyonlar",
  "/reports":      "Raporlar",
  "/settings":     "Ayarlar",
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = React.useState("")
  const user = session?.user as { name?: string; email?: string; role?: string; image?: string } | undefined

  const pageTitle = Object.entries(pageTitles).find(([key]) =>
    pathname === key || pathname.startsWith(key + "/")
  )?.[1] || "Kafe Otomasyon"

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Menü aramasına yönlendir
      router.push(`/menu?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <Menu size={20} />
      </Button>

      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">{pageTitle}</h1>
      </div>

      <div className="flex-1 max-w-md mx-auto">
        <Input
          placeholder="Menüde ara... (Enter)"
          icon={<Search size={16} />}
          className="h-9 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      <div className="flex items-center gap-1">
        {/* Bildirimler */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          title="Bildirimler"
        >
          <Bell size={18} />
          {/* Sayı dinamik olarak bildirim state'inden gelecek */}
        </Button>

        {/* Kullanıcı menüsü */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full outline-none hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <Avatar src={user?.image} alt={user?.name} size="sm" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name || "Kullanıcı"}</span>
                <span className="text-xs font-normal text-neutral-500">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User size={16} />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings size={16} />
              Ayarlar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600 focus:text-red-600 dark:text-red-400"
            >
              <LogOut size={16} />
              Cikis Yap
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
