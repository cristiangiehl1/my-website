import { ExternalLink, Mail, MapPin } from 'lucide-react'
import React from 'react'

import { __CONTACT__ } from '@/constants/contact'

import { ContactLink } from '../../contact-link'

const contactLinks = [
  {
    icon: __CONTACT__.whatsapp.icon,
    label: 'WhatsApp',
    value: '+55 (21) 99981-5903',
    href: __CONTACT__.whatsapp.href,
    description: 'Respondo rapidamente',
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'Envie pelo formulario',
    href: '#contact-form',
    description: 'Para propostas e projetos',
  },
  {
    icon: MapPin,
    label: 'Localizacao',
    value: 'Itapema/SC, Brasil',
    href: null,
    description: 'Disponivel para trabalho remoto',
  },
]

const socialLinks = [
  {
    icon: __CONTACT__.github.icon,
    label: 'GitHub',
    href: __CONTACT__.github.href,
  },
  {
    icon: __CONTACT__.linkedin.icon,
    label: 'LinkedIn',
    href: __CONTACT__.linkedin.href,
  },
]

export function ContactInfo() {
  return (
    <aside className='flex flex-col gap-4'>
      <div>
        <h2 className='text-foreground mb-2 text-2xl font-bold'>
          Vamos conversar?
        </h2>
        <p className='text-muted-foreground leading-relaxed'>
          Estou disponivel para novos projetos, colaboracoes ou apenas para
          trocar uma ideia sobre tecnologia. Fique a vontade para entrar em
          contato!
        </p>
      </div>

      <div className='flex flex-col gap-4'>
        {contactLinks.map((item) => (
          <ContactCard key={item.label} {...item} />
        ))}
      </div>

      <div>
        <h3 className='text-foreground mb-3 text-sm font-semibold tracking-wider uppercase'>
          Redes sociais
        </h3>
        <div className='flex gap-3'>
          {socialLinks.map(({ href, icon: Icon, label }, i) => (
            <ContactLink key={i} Icon={Icon} href={href} ariaLabel={label} />
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
