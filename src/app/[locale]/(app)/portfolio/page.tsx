import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { PorfolioMain } from '@/app/_components/pages/portfolio/portfolio'
import { __PORTFOLIO__ } from '@/data/portfolio'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  return { title: t('metaTitle') }
}

export default function PortfolioPage() {
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
