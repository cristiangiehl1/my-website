import './globals.css'

import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'

import { websiteMetadata } from './metadata'
import { Providers } from './providers'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
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
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} flex min-h-screen w-full flex-col antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
