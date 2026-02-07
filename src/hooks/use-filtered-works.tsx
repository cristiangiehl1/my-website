'use client'

import { useState } from 'react'

import type { Project } from '@/@types/project'
import type { TechnologyName } from '@/@types/technology'

export function useFilteredPortfolioItems(items: Array<Project>) {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [isExactMatchEnable, setIsExactMatchEnable] = useState(true)

  const filteredItems: Array<Project> =
    selectedTechs.length === 0
      ? items
      : isExactMatchEnable
        ? items.filter((project) =>
            selectedTechs.every((tech) =>
              project.technologies.includes(tech as TechnologyName)
            )
          )
        : items.filter((project) =>
            selectedTechs.some((tech) =>
              project.technologies.includes(tech as TechnologyName)
            )
          )

  return {
    filteredItems,
    selectedTechs,
    setSelectedTechs,
    isExactMatchEnable,
    setIsExactMatchEnable,
  }
}
