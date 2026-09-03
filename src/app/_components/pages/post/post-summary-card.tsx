'use client'

import { Calendar, Clock, ExternalLink, Github, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'

import type { Project } from '@/@types/project'
import { Badge } from '@/app/_components/ui/badge'
import { Button } from '@/app/_components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface PostSummaryCardProps {
  project: Project & { title: string; minutes: number }
  className?: string
}

export function PostSummaryCard({ project, className }: PostSummaryCardProps) {
  const {
    author,
    createdAt,
    minutes,
    category,
    featured,
    github,
    deploy,
    title,
  } = project
  const t = useTranslations('post')
  const tPortfolio = useTranslations('portfolio')
  const locale = useLocale()

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(createdAt))

  return (
    <div
      className={cn(
        'border-border bg-card shadow-primary/10 relative overflow-hidden rounded-xl border p-4 shadow-lg',
        className
      )}>
      <div className='bg-primary absolute inset-x-0 top-0 h-0.5' />

      <div className='mb-3 flex items-start justify-between gap-2'>
        <span className='text-primary font-mono text-[0.65rem] tracking-wider uppercase'>
          {category}
        </span>
        {featured && (
          <Badge variant='outline' className='shrink-0 gap-1'>
            <Sparkles className='text-primary size-3' />
            {tPortfolio('featured')}
          </Badge>
        )}
      </div>

      <p className='text-foreground mb-4 line-clamp-2 text-sm leading-snug font-semibold'>
        {title}
      </p>

      <Link href='/about' className='group mb-4 flex items-center gap-2.5'>
        <Image
          src={author.avatar || '/placeholder.svg'}
          alt={author.name}
          width={28}
          height={28}
          className='ring-border group-hover:ring-primary/50 shrink-0 rounded-full ring-2 transition-all'
        />
        <p className='text-foreground group-hover:text-primary min-w-0 truncate text-sm font-medium transition-colors'>
          {author.name}
        </p>
      </Link>

      <div className='border-border mb-4 space-y-2 border-t pt-3'>
        <div className='text-muted-foreground flex items-center gap-2 text-xs'>
          <Calendar className='text-primary size-3.5 shrink-0' />
          <time dateTime={createdAt}>{formattedDate}</time>
        </div>
        <div className='text-muted-foreground flex items-center gap-2 text-xs'>
          <Clock className='text-primary size-3.5 shrink-0' />
          {t('readingTime', { minutes })}
        </div>
      </div>

      {(github || deploy) && (
        <div className='flex flex-col gap-2'>
          {deploy && (
            <Button asChild className='w-full'>
              <a href={deploy} target='_blank' rel='noopener noreferrer'>
                <ExternalLink />
                {t('viewDemo')}
              </a>
            </Button>
          )}
          {github && (
            <Button asChild variant='outline' className='w-full'>
              <a href={github} target='_blank' rel='noopener noreferrer'>
                <Github />
                {t('repository')}
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
