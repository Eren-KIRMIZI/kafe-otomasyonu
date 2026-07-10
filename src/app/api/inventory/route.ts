import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createInventoryItemSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  currentStock: z.number().min(0).optional(),
  minimumStock: z.number().min(0).optional(),
  maximumStock: z.number().positive().optional().nullable(),
  unitCost: z.number().min(0).optional(),
  supplier: z.string().optional().nullable(),
  supplierPhone: z.string().optional().nullable(),
  expiryDate: z.string().datetime().optional().nullable(),
  branchId: z.string().uuid(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const lowStock = searchParams.get("lowStock")
    const search = searchParams.get("search")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (branchId) where.branchId = branchId
    if (search) where.name = { contains: search, mode: "insensitive" }
    if (lowStock === "true") {
      where.currentStock = { lte: prisma.inventoryItem.fields.minimumStock }
    }

    let items = await prisma.inventoryItem.findMany({
      where,
      include: { movements: { orderBy: { createdAt: "desc" }, take: 5 } },
      orderBy: { name: "asc" },
      skip,
      take,
    })

    if (lowStock === "true") {
      items = items.filter((item) => item.currentStock <= item.minimumStock)
    }

    return NextResponse.json({ data: items, total: items.length })
  } catch (error) {
    return NextResponse.json({ error: "Stok yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createInventoryItemSchema.parse(body)

    const item = await prisma.inventoryItem.create({
      data: {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Stok kalemi oluşturulamadı" }, { status: 500 })
  }
}
