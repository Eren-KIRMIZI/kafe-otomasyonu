import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

const createStaffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "CASHIER", "WAITER", "KITCHEN", "BARISTA"]),
  branchId: z.string().uuid(),
  hourlyRate: z.number().min(0),
  startDate: z.string().datetime(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const role = searchParams.get("role")
    const isActive = searchParams.get("isActive")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (branchId) where.branchId = branchId
    if (role) where.user = { role }
    if (isActive !== null) where.isActive = isActive === "true"

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        include: { user: true, shifts: { orderBy: { date: "desc" }, take: 10 } },
        orderBy: { user: { name: "asc" } },
        skip,
        take,
      }),
      prisma.staff.count({ where }),
    ])

    return NextResponse.json({ data: staff, total })
  } catch (error) {
    return NextResponse.json({ error: "Personel yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createStaffSchema.parse(body)

    const { hourlyRate, startDate, ...userData } = data

    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashPassword(data.password),
      },
    })

    const staff = await prisma.staff.create({
      data: {
        userId: user.id,
        branchId: data.branchId,
        hourlyRate,
        startDate: new Date(startDate),
      },
      include: { user: true },
    })

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Personel oluşturulamadı" }, { status: 500 })
  }
}
