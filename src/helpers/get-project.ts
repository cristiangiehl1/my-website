import { notFound } from 'next/navigation'

import { __PORTFOLIO__ } from '@/data/portfolio'
import { slugify } from '@/helpers/slugify'

export function getProjectBySlug(slug: string) {
  const project = __PORTFOLIO__.find((item) => slugify(item.title) === slug)

  if (!project) {
    notFound()
  }

  return project
}
