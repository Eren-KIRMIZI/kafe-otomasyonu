import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateTableSchema = z.object({
  number: z.number().int().positive().optional(),
  capacity: z.number().int().positive().optional(),
  status: z.enum(["EMPTY", "ORDERED", "WAITING_BILL", "RESERVED"]).optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional(),
  floor: z.number().int().positive().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
          include: { items: { include: { product: true } } },
        },
        reservations: {
          where: { status: { notIn: ["CANCELLED", "COMPLETED"] } },
          include: { customer: true },
        },
      },
    })

    if (!table) {
      return NextResponse.json({ error: "Masa bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(table)
  } catch (error) {
    return NextResponse.json({ error: "Masa yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateTableSchema.parse(body)

    const table = await prisma.table.update({ where: { id }, data })
    return NextResponse.json(table)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Masa güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    await prisma.table.delete({ where: { id } })
    return NextResponse.json({ message: "Masa silindi" })
  } catch (error) {
    return NextResponse.json({ error: "Masa silinemedi" }, { status: 500 })
  }
}
