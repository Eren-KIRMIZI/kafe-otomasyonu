import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateReservationSchema = z.object({
  tableId: z.string().uuid().nullable().optional(),
  date: z.string().datetime().optional(),
  time: z.string().optional(),
  partySize: z.number().int().positive().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  note: z.string().optional().nullable(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { customer: true, table: true, branch: true },
    })

    if (!reservation) {
      return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    return NextResponse.json({ error: "Rezervasyon yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateReservationSchema.parse(body)

    const updateData: any = { ...data }
    if (data.date) updateData.date = new Date(data.date)

    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
      include: { customer: true, table: true },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Rezervasyon güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    await prisma.reservation.delete({ where: { id } })
    return NextResponse.json({ message: "Rezervasyon silindi" })
  } catch (error) {
    return NextResponse.json({ error: "Rezervasyon silinemedi" }, { status: 500 })
  }
}
