import { Briefcase, Dices, Dumbbell, Monitor } from 'lucide-react'

import { Separator } from '../../ui/separator'

export function AboutPersonal() {
  return (
    <section className='flex flex-col gap-6 pt-16 pb-8'>
      <Separator className='mb-2' />
      <h2 className='text-foreground text-2xl font-bold tracking-tight'>
        Sobre
      </h2>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='border-border bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 transition-colors'>
          <Briefcase className='text-muted-foreground mt-0.5 h-5 w-5 shrink-0' />
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Ex-analista de credito no mercado financeiro e corretor de imoveis.
          </p>
        </div>

        <div className='border-border bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 transition-colors'>
          <Monitor className='text-primary mt-0.5 h-5 w-5 shrink-0' />
          <p className='text-muted-foreground text-sm leading-relaxed'>
            <span className='text-foreground font-medium'>
              Fullstack Developer
            </span>{' '}
            — construindo interfaces e backends robustos.
          </p>
        </div>

        <div className='border-border bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 transition-colors'>
          <Dices className='text-secondary mt-0.5 h-5 w-5 shrink-0' />
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Entusiasta de{' '}
            <span className='text-foreground font-medium'>Games e RPG</span>.
          </p>
        </div>

        <div className='border-border bg-card hover:border-primary/40 flex items-start gap-3 rounded-xl border p-5 transition-colors'>
          <Dumbbell className='text-primary mt-0.5 h-5 w-5 shrink-0' />
          <p className='text-muted-foreground text-sm leading-relaxed'>
            <span className='text-foreground font-medium'>Gym rat</span> — foco
            tambem na saude e bem-estar.
          </p>
        </div>
      </div>
    </section>
  )
}
