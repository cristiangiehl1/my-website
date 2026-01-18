'use client'

import { useState } from 'react'

import type { Work } from '@/@types/work'

export function useFilteredWorks(works: Array<Work>) {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [isExactMatchEnable, setIsExactMatchEnable] = useState(true)

  const filteredWorks: Array<Work> =
    selectedTechs.length === 0
      ? works
      : isExactMatchEnable
        ? works.filter((project) =>
            selectedTechs.every((tech) => project.technologies.includes(tech))
          )
        : works.filter((project) =>
            selectedTechs.some((tech) => project.technologies.includes(tech))
          )

  return {
    filteredWorks,
    selectedTechs,
    setSelectedTechs,
    isExactMatchEnable,
    setIsExactMatchEnable,
  }
}
