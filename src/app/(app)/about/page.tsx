import type { Metadata } from 'next'

import { Container, MainContainer } from '@/app/_components/container'
import { AboutExperience } from '@/app/_components/pages/about/about-experience'
import { AboutHero } from '@/app/_components/pages/about/about-hero'
import { AboutPersonal } from '@/app/_components/pages/about/about-personal'

export const metadata: Metadata = {
  title: 'Sobre Mim',
}

export default function AboutPage() {
  return (
    <Container>
      <MainContainer className='bg-background min-h-screen'>
        <AboutHero />
        <AboutExperience />
        <AboutPersonal />
      </MainContainer>
    </Container>
  )
}
