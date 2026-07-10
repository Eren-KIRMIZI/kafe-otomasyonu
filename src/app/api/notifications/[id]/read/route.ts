import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  _request: Request,
  { params }: { params: Promise<any> }
) {
  try {
    const { id } = await params

    const notification = await prisma.notification.findUnique({ where: { id } })
    if (!notification) {
      return NextResponse.json({ error: "Bildirim bulunamadı" }, { status: 404 })
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Bildirim güncellenemedi" }, { status: 500 })
  }
}
