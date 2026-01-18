'use client'

import { useState } from 'react'

import type { Work } from '@/@types/work'
import projects from '@/data/projects.json'

export function useFilteredWorks() {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [isExactMatchEnable, setIsExactMatchEnable] = useState(true)

  const filteredWorks: Array<Work> =
    selectedTechs.length === 0
      ? projects
      : isExactMatchEnable
        ? projects.filter((project) =>
            selectedTechs.every((tech) => project.technologies.includes(tech))
          )
        : projects.filter((project) =>
            selectedTechs.some((tech) => project.technologies.includes(tech))
          )

  return {
    works: filteredWorks,
    selectedTechs,
    setSelectedTechs,
    isExactMatchEnable,
    setIsExactMatchEnable,
  }
}
