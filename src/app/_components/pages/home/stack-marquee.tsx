import type { TechnologyName } from '@/@types/technology'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

const FEATURED_STACK: TechnologyName[] = [
  'typescript',
  'rust',
  'python',
  'node',
  'react',
  'next',
  'tailwind',
  'gsap',
  'docker',
  'postgresql',
  'redis',
  'prisma',
  'langchain',
  'claude',
]

function StackTrack({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className='flex shrink-0 items-center gap-8 pr-8'
      aria-hidden={ariaHidden}>
      {FEATURED_STACK.map((key) => {
        const { icon: Icon, label, style } = TECHNOLOGY_DATA[key]
        return (
          <div
            key={key}
            className='text-muted-foreground flex items-center gap-2 text-sm font-medium whitespace-nowrap'>
            <Icon className={cn('size-5', style?.iconColor)} />
            {label}
          </div>
        )
      })}
    </div>
  )
}

export function StackMarquee({ title }: { title: string }) {
  return (
    <section className='border-border border-t py-12'>
      <h2 className='text-muted-foreground mb-6 text-center text-sm font-semibold tracking-widest uppercase'>
        {title}
      </h2>
      <div className='stack-marquee overflow-hidden'>
        <div className='stack-marquee-track flex w-max'>
          <StackTrack />
          <StackTrack ariaHidden />
        </div>
      </div>
    </section>
  )
}
