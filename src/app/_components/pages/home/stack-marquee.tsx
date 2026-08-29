import type { TechnologyName } from '@/@types/technology'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/app/_components/ui/hover-card'
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
        const { icon: Icon, label, style } = TECHNOLOGY_DATA[key]
        return (
          <HoverCard key={key} openDelay={100} closeDelay={0}>
            <HoverCardTrigger asChild>
              <Icon
                tabIndex={ariaHidden ? -1 : 0}
                className={cn(
                  'text-muted-foreground size-10',
                  style?.iconColor
                )}
              />
            </HoverCardTrigger>
            <HoverCardContent className='w-auto px-3 py-1.5 text-sm'>
              {label}
            </HoverCardContent>
          </HoverCard>
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
