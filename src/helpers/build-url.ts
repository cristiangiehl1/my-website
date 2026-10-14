import type { Metadata } from 'next'

import { routing } from '@/i18n/routing'

const baseUrl = process.env.BASE_URL!

/** Absolute URL for a path in a locale; the default locale has no prefix. */
export function buildUrl(locale: string, path = ''): string {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  const suffix = path ? `/${path}` : ''
  return `${baseUrl}${prefix}${suffix}`
}

export function buildFeedUrl(locale: string): string {
  return `${buildUrl(locale)}/feed.xml`
}

/** canonical + hreflang (with x-default) + feed discovery for one page. */
export function buildAlternates(
  locale: string,
  path = ''
): NonNullable<Metadata['alternates']> {
  return {
    canonical: buildUrl(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, buildUrl(l, path)])),
      'x-default': buildUrl(routing.defaultLocale, path),
    },
    types: { 'application/rss+xml': buildFeedUrl(locale) },
  }
}
