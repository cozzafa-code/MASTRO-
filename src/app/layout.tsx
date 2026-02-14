import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MASTRO — Tutto il tuo lavoro. Un posto solo.',
  description: 'La piattaforma per artigiani italiani',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}