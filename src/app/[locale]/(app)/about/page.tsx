import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container, MainContainer } from '@/app/_components/container'
import { AboutExperience } from '@/app/_components/pages/about/about-experience'
import { AboutHero } from '@/app/_components/pages/about/about-hero'
import { AboutPersonal } from '@/app/_components/pages/about/about-personal'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('metaTitle') }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

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
