import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MK Black Friday Radar',
  description: 'AI-powered deal discovery platform for North Macedonia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mk">
      <body className="antialiased">{children}</body>
    </html>
  )
}
