import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { PorfolioMain } from '@/app/_components/pages/portfolio/portfolio'
import { __PORTFOLIO__ } from '@/data/portfolio'
import { buildAlternates } from '@/helpers/build-url'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  return {
    title: t('metaTitle'),
    alternates: buildAlternates(locale, 'portfolio'),
  }
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Main Content */}
      <PorfolioMain
        items={__PORTFOLIO__.toSorted((a, b) =>
          a.featured === b.featured ? 0 : a.featured ? -1 : 1
        )}
      />
    </>
  )
}
