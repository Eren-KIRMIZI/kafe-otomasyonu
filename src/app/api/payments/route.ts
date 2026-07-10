import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (orderId) where.orderId = orderId

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { order: { include: { items: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.payment.count({ where }),
    ])

    return NextResponse.json({ data: payments, total })
  } catch (error) {
    return NextResponse.json({ error: "Ödemeler yüklenemedi" }, { status: 500 })
  }
}

const processPaymentSchema = z.object({
  orderId: z.string().uuid(),
  method: z.enum(["CASH", "CREDIT_CARD", "QR_MEAL_CARD", "MEAL_CARD", "ONLINE"]),
  amount: z.number().positive(),
  discountAmount: z.number().min(0).optional(),
  couponCode: z.string().optional(),
  tipAmount: z.number().min(0).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = processPaymentSchema.parse(body)

    const order = await prisma.order.findUnique({ where: { id: data.orderId } })
    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    if (order.status === "COMPLETED" || order.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Bu sipariş için ödeme yapılamaz" },
        { status: 400 }
      )
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: data.orderId },
    })
    if (existingPayment) {
      return NextResponse.json(
        { error: "Bu sipariş için zaten ödeme yapılmış" },
        { status: 400 }
      )
    }

    const [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          orderId: data.orderId,
          method: data.method,
          amount: data.amount,
          discountAmount: data.discountAmount || 0,
          couponCode: data.couponCode,
          tipAmount: data.tipAmount || 0,
        },
      }),
      prisma.order.update({
        where: { id: data.orderId },
        data: {
          status: "COMPLETED",
          discountAmount: data.discountAmount || 0,
        },
      }),
    ])

    if (order.tableId) {
      const hasActiveOrders = await prisma.order.count({
        where: {
          tableId: order.tableId,
          status: { notIn: ["COMPLETED", "CANCELLED"] },
          id: { not: data.orderId },
        },
      })

      if (hasActiveOrders === 0) {
        await prisma.table.update({
          where: { id: order.tableId },
          data: { status: "EMPTY" },
        })
      }
    }

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Ödeme işlenemedi" }, { status: 500 })
  }
}
