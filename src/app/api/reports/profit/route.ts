import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const orderWhere: any = {
      status: "COMPLETED",
    }
    if (dateFrom || dateTo) {
      orderWhere.createdAt = {}
      if (dateFrom) orderWhere.createdAt.gte = new Date(dateFrom)
      if (dateTo) orderWhere.createdAt.lte = new Date(dateTo)
    }
    if (branchId) orderWhere.branchId = branchId

    const [orders, inventoryCosts] = await Promise.all([
      prisma.order.findMany({
        where: orderWhere,
        include: {
          items: { include: { product: true } },
          payment: true,
        },
      }),
      prisma.inventoryMovement.findMany({
        where: {
          type: "IN",
          ...(branchId
            ? { inventoryItem: { branchId } }
            : {}),
          ...(dateFrom || dateTo
            ? {
                createdAt: {
                  ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
                  ...(dateTo ? { lte: new Date(dateTo) } : {}),
                },
              }
            : {}),
        },
        include: { inventoryItem: true },
      }),
    ])

    const totalRevenue = orders.reduce((sum, o) => sum + o.finalAmount, 0)
    const totalTax = orders.reduce((sum, o) => sum + o.taxAmount, 0)
    const totalDiscount = orders.reduce((sum, o) => sum + o.discountAmount, 0)
    const totalTips = orders.reduce((sum, o) => sum + (o.payment?.tipAmount || 0), 0)

    const totalCOGS = orders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((itemSum, item) => {
          return itemSum + (item.product as any).unitCost * item.quantity
        }, 0)
      )
    }, 0)

    const inventoryPurchases = inventoryCosts.reduce(
      (sum, m) => sum + m.inventoryItem.unitCost * m.quantity,
      0
    )

    const grossProfit = totalRevenue - totalCOGS
    const netProfit = grossProfit - inventoryPurchases + totalTips

    const profitByCategory: Record<string, { revenue: number; cost: number; profit: number }> = {}
    for (const order of orders) {
      for (const item of order.items) {
        const catName = (item.product as any).category?.name || "Diğer"
        if (!profitByCategory[catName]) {
          profitByCategory[catName] = { revenue: 0, cost: 0, profit: 0 }
        }
        profitByCategory[catName].revenue += item.totalPrice
        const cost = (item.product as any).unitCost * item.quantity
        profitByCategory[catName].cost += cost
        profitByCategory[catName].profit += item.totalPrice - cost
      }
    }

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalCOGS,
        inventoryPurchases,
        totalTax,
        totalDiscount,
        totalTips,
        grossProfit,
        netProfit,
        profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
      },
      profitByCategory: Object.entries(profitByCategory).map(([category, data]) => ({
        category,
        ...data,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Kar-zarar raporu oluşturulamadı" }, { status: 500 })
  }
}
