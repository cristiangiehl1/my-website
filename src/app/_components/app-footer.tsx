'use client'

import { useTranslations } from 'next-intl'
import type { HTMLAttributes } from 'react'

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
      <p className='text-muted-foreground text-center text-xs'>{t('rights')}</p>
    </footer>
  )
}
