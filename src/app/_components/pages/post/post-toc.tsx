'use client'

import { useTranslations } from 'next-intl'

import type { PostHeading } from '@/helpers/extract-headings'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { cn } from '@/lib/utils'

interface PostTocProps {
  headings: PostHeading[]
  className?: string
}

function scrollToHeading(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function PostToc({ headings, className }: PostTocProps) {
  const t = useTranslations('post')
  const ids = headings.map((heading) => heading.id)
  const activeId = useScrollSpy(ids)

  if (headings.length === 0) return null

  return (
    <nav className={cn('text-sm', className)}>
      <p className='text-muted-foreground mb-3 font-mono text-[0.65rem] tracking-wider uppercase'>
        {t('toc')}
      </p>
      <ul className='border-border space-y-1 border-l'>
        {headings.map((heading) => {
          const isActive = heading.id === activeId
          return (
            <li key={heading.id} className='-ml-px'>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  'block w-full border-l-2 py-1 pl-3 text-left transition-colors',
                  isActive
                    ? 'border-primary text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground border-transparent'
                )}>
                {heading.text}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
