import fs from 'node:fs/promises'
import path from 'node:path'

export async function getMarkdown(slug: string, locale: string) {
  const dir = path.join('public', 'posts')
  const localized = path.join(dir, `${slug}.en.md`)
  const base = path.join(dir, `${slug}.md`)

  if (locale === 'en-US') {
    try {
      return {
        content: await fs.readFile(localized, 'utf-8'),
        isFallback: false,
      }
    } catch {
      return { content: await fs.readFile(base, 'utf-8'), isFallback: true }
    }
  }
  return { content: await fs.readFile(base, 'utf-8'), isFallback: false }
}
