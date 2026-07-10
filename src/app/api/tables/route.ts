import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createTableSchema = z.object({
  number: z.number().int().positive(),
  capacity: z.number().int().positive(),
  branchId: z.string().uuid(),
  status: z.enum(["EMPTY", "ORDERED", "WAITING_BILL", "RESERVED"]).optional(),
  x: z.number().int().optional(),
  y: z.number().int().optional(),
  floor: z.number().int().positive().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const skip = parseInt(searchParams.get("skip") || "0")
    const take = parseInt(searchParams.get("take") || "100")

    const where: any = {}
    if (branchId) where.branchId = branchId

    const [tables, total] = await Promise.all([
      prisma.table.findMany({
        where,
        include: { orders: { where: { status: { not: "COMPLETED" } } } },
        orderBy: { number: "asc" },
        skip,
        take,
      }),
      prisma.table.count({ where }),
    ])

    return NextResponse.json({ data: tables, total })
  } catch (error) {
    return NextResponse.json({ error: "Masalar yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createTableSchema.parse(body)

    const table = await prisma.table.create({ data })
    return NextResponse.json(table, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Masa oluşturulamadı" }, { status: 500 })
  }
}
