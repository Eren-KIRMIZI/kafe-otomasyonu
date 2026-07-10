import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "@/auth.config"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      branchId: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    role?: string
    branchId?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.isActive) return null

        // crypto burada güvenli: bu fonksiyon sadece sunucu tarafında çalışır
        const crypto = await import("crypto")
        const [salt, hash] = user.password.split(":")
        const verifyHash = crypto.scryptSync(credentials.password as string, salt, 64).toString("hex")
        if (hash !== verifyHash) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          branchId: user.branchId,
        }
      },
    }),
  ],
})
