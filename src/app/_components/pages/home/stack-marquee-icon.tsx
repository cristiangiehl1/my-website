'use client'

import type { ComponentProps, PointerEvent, ReactNode } from 'react'
import { forwardRef, useCallback, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { StickerPeel, type StickerPeelHandle } from './sticker-peel'

const SVG_NS = 'http://www.w3.org/2000/svg'
const STICKER_SIZE = 40
// How much empty margin the icon gets inside its sticker tile, as a fraction
// of the icon's own width/height on each side.
const ICON_PADDING_RATIO = 0.18
const ICON_SCALE = 1 / (1 + ICON_PADDING_RATIO * 2)
// The tile's paper color, leaning into the icon's own color. Resolved in CSS
// rather than JS so the server-rendered markup already paints tinted — a
// post-mount effect would repaint every tile after first paint, which reads as
// the whole marquee flashing its colors in on refresh.
const PAPER_COLOR = 'color-mix(in srgb, currentColor 22%, var(--card))'
// Diagonal sheen + edge rim that read as paper rather than a flat color
// swatch — shared between the CSS resting tile and the peel's SVG texture.
const PAPER_SHEEN_GRADIENT =
  'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.12) 100%)'
const PAPER_SHEEN_STOPS = [
  { offset: '0%', color: '#ffffff', opacity: 0.18 },
  { offset: '45%', color: '#ffffff', opacity: 0.02 },
  { offset: '100%', color: '#000000', opacity: 0.12 },
]
const PAPER_BORDER_COLOR = 'rgba(255,255,255,0.14)'

// Normalizes any computed CSS color — including the modern `color(srgb ...)`
// form browsers hand back for color-mix() — into a plain rgb() string that is
// safe to inline as an SVG paint value, by round-tripping it through the
// canvas 2D color parser.
function normalizeColor(cssColor: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) return cssColor
  ctx.fillStyle = cssColor
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `rgb(${r}, ${g}, ${b})`
}

interface StackMarqueeIconProps extends ComponentProps<'div'> {
  children: ReactNode
  /** Tailwind text-color class for this icon; drives the tile's paper tint. */
  iconColorClassName?: string
}

// Renders the flat tech icon (passed as children, already rendered by the
// server-component caller) sitting on a permanent square "paper" tile tinted
// with the icon's own color — the same tile is what's baked into the hover
// texture below, so the sticker peel lifts a background that was already
// there instead of conjuring one only on hover. On hover this mounts a WebGL
// "sticker peel" overlay on top (built from the tile + icon markup as a
// texture). Mounting the peel effect lazily keeps at most a couple of WebGL
// contexts alive at once instead of one per marquee icon.
export const StackMarqueeIcon = forwardRef<
  HTMLDivElement,
  StackMarqueeIconProps
