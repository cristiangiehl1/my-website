'use client'

import { useState } from 'react'
import { BiCodeAlt } from 'react-icons/bi'

import { ProjectCard } from '@/app/_components/project-card'
import { MultiSelect } from '@/app/_components/ui/multi-select'
import { TECH_OPTIONS } from '@/constants/technology-icon'
import { PROJECTS } from '@/data/projects'

export default function ProjectsPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const filteredProjects =
    selectedFilters.length === 0
      ? PROJECTS
      : PROJECTS.filter((project) =>
          project.technologies.some((tech) => selectedFilters.includes(tech))
        )

  return (
    <>
      {/* Background Elements */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='bg-primary/10 animate-glow absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl' />
        <div
          className='bg-secondary/10 animate-glow absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl'
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className='pointer-events-none fixed inset-0 opacity-20'
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(var(--color-border) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(var(--color-border) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Main Content */}
      <div className='relative px-4 pt-24 pb-16 sm:px-6 lg:px-8'>
        <div className='container mx-auto max-w-7xl'>
          {/* Header */}
          <div className='mb-12 space-y-4 text-center'>
            <h1 className='text-5xl font-bold text-balance sm:text-6xl'>
              Meus <span className='text-primary'>Projetos</span>
            </h1>
            <p className='text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed text-pretty'>
              Desenvolvimento de soluções completas: APIs, landing pages,
              dashboards e muito mais
            </p>
          </div>

          <div className='bg-card/50 border-border mb-12 rounded-lg border p-6 backdrop-blur-sm'>
            <div className='mb-4 flex items-center gap-3'>
              <BiCodeAlt size={24} className='text-primary' />
              <h2 className='text-lg font-semibold'>Filtrar por tecnologias</h2>
            </div>
            <MultiSelect
              options={TECH_OPTIONS}
              value={selectedFilters}
              onValueChange={setSelectedFilters}
              placeholder='Selecione as tecnologias...'
              responsive={true}
            />
            {selectedFilters.length > 0 && (
              <p className='text-muted-foreground mt-3 text-sm'>
                {filteredProjects.length} projeto
                {filteredProjects.length !== 1 ? 's' : ''} encontrado
                {filteredProjects.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Projects Grid */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredProjects.map((project, i) => (
              <ProjectCard key={i} project={project} />
            ))}
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className='space-y-4 py-16 text-center'>
              <BiCodeAlt size={64} className='text-muted-foreground mx-auto' />
              <h3 className='text-muted-foreground text-2xl font-bold'>
                Nenhum projeto encontrado
              </h3>
              <p className='text-muted-foreground'>
                Tente selecionar outras tecnologias
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
