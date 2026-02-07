import type { Metadata } from 'next'

import { Container, MainContainer } from '@/app/_components/container'

export const metadata: Metadata = {
  title: 'Sobre Mim',
}

export default function AboutPage() {
  return (
    <Container>
      <MainContainer>
        <h1>Sobre Mim</h1>
      </MainContainer>
    </Container>
  )
}
