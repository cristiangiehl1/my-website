'use client'

import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { PostHeading } from '@/helpers/extract-headings'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { cn } from '@/lib/utils'

interface PostMobileTocProps {
  headings: PostHeading[]
  className?: string
}

function scrollToHeading(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function PostMobileToc({ headings, className }: PostMobileTocProps) {
  const t = useTranslations('post')
  const ids = headings.map((heading) => heading.id)
  const activeId = useScrollSpy(ids)
  const activeHeading = headings.find((heading) => heading.id === activeId)

  if (headings.length === 0) return null

  return (
    <details className={cn('group', className)}>
      <summary className='border-border bg-card flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm marker:content-none'>
        <span className='truncate'>
          {t('toc')}
          {activeHeading && (
            <span className='text-muted-foreground'>
              {' '}
              — {activeHeading.text}
            </span>
          )}
        </span>
        <ChevronDown className='size-4 shrink-0 transition-transform group-open:rotate-180' />
      </summary>
      <ul className='border-border rounded-b-lg border-x border-t-0 border-b px-4 py-2'>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className='border-border/60 border-b py-2 last:border-b-0'>
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                'text-left transition-colors',
                heading.id === activeId
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}>
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </details>
  )
}
