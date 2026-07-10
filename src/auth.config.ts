import type { NextAuthConfig } from "next-auth"

/**
 * Edge Runtime uyumlu auth config.
 * Node.js modülleri (crypto, prisma) kullanılmaz.
 * Middleware (proxy.ts) bu dosyayı kullanır.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        ;(token as Record<string, unknown>).id = user.id
        ;(token as Record<string, unknown>).role = (user as Record<string, unknown>).role
        ;(token as Record<string, unknown>).branchId = (user as Record<string, unknown>).branchId
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = (token as Record<string, unknown>).id as string
        session.user.role = (token as Record<string, unknown>).role as string
        session.user.branchId = (token as Record<string, unknown>).branchId as string
      }
      return session
    },
  },
}
