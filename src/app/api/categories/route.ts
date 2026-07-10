import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  branchId: z.string().uuid(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")

    const where: any = {}
    if (branchId) where.branchId = branchId

    const categories = await prisma.category.findMany({
      where,
      include: { products: { where: { isActive: true } } },
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Kategoriler yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createCategorySchema.parse(body)

    const category = await prisma.category.create({ data })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Kategori oluşturulamadı" }, { status: 500 })
  }
}
