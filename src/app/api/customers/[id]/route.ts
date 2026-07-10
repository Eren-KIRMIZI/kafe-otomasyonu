import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCustomerSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  birthDate: z.string().datetime().optional().nullable(),
  loyaltyPoints: z.number().int().min(0).optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        favorites: { include: { product: true } },
        reservations: { orderBy: { date: "desc" }, take: 10 },
      },
    })

    if (!customer) {
      return NextResponse.json({ error: "Müşteri bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json({ error: "Müşteri yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateCustomerSchema.parse(body)

    const updateData: any = { ...data }
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate)
    }

    const customer = await prisma.customer.update({ where: { id }, data: updateData })
    return NextResponse.json(customer)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Müşteri güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    await prisma.customer.delete({ where: { id } })
    return NextResponse.json({ message: "Müşteri silindi" })
  } catch (error) {
    return NextResponse.json({ error: "Müşteri silinemedi" }, { status: 500 })
  }
}
