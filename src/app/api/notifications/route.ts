import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const unreadOnly = searchParams.get("unreadOnly")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "50")

    const where: any = {}
    if (userId) where.userId = userId
    if (unreadOnly === "true") where.isRead = false

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
    ])

    return NextResponse.json({ data: notifications, total })
  } catch (error) {
    return NextResponse.json({ error: "Bildirimler yüklenemedi" }, { status: 500 })
  }
}

const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
  data: z.any().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createNotificationSchema.parse(body)

    const notification = await prisma.notification.create({ data })
    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Bildirim oluşturulamadı" }, { status: 500 })
  }
}
