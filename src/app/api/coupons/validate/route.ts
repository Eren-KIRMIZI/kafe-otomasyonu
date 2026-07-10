import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const validateCouponSchema = z.object({
  code: z.string().min(1),
  orderAmount: z.number().min(0),
  branchId: z.string().uuid().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, orderAmount, branchId } = validateCouponSchema.parse(body)

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json({ valid: false, error: "Kupon bulunamadı" }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, error: "Kupon pasif" }, { status: 400 })
    }

    if (new Date() > coupon.expiresAt) {
      return NextResponse.json({ valid: false, error: "Kupon süresi dolmuş" }, { status: 400 })
    }

    if (coupon.maxUsage && coupon.currentUsage >= coupon.maxUsage) {
      return NextResponse.json({ valid: false, error: "Kupon kullanım limiti dolmuş" }, { status: 400 })
    }

    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          valid: false,
          error: `Minimum sipariş tutarı ${coupon.minOrderAmount} TL olmalıdır`,
        },
        { status: 400 }
      )
    }

    if (coupon.branchId && branchId && coupon.branchId !== branchId) {
      return NextResponse.json(
        { valid: false, error: "Kupon bu şubede geçerli değil" },
        { status: 400 }
      )
    }

    let discount = 0
    if (coupon.discountType === "PERCENTAGE") {
      discount = (orderAmount * coupon.discountValue) / 100
    } else {
      discount = Math.min(coupon.discountValue, orderAmount)
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Kupon doğrulanamadı" }, { status: 500 })
  }
}
