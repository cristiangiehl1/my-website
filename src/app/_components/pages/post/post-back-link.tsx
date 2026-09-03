'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

interface PostBackLinkProps {
  className?: string
}

// Rendered above the post's rail/content/rail grid on mobile/tablet (not
// inside PostHeader) so the grid's top edge — and both sticky rails — line
// up with the cover image instead of with this button. From lg it moves
// inside PostSidebar instead, after the TOC — styled the same as its items
// (border-l accent, muted → foreground) rather than as a boxed button, so
// it reads as the rail's last entry, not an unrelated control bolted on.
export function PostBackLink({ className }: PostBackLinkProps) {
  const t = useTranslations('post')
  const { back } = useRouter()

  return (
    <button
      onClick={() => back()}
      className={cn(
        'group text-muted-foreground hover:text-foreground hover:border-primary flex items-center gap-2 border-l-2 border-transparent py-1 pl-3 text-sm transition-colors',
        className
      )}>
      <ArrowLeft className='size-4 transition-transform group-hover:-translate-x-1' />
      {t('back')}
    </button>
  )
}
