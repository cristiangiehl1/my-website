import type { MetadataRoute } from 'next'

import { websiteMetadata } from './metadata'

type SitemapEntryWithoutUrl = Omit<MetadataRoute.Sitemap[0], 'url'>

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = websiteMetadata.metadataBase

  const customRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      priority: 1,
    },
    {
      url: `${baseUrl}about`,
      priority: 0.5,
    },
  ]

  const defaultSitemapEntry: SitemapEntryWithoutUrl = {
    changeFrequency: 'yearly',
    lastModified: new Date(),
  }

  const routes = customRoutes.map((route) => ({
    ...defaultSitemapEntry,
    ...route,
  }))

  return routes
}
