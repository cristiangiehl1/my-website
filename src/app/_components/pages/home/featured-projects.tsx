import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { FaArrowRight } from 'react-icons/fa'

import type { Project } from '@/@types/project'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { __PORTFOLIO__ } from '@/data/portfolio'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const FEATURED_SLUGS = [
  'orchestrator-agent',
  'gestao-de-despesas',
  'langchain-rag-lab',
] as const

function getFeaturedProjects(): Project[] {
  return FEATURED_SLUGS.map(
    (slug) => __PORTFOLIO__.find((project) => project.slug === slug)!
  )
}

async function ProjectCard({
  project,
  index,
  variant,
  className,
}: {
  project: Project
  index: number
  variant: 'large' | 'compact'
  className?: string
}) {
  const t = await getTranslations('portfolio')
  const title = t(`projects.${project.slug}.title`)
  const description = t(`projects.${project.slug}.description`)
  const isLarge = variant === 'large'
  const maxTech = isLarge ? 5 : 3

  return (
    <Link
      href={`/post/${project.slug}`}
      className={cn(
        'group border-border bg-card hover:border-primary hover:shadow-soft-elevated relative flex flex-col overflow-hidden rounded-lg border transition-all',
        className
      )}>
      <div
        className={cn(
          'bg-muted relative overflow-hidden',
          isLarge ? 'h-64' : 'h-40'
        )}>
        <Image
          src={project.coverUrl || '/images/project-placeholder.jpg'}
          alt=''
          fill
          sizes='(min-width: 768px) 50vw, 100vw'
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='from-card absolute inset-0 bg-linear-to-t to-transparent opacity-70' />
        <span className='border-border bg-card/80 text-muted-foreground absolute top-3 left-3 rounded-md border px-2 py-1 font-mono text-xs backdrop-blur-sm'>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className='flex flex-1 flex-col gap-2 p-5'>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='group-hover:text-primary text-lg font-bold text-balance transition-colors'>
            {title}
          </h3>
          <FaArrowRight
            className='text-primary mt-1 size-4 shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100'
            aria-hidden
          />
        </div>
        {isLarge && (
          <p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>
            {description}
          </p>
        )}
        <div className='mt-auto flex flex-wrap gap-1.5 pt-2'>
          {project.technologies.slice(0, maxTech).map((tech) => {
            const { icon: Icon, label, style } = TECHNOLOGY_DATA[tech]
            return (
              <span
                key={tech}
                className='border-border bg-muted/50 text-muted-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1 font-mono text-xs'>
                <Icon className={cn('size-3.5', style?.iconColor)} />
                {label}
              </span>
            )
          })}
        </div>
      </div>
    </Link>
  )
}

export async function FeaturedProjects({
  title,
  viewAll,
}: {
  title: string
  viewAll: string
}) {
  const [main, ...rest] = getFeaturedProjects()

  return (
    <section className='py-12'>
      <div className='mb-8 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <Link
          href='/portfolio'
          className='text-primary text-sm font-medium hover:underline'>
          {viewAll}
        </Link>
      </div>
      <div className='grid gap-6 md:grid-cols-3 md:grid-rows-2'>
        {main && (
          <ProjectCard
            project={main}
            index={0}
            variant='large'
            className='md:col-span-2 md:row-span-2'
          />
        )}
        {rest.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i + 1}
            variant='compact'
            className={
              i === 0
                ? 'md:col-start-3 md:row-start-1'
                : 'md:col-start-3 md:row-start-2'
            }
          />
        ))}
      </div>
    </section>
  )
}
