import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().min(0),
  size: z.string().optional(),
  note: z.string().optional(),
  extras: z.any().optional(),
})

const createOrderSchema = z.object({
  tableId: z.string().uuid().nullable().optional(),
  branchId: z.string().uuid(),
  waiterId: z.string().uuid().nullable().optional(),
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]).optional(),
  customerNote: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const tableId = searchParams.get("tableId")
    const branchId = searchParams.get("branchId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (status) where.status = status
    if (tableId) where.tableId = tableId
    if (branchId) where.branchId = branchId
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true } },
          table: true,
          waiter: true,
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({ data: orders, total })
  } catch (error) {
    return NextResponse.json({ error: "Siparişler yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createOrderSchema.parse(body)

    const totalAmount = data.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    )

    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId },
    })
    const taxAmount = totalAmount * ((branch?.taxRate || 0) / 100)
    const serviceFee = branch?.serviceFee || 0
    const finalAmount = totalAmount + taxAmount + serviceFee

    const order = await prisma.order.create({
      data: {
        tableId: data.tableId || null,
        branchId: data.branchId,
        waiterId: data.waiterId || null,
        orderType: data.orderType || "DINE_IN",
        customerNote: data.customerNote,
        totalAmount,
        taxAmount,
        serviceFee,
        finalAmount,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            size: item.size,
            note: item.note,
            extras: item.extras,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        table: true,
      },
    })

    if (data.tableId) {
      await prisma.table.update({
        where: { id: data.tableId },
        data: { status: "ORDERED" },
      })
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Sipariş oluşturulamadı" }, { status: 500 })
  }
}
