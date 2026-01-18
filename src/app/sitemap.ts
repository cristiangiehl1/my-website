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
    {
      url: `${baseUrl}contact`,
      priority: 0.5,
    },
    {
      url: `${baseUrl}skills`,
      priority: 0.5,
    },
    {
      url: `${baseUrl}portfolio/projects`,
      priority: 0.5,
    },
    {
      url: `${baseUrl}portfolio/animations`,
      priority: 0.5,
    },
    {
      url: `${baseUrl}portfolio/games`,
      priority: 0.5,
    },
  ]

  const defaultSitemapEntry: SitemapEntryWithoutUrl = {
    changeFrequency: 'yearly',
    lastModified: '2026',
  }

  const routes = customRoutes.map((route) => ({
    ...defaultSitemapEntry,
    ...route,
  }))

  return routes
}
