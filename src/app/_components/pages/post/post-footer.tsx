'use client'

import { ArrowUpRight } from 'lucide-react'
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

  if (nearbyProjects.length === 0) return null

  return (
    <footer className='border-border mt-12 border-t pt-10'>
      <p className='text-muted-foreground mb-6 font-mono text-[0.65rem] tracking-wider uppercase'>
        {t('related')}
      </p>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        {nearbyProjects.map((project) => (
          <Link
            key={project.id}
            href={`/post/${project.slug}`}
            className='border-border bg-card hover:border-primary/60 group relative overflow-hidden rounded-xl border p-4 transition-colors'>
            <div className='bg-primary absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100' />

            <div className='flex items-center gap-4'>
              {project.coverUrl && (
                <div className='border-border relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border'>
                  <Image
                    src={project.coverUrl}
                    alt={project.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <span className='text-primary font-mono text-[0.6rem] tracking-wider uppercase'>
                  {project.category}
                </span>
                <div className='mt-0.5 flex items-center gap-1.5'>
                  <h3 className='text-foreground group-hover:text-primary truncate text-sm font-semibold transition-colors'>
                    {project.title}
                  </h3>
                  <ArrowUpRight className='text-primary size-3.5 shrink-0 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100' />
                </div>
                <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                  {project.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </footer>
  )
}
