import type { Metadata } from 'next'

import { PorfolioMain } from '@/app/_components/pages/portfolio/portfolio'
import { __PORTFOLIO__ } from '@/data/portfolio'

export const metadata: Metadata = {
  title: 'Portfólio',
}

export default function PortfolioPage() {
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
            'Desenvolvimento de soluções completas: APIs, landing pages, games e muito mais',
        }}
        fallback={{ title: 'Nenhum projeto encontrado' }}
        items={__PORTFOLIO__.toSorted((a, b) =>
          a.featured === b.featured ? 0 : a.featured ? -1 : 1
        )}
      />
    </>
  )
}
