import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateStaffSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  role: z.enum(["ADMIN", "CASHIER", "WAITER", "KITCHEN", "BARISTA"]).optional(),
  hourlyRate: z.number().min(0).optional(),
  endDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        user: true,
        shifts: { orderBy: { date: "desc" } },
      },
    })

    if (!staff) {
      return NextResponse.json({ error: "Personel bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(staff)
  } catch (error) {
    return NextResponse.json({ error: "Personel yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateStaffSchema.parse(body)

    const staff = await prisma.staff.findUnique({ where: { id } })
    if (!staff) {
      return NextResponse.json({ error: "Personel bulunamadı" }, { status: 404 })
    }

    const { endDate, ...userData } = data
    const staffUpdateData: any = {}
    if (endDate !== undefined) staffUpdateData.endDate = endDate ? new Date(endDate) : null
    if (data.hourlyRate !== undefined) staffUpdateData.hourlyRate = data.hourlyRate
    if (data.isActive !== undefined) staffUpdateData.isActive = data.isActive

    const [updatedStaff] = await prisma.$transaction([
      prisma.staff.update({
        where: { id },
        data: staffUpdateData,
      }),
      ...(Object.keys(userData).length > 0
        ? [
            prisma.user.update({
              where: { id: staff.userId },
              data: userData,
            }),
          ]
        : []),
    ])

    const result = await prisma.staff.findUnique({
      where: { id },
      include: { user: true },
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Personel güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const staff = await prisma.staff.findUnique({ where: { id } })
    if (!staff) {
      return NextResponse.json({ error: "Personel bulunamadı" }, { status: 404 })
    }

    await prisma.staff.delete({ where: { id } })
    await prisma.user.update({
      where: { id: staff.userId },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Personel silindi" })
  } catch (error) {
    return NextResponse.json({ error: "Personel silinemedi" }, { status: 500 })
  }
}
