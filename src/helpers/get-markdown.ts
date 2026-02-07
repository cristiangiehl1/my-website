import fs from 'node:fs/promises'
import path from 'node:path'

export async function getMarkdown(slug: string) {
  const filePath = path.join('public', 'posts', `${slug}.md`)
  return fs.readFile(filePath, 'utf-8')
}
