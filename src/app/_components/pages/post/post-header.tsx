'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

import type { Project } from '@/@types/project'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import type { PostHeading } from '@/helpers/extract-headings'
import { cn } from '@/lib/utils'

import { Button } from '../../ui/button'
import { PostMobileToc } from './post-mobile-toc'
import { PostSummaryCard } from './post-summary-card'

interface PostHeaderProps {
  project: Project & { title: string; description: string; minutes: number }
  headings: PostHeading[]
}

export function PostHeader({ project, headings }: PostHeaderProps) {
  const { description, technologies, title, coverUrl } = project
  const t = useTranslations('post')

  return (
    <header className='mb-10 w-full'>
      {/* Cover image */}
      {coverUrl && (
        <div className='border-border relative mb-8 aspect-16/8 overflow-hidden rounded-xl border'>
          <Image
            src={coverUrl || '/images/project-placeholder.jpg'}
            alt={t('coverAlt', { title })}
            fill
            className='object-cover'
            priority
          />
          <div className='from-background/80 absolute inset-0 bg-linear-to-t via-transparent to-transparent' />
        </div>
      )}

      {/* Title */}
      <h1 className='text-foreground mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
        {title}
      </h1>

      {/* Description */}
      <p className='text-muted-foreground mb-6 text-base leading-relaxed sm:text-lg'>
        {description}
      </p>

      {/* Mobile-only — desktop gets the same contents/card in PostSidebar */}
      {/* Below lg: the rail is gone, so the contents disclosure comes back. */}
      <div className='mb-4 lg:hidden'>
        <PostMobileToc headings={headings} />
      </div>

      {/* Below xl: no room yet for a third (card) column, so it sits here
          instead. From xl the rail's own PostCardRail replaces it. */}
      <div className='mb-6 xl:hidden'>
        <PostSummaryCard project={project} />
      </div>

      {/* Technologies */}
      <div className='mt-6 flex flex-wrap items-center gap-x-4 gap-y-2'>
        {technologies.sort().map((tech, idx) => {
          const { icon: Icon, style, link } = TECHNOLOGY_DATA[tech]
          return (
            <Button key={idx} asChild variant={'outline'}>
              <a href={link} target='_blank'>
                <Icon className={cn(style?.iconColor, 'text-lg')} />
                {tech}
              </a>
            </Button>
          )
        })}
      </div>

      <div className='bg-border mt-8 h-px' />
    </header>
  )
}
