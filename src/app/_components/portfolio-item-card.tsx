'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa6'

import type { Project } from '@/@types/project'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'

interface WorkCardProps {
  item: Project
}

export function PortfolioItemCard({
  item: { slug, featured, coverUrl, technologies, deploy, github },
}: WorkCardProps) {
  const t = useTranslations('portfolio')
  const title = t(`projects.${slug}.title`)
  const description = t(`projects.${slug}.description`)

  const technologiesSize = technologies.length
  const technologiesMoreIndicator = Math.max(technologiesSize - 5, 0)

  return (
    <div className='group bg-card border-border hover:border-primary hover:shadow-primary/20 relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl'>
      {featured && (
        <div className='bg-primary text-primary-foreground absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-bold'>
          {t('featured')}
        </div>
      )}

      {/* Image */}
      <Link
        href={`/post/${slug}`}
        className='bg-muted relative h-48 overflow-hidden'
        aria-label={t('goToPost', { title })}>
        <Image
          src={coverUrl || '/images/project-placeholder.jpg'}
          alt={title}
          fill
          sizes='
                        (min-width: 1280px) 33vw,
                        (min-width: 768px) 50vw,
                        100vw
                      '
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        <div className='from-card absolute inset-0 bg-linear-to-t to-transparent opacity-60' />
      </Link>

      {/* Content */}
      <div className='flex flex-1 flex-col space-y-4 p-6'>
        <h3 className='group-hover:text-primary text-xl font-bold text-balance transition-colors'>
          {title}
        </h3>

        <div>
          <p
            className={cn(
              'text-muted-foreground line-clamp-3 text-sm leading-relaxed text-pretty'
            )}>
            {description}
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          {technologies
            .sort()
            .slice(0, Math.min(technologiesSize, 5))
            .map((tech, idx) => {
              const { icon: Icon, style, link } = TECHNOLOGY_DATA[tech]
              return (
                <Button key={idx} variant={'outline'} asChild>
                  <a href={link} target='_blank'>
                    <Icon className={style?.iconColor} />
                    {tech}
                  </a>
                </Button>
              )
            })}

          {technologiesMoreIndicator > 0 && (
            <p className='text-muted-foreground text-sm'>
              {t('more', { count: technologiesMoreIndicator })}
            </p>
          )}
        </div>

        {/* Actions */}
        {(github || deploy) && (
          <div className='mt-auto flex gap-3 pt-2'>
            {github && (
              <Button
                asChild
                variant='outline'
                size='sm'
                className='hover:bg-primary hover:text-primary-foreground hover:border-primary flex-1 bg-transparent transition-all'>
                <a href={github} target='_blank' rel='noopener noreferrer'>
                  <FaGithub className='mr-2' size={16} />
                  {t('code')}
                </a>
              </Button>
            )}
            {deploy && (
              <Button
                asChild
                size='sm'
                className='bg-primary text-primary-foreground hover:bg-primary/90 flex-1'>
                <a href={deploy} target='_blank' rel='noopener noreferrer'>
                  <FaExternalLinkAlt className='mr-2' size={14} />
                  {t('demo')}
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
