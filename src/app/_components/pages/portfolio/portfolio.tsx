'use client'

import { useTranslations } from 'next-intl'
import { BiCodeAlt } from 'react-icons/bi'

import type { Project } from '@/@types/project'
import { useFilteredPortfolioItems } from '@/hooks/use-filtered-works'

import { PortfolioFilters } from '../../portfolio-filters'
import { PortfolioMatrix } from './portfolio-matrix'

export function PortfolioHeader() {
  const t = useTranslations('portfolio')

  return (
    <div className='mb-12 space-y-4 text-center'>
      <h1 className='text-5xl font-bold text-balance sm:text-6xl'>
        {t.rich('header.title', {
          hl: (chunks) => <span className='text-primary'>{chunks}</span>,
        })}
      </h1>
      <p className='text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed text-pretty'>
        {t('header.description')}
      </p>
    </div>
  )
}

export function PortfolioEmptyDataFallback() {
  const t = useTranslations('portfolio')

  return (
    <div className='space-y-4 py-10 text-center sm:py-12'>
      <BiCodeAlt size={64} className='text-muted-foreground mx-auto' />
      <h3 className='text-muted-foreground text-2xl font-bold'>
        {t('empty.title')}
      </h3>
      <p className='text-muted-foreground'>{t('empty.hint')}</p>
    </div>
  )
}

interface PorfolioMainProps {
  items: Array<Project>
}

export function PorfolioMain({ items }: PorfolioMainProps) {
  const {
    filteredItems,
    isExactMatchEnable,
    selectedTechs,
    setIsExactMatchEnable,
    setSelectedTechs,
  } = useFilteredPortfolioItems(items)

  return (
    <main className='relative px-4 pt-32 pb-20 sm:px-6 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header */}
        <PortfolioHeader />

        <PortfolioFilters
          items={filteredItems}
          isExactMatchEnable={isExactMatchEnable}
          selectedTechs={selectedTechs}
          setIsExactMatchEnable={setIsExactMatchEnable}
          setSelectedTechs={setSelectedTechs}
        />

        {/* Technology × project matrix, with the selected project alongside */}
        {filteredItems.length > 0 ? (
          <PortfolioMatrix items={filteredItems} />
        ) : (
          <PortfolioEmptyDataFallback />
        )}
      </div>
    </main>
  )
}
