import { useTranslations } from 'next-intl'

import { TECHNOLOGY_DATA } from '@/constants/technology-data'

import { Badge } from '../../ui/badge'
import { Separator } from '../../ui/separator'

export function AboutExperience() {
  const t = useTranslations('about')

  return (
    <section className='flex flex-col gap-6 pt-16'>
      <Separator className='mb-2' />
      <h2 className='text-foreground text-2xl font-bold tracking-tight'>
        {t('experience.title')}
      </h2>

      <div className='border-border bg-card rounded-xl border p-6'>
        <p className='text-muted-foreground leading-relaxed'>
          {t.rich('experience.p1', {
            b: (c) => <span className='text-foreground font-medium'>{c}</span>,
          })}
        </p>
      </div>

      <div className='border-border bg-card rounded-xl border p-6'>
        <p className='text-muted-foreground leading-relaxed'>
          {t.rich('experience.p2', {
            b: (c) => <span className='text-foreground font-medium'>{c}</span>,
          })}
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
