import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get("staffId")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const status = searchParams.get("status")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (staffId) where.staffId = staffId
    if (status) where.status = status
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) where.date.gte = new Date(dateFrom)
      if (dateTo) where.date.lte = new Date(dateTo)
    }

    const [shifts, total] = await Promise.all([
      prisma.shift.findMany({
        where,
        include: { staff: { include: { user: true } } },
        orderBy: { date: "desc" },
        skip,
        take,
      }),
      prisma.shift.count({ where }),
    ])

    return NextResponse.json({ data: shifts, total })
  } catch (error) {
    return NextResponse.json({ error: "Vardiyalar yüklenemedi" }, { status: 500 })
  }
}

const createShiftSchema = z.object({
  staffId: z.string().uuid(),
  date: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createShiftSchema.parse(body)

    const shift = await prisma.shift.create({
      data: { ...data, date: new Date(data.date) },
      include: { staff: { include: { user: true } } },
    })

    return NextResponse.json(shift, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Vardiya oluşturulamadı" }, { status: 500 })
  }
}
