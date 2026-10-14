import type { MetadataRoute } from 'next'

import { __PORTFOLIO__ } from '@/data/portfolio'
import { buildUrl } from '@/helpers/build-url'
import { toIsoDate } from '@/helpers/to-iso-date'
import { routing } from '@/i18n/routing'

type SitemapEntry = MetadataRoute.Sitemap[0]

const baseRoutes = ['', 'about', 'contact', 'skills', 'portfolio']

function altLanguages(path: string): Record<string, string> {
  return Object.fromEntries(routing.locales.map((l) => [l, buildUrl(l, path)]))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: SitemapEntry[] = []

  const now = new Date()
  const defaults: Partial<SitemapEntry> = {
    changeFrequency: 'yearly',
    lastModified: now,
  }

  // static routes — both locales
  for (const path of baseRoutes) {
    for (const locale of routing.locales) {
      entries.push({
        ...defaults,
        url: buildUrl(locale, path),
        priority: path === '' ? 1 : 0.5,
        alternates: {
          languages: altLanguages(path),
        },
      })
    }
  }

  // post slugs — both locales
  for (const project of __PORTFOLIO__) {
    const path = `post/${project.slug}`
    for (const locale of routing.locales) {
      entries.push({
        ...defaults,
        lastModified: toIsoDate(project.updatedAt ?? project.createdAt),
        url: buildUrl(locale, path),
        priority: 1,
        images: [project.coverUrl ?? '/images/project-placeholder.jpg'],
        alternates: {
          languages: altLanguages(path),
        },
      })
    }
  }

  return entries
}
