import './globals.css'

import { Geist, Geist_Mono } from 'next/font/google'

import { websiteMetadata } from './metadata'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = websiteMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen w-full flex-col antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
