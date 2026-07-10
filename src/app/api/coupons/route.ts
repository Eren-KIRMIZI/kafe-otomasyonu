import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCouponSchema = z.object({
  code: z.string().min(3).max(50).transform((v) => v.toUpperCase()),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().min(0).optional(),
  maxUsage: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().datetime(),
  isActive: z.boolean().optional(),
  branchId: z.string().uuid().optional().nullable(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const isActive = searchParams.get("isActive")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (branchId) where.branchId = branchId
    if (isActive !== null) where.isActive = isActive === "true"

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        include: { branch: true },
        orderBy: { expiresAt: "desc" },
        skip,
        take,
      }),
      prisma.coupon.count({ where }),
    ])

    return NextResponse.json({ data: coupons, total })
  } catch (error) {
    return NextResponse.json({ error: "Kuponlar yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createCouponSchema.parse(body)

    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        expiresAt: new Date(data.expiresAt),
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Kupon oluşturulamadı" }, { status: 500 })
  }
}
