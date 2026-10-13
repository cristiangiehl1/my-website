'use client'

import { useEffect, useSyncExternalStore } from 'react'

import type { TechnologyName } from '@/@types/technology'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

import { preloadStickerPeel, StackMarqueeIcon } from './stack-marquee-icon'

const subscribe = () => () => {}

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

export function StackMarqueeRow({
  items,
  reverse,
  label,
}: {
  items: TechnologyName[]
  reverse?: boolean
  label: string
}) {
  // false during SSR and hydration, true afterwards. The looping duplicate is
  // only mounted then, so the initial HTML carries each icon once.
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  useEffect(() => {
    const idle =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000))
    const cancel = window.cancelIdleCallback ?? clearTimeout
    const id = idle(preloadStickerPeel, { timeout: 4000 } as never)
    return () => cancel(id as never)
  }, [])

  return (
    <div
      className='stack-marquee overflow-hidden'
      tabIndex={0}
      aria-label={label}>
      {/* The track is the item list rendered twice, so translating it by half
          its width lands exactly on the duplicate and the loop is seamless.
          The animation only starts once both copies exist. */}
      <div
        className={cn(
          'stack-marquee-track flex w-max',
          ready && 'stack-marquee-track-ready',
          reverse && 'stack-marquee-track-reverse'
        )}>
        <StackTrack items={items} />
        {ready && <StackTrack items={items} ariaHidden />}
      </div>
    </div>
  )
}
