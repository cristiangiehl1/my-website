import { TECHNOLOGY_DATA } from '@/constants/technology-data'

import { Badge } from '../../ui/badge'
import { Separator } from '../../ui/separator'

const skills = [
  'TanStack',
  'shadcn/ui',
  'Zod',
  'Tailwind CSS',
  'Jest',
  'Cypress',
]

export function AboutExperience() {
  return (
    <section className='flex flex-col gap-6 pt-16'>
      <Separator className='mb-2' />
      <h2 className='text-foreground text-2xl font-bold tracking-tight'>
        Experiencia & Stack
      </h2>

      <div className='border-border bg-card rounded-xl border p-6'>
        <p className='text-muted-foreground leading-relaxed'>
          Ao longo da minha trajetoria, adquiri solida experiencia com as
          principais bibliotecas e ferramentas do ecossistema frontend, como{' '}
          <span className='text-foreground font-medium'>TanStack</span>,{' '}
          <span className='text-foreground font-medium'>shadcn/ui</span>,{' '}
          <span className='text-foreground font-medium'>Zod</span> e{' '}
          <span className='text-foreground font-medium'>Tailwind CSS</span>,
          alem da aplicacao consistente de boas praticas de testes, incluindo
          testes unitarios, de integracao e end-to-end, utilizando
          principalmente{' '}
          <span className='text-foreground font-medium'>Jest</span> e, em alguns
          projetos, <span className='text-foreground font-medium'>Cypress</span>
          .
        </p>
      </div>

      <div className='flex flex-wrap gap-2'>
        {Object.values(TECHNOLOGY_DATA).map(
          ({ label, icon: Icon, style, link }) => (
            <a href={link} key={label}>
              <Badge
                variant='outline'
                className='hover:border-primary gap-2 border-2 px-4 py-2 [&>svg]:size-5'>
                <Icon className={style.iconColor} />
                {label}
              </Badge>
            </a>
          )
        )}
      </div>
    </section>
  )
}
