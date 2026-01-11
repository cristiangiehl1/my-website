import type { MetadataRoute } from 'next'

import { websiteMetadata } from './metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: [''],
    },
    host: `${websiteMetadata.metadataBase}`,
    sitemap: `${websiteMetadata.metadataBase}/sitemap.xml`,
  }
}
