import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")

    if (!branchId) {
      return NextResponse.json({ error: "branchId gerekli" }, { status: 400 })
    }

    const settings = await prisma.setting.findMany({
      where: { branchId },
      orderBy: { key: "asc" },
    })

    const settingsObject: Record<string, string> = {}
    for (const setting of settings) {
      settingsObject[setting.key] = setting.value
    }

    return NextResponse.json(settingsObject)
  } catch (error) {
    return NextResponse.json({ error: "Ayarlar yüklenemedi" }, { status: 500 })
  }
}

const updateSettingsSchema = z.record(z.string(), z.string())

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")

    if (!branchId) {
      return NextResponse.json({ error: "branchId gerekli" }, { status: 400 })
    }

    const body = await request.json()
    const data = updateSettingsSchema.parse(body)

    const upserts = Object.entries(data).map(([key, value]) =>
      prisma.setting.upsert({
        where: { branchId_key: { branchId, key } },
        create: { branchId, key, value },
        update: { value },
      })
    )

    await prisma.$transaction(upserts)

    const settings = await prisma.setting.findMany({
      where: { branchId },
      orderBy: { key: "asc" },
    })

    const settingsObject: Record<string, string> = {}
    for (const setting of settings) {
      settingsObject[setting.key] = setting.value
    }

    return NextResponse.json(settingsObject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 })
  }
}
