import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateInventoryItemSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  currentStock: z.number().min(0).optional(),
  minimumStock: z.number().min(0).optional(),
  maximumStock: z.number().positive().optional().nullable(),
  unitCost: z.number().min(0).optional(),
  supplier: z.string().optional().nullable(),
  supplierPhone: z.string().optional().nullable(),
  expiryDate: z.string().datetime().optional().nullable(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { movements: { orderBy: { createdAt: "desc" }, include: { user: true } } },
    })

    if (!item) {
      return NextResponse.json({ error: "Stok kalemi bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: "Stok kalemi yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateInventoryItemSchema.parse(body)

    const updateData: any = { ...data }
    if (data.expiryDate) updateData.expiryDate = new Date(data.expiryDate)

    const item = await prisma.inventoryItem.update({ where: { id }, data: updateData })
    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Stok kalemi güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    await prisma.inventoryItem.delete({ where: { id } })
    return NextResponse.json({ message: "Stok kalemi silindi" })
  } catch (error) {
    return NextResponse.json({ error: "Stok kalemi silinemedi" }, { status: 500 })
  }
}
