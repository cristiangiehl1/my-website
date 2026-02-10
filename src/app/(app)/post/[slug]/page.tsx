import type { Metadata } from 'next'

import { Container, MainContainer } from '@/app/_components/container'
import { MarkdownContent } from '@/app/_components/pages/post/markdown-content'
import { PostFooter } from '@/app/_components/pages/post/post-footer'
import { PostHeader } from '@/app/_components/pages/post/post-header'
import { generateReadingTime } from '@/helpers/generate-reading-time'
import { getMarkdown } from '@/helpers/get-markdown'
import { getProjectBySlug } from '@/helpers/get-project'

interface PostPageParams {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PostPageParams): Promise<Metadata> {
  const { slug } = await params

  const portfolioItem = getProjectBySlug(slug)

  return {
    title: portfolioItem.title,
    description: portfolioItem.description,
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

  return (
    <Container>
      <MainContainer className='relative'>
        <PostHeader project={{ ...project, readTime: text }} />
        <MarkdownContent content={content} />
        <PostFooter />
      </MainContainer>
    </Container>
  )
}
