import { Briefcase, Dices, Dumbbell, Monitor } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Separator } from '../../ui/separator'

export function AboutPersonal() {
  const t = useTranslations('about')

  return (
    <section className='flex flex-col gap-6 pt-16 pb-8'>
      <Separator className='mb-2' />
      <h2 className='text-foreground text-2xl font-bold tracking-tight'>
        {t('personal.title')}
      </h2>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='border-border bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 transition-colors'>
          <Briefcase className='text-muted-foreground mt-0.5 h-5 w-5 shrink-0' />
          <p className='text-muted-foreground text-sm leading-relaxed'>
            {t('personal.creditAnalyst')}
          </p>
        </div>

        <div className='border-border bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 transition-colors'>
          <Monitor className='text-primary mt-0.5 h-5 w-5 shrink-0' />
          <p className='text-muted-foreground text-sm leading-relaxed'>
            {t.rich('personal.currentRole', {
              b: (c) => (
                <span className='text-foreground font-medium'>{c}</span>
              ),
            })}
          </p>
        </div>

        <div className='border-border bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 transition-colors'>
          <Dices className='text-primary mt-0.5 h-5 w-5 shrink-0' />
          <p className='text-muted-foreground text-sm leading-relaxed'>
            {t.rich('personal.games', {
              b: (c) => (
                <span className='text-foreground font-medium'>{c}</span>
              ),
            })}
          </p>
        </div>

        <div className='border-border bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 transition-colors'>
          <Dumbbell className='text-primary mt-0.5 h-5 w-5 shrink-0' />
          <p className='text-muted-foreground text-sm leading-relaxed'>
            {t.rich('personal.gym', {
              b: (c) => (
                <span className='text-foreground font-medium'>{c}</span>
              ),
            })}
          </p>
        </div>
      </div>
    </section>
  )
}
