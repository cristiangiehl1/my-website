import type { Project } from '@/@types/project'
import { __PORTFOLIO__ } from '@/data/portfolio'
import { slugify } from '@/helpers/slugify'

export function getNearbyProjects(slug: string, count: number = 4): Project[] {
  const currentIndex = __PORTFOLIO__.findIndex((p) => slugify(p.title) === slug)

  if (currentIndex === -1) return []

  return __PORTFOLIO__
    .map((project, index) => ({
      project,
      index,
      distance: Math.abs(index - currentIndex),
    }))
    .filter((item) => item.distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.project)
}
