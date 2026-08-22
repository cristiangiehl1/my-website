'use client'

import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import type { Project } from '@/@types/project'
import { Link } from '@/i18n/navigation'

interface NearbyProject extends Project {
  title: string
  description: string
}

interface PostFooterProps {
  nearbyProjects: NearbyProject[]
}

export function PostFooter({ nearbyProjects }: PostFooterProps) {
  const t = useTranslations('post')

  return (
    <footer className='border-border mt-12 border-t pt-8'>
      {nearbyProjects.length > 0 && (
        <div className='mb-10'>
          <h2 className='text-foreground mb-6 text-xl font-semibold'>
            {t('related')}
          </h2>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {nearbyProjects.map((project) => (
              <Link
                key={project.id}
                href={`/post/${project.slug}`}
                className='bg-card border-border hover:border-primary group flex items-center gap-4 rounded-lg border p-4 transition-colors'>
                {project.coverUrl && (
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md'>
                    <Image
                      src={project.coverUrl}
                      alt={project.title}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-110'
                    />
                  </div>
                )}
                <div className='min-w-0'>
                  <h3 className='text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors'>
                    {project.title}
                  </h3>
                  <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
        <Link
          href='/portfolio'
          className='text-muted-foreground hover:text-primary group inline-flex items-center gap-2 text-sm transition-colors'>
          <ArrowLeft />
          <span>{t('backToPortfolio')}</span>
        </Link>

        <p className='text-muted-foreground text-xs'>{t('thanks')}</p>
      </div>
    </footer>
  )
}
