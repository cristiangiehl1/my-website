import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Container, MainContainer } from '@/app/_components/container'
import { MarkdownContent } from '@/app/_components/pages/post/markdown-content'
import { PostFooter } from '@/app/_components/pages/post/post-footer'
import { PostHeader } from '@/app/_components/pages/post/post-header'
import { generateReadingTime } from '@/helpers/generate-reading-time'
import { getMarkdown } from '@/helpers/get-markdown'
import { getNearbyProjects } from '@/helpers/get-nearby-projects'
import { getProjectBySlug } from '@/helpers/get-project'

interface PostPageParams {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PostPageParams): Promise<Metadata> {
  const { slug } = await params

  const portfolioItem = getProjectBySlug(slug)
  const t = await getTranslations('portfolio')

  return {
    title: t(`projects.${slug}.title`),
    description: t(`projects.${slug}.description`),
    openGraph: {
      images: portfolioItem.coverUrl || [],
    },
  }
}

export default async function PostPage({ params }: PostPageParams) {
  const { slug } = await params

  const project = getProjectBySlug(slug)
  const content = await getMarkdown(slug)
  const { text } = generateReadingTime(content)
  const t = await getTranslations('portfolio')

  const title = t(`projects.${slug}.title`)
  const description = t(`projects.${slug}.description`)

  return (
    <Container>
      <MainContainer className='relative'>
        <PostHeader
          project={{ ...project, title, description, readTime: text }}
        />
        <MarkdownContent content={content} />
        <PostFooter
          nearbyProjects={getNearbyProjects(slug)}
          getTitle={(s) => t(`projects.${s}.title`)}
          getDescription={(s) => t(`projects.${s}.description`)}
        />
      </MainContainer>
    </Container>
  )
}
