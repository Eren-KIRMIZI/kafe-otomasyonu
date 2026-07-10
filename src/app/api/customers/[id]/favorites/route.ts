import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const favorites = await prisma.customerFavorite.findMany({
      where: { customerId: id },
      include: { product: { include: { category: true } } },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    return NextResponse.json({ error: "Favoriler yüklenemedi" }, { status: 500 })
  }
}

const addFavoriteSchema = z.object({
  productId: z.string().uuid(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { productId } = addFavoriteSchema.parse(body)

    const favorite = await prisma.customerFavorite.create({
      data: { customerId: id, productId },
      include: { product: true },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Favori eklenemedi" }, { status: 500 })
  }
}

const removeFavoriteSchema = z.object({
  productId: z.string().uuid(),
})

export async function DELETE(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "productId gerekli" }, { status: 400 })
    }

    await prisma.customerFavorite.delete({
      where: { customerId_productId: { customerId: id, productId } },
    })

    return NextResponse.json({ message: "Favori kaldırıldı" })
  } catch (error) {
    return NextResponse.json({ error: "Favori kaldırılamadı" }, { status: 500 })
  }
}
