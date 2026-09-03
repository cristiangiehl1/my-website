import type { Project } from '@/@types/project'

import { PostSummaryCard } from './post-summary-card'

interface PostCardRailProps {
  project: Project & { title: string; minutes: number }
}

// Right rail — only shown once there's room for three columns (xl+).
// Between lg and xl, PostHeader renders the same card inline instead.
export function PostCardRail({ project }: PostCardRailProps) {
  return (
    <aside className='top-28.5 hidden self-start xl:sticky xl:block'>
      <PostSummaryCard project={project} />
    </aside>
  )
}
