import type { HTMLAttributes } from 'react'
import type { IconType } from 'react-icons'

import { cn } from '@/lib/utils'

interface SocialLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  Icon: IconType
  href: string
  ariaLabel: string
}

export function SocialLink({
  Icon,
  href,
  ariaLabel,
  className,
  ...props
}: SocialLinkProps) {
  return (
    <a
      href={href}
      aria-label={`Navegar para ${ariaLabel}`}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        'bg-muted flex h-12 w-12 transform items-center justify-center rounded-lg',
        'transition-all duration-300',
        'hover:bg-primary hover:text-primary-foreground hover:scale-110',
        className
      )}
      {...props}>
      <Icon size={20} />
    </a>
  )
}
