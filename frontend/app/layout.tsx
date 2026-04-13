export const metadata = {
  title: 'MK Black Friday Radar - Најдобри Понуди во Македонија',
  description: 'AI-powered deal discovery platform for North Macedonia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="mk">
      <body>{children}</body>
    </html>
  )
}
