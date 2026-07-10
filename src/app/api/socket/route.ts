import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Socket.io sunucusu ayrı bir process olarak çalışmalıdır",
    note: "socket.io kurulumu için 'npm run socket' komutunu çalıştırın. Bu endpoint sadece bilgi amaçlıdır.",
  })
}
