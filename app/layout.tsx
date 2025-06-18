import type { Metadata } from 'next'
import './globals.css'
import { TranslationProvider } from '../contexts/TranslationContext'

export const metadata: Metadata = {
  title: 'IA Digital - Transforme Sua Presença Digital',
  description: 'Criação de logotipos, websites e estratégias de marketing digital personalizadas com inteligência artificial',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  )
}
