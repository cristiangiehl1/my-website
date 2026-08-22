import { ExternalLink, Mail, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { __SOCIAL__ } from '@/constants/social'

import { SocialLink } from '../../social-link'

const socialLinks = [
  {
    icon: __SOCIAL__.github.icon,
    label: 'GitHub',
    href: __SOCIAL__.github.href,
  },
  {
    icon: __SOCIAL__.linkedin.icon,
    label: 'LinkedIn',
    href: __SOCIAL__.linkedin.href,
  },
]

export function ContactInfo() {
  const t = useTranslations('contact')

  const contactCards = [
    {
      icon: __SOCIAL__.whatsapp.icon,
      label: t('info.cards.whatsapp.label'),
      value: t('info.cards.whatsapp.value'),
      href: __SOCIAL__.whatsapp.href,
      description: t('info.cards.whatsapp.description'),
    },
    {
      icon: Mail,
      label: t('info.cards.email.label'),
      value: t('info.cards.email.value'),
      href: '#contact-form',
      description: t('info.cards.email.description'),
    },
    {
      icon: MapPin,
      label: t('info.cards.location.label'),
      value: t('info.cards.location.value'),
      href: null,
      description: t('info.cards.location.description'),
    },
  ]

  return (
    <aside className='flex flex-col gap-4'>
      <div>
        <h2 className='text-foreground mb-2 text-2xl font-bold'>
          {t('info.heading')}
        </h2>
        <p className='text-muted-foreground leading-relaxed'>
          {t('info.body')}
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        {contactCards.map((item) => (
          <ContactCard key={item.label} {...item} />
        ))}
      </div>

      <div>
        <h3 className='text-foreground mb-3 text-sm font-semibold tracking-wider uppercase'>
          {t('info.socialsTitle')}
        </h3>
        <div className='flex gap-3'>
          {socialLinks.map(({ href, icon: Icon, label }, i) => (
            <SocialLink key={i} Icon={Icon} href={href} ariaLabel={label} />
          ))}
        </div>
      </div>
    </aside>
  )
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  href: string | null
  description: string
}) {
  const content = (
    <div className='bg-muted/50 border-border hover:border-primary/30 group flex items-start gap-4 rounded-xl border p-4 transition-all'>
      <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg'>
        <Icon className='h-5 w-5' />
      </div>
      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
          {label}
        </span>
        <span className='text-foreground flex items-center gap-1 text-sm font-semibold'>
          {value}
          {href && href !== '#contact-form' && (
            <ExternalLink className='h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100' />
          )}
        </span>
        <span className='text-muted-foreground text-xs'>{description}</span>
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    )
  }

  return content
}
