'use client'

import Image from 'next/image'
import { useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'

import type { TechnologyName } from '@/@types/technology'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export interface FeaturedProjectItem {
  slug: string
  title: string
  description: string
  coverUrl?: string
  technologies: TechnologyName[]
}

export function FeaturedProjectsShowcase({
  items,
  viewProject,
}: {
  items: FeaturedProjectItem[]
  viewProject: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = items[activeIndex]

  return (
    <div className='border-border bg-card grid overflow-hidden rounded-lg border font-mono md:grid-cols-5'>
      {/* Preview pane */}
      <div className='relative order-2 flex flex-col md:order-2 md:col-span-3'>
        <div className='bg-muted relative h-64 overflow-hidden md:h-full md:min-h-96'>
          <Image
            key={active.slug}
            src={active.coverUrl || '/images/project-placeholder.jpg'}
            alt=''
            fill
            sizes='(min-width: 768px) 60vw, 100vw'
            className='object-cover'
          />
          <div className='from-card absolute inset-0 bg-linear-to-t to-transparent opacity-80' />
          <div className='absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6'>
            <h3 className='text-xl font-bold text-balance'>{active.title}</h3>
            <p className='text-muted-foreground line-clamp-2 text-sm leading-relaxed text-pretty'>
              {active.description}
            </p>
            <div className='flex flex-wrap gap-1.5'>
              {active.technologies.slice(0, 5).map((tech) => {
                const { icon: Icon, label, style } = TECHNOLOGY_DATA[tech]
                return (
                  <span
                    key={tech}
                    className='border-border bg-card/80 text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs backdrop-blur-sm'>
                    <Icon className={cn('size-3.5', style?.iconColor)} />
                    {label}
                  </span>
                )
              })}
            </div>
            <Link
              href={`/post/${active.slug}`}
              className='text-primary group inline-flex w-fit items-center gap-2 text-sm font-medium hover:underline'>
              {viewProject}
              <FaArrowRight className='size-3.5 transition-transform group-hover:translate-x-1' />
            </Link>
          </div>
        </div>
      </div>

      {/* Terminal-style file listing */}
      <div className='border-border order-1 md:order-1 md:col-span-2 md:border-r'>
        <div className='border-border text-muted-foreground border-b px-4 py-3 text-xs'>
          <span className='text-primary'>$</span> ls -la featured_projects/
        </div>
        <ul>
          {items.map((item, i) => {
            const isActive = i === activeIndex
            return (
              <li key={item.slug}>
                <button
                  type='button'
                  onClick={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'border-border flex w-full items-center gap-3 border-b px-4 py-4 text-left text-sm transition-colors last:border-b-0',
                    isActive
                      ? 'bg-primary/10 text-foreground'
                      : 'text-muted-foreground hover:bg-muted/40'
                  )}>
                  <span
                    className={cn(
                      'w-3 text-xs',
                      isActive ? 'text-primary' : 'text-transparent'
                    )}>
                    ▸
                  </span>
                  <span className='flex-1 truncate'>
                    {String(i + 1).padStart(2, '0')}_{item.slug}
                    <span className='text-muted-foreground/60'>.project</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
