import { notFound } from 'next/navigation'

import { __AUTHORS__ } from '@/data/authors'

import { slugify } from './slugify'

export function getAuthorBySlug(slug: string) {
  const author = __AUTHORS__.find((author) => slugify(author.name) === slug)

  if (!author) {
    return notFound()
  }

  return author
}
