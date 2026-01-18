import type { Metadata } from 'next'

import { PorfolioMain } from '@/app/_components/pages/portfolio/portfolio'
import games from '@/data/games.json'

export const metadata: Metadata = {
  title: 'Games',
}

export default function GamesPage() {
  return (
    <>
      {/* Main Content */}
      <PorfolioMain
        header={{
          title: (
            <>
              Meus <span className='text-primary'>Games</span>
            </>
          ),
          description:
            'Uma coleção de jogos desenvolvidos com tecnologias modernas, com foco em mecânicas de gameplay, interações em tempo real e arquitetura bem estruturada.',
        }}
        fallback={{ title: 'Nenhum game encontrado' }}
        works={games}
      />
    </>
  )
}
