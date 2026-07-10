import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const statusTransitions: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["SERVED"],
  SERVED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
}

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "SERVED", "COMPLETED", "CANCELLED"]),
})

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = updateStatusSchema.parse(body)

    const order = await prisma.order.findUnique({ where: { id } })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    const allowed = statusTransitions[order.status]
    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        { error: `${order.status} durumundan ${status} durumuna geçilemez` },
        { status: 400 }
      )
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        table: true,
      },
    })

    if (status === "COMPLETED" && order.tableId) {
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

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Durum güncellenemedi" }, { status: 500 })
  }
}
