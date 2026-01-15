'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface AppFooterProps {
  className?: string
}

export function AppFooter({ className }: AppFooterProps) {
  const pathName = usePathname()

  return (
    <footer
      className={cn(
        'border-border w-full border-t py-6',
        className,
        pathName === '/' ? 'absolute right-0 bottom-0 left-0' : ''
      )}
    >
      <p className='text-muted-foreground text-center text-xs'>
        © 2026 Cristian Giehl
      </p>
    </footer>
  )
}
