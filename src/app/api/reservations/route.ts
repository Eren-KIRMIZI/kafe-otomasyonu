import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createReservationSchema = z.object({
  customerId: z.string().uuid(),
  tableId: z.string().uuid().nullable().optional(),
  branchId: z.string().uuid(),
  date: z.string().datetime(),
  time: z.string(),
  partySize: z.number().int().positive(),
  note: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const status = searchParams.get("status")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (branchId) where.branchId = branchId
    if (status) where.status = status
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) where.date.gte = new Date(dateFrom)
      if (dateTo) where.date.lte = new Date(dateTo)
    }

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: { customer: true, table: true, branch: true },
        orderBy: { date: "asc" },
        skip,
        take,
      }),
      prisma.reservation.count({ where }),
    ])

    return NextResponse.json({ data: reservations, total })
  } catch (error) {
    return NextResponse.json({ error: "Rezervasyonlar yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createReservationSchema.parse(body)

    const reservation = await prisma.reservation.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
      include: { customer: true, table: true },
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Rezervasyon oluşturulamadı" }, { status: 500 })
  }
}
