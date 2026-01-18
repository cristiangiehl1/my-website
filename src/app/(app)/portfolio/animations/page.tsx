import type { Metadata } from 'next'

import { PorfolioMain } from '@/app/_components/pages/portfolio/portfolio'
import animations from '@/data/animations.json'

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
              Minhas <span className='text-primary'>Animações</span>
            </>
          ),
          description:
            'Animações criadas com GSAP para desenvolver interfaces modernas e disruptivas, explorando desde microinterações em componentes simples, como menus, até animações avançadas para carrosséis e experiências altamente interativas.',
        }}
        fallback={{ title: 'Nenhuma animação encontrada' }}
        works={animations}
      />
    </>
  )
}
