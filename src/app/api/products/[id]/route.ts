import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().url().optional().nullable(),
  categoryId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
  isFood: z.boolean().optional(),
  isBeverage: z.boolean().optional(),
  preparationTime: z.number().int().positive().optional().nullable(),
  sizes: z.array(z.object({
    name: z.string(),
    priceModifier: z.number(),
  })).optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, sizes: true, extras: { include: { extra: true } } },
    })

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Ürün yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { sizes, ...productData } = updateProductSchema.parse(body)

    const updateData: any = { ...productData }

    if (sizes) {
      await prisma.productSize.deleteMany({ where: { productId: id } })
      updateData.sizes = { create: sizes }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true, sizes: true },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: "Ürün silindi" })
  } catch (error) {
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 })
  }
}
