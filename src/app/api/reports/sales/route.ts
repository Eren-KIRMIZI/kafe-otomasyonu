import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const groupBy = searchParams.get("groupBy") || "day"

    const where: any = {
      status: "COMPLETED",
    }
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }
    if (branchId) where.branchId = branchId

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: { include: { product: { include: { category: true } } } },
        payment: true,
      },
      orderBy: { createdAt: "asc" },
    })

    const salesByPeriod: Record<string, { revenue: number; orders: number; items: number }> = {}
    const salesByCategory: Record<string, { revenue: number; quantity: number }> = {}
    const salesByProduct: Record<string, { revenue: number; quantity: number }> = {}

    for (const order of orders) {
      const date = new Date(order.createdAt)
      let key: string

      switch (groupBy) {
        case "hour":
          key = `${date.toISOString().split("T")[0]} ${date.getHours()}:00`
          break
        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          break
        default:
          key = date.toISOString().split("T")[0]
      }

      if (!salesByPeriod[key]) {
        salesByPeriod[key] = { revenue: 0, orders: 0, items: 0 }
      }
      salesByPeriod[key].revenue += order.finalAmount
      salesByPeriod[key].orders += 1

      for (const item of order.items) {
        salesByPeriod[key].items += item.quantity

        const categoryName = item.product.category?.name || "Diğer"
        if (!salesByCategory[categoryName]) {
          salesByCategory[categoryName] = { revenue: 0, quantity: 0 }
        }
        salesByCategory[categoryName].revenue += item.totalPrice
        salesByCategory[categoryName].quantity += item.quantity

        const productName = item.product.name
        if (!salesByProduct[productName]) {
          salesByProduct[productName] = { revenue: 0, quantity: 0 }
        }
        salesByProduct[productName].revenue += item.totalPrice
        salesByProduct[productName].quantity += item.quantity
      }
    }

    const totalRevenue = orders.reduce((sum, o) => sum + o.finalAmount, 0)
    const totalItems = orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0
    )

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrders: orders.length,
        totalItems,
        averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      },
      byPeriod: Object.entries(salesByPeriod).map(([date, data]) => ({ date, ...data })),
      byCategory: Object.entries(salesByCategory).map(([category, data]) => ({
        category,
        ...data,
      })),
      byProduct: Object.entries(salesByProduct)
        .map(([product, data]) => ({ product, ...data }))
        .sort((a, b) => b.revenue - a.revenue),
    })
  } catch (error) {
    return NextResponse.json({ error: "Satış raporu oluşturulamadı" }, { status: 500 })
  }
}
