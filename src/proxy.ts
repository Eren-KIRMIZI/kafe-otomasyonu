import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

// Edge Runtime uyumlu — crypto veya Prisma kullanılmıyor
const { auth } = NextAuth(authConfig)

// Müşterilerin giriş yapmadan erişebileceği rotalar (QR menü vb.)
const publicPrefixes = [
  "/login",
  "/qr",           // /qr/masa-[id] gibi rotalar
  "/customer",     // /customer/[tableId]/menu gibi rotalar
  "/api/public",   // Herkese açık API uç noktaları
]

// Sadece çalışanlara özel rotalar
const protectedPrefixes = [
  "/dashboard",
  "/tables",
  "/orders",
  "/kitchen",
  "/barista",
  "/cashier",
  "/menu",
  "/inventory",
  "/staff",
  "/customers",
  "/reservations",
  "/reports",
  "/settings",
]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Önce herkese açık rotaları kontrol et
  const isPublic = publicPrefixes.some((prefix) => pathname.startsWith(prefix))
  if (isPublic) return NextResponse.next()

  // Korumalı rota ise giriş zorunlu
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
