'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { Project } from '@/@types/project'
import type { TechnologyName } from '@/@types/technology'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

import { PortfolioItemCard } from '../../portfolio-item-card'

/**
 * A column only earns its place if the technology shows up in more than one
 * project — a column with a single lit cell offers nothing to compare. With
 * fewer than three projects on screen (a narrow filter) that rule would wipe
 * the matrix out, so it relaxes to "every technology in view".
 */
function useMatrixColumns(items: Array<Project>) {
  const minShared = items.length >= 3 ? 2 : 1

  const columns = useMemo(() => {
    const usage = new Map<TechnologyName, number>()
    for (const item of items) {
      for (const tech of item.technologies) {
        usage.set(tech, (usage.get(tech) ?? 0) + 1)
      }
    }

    return [...usage.entries()]
      .filter(([, count]) => count >= minShared)
      .sort(
        ([techA, countA], [techB, countB]) =>
          countB - countA ||
          TECHNOLOGY_DATA[techA].label.localeCompare(
            TECHNOLOGY_DATA[techB].label
          )
      )
      .map(([tech, count]) => ({ tech, count }))
  }, [items, minShared])

  return { columns, isRelaxed: minShared === 1 }
}

/**
 * Reveals the grid once, when it first scrolls into view. Reduced motion is
 * handled in CSS (the stagger collapses to zero) rather than here, so the only
 * state update stays inside the observer callback.
 */
function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // The stagger is decoration, so it must never be the thing keeping real
    // content hidden. A tab opened in the background never runs intersection
    // checks, which would otherwise leave the grid blank; this shows it anyway.
    const fallback = window.setTimeout(() => setRevealed(true), 3000)

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return
        setRevealed(true)
        obs.disconnect()
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  return { ref, revealed }
}

