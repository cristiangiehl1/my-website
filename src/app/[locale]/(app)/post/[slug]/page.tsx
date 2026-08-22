import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container, MainContainer } from '@/app/_components/container'
import { MarkdownContent } from '@/app/_components/pages/post/markdown-content'
import { PostFooter } from '@/app/_components/pages/post/post-footer'
import { PostHeader } from '@/app/_components/pages/post/post-header'
import { __PORTFOLIO__ } from '@/data/portfolio'
import { generateReadingTime } from '@/helpers/generate-reading-time'
import { getMarkdown } from '@/helpers/get-markdown'
import { getNearbyProjects } from '@/helpers/get-nearby-projects'
import { getProjectBySlug } from '@/helpers/get-project'
import { routing } from '@/i18n/routing'

interface PostPageParams {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    __PORTFOLIO__.map((project) => ({ locale, slug: project.slug }))
  )
}

export async function generateMetadata({
  params,
}: PostPageParams): Promise<Metadata> {
  const { locale, slug } = await params

  const portfolioItem = getProjectBySlug(slug)
  const t = await getTranslations({ locale, namespace: 'portfolio' })

  return {
    title: t(`projects.${slug}.title`),
    description: t(`projects.${slug}.description`),
    alternates: {
      languages: {
        'pt-BR': `/post/${slug}`,
        'en-US': `/en-US/post/${slug}`,
      },
    },
    openGraph: {
      images: portfolioItem.coverUrl || [],
    },
  }
}

export default async function PostPage({ params }: PostPageParams) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = getProjectBySlug(slug)
  const { content, isFallback } = await getMarkdown(slug, locale)
  const { minutes } = generateReadingTime(content)
  const t = await getTranslations('portfolio')
  const tPost = await getTranslations('post')

  const title = t(`projects.${slug}.title`)
  const description = t(`projects.${slug}.description`)

  const nearbyProjects = getNearbyProjects(slug).map((p) => ({
    ...p,
    title: t(`projects.${p.slug}.title`),
    description: t(`projects.${p.slug}.description`),
  }))

  return (
    <Container>
      <MainContainer className='relative'>
        <PostHeader project={{ ...project, title, description, minutes }} />
        {isFallback && (
          <div className='border-border bg-muted/50 text-muted-foreground mb-6 rounded-lg border px-4 py-3 text-sm'>
            {tPost('fallbackNotice')}
          </div>
        )}
        <MarkdownContent content={content} />
        <PostFooter nearbyProjects={nearbyProjects} />
      </MainContainer>
    </Container>
  )
}
