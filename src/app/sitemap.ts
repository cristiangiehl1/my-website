import type { MetadataRoute } from 'next'

import { __PORTFOLIO__ } from '@/data/portfolio'

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
      url: `${baseUrl}portfolio`,
      priority: 0.5,
    },
  ]

  const defaultSitemapEntry: SitemapEntryWithoutUrl = {
    changeFrequency: 'yearly',
    lastModified: '2026',
  }

  __PORTFOLIO__.forEach((project) =>
    customRoutes.push({
      url: `${baseUrl}post/${project.slug}`,
      priority: 1,
      images: [project.coverUrl ?? '/images/project-placeholder.jpg'],
    })
  )

  const routes = customRoutes.map((route) => ({
    ...defaultSitemapEntry,
    ...route,
  }))

  return routes
}
