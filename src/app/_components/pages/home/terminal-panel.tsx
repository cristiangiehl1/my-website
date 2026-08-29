'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useRef } from 'react'

gsap.registerPlugin(TextPlugin)

const CHAR_SECONDS = 0.055
const LINE_PAUSE = 0.8
const FINAL_HOLD = 1.6

function Line({
  cmd,
  cmdRef,
  value,
  valueRef,
}: {
  cmd: string
  cmdRef: React.RefObject<HTMLSpanElement | null>
  value: string
  valueRef: React.RefObject<HTMLParagraphElement | null>
}) {
  return (
    <div className='flex flex-col'>
      <p className='text-foreground'>
        <span className='text-primary'>$</span>{' '}
        <span ref={cmdRef} className='inline-block whitespace-nowrap'>
          {cmd}
        </span>
      </p>
      <p ref={valueRef} className='text-muted-foreground'>
        <span className='text-primary'>&gt;</span> {value}
      </p>
    </div>
  )
}

export function TerminalPanel({
  role,
  location,
}: {
  role: string
  location: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const cmd1Ref = useRef<HTMLSpanElement>(null)
  const cmd2Ref = useRef<HTMLSpanElement>(null)
  const cmd3Ref = useRef<HTMLSpanElement>(null)
  const value1Ref = useRef<HTMLParagraphElement>(null)
  const value2Ref = useRef<HTMLParagraphElement>(null)
  const value3Ref = useRef<HTMLParagraphElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (reduceMotion) return

      timelineRef.current = gsap
        .timeline({ repeat: -1, defaults: { ease: 'none' } })
        .set([cmd1Ref.current, cmd2Ref.current, cmd3Ref.current], {
          text: '',
        })
        .set([value1Ref.current, value2Ref.current, value3Ref.current], {
          opacity: 0,
        })
        .to(cmd1Ref.current, {
          text: 'whoami',
          duration: 'whoami'.length * CHAR_SECONDS,
        })
        .to(value1Ref.current, { opacity: 1, duration: 0.15 })
        .to({}, { duration: LINE_PAUSE })
        .to(cmd2Ref.current, {
          text: 'stack --top',
          duration: 'stack --top'.length * CHAR_SECONDS,
        })
        .to(value2Ref.current, { opacity: 1, duration: 0.15 })
        .to({}, { duration: LINE_PAUSE })
        .to(cmd3Ref.current, {
          text: 'location',
          duration: 'location'.length * CHAR_SECONDS,
        })
        .to(value3Ref.current, { opacity: 1, duration: 0.15 })
        .to({}, { duration: FINAL_HOLD })
    },
    { scope: containerRef }
  )

  function pause() {
    timelineRef.current?.pause()
    if (cursorRef.current) cursorRef.current.style.animationPlayState = 'paused'
  }

  function resume() {
    timelineRef.current?.play()
    if (cursorRef.current)
      cursorRef.current.style.animationPlayState = 'running'
  }

  return (
    <div
      ref={containerRef}
      className='border-border bg-card shadow-soft-stack w-full max-w-md rounded-lg border font-mono text-sm'
      tabIndex={0}
      aria-label='Terminal'
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}>
      <div className='border-border flex items-center gap-2 border-b px-4 py-3'>
        <span className='bg-destructive h-3 w-3 rounded-full' />
        <span className='bg-muted-foreground h-3 w-3 rounded-full' />
        <span className='bg-primary h-3 w-3 rounded-full' />
        <span className='text-muted-foreground ml-2 text-xs'>~/cristian</span>
      </div>
      <div className='flex flex-col gap-3 p-4'>
        <Line cmd='whoami' cmdRef={cmd1Ref} value={role} valueRef={value1Ref} />
        <Line
          cmd='stack --top'
          cmdRef={cmd2Ref}
          value='TypeScript · Next.js · Rust · Python'
          valueRef={value2Ref}
        />
        <Line
          cmd='location'
          cmdRef={cmd3Ref}
          value={location}
          valueRef={value3Ref}
        />
        <p className='text-primary'>
          ${' '}
          <span
            ref={cursorRef}
            className='bg-primary inline-block h-4 w-2 align-middle'
            style={{
              animation: 'terminal-cursor-blink 1s steps(1, jump-end) infinite',
            }}
          />
        </p>
      </div>
    </div>
  )
}
