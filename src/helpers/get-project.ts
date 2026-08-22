import { notFound } from 'next/navigation'

import { __PORTFOLIO__ } from '@/data/portfolio'

export function getProjectBySlug(slug: string) {
  const project = __PORTFOLIO__.find((item) => item.slug === slug)

  if (!project) {
    notFound()
  }

  return project
}
