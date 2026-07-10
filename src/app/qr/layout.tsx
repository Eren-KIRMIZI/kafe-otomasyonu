import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Menü | Kafe",
  description: "Menümüzü inceleyin",
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950">
      {children}
    </div>
  )
}
