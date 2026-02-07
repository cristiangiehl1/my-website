import type { Metadata } from 'next'

import { Container, MainContainer } from '@/app/_components/container'

export const metadata: Metadata = {
  title: 'Contato',
}

export default function ContactPage() {
  return (
    <Container>
      <MainContainer>
        <h1>Contato</h1>
      </MainContainer>
    </Container>
  )
}
