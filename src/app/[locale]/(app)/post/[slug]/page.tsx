import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container, MainContainer } from '@/app/_components/container'
import { MarkdownContent } from '@/app/_components/pages/post/markdown-content'
import { PostBackLink } from '@/app/_components/pages/post/post-back-link'
import { PostCardRail } from '@/app/_components/pages/post/post-card-rail'
import { PostFooter } from '@/app/_components/pages/post/post-footer'
import { PostHeader } from '@/app/_components/pages/post/post-header'
import { PostSidebar } from '@/app/_components/pages/post/post-sidebar'
import { __PORTFOLIO__ } from '@/data/portfolio'
import { extractHeadings } from '@/helpers/extract-headings'
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
  const headings = extractHeadings(content)
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
      <MainContainer className='relative max-w-7xl xl:max-w-[96rem]'>
        {/* Below lg: no rail, so the back link renders here instead. From lg
            it moves into PostSidebar, at the end of the contents list. */}
        <PostBackLink className='mb-8 lg:hidden' />

        {/* Grid starts here (not above, with the back link) so both sticky
            rails line up with the cover image instead of with that button. */}
        <div className='lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)_240px] xl:gap-16'>
          <PostSidebar headings={headings} />
          <div className='min-w-0'>
            <PostHeader
              project={{ ...project, title, description, minutes }}
              headings={headings}
            />
            {isFallback && (
              <div className='border-border bg-muted/50 text-muted-foreground mb-6 rounded-lg border px-4 py-3 text-sm'>
                {tPost('fallbackNotice')}
              </div>
            )}
            <MarkdownContent content={content} headings={headings} />
            <PostFooter nearbyProjects={nearbyProjects} />
          </div>
          <PostCardRail project={{ ...project, title, minutes }} />
        </div>
      </MainContainer>
    </Container>
  )
}
