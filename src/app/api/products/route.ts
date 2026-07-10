import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().uuid(),
  branchId: z.string().uuid(),
  isActive: z.boolean().optional(),
  isFood: z.boolean().optional(),
  isBeverage: z.boolean().optional(),
  preparationTime: z.number().int().positive().optional(),
  sizes: z.array(z.object({
    name: z.string(),
    priceModifier: z.number(),
  })).optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const branchId = searchParams.get("branchId")
    const isActive = searchParams.get("isActive")
    const search = searchParams.get("search")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "100")

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (branchId) where.branchId = branchId
    if (isActive !== null) where.isActive = isActive === "true"
    if (search) where.name = { contains: search, mode: "insensitive" }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, sizes: true },
        orderBy: { name: "asc" },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({ data: products, total })
  } catch (error) {
    return NextResponse.json({ error: "Ürünler yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sizes, ...productData } = createProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        ...productData,
        sizes: sizes ? { create: sizes } : undefined,
      },
      include: { category: true, sizes: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Ürün oluşturulamadı" }, { status: 500 })
  }
}
