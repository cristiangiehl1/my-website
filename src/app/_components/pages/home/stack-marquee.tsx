import type { TechnologyName } from '@/@types/technology'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

import { StackMarqueeIcon } from './stack-marquee-icon'

const ALL_TECHNOLOGIES = Object.keys(TECHNOLOGY_DATA) as TechnologyName[]
const SPLIT_AT = Math.ceil(ALL_TECHNOLOGIES.length / 2)
const STACK_ROWS = [
  ALL_TECHNOLOGIES.slice(0, SPLIT_AT),
  ALL_TECHNOLOGIES.slice(SPLIT_AT),
]

function StackTrack({
  items,
  ariaHidden,
}: {
  items: TechnologyName[]
  ariaHidden?: boolean
}) {
  return (
    <div
      className='flex shrink-0 items-center gap-10 pr-10'
      aria-hidden={ariaHidden}>
      {items.map((key) => {
        const { icon: Icon, label, style } = TECHNOLOGY_DATA[key]
        return (
          <StackMarqueeIcon
            key={key}
            iconColorClassName={style?.iconColor}
            tabIndex={ariaHidden ? -1 : 0}
            aria-label={label}>
            <Icon
              className={cn('text-muted-foreground size-10', style?.iconColor)}
            />
          </StackMarqueeIcon>
        )
      })}
    </div>
  )
}

function StackRow({
  items,
  reverse,
  label,
}: {
  items: TechnologyName[]
  reverse?: boolean
  label: string
}) {
  return (
    <div
      className='stack-marquee overflow-hidden'
      tabIndex={0}
      aria-label={label}>
      {/* The track is the item list rendered twice, so translating it by half
          its width lands exactly on the duplicate and the loop is seamless. */}
      <div
        className={cn(
          'stack-marquee-track flex w-max',
          reverse && 'stack-marquee-track-reverse'
        )}>
        <StackTrack items={items} />
        <StackTrack items={items} ariaHidden />
      </div>
    </div>
  )
}

export function StackMarquee({ title }: { title: string }) {
  return (
    <section className='flex flex-col gap-10 py-12'>
      {STACK_ROWS.map((items, index) => (
        <StackRow
          key={index}
          items={items}
          reverse={index % 2 === 1}
          label={title}
        />
      ))}
    </section>
  )
}
