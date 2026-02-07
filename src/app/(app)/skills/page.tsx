import type { Metadata } from 'next'

import { Container, MainContainer } from '@/app/_components/container'

export const metadata: Metadata = {
  title: 'Skills',
}

export default function SkillsPage() {
  return (
    <Container>
      <MainContainer>
        <h1>Skills</h1>
      </MainContainer>
    </Container>
  )
}
