import { getTranslations } from 'next-intl/server'

import { __PORTFOLIO__ } from '@/data/portfolio'
import { Link } from '@/i18n/navigation'

import { FeaturedProjectsShowcase } from './featured-projects-showcase'

const FEATURED_SLUGS = [
  'orchestrator-agent',
  'gestao-de-despesas',
  'langchain-rag-lab',
] as const

export async function FeaturedProjects({
  title,
  viewAll,
}: {
  title: string
  viewAll: string
}) {
  const t = await getTranslations('portfolio')
  const tHome = await getTranslations('home')

  const items = FEATURED_SLUGS.map((slug) => {
    const project = __PORTFOLIO__.find((p) => p.slug === slug)!
    return {
      slug: project.slug,
      title: t(`projects.${slug}.title`),
      description: t(`projects.${slug}.description`),
      coverUrl: project.coverUrl,
      technologies: project.technologies,
    }
  })

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
      <FeaturedProjectsShowcase
        items={items}
        viewProject={tHome('projects.viewProject')}
      />
    </section>
  )
}
