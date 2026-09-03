import type { PostHeading } from '@/helpers/extract-headings'

import { PostBackLink } from './post-back-link'
import { PostToc } from './post-toc'

interface PostSidebarProps {
  headings: PostHeading[]
}

// Left rail — contents, then the back link at the end. The summary card
// lives in its own right rail (see PostCardRail): on posts with many
// sections the two used to be stacked in one sticky column, and the card
// would run past the bottom of the viewport once the TOC alone was taller
// than the space below it.
export function PostSidebar({ headings }: PostSidebarProps) {
  return (
    <aside className='top-28.5 hidden self-start lg:sticky lg:block'>
      <PostToc headings={headings} />
      <PostBackLink className='mt-6' />
    </aside>
  )
}
