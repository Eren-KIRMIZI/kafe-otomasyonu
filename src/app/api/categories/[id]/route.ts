import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    })

    if (!category) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Kategori yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateCategorySchema.parse(body)

    const category = await prisma.category.update({ where: { id }, data })
    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Kategori güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ message: "Kategori silindi" })
  } catch (error) {
    return NextResponse.json({ error: "Kategori silinemedi" }, { status: 500 })
  }
}