export function PortfolioMatrix({ items }: { items: Array<Project> }) {
  const t = useTranslations('portfolio')
  const { columns, isRelaxed } = useMatrixColumns(items)
  const { ref, revealed } = useRevealOnce<HTMLDivElement>()

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [hoverTech, setHoverTech] = useState<TechnologyName | null>(null)
  const [lockedTech, setLockedTech] = useState<TechnologyName | null>(null)

  // Touch has no hover, so tapping a header locks the column instead. Hovering
  // still previews over a lock and falls back to it on the way out, which keeps
  // the pointer feeling live rather than stuck.
  const hotTech = hoverTech ?? lockedTech
  const lockedColumn = columns.find(({ tech }) => tech === lockedTech)

  // Derive rather than store the index: a filter change can drop the selected
  // project, and falling back to the first one keeps the panel truthful.
  const selected = items.find((p) => p.slug === selectedSlug) ?? items[0]

  // With the rule relaxed, "shared" would be a lie above a full row of columns.
  const summary = isRelaxed
    ? t('matrix.showing', { count: columns.length })
    : t('matrix.shared', { count: columns.length })

  return (
    <div className='grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]'>
      {/* min-w-0: a grid item defaults to min-width:auto, so the min-w-max
          table would stretch this track and scroll the whole page sideways
          instead of scrolling inside its own wrapper. */}
      <div className='min-w-0'>
        <div className='mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1'>
          <h2 className='text-lg font-semibold'>{t('matrix.title')}</h2>
          <p className='text-muted-foreground font-mono text-xs'>{summary}</p>
        </div>

        {/* Names the locked column: on a phone the headers are icons only, so
            without this the lock would have nothing readable attached to it.
            Always rendered — letting it appear and vanish shifted the matrix up
            by its own height, right under the finger that just tapped clear. */}
        <div
          className={cn(
            'mb-3 flex items-center gap-3 rounded-md border px-3 py-2 transition-colors',
            lockedColumn
              ? 'border-primary/40 bg-primary/5'
              : 'border-border/40 bg-transparent'
          )}>
          <p className='min-w-0 flex-1 truncate font-mono text-xs'>
            {lockedColumn ? (
              <>
                <span className='text-primary'>
                  {TECHNOLOGY_DATA[lockedColumn.tech].label}
                </span>
                <span className='text-muted-foreground'>
                  {' · '}
                  {t('matrix.usedBy', { count: lockedColumn.count })}
                </span>
              </>
            ) : (
              <span className='text-muted-foreground/70'>
                {t('matrix.noneLocked')}
              </span>
            )}
          </p>
          <button
            type='button'
            onClick={() => setLockedTech(null)}
            className={cn(
              'text-muted-foreground hover:text-foreground shrink-0 font-mono text-xs transition-colors',
              !lockedColumn && 'invisible'
            )}>
            {t('matrix.clear')}
          </button>
        </div>

        {/* The wrapper clears the hover too: a fast diagonal exit can skip the
            header button's own pointerleave and leave a column stuck on. */}
        <div
          ref={ref}
          onPointerLeave={() => setHoverTech(null)}
          // [contain:paint] stops the wide table from leaking into the page's
          // own scrollable overflow — without it the whole page slides
          // sideways on a phone even though the table scrolls in here.
          className='overflow-x-auto pb-2 [contain:paint]'>
          <table className='w-full min-w-max border-collapse'>
            <caption className='sr-only'>{t('matrix.caption')}</caption>
            <thead>
              <tr>
                <th
                  scope='col'
                  className='bg-background border-border/40 sticky left-0 z-20 w-28 border-r md:w-60'>
                  <span className='sr-only'>{t('matrix.projectColumn')}</span>
                </th>
                {columns.map(({ tech, count }) => {
                  const { icon: Icon, label, style } = TECHNOLOGY_DATA[tech]
                  const isHot = hotTech === tech
                  const isLocked = lockedTech === tech
                  return (
                    <th
                      key={tech}
                      scope='col'
                      className='w-8 align-bottom md:w-9'>
                      <button
                        type='button'
                        onPointerEnter={() => setHoverTech(tech)}
                        onPointerLeave={() => setHoverTech(null)}
                        onFocus={() => setHoverTech(tech)}
                        onBlur={() => setHoverTech(null)}
                        onClick={() =>
                          setLockedTech((current) =>
                            current === tech ? null : tech
                          )
                        }
                        aria-pressed={isLocked}
                        className={cn(
                          'flex h-11 w-full flex-col items-center justify-end gap-2 rounded-t-sm pb-2 transition-colors md:h-32',
                          isLocked && 'bg-primary/10'
                        )}>
                        {/* The rotated label is decorative below md, where only
                            the icon shows — the name still reaches AT here. */}
                        <span className='sr-only'>{label}</span>
                        <span
                          aria-hidden
                          className={cn(
                            'hidden font-mono text-[10px] whitespace-nowrap transition-colors md:block',
                            isHot ? 'text-primary' : 'text-muted-foreground',
                            'rotate-180 [writing-mode:vertical-rl]'
                          )}>
                          {label}
                          <span className='text-muted-foreground/50'>
                            {' '}
                            ·{count}
                          </span>
                        </span>
                        <Icon
                          className={cn(
                            'size-4 shrink-0 transition-opacity',
                            style?.iconColor,
                            isHot ? 'opacity-100' : 'opacity-50'
                          )}
                        />
                      </button>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {items.map((item, row) => {
                const title = t(`projects.${item.slug}.title`)
                const isSelected = selected?.slug === item.slug
                // The selected row keeps full presence even while a column is
                // highlighted — its card is on screen, so fading it contradicts
                // what the reader is looking at.
                const isDimmed =
                  !isSelected &&
                  hotTech !== null &&
                  !item.technologies.includes(hotTech)

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      'transition-opacity duration-300 motion-reduce:transition-none',
                      isDimmed && 'opacity-25'
                    )}>
                    {/* Pinned: without this the project name scrolls out of
                        view on a phone and the lit cells lose their subject. */}
                    <th
                      scope='row'
                      className='bg-background border-border/40 sticky left-0 z-10 border-t border-r pr-2 md:pr-4'>
                      <button
                        type='button'
                        onClick={() => setSelectedSlug(item.slug)}
                        onFocus={() => setSelectedSlug(item.slug)}
                        aria-label={t('matrix.selectProject', { title })}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex h-11 w-full items-center gap-1.5 truncate text-left text-xs transition-colors md:gap-2 md:text-sm',
                          isSelected
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground'
                        )}>
                        {/* An explicit cap, not just truncate: min-w-max on the
                            table sizes this column to the longest title, so the
                            content itself has to stop growing. */}
                        <span className='max-w-[104px] truncate md:max-w-none'>
                          {title}
                        </span>
                        {item.featured && (
                          <span
                            aria-hidden
                            className='text-primary shrink-0 text-xs'>
                            ★
                          </span>
                        )}
                      </button>
                    </th>

                    {columns.map(({ tech }, col) => {
                      const uses = item.technologies.includes(tech)
                      return (
                        <td
                          key={tech}
                          className='border-border/40 h-11 border-t text-center'>
                          {/* The stagger lives in a one-shot animation, not in
                              transition-delay: as a delay it also applied to
                              the highlight, so lighting a column rippled in
                              over half a second and left every cell's
                              transition permanently pending. */}
                          <span
                            aria-hidden
                            style={
                              {
                                '--cascade': `${row * 40 + col * 26}ms`,
                              } as React.CSSProperties
                            }
                            className={cn(
                              'mx-auto block size-3.5 rounded-[3px] transition-[background-color,box-shadow] duration-200 motion-reduce:transition-none',
                              revealed
                                ? 'animate-matrix-cell-in [animation-delay:var(--cascade)] motion-reduce:[animation-delay:0ms]'
                                : 'scale-0 opacity-0',
                              uses ? 'bg-primary' : 'bg-border/60',
                              hotTech === tech && 'ring-primary/30 ring-2'
                            )}
                          />
                          <span className='sr-only'>
                            {uses ? t('matrix.uses') : t('matrix.notUses')}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className='text-muted-foreground mt-4 text-sm'>{t('matrix.hint')}</p>
      </div>

      {selected && (
        <aside className='lg:sticky lg:top-24'>
          {/* No key on purpose: remounting would restart the panel's decode
              effect as a first render, which is exactly the case it skips. */}
          <PortfolioItemCard item={selected} />
        </aside>
      )}
    </div>
  )
}
