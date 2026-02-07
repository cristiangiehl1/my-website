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
  const isActive = pathName === href

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'nav-link relative inline-flex items-center gap-2 bg-transparent',
        'text-foreground transition-colors duration-200',
        'hover:text-primary focus-visible:text-primary',
        'focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'rounded-sm px-1 py-0.5',
        isActive && [
          'text-primary font-semibold',
          'after:absolute after:right-0 after:bottom-0 after:left-0',
          'after:bg-primary after:h-0.5 after:rounded-full',
          'after:shadow-[0_0_8px_rgba(var(--primary),0.4)]',
        ],
        className
      )}
      {...props}>
      {label}
    </Link>
  )
}
