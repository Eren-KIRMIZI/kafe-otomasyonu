import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateOrderSchema = z.object({
  tableId: z.string().uuid().nullable().optional(),
  waiterId: z.string().uuid().nullable().optional(),
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]).optional(),
  customerNote: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELLED"]).optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        table: true,
        waiter: true,
        payment: true,
        branch: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: "Sipariş yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateOrderSchema.parse(body)

    const order = await prisma.order.update({
      where: { id },
      data,
      include: {
        items: { include: { product: true } },
        table: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Sipariş güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: { table: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    })

    if (order.tableId) {
      const hasActiveOrders = await prisma.order.count({
        where: {
          tableId: order.tableId,
          status: { notIn: ["COMPLETED", "CANCELLED"] },
          id: { not: id },
        },
      })

      if (hasActiveOrders === 0) {
        await prisma.table.update({
          where: { id: order.tableId },
          data: { status: "EMPTY" },
        })
      }
    }

    return NextResponse.json({ message: "Sipariş iptal edildi" })
  } catch (error) {
    return NextResponse.json({ error: "Sipariş iptal edilemedi" }, { status: 500 })
  }
}
