import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';

// Auth gerekmez — müşteriler bu endpoint'i kullanır
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")

    const where: { isActive: boolean; branchId?: string } = { isActive: true }
    if (branchId) where.branchId = branchId

    const categories = await prisma.category.findMany({
      where: { isActive: true, ...(branchId ? { branchId } : {}) },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { name: "asc" },
          include: {
            sizes: {
              select: {
                id: true,
                name: true,
                priceModifier: true,
              },
            },
            extras: {
              include: {
                extra: true,
              },
            },
          },
        },
      },
      orderBy: { sortOrder: "asc" },
    })

    const mappedCategories = categories.map(cat => ({
      ...cat,
      products: cat.products.map(prod => ({
        ...prod,
        extraItems: (prod as any).extras,
        extras: undefined
      }))
    }))

    return NextResponse.json(mappedCategories, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    })
  } catch {
    return NextResponse.json({ error: "Menü yüklenemedi" }, { status: 500 })
  }
}
