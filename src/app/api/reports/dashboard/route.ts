import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const period = searchParams.get("period") || "today"

    const now = new Date()
    let dateFrom: Date
    let dateTo: Date = endOfDay(now)

    switch (period) {
      case "today":
        dateFrom = startOfDay(now)
        break
      case "yesterday":
        dateFrom = startOfDay(subDays(now, 1))
        dateTo = endOfDay(subDays(now, 1))
        break
      case "week":
        dateFrom = startOfWeek(now, { weekStartsOn: 1 })
        break
      case "month":
        dateFrom = startOfMonth(now)
        break
      default:
        dateFrom = startOfDay(now)
    }

    const orderWhere: any = {
      createdAt: { gte: dateFrom, lte: dateTo },
      status: { not: "CANCELLED" },
    }
    if (branchId) orderWhere.branchId = branchId

    const [
      totalOrders,
      completedOrders,
      revenueResult,
      activeTables,
      pendingOrders,
      topProducts,
      ordersByStatus,
      recentPayments,
    ] = await Promise.all([
      prisma.order.count({ where: orderWhere }),
      prisma.order.count({ where: { ...orderWhere, status: "COMPLETED" } }),
      prisma.payment.aggregate({
        where: {
          createdAt: { gte: dateFrom, lte: dateTo },
          ...(branchId ? { order: { branchId } } : {}),
        },
        _sum: { amount: true, tipAmount: true },
      }),
      prisma.table.count({
        where: {
          status: { not: "EMPTY" },
          ...(branchId ? { branchId } : {}),
        },
      }),
      prisma.order.count({
        where: {
          ...orderWhere,
          status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] },
        },
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: { order: orderWhere },
        _sum: { quantity: true, totalPrice: true },
        _count: true,
        orderBy: { _sum: { totalPrice: "desc" } },
        take: 10,
      }),
      prisma.order.groupBy({
        by: ["status"],
        where: orderWhere,
        _count: true,
      }),
      prisma.payment.findMany({
        where: {
          createdAt: { gte: dateFrom, lte: dateTo },
          ...(branchId ? { order: { branchId } } : {}),
        },
        include: { order: { include: { items: { include: { product: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ])

    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (tp) => {
        const product = await prisma.product.findUnique({
          where: { id: tp.productId },
        })
        return {
          product: product?.name || "Bilinmeyen",
          quantity: tp._sum.quantity || 0,
          revenue: tp._sum.totalPrice || 0,
        }
      })
    )

    const totalRevenue = revenueResult._sum.amount || 0
    const totalTips = revenueResult._sum.tipAmount || 0
    const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0

    return NextResponse.json({
      period,
      dateFrom,
      dateTo,
      totalRevenue,
      totalTips,
      totalOrders,
      completedOrders,
      averageOrderValue,
      activeTables,
      pendingOrders,
      topProducts: topProductsWithDetails,
      ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
      recentPayments,
    })
  } catch (error) {
    return NextResponse.json({ error: "Dashboard verisi yüklenemedi" }, { status: 500 })
  }
}
