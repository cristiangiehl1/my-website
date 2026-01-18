'use client'

import { BiCodeAlt } from 'react-icons/bi'

import { useFilteredWorks } from '@/hooks/use-filtered-works'

import { ProjectCard } from '../../project-card'
import { TechnologyFilters } from '../../tecnhology-filter'

interface PortfolioHeanderProps {
  title: string
  description: string
}

export function PortfolioHeader({ title, description }: PortfolioHeanderProps) {
  return (
    <div className='mb-12 space-y-4 text-center'>
      <h1 className='text-5xl font-bold text-balance sm:text-6xl'>
        Meus <span className='text-primary'>{title}</span>
      </h1>
      <p className='text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed text-pretty'>
        {description}
      </p>
    </div>
  )
}

interface PortfolioEmptyDataFallbackProps {
  title: string
}

export function PortfolioEmptyDataFallback({
  title,
}: PortfolioEmptyDataFallbackProps) {
  return (
    <div className='space-y-4 py-10 text-center sm:py-12'>
      <BiCodeAlt size={64} className='text-muted-foreground mx-auto' />
      <h3 className='text-muted-foreground text-2xl font-bold'>{title}</h3>
      <p className='text-muted-foreground'>
        Tente selecionar outras tecnologias
      </p>
    </div>
  )
}

interface PorfolioMainProps {
  header: PortfolioHeanderProps
  fallback: PortfolioEmptyDataFallbackProps
}

export function PorfolioMain({ fallback, header }: PorfolioMainProps) {
  const {
    works,
    isExactMatchEnable,
    selectedTechs,
    setIsExactMatchEnable,
    setSelectedTechs,
  } = useFilteredWorks()

  return (
    <main className='relative px-4 pt-24 pb-16 sm:px-6 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header */}
        <PortfolioHeader
          title={header.title}
          description={header.description}
        />

        <TechnologyFilters
          works={works}
          isExactMatchEnable={isExactMatchEnable}
          selectedTechs={selectedTechs}
          setIsExactMatchEnable={setIsExactMatchEnable}
          setSelectedTechs={setSelectedTechs}
        />

        {/* Works Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {works.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* No Results */}
        {works.length === 0 && (
          <PortfolioEmptyDataFallback title={fallback.title} />
        )}
      </div>
    </main>
  )
}
