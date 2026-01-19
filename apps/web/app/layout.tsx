import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Hogar - Muebles a tu medida',
    template: '%s | Hogar',
  },
  description:
    'Encuentra los mejores muebles de fabricantes locales en Lima. Visualiza con realidad aumentada y recibe en tu hogar.',
  keywords: [
    'muebles',
    'muebles lima',
    'muebles perú',
    'sofás',
    'comedores',
    'muebles a medida',
    'realidad aumentada',
  ],
  authors: [{ name: 'Hogar' }],
  creator: 'Hogar',
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: 'https://hogar.pe',
    siteName: 'Hogar',
    title: 'Hogar - Muebles a tu medida',
    description:
      'Encuentra los mejores muebles de fabricantes locales en Lima. Visualiza con realidad aumentada y recibe en tu hogar.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hogar - Muebles a tu medida',
    description:
      'Encuentra los mejores muebles de fabricantes locales en Lima.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
