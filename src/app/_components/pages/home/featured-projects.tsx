import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { Project } from '@/@types/project'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { __PORTFOLIO__ } from '@/data/portfolio'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

function getFeaturedProjects(): Project[] {
  return [...__PORTFOLIO__]
    .filter((project) => project.featured)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3)
}

async function ProjectCard({
  project,
  variant,
  className,
}: {
  project: Project
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
        'group border-border bg-card hover:border-primary relative flex flex-col overflow-hidden rounded-lg border transition-colors',
        className
      )}>
      <div
        className={cn(
          'bg-muted relative overflow-hidden',
          isLarge ? 'h-56' : 'h-36'
        )}>
        <Image
          src={project.coverUrl || '/images/project-placeholder.jpg'}
          alt=''
          fill
          sizes='(min-width: 768px) 50vw, 100vw'
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
      </div>
      <div className='flex flex-1 flex-col gap-2 p-5'>
        <h3 className='group-hover:text-primary text-lg font-bold text-balance transition-colors'>
          {title}
        </h3>
        {isLarge && (
          <p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>
            {description}
          </p>
        )}
        <div className='mt-auto flex flex-wrap gap-2 pt-2'>
          {project.technologies.slice(0, maxTech).map((tech) => {
            const { icon: Icon, label, style } = TECHNOLOGY_DATA[tech]
            return (
              <span
                key={tech}
                className='border-border bg-muted/50 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs'>
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
    <section className='border-border border-t py-12'>
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
            variant='large'
            className='md:col-span-2 md:row-span-2'
          />
        )}
        {rest.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
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
