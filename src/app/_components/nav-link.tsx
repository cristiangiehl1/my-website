'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { AnchorHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string
  href: string
  handleClick?: () => void
}

export function NavLink({
  href,
  label,
  handleClick,
  className,
  ...props
}: NavLinkProps) {
  const pathName = usePathname()

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'nav-link relative inline-flex items-center gap-2',
        'text-foreground hover:text-primary focus:text-primary transition-colors',
        className,
        pathName === href
          ? 'text-foreground after:scale-100'
          : 'text-muted-foreground'
      )}
      {...props}
    >
      {label}
    </Link>
  )
}
