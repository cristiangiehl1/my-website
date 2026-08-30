'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa6'

import type { Project } from '@/@types/project'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_-<>#*'
// Budget: the whole intro lands under a second, because comparing projects
// means clicking several rows in a row and nobody waits twice for the same
// flourish. Title decodes in ~450ms, the summary types in ~550ms after it.
const DECODE_STEP_MS = 26
const TYPE_STEP_MS = 12
const TYPE_CHARS_PER_STEP = 4
const SUMMARY_MAX = 180
const FLAGS_SHOWN = 6

/** Trims to a word boundary so the typewriter never runs for seconds. */
function summarize(text: string) {
  if (text.length <= SUMMARY_MAX) return text
  const cut = text.slice(0, SUMMARY_MAX)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

const randomChar = () =>
  SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]

/**
 * The scramble has to overwrite the title in the same commit React wrote it,
 * or the finished name flashes for a frame before dissolving. useLayoutEffect
 * runs before paint; on the server it is not available, and there is nothing
 * to animate there anyway.
 */
const useBeforePaintEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Decodes the title character by character, then types the summary out.
 * Runs on every project change but not on the first render: arriving at the
 * page should not make you wait to read, and animating a server-rendered
 * string would flash the finished text before blanking it.
 */
function useTerminalIntro(slug: string, title: string, summary: string) {
  const titleRef = useRef<HTMLSpanElement>(null)
  const summaryRef = useRef<HTMLSpanElement>(null)
  const isFirstRender = useRef(true)

  useBeforePaintEffect(() => {
    const titleEl = titleRef.current
    const summaryEl = summaryRef.current
    if (!titleEl || !summaryEl) return

    const settle = () => {
      titleEl.textContent = title
      summaryEl.textContent = summary
      summaryEl.classList.remove('terminal-typing')
    }

    if (
      isFirstRender.current ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      isFirstRender.current = false
      settle()
      return
    }

    const drawDecode = (settled: number) => {
      titleEl.textContent =
        title.slice(0, settled) +
        title.slice(settled).replace(/\S/g, randomChar)
    }

    let typeTimer = 0
    let frame = 0
    summaryEl.textContent = ''
    summaryEl.classList.add('terminal-typing')
    drawDecode(0)

    const decodeTimer = window.setInterval(() => {
      frame += 1

      if (frame < title.length) {
        drawDecode(frame)
        return
      }

      window.clearInterval(decodeTimer)
      titleEl.textContent = title

      let typed = 0
      typeTimer = window.setInterval(() => {
        typed += TYPE_CHARS_PER_STEP
        summaryEl.textContent = summary.slice(0, typed)
        if (typed < summary.length) return
        window.clearInterval(typeTimer)
        settle()
      }, TYPE_STEP_MS)
    }, DECODE_STEP_MS)

    return () => {
      window.clearInterval(decodeTimer)
      window.clearInterval(typeTimer)
    }
  }, [slug, title, summary])

  return { titleRef, summaryRef }
}

interface WorkCardProps {
  item: Project
}

