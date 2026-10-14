import { getTranslations } from 'next-intl/server'

import { __PORTFOLIO__ } from '@/data/portfolio'

import { buildFeedUrl, buildUrl } from './build-url'
import { toIsoDate } from './to-iso-date'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(date: string): string {
  return new Date(`${toIsoDate(date)}T12:00:00Z`).toUTCString()
}

export async function buildFeed(locale: string): Promise<Response> {
  const tMeta = await getTranslations({ locale, namespace: 'meta' })
  const t = await getTranslations({ locale, namespace: 'portfolio' })

  const projects = [...__PORTFOLIO__].sort((a, b) =>
    toIsoDate(b.createdAt).localeCompare(toIsoDate(a.createdAt))
  )

  const lastBuild = projects.length
    ? toRfc822(projects[0].updatedAt ?? projects[0].createdAt)
    : new Date().toUTCString()

  const items = projects
    .map((project) => {
      const url = buildUrl(locale, `post/${project.slug}`)
      return `    <item>
      <title>${escapeXml(t(`projects.${project.slug}.title`))}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(project.createdAt)}</pubDate>
      <description>${escapeXml(t(`projects.${project.slug}.description`))}</description>
      <category>${escapeXml(project.category)}</category>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(tMeta('siteTitle'))}</title>
    <link>${buildUrl(locale)}</link>
    <description>${escapeXml(tMeta('description'))}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${buildFeedUrl(locale)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
