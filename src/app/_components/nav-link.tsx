'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface NavLinkProps {
  label: string
  href: string
  handleClick?: () => void
  className?: string
}

export function NavLink({ href, label, handleClick, className }: NavLinkProps) {
  const pathName = usePathname()

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center gap-2',
        'text-foreground hover:text-primary focus:text-primary transition-colors',
        className,
        pathName === href
          ? 'text-foreground after:scale-100'
          : 'text-muted-foreground'
      )}
    >
      {label}
    </Link>
  )
}
