'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export interface FeaturedProjectItem {
  slug: string
  title: string
  coverUrl?: string
  meta: string
}

const FALLBACK_COVER = '/images/project-placeholder.jpg'

/**
 * Editorial index: one typographic row per project. On pointer devices the
 * unhovered rows dim and a preview thumbnail trails the cursor with a bit of
 * lag; on touch each row carries its own inline thumbnail instead.
 */
export function FeaturedProjectsShowcase({
  items,
  viewProject,
}: {
  items: FeaturedProjectItem[]
  viewProject: string
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  const isActive = activeIndex !== null

  /* Lerp the preview toward the pointer. Only runs while a row is active. */
  useEffect(() => {
    if (!isActive) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let frame = 0
    const tick = () => {
      const el = floatRef.current
      if (el) {
        const ease = reduceMotion ? 1 : 0.16
        current.current.x += (target.current.x - current.current.x) * ease
        current.current.y += (target.current.y - current.current.y) * ease

        // Tilt proportional to how far the preview still trails the pointer.
        const lag = target.current.x - current.current.x
        const tilt = reduceMotion ? 0 : Math.max(-8, Math.min(8, lag * 0.35))

        el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg)`
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isActive])

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const list = listRef.current
    if (!list) return
    const rect = list.getBoundingClientRect()
    target.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }, [])

  /* Keyboard focus has no cursor to follow — park the preview beside the row. */
  const handleFocus = useCallback(
    (index: number) => (event: React.FocusEvent<HTMLAnchorElement>) => {
      const list = listRef.current
      if (list) {
        const listRect = list.getBoundingClientRect()
        const rowRect = event.currentTarget.getBoundingClientRect()
        target.current = {
          x: listRect.width - 140,
          y: rowRect.top - listRect.top + rowRect.height / 2,
        }
        current.current = { ...target.current }
      }
      setActiveIndex(index)
    },
    []
  )

  const clear = useCallback(() => setActiveIndex(null), [])

  const activeItem = activeIndex === null ? null : items[activeIndex]

  return (
    <div className='relative'>
      <ul
        ref={listRef}
        className='border-border relative border-t'
        onPointerMove={handlePointerMove}
        onPointerLeave={clear}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) clear()
        }}>
        {items.map((item, i) => {
          const isCurrent = activeIndex === i
          return (
            <li key={item.slug}>
              <Link
                href={`/post/${item.slug}`}
                aria-label={`${viewProject}: ${item.title}`}
                onPointerEnter={() => setActiveIndex(i)}
                onFocus={handleFocus(i)}
                className={cn(
                  'border-border group flex items-center gap-4 border-b py-5 transition-[opacity,padding] duration-300 motion-reduce:transition-none md:gap-6 md:py-6',
                  isActive && !isCurrent && 'opacity-30',
                  isCurrent && 'md:pl-4'
                )}>
                <span className='text-muted-foreground w-6 shrink-0 font-mono text-xs'>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Touch devices never see the trailing preview. */}
                <span className='border-border relative block aspect-16/10 w-20 shrink-0 overflow-hidden rounded-md border md:hidden'>
                  <Image
                    src={item.coverUrl || FALLBACK_COVER}
                    alt=''
                    fill
                    sizes='80px'
                    className='object-cover'
                  />
                </span>

                <span className='min-w-0 flex-1'>
                  <span
                    className={cn(
                      'block text-xl leading-tight font-bold tracking-tight text-balance transition-colors duration-300 motion-reduce:transition-none md:text-3xl',
                      isCurrent && 'text-primary'
                    )}>
                    {item.title}
                  </span>
                  <span className='text-muted-foreground mt-1 block font-mono text-xs md:hidden'>
                    {item.meta}
                  </span>
                </span>

                <span className='text-muted-foreground hidden shrink-0 font-mono text-xs md:block'>
                  {item.meta}
                </span>

                <FaArrowRight
                  aria-hidden
                  className={cn(
                    'text-primary hidden size-4 shrink-0 transition-opacity duration-300 motion-reduce:transition-none md:block',
                    isCurrent ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </Link>
            </li>
          )
        })}

        <div
          ref={floatRef}
          aria-hidden
          className={cn(
            'border-border pointer-events-none absolute top-0 left-0 z-10 hidden aspect-16/10 w-64 overflow-hidden rounded-md border shadow-2xl transition-opacity duration-200 motion-reduce:transition-none md:block',
            activeItem ? 'opacity-100' : 'opacity-0'
          )}>
          {activeItem && (
            <Image
              key={activeItem.slug}
              src={activeItem.coverUrl || FALLBACK_COVER}
              alt=''
              fill
              sizes='256px'
              className='object-cover'
            />
          )}
        </div>
      </ul>
    </div>
  )
}
