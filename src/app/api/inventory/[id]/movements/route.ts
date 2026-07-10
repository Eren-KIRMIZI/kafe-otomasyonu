import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const [movements, total] = await Promise.all([
      prisma.inventoryMovement.findMany({
        where: { inventoryItemId: id },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.inventoryMovement.count({ where: { inventoryItemId: id } }),
    ])

    return NextResponse.json({ data: movements, total })
  } catch (error) {
    return NextResponse.json({ error: "Hareketler yüklenemedi" }, { status: 500 })
  }
}

const createMovementSchema = z.object({
  type: z.enum(["IN", "OUT", "WASTE", "ADJUSTMENT"]),
  quantity: z.number().positive(),
  reason: z.string().optional(),
  userId: z.string().uuid().optional(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = createMovementSchema.parse(body)

    const item = await prisma.inventoryItem.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json({ error: "Stok kalemi bulunamadı" }, { status: 404 })
    }

    let newStock = item.currentStock
    switch (data.type) {
      case "IN":
        newStock += data.quantity
        break
      case "OUT":
      case "WASTE":
        if (item.currentStock < data.quantity) {
          return NextResponse.json({ error: "Yetersiz stok" }, { status: 400 })
        }
        newStock -= data.quantity
        break
      case "ADJUSTMENT":
        newStock = data.quantity
        break
    }

    const [movement] = await prisma.$transaction([
      prisma.inventoryMovement.create({
        data: {
          inventoryItemId: id,
          type: data.type,
          quantity: data.quantity,
          reason: data.reason,
          userId: data.userId,
        },
        include: { user: true },
      }),
      prisma.inventoryItem.update({
        where: { id },
        data: { currentStock: newStock },
      }),
    ])

    return NextResponse.json(movement, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Stok hareketi oluşturulamadı" }, { status: 500 })
  }
}
