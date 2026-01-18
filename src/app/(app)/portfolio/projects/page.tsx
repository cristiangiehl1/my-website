import type { Metadata } from 'next'

import { PorfolioMain } from '@/app/_components/pages/portfolio/portfolio'

export const metadata: Metadata = {
  title: 'Projetos',
}

export default function ProjectsPage() {
  return (
    <>
      {/* Main Content */}
      <PorfolioMain
        header={{
          title: 'Projetos',
          description:
            'Desenvolvimento de soluções completas: APIs, landing pages, dashboards e muito mais',
        }}
        fallback={{ title: 'Nenhum projeto encontrado' }}
      />
    </>
  )
}
