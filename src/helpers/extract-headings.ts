import { slugify } from './slugify'

export interface PostHeading {
  id: string
  text: string
}

const H2_LINE = /^##\s+(.+)$/

export function extractHeadings(markdown: string): PostHeading[] {
  const seen = new Map<string, number>()

  return markdown
    .split('\n')
    .map((line) => H2_LINE.exec(line.trim())?.[1])
    .filter((text): text is string => Boolean(text))
    .map((raw) => {
      const text = raw.replace(/[*_`]/g, '').trim()
      const base = slugify(text)
      const occurrence = seen.get(base) ?? 0
      seen.set(base, occurrence + 1)
      return { id: occurrence === 0 ? base : `${base}-${occurrence}`, text }
    })
}
