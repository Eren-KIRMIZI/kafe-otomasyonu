import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCouponSchema = z.object({
  code: z.string().min(3).max(50).transform((v) => v.toUpperCase()).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().positive().optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxUsage: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: { branch: true },
    })

    if (!coupon) {
      return NextResponse.json({ error: "Kupon bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(coupon)
  } catch (error) {
    return NextResponse.json({ error: "Kupon yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = updateCouponSchema.parse(body)

    const updateData: any = { ...data }
    if (data.expiresAt) updateData.expiresAt = new Date(data.expiresAt)

    const coupon = await prisma.coupon.update({ where: { id }, data: updateData })
    return NextResponse.json(coupon)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Kupon güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params
    await prisma.coupon.delete({ where: { id } })
    return NextResponse.json({ message: "Kupon silindi" })
  } catch (error) {
    return NextResponse.json({ error: "Kupon silinemedi" }, { status: 500 })
  }
}
