import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface AppFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function AppFooter({ className, ...props }: AppFooterProps) {
  return (
    <footer
      className={cn('border-border mt-auto w-full border-t py-6', className)}
      {...props}>
      <p className='text-muted-foreground text-center text-xs'>
        © 2026 Cristian Giehl
      </p>
    </footer>
  )
}
