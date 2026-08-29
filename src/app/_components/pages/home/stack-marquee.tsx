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
      className='flex shrink-0 items-center gap-10 pr-10'
      aria-hidden={ariaHidden}>
      {FEATURED_STACK.map((key) => {
        const { icon: Icon, style } = TECHNOLOGY_DATA[key]
        return (
          <Icon
            key={key}
            className={cn('text-muted-foreground size-10', style?.iconColor)}
          />
        )
      })}
    </div>
  )
}

export function StackMarquee({ title }: { title: string }) {
  return (
    <section className='py-12'>
      <h2 className='text-muted-foreground mb-6 text-center text-sm font-semibold tracking-widest uppercase'>
        {title}
      </h2>
      <div
        className='stack-marquee overflow-hidden'
        tabIndex={0}
        aria-label={title}>
        <div className='stack-marquee-track flex w-max'>
          <StackTrack />
          <StackTrack ariaHidden />
        </div>
      </div>
    </section>
  )
}
