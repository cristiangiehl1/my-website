import type { Metadata } from 'next'

export const siteUrl = process.env.BASE_URL!

export const websiteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),

  generator: 'Next.js',
  applicationName: 'Cristian Giehl Portfolio',

  title: {
    default: 'Cristian Giehl — Full Stack Developer',
    template: '%s | Cristian Giehl',
  },

  description:
    'Portfolio de Cristian Giehl, desenvolvedor Full Stack especializado em React, Next.js, Node.js e automações. Projetos reais, soluções modernas e foco em performance.',

  keywords: [
    'Cristian Giehl',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'Portfolio',
    'Web Development',
  ],

  authors: [
    {
      name: 'Cristian Giehl',
      url: siteUrl,
    },
  ],

  creator: 'Cristian Giehl',
  publisher: 'Cristian Giehl',

  referrer: 'origin-when-cross-origin',

  openGraph: {
    title: 'Cristian Giehl — Full Stack Developer',
    description:
      'Conheça os projetos e experiências de Cristian Giehl. Desenvolvimento web moderno com React, Next.js, Node.js e TypeScript.',
    url: siteUrl,
    siteName: 'Cristian Giehl',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/images/og-img.jpg',
        width: 1200,
        height: 630,
        alt: 'Portfolio de Cristian Giehl',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Cristian Giehl — Full Stack Developer',
    description:
      'Portfolio com projetos reais em React, Next.js, Node.js e TypeScript.',
    creator: '@cristiangiehl',
    images: ['/images/og-img.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/icons/favicon.ico',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
}
