'use client'

import { useTranslations } from 'next-intl'
import type { HTMLAttributes } from 'react'

import { __SOCIAL__ } from '@/constants/social'
import { cn } from '@/lib/utils'

interface AppFooterProps extends HTMLAttributes<HTMLElement> {
  className?: string
}

export function AppFooter({ className, ...props }: AppFooterProps) {
  const t = useTranslations('common.footer')
  return (
    <footer
      className={cn('border-border mt-auto w-full border-t py-6', className)}
      {...props}>
      <div className='text-muted-foreground flex flex-col items-center gap-1 text-xs'>
        <a
          href={__SOCIAL__.email.href}
          className='hover:text-primary transition-colors'>
          {__SOCIAL__.email.href.replace('mailto:', '')}
        </a>
        <p>{t('rights')}</p>
      </div>
    </footer>
  )
}
