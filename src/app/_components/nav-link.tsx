'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

interface NavLinkProps {
  label: string
  href: string
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathName = usePathname()

  return (
    <Link
      href={href}
      className={cn(
        'text-foreground hover:text-primary transition-colors',
        pathName === href ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      {label}
    </Link>
  )
}