>(function StackMarqueeIcon(
  {
    children,
    iconColorClassName,
    className,
    onPointerEnter,
    onPointerLeave,
    ...props
  },
  forwardedRef
) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const tileRef = useRef<HTMLDivElement>(null)
  const stickerRef = useRef<StickerPeelHandle>(null)
  const isHoveredRef = useRef(false)
  const hasStickerRef = useRef(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [backColor, setBackColor] = useState<string | null>(null)
  const [stickerVisible, setStickerVisible] = useState(false)

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      wrapperRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef]
  )

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(event)
      isHoveredRef.current = true

      // A sticker from the previous hover can still be peeling away (the exit
      // animation runs before unmount). Re-peel that instance instead of
      // stacking a second one whose texture the mounted component would
      // ignore — that's what made fast re-entries render a frozen, or
      // vanishing, icon.
      if (hasStickerRef.current) {
        stickerRef.current?.requestEnter()
        return
      }

      const svg = wrapperRef.current?.querySelector('svg')
      if (!svg || !tileRef.current) return

      const iconColor = getComputedStyle(svg).color
      const paperColor = normalizeColor(
        getComputedStyle(tileRef.current).backgroundColor
      )

      const clone = svg.cloneNode(true) as SVGSVGElement
      clone.setAttribute('width', '256')
      clone.setAttribute('height', '256')
      clone.style.color = iconColor

      const [vx, vy, vw, vh] = (clone.getAttribute('viewBox') || '0 0 24 24')
        .trim()
        .split(/\s+/)
        .map(Number)

      // Pad the icon within a larger frame (same ratio as the flat layer's
      // CSS scale below) so it isn't glued to the sticker's edges.
      const padX = vw * ICON_PADDING_RATIO
      const padY = vh * ICON_PADDING_RATIO
      const paddedX = vx - padX
      const paddedY = vy - padY
      const paddedW = vw + padX * 2
      const paddedH = vh + padY * 2
      clone.setAttribute(
        'viewBox',
        `${paddedX} ${paddedY} ${paddedW} ${paddedH}`
      )

      // Sharp-edged paper behind the glyph — no rx/ry — matching the
      // permanent tile below, so the mesh peels the icon's own background
      // instead of just the bare vector line-art.
      const bg = document.createElementNS(SVG_NS, 'rect')
      bg.setAttribute('x', String(paddedX))
      bg.setAttribute('y', String(paddedY))
      bg.setAttribute('width', String(paddedW))
      bg.setAttribute('height', String(paddedH))
      bg.setAttribute('fill', paperColor)
      // Stroke-based icon sets (lucide et al.) put stroke="currentColor" and a
      // non-zero stroke-width on the root svg, which our plain rects would
      // inherit and render as a thick colored outline around the paper.
      bg.setAttribute('stroke', 'none')

      // Diagonal sheen + a thin rim — matches the CSS tile's paper look so
      // the swap between flat and peeled states is seamless.
      const defs = document.createElementNS(SVG_NS, 'defs')
      const gradient = document.createElementNS(SVG_NS, 'linearGradient')
      const gradientId = 'sticker-sheen'
      gradient.setAttribute('id', gradientId)
      gradient.setAttribute('x1', '0')
      gradient.setAttribute('y1', '0')
      gradient.setAttribute('x2', '1')
      gradient.setAttribute('y2', '1')
      PAPER_SHEEN_STOPS.forEach(({ offset, color, opacity }) => {
        const stop = document.createElementNS(SVG_NS, 'stop')
        stop.setAttribute('offset', offset)
        stop.setAttribute('stop-color', color)
        stop.setAttribute('stop-opacity', String(opacity))
        gradient.appendChild(stop)
      })
      defs.appendChild(gradient)

      const sheen = document.createElementNS(SVG_NS, 'rect')
      sheen.setAttribute('x', String(paddedX))
      sheen.setAttribute('y', String(paddedY))
      sheen.setAttribute('width', String(paddedW))
      sheen.setAttribute('height', String(paddedH))
      sheen.setAttribute('fill', `url(#${gradientId})`)
      sheen.setAttribute('stroke', 'none')

      const strokeWidth = paddedW * 0.02
      const border = document.createElementNS(SVG_NS, 'rect')
      border.setAttribute('x', String(paddedX + strokeWidth / 2))
      border.setAttribute('y', String(paddedY + strokeWidth / 2))
      border.setAttribute('width', String(paddedW - strokeWidth))
      border.setAttribute('height', String(paddedH - strokeWidth))
      border.setAttribute('fill', 'none')
      border.setAttribute('stroke', PAPER_BORDER_COLOR)
      border.setAttribute('stroke-width', String(strokeWidth))
      // Same inheritance trap as above: a rounded linejoin from the icon's
      // root would bevel the sticker's corners.
      border.setAttribute('stroke-linejoin', 'miter')

      clone.prepend(defs, bg, sheen, border)

      const markup = new XMLSerializer().serializeToString(clone)
      hasStickerRef.current = true
      setStickerVisible(false)
      setBackColor(paperColor)
      setImageSrc(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
      )
    },
    [onPointerEnter]
  )

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event)
      isHoveredRef.current = false
      stickerRef.current?.requestExit(() => {
        // The pointer came back mid-exit and requestEnter already re-peeled
        // this instance — tearing it down now would drop the icon entirely.
        if (isHoveredRef.current) return
        hasStickerRef.current = false
        setStickerVisible(false)
        setImageSrc(null)
      })
    },
    [onPointerLeave]
  )

  const handleStickerReady = useCallback(() => setStickerVisible(true), [])

  return (
    <div
      ref={setRefs}
      // The icon's own text color also lands here so the tile's color-mix()
      // paper tint can resolve against currentColor, with no JS involved.
      className={cn(
        'text-muted-foreground relative inline-flex size-10 items-center justify-center',
        iconColorClassName,
        className
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...props}>
      {/* Flat resting layer — only hidden once the WebGL sticker has its
          texture and is about to render, so peeling reveals what's actually
          behind it instead of this static copy, without a blank flash while
          the sticker is still loading. */}
      <div className={cn('absolute inset-0', stickerVisible && 'invisible')}>
        <div
          ref={tileRef}
          className='absolute inset-0 border shadow-[0_2px_6px_rgba(0,0,0,0.45)]'
          style={{
            backgroundColor: PAPER_COLOR,
            backgroundImage: PAPER_SHEEN_GRADIENT,
            borderColor: PAPER_BORDER_COLOR,
          }}
        />
        <div
          className='relative flex size-full items-center justify-center'
          style={{ transform: `scale(${ICON_SCALE})` }}>
          {children}
        </div>
      </div>
      {imageSrc && backColor && (
        <StickerPeel
          ref={stickerRef}
          image={imageSrc}
          backColor={backColor}
          size={STICKER_SIZE}
          autoPeel
          interactive={false}
          onReady={handleStickerReady}
          className='absolute inset-0'
        />
      )}
    </div>
  )
})