export function PortfolioItemCard({
  item: {
    slug,
    featured,
    coverUrl,
    technologies,
    deploy,
    github,
    category,
    createdAt,
  },
}: WorkCardProps) {
  const t = useTranslations('portfolio')
  const title = t(`projects.${slug}.title`)
  const summary = summarize(t(`projects.${slug}.description`))
  const { titleRef, summaryRef } = useTerminalIntro(slug, title, summary)

  // createdAt is MM/DD/YYYY; rebuilt by hand so no timezone can shift the day.
  const [month, day, year] = createdAt.split('/')
  const flags = technologies.slice(0, FLAGS_SHOWN)
  const hiddenFlags = technologies.length - flags.length

  return (
    <article className='border-border bg-card overflow-hidden rounded-lg border font-mono'>
      <div className='border-border text-muted-foreground flex items-center gap-2 border-b px-3 py-2 text-[10px]'>
        <span aria-hidden className='bg-primary size-2 shrink-0 rounded-full' />
        <span aria-hidden className='bg-border size-2 shrink-0 rounded-full' />
        <span aria-hidden className='bg-border size-2 shrink-0 rounded-full' />
        <span className='truncate'>{slug}.project</span>
        {featured && (
          <span className='text-primary ml-auto shrink-0'>
            ★ {t('featured')}
          </span>
        )}
      </div>

      <Link
        href={`/post/${slug}`}
        aria-label={t('goToPost', { title })}
        className='bg-muted border-border relative block aspect-16/9 overflow-hidden border-b'>
        <Image
          key={slug}
          src={coverUrl || '/images/project-placeholder.jpg'}
          alt=''
          fill
          sizes='(min-width: 1024px) 360px, 100vw'
          className='animate-in fade-in object-cover opacity-80 duration-300'
        />
        <span
          aria-hidden
          className='pointer-events-none absolute inset-0 opacity-60 [background:repeating-linear-gradient(to_bottom,rgba(0,0,0,0.28)_0_1px,transparent_1px_3px)]'
        />
      </Link>

      <div className='space-y-3 p-3.5'>
        <p className='text-muted-foreground text-[10px]'>
          <span className='text-primary'>$</span> cat {slug}.json
        </p>

        <h3 className='text-primary text-[15px] leading-tight font-bold'>
          <span className='sr-only'>{title}</span>
          <span ref={titleRef} aria-hidden>
            {title}
          </span>
        </h3>

        <dl className='text-muted-foreground grid grid-cols-[72px_minmax(0,1fr)] gap-x-3 gap-y-1 text-[10.5px]'>
          <dt>{t('panel.category')}</dt>
          <dd className='text-foreground'>{category}</dd>
          <dt>{t('panel.created')}</dt>
          <dd className='text-foreground'>{`${day}.${month}.${year}`}</dd>
          <dt>{t('panel.stack')}</dt>
          <dd className='text-foreground'>
            {t('panel.stackCount', { count: technologies.length })}
          </dd>
        </dl>

        <p className='border-border text-muted-foreground min-h-[4.5rem] border-t pt-3 text-[11px] leading-relaxed'>
          <span className='sr-only'>{summary}</span>
          <span ref={summaryRef} aria-hidden>
            {summary}
          </span>
        </p>

        <div className='flex flex-wrap gap-1.5'>
          {flags.map((tech) => {
            const { label, link } = TECHNOLOGY_DATA[tech]
            return (
              <a
                key={tech}
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                title={label}
                className='border-border text-muted-foreground hover:border-primary hover:text-primary rounded border border-dashed px-1.5 py-0.5 text-[9.5px] transition-colors'>
                --{tech}
              </a>
            )
          })}
          {hiddenFlags > 0 && (
            <span className='text-muted-foreground/60 px-1 py-0.5 text-[9.5px]'>
              {t('more', { count: hiddenFlags })}
            </span>
          )}
        </div>

        <div className='border-border flex gap-2 border-t pt-3'>
          <TerminalAction href={github} icon={FaGithub} label={t('code')} />
          <TerminalAction
            href={deploy}
            icon={FaExternalLinkAlt}
            label={t('demo')}
            highlighted
          />
        </div>
      </div>
    </article>
  )
}

/** A link when the project has one, a spent slot when it does not. */
function TerminalAction({
  href,
  icon: Icon,
  label,
  highlighted,
}: {
  href?: string
  icon: typeof FaGithub
  label: string
  highlighted?: boolean
}) {
  const t = useTranslations('portfolio')

  const shared =
    'flex flex-1 items-center justify-center gap-2 rounded-md border px-2 py-2 text-[10.5px] transition-colors'

  if (!href) {
    return (
      <span
        className={cn(
          shared,
          'border-border/60 text-muted-foreground/50 border-dashed'
        )}>
        <Icon aria-hidden className='size-3' />
        {t('panel.unavailable')}
      </span>
    )
  }

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        shared,
        highlighted
          ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
          : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
      )}>
      <Icon aria-hidden className='size-3' />
      {label}
    </a>
  )
}
