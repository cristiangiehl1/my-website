import type { Metadata } from 'next'

import { PorfolioMain } from '@/app/_components/pages/portfolio/portfolio'
import projects from '@/data/projects.json'

export const metadata: Metadata = {
  title: 'Projetos',
}

export default function ProjectsPage() {
  return (
    <>
      {/* Main Content */}
      <PorfolioMain
        header={{
          title: (
            <>
              Meus <span className='text-primary'>Projetos</span>
            </>
          ),
          description:
            'Desenvolvimento de soluções completas: APIs, landing pages, dashboards e muito mais',
        }}
        fallback={{ title: 'Nenhum projeto encontrado' }}
        works={projects}
      />
    </>
  )
}
