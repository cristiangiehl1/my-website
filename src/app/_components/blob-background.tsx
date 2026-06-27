'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'

function cardinal(
  data: { x: number; y: number }[],
  closed: boolean,
  tension: number
): string {
  if (data.length < 1) return 'M0 0'
  const size = data.length - (closed ? 0 : 1)
  let path = 'M' + data[0].x + ' ' + data[0].y + ' C'
  for (let i = 0; i < size; i++) {
    const p0 = closed
      ? data[(i - 1 + size) % size]
      : i === 0
        ? data[0]
        : data[i - 1]
    const p1 = data[i]
    const p2 = data[(i + 1) % (closed ? size : data.length)]
    const p3 = closed ? data[(i + 2) % size] : i === size - 1 ? p2 : data[i + 2]
    const x1 = p1.x + ((p2.x - p0.x) / 6) * tension
    const y1 = p1.y + ((p2.y - p0.y) / 6) * tension
    const x2 = p2.x - ((p3.x - p1.x) / 6) * tension
    const y2 = p2.y - ((p3.y - p1.y) / 6) * tension
    path += ' ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + ' ' + p2.x + ' ' + p2.y
  }
  return closed ? path + 'z' : path
}

function random(min: number, max: number) {
  return min + (max - min) * Math.random()
}

interface BlobBackgroundProps {
  children?: React.ReactNode
  className?: string
  color?: string
  opacity?: number
  blurRadius?: number
  numPoints?: number
  minRadius?: number
  maxRadius?: number
  durationRange?: [number, number]
}

export function BlobBackground({
  children,
  className = 'relative',
  color = 'var(--primary)',
  opacity = 0.5,
  blurRadius = 2,
  numPoints = 8,
  minRadius = 0.5,
  maxRadius = 0.9,
  durationRange = [2, 4],
}: BlobBackgroundProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(0)

  useGSAP(
    () => {
      if (size === 0) return

      const path = pathRef.current
      if (!path) return

      const cx = size / 2
      const cy = size / 2
      const innerR = size * minRadius
      const outerR = size * maxRadius
      const slice = (Math.PI * 2) / numPoints
      const startAngle = random(0, Math.PI * 2)

      const points: { x: number; y: number }[] = []

      for (let i = 0; i < numPoints; i++) {
        const angle = startAngle + i * slice
        const r0 = random(innerR, outerR)
        const r1 = random(innerR, outerR)
        const point = {
          x: cx + Math.cos(angle) * r0,
          y: cy + Math.sin(angle) * r0,
        }
        points.push(point)

        gsap.to(point, {
          x: cx + Math.cos(angle) * r1,
          y: cy + Math.sin(angle) * r1,
          duration: random(durationRange[0], durationRange[1]),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          onUpdate: () => {
            path.setAttribute('d', cardinal(points, true, 1))
          },
        })
      }

      path.setAttribute('d', cardinal(points, true, 1))
    },
    { dependencies: [size], scope: containerRef }
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      setSize(container.offsetWidth)
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {size > 0 && (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className='pointer-events-none absolute inset-0 overflow-visible'>
          {blurRadius > 0 && (
            <defs>
              <filter id='blob-blur'>
                <feGaussianBlur stdDeviation={String(blurRadius)} />
              </filter>
            </defs>
          )}
          <path
            ref={pathRef}
            fill={color}
            fillOpacity={opacity}
            {...(blurRadius > 0 ? { filter: 'url(#blob-blur)' } : {})}
          />
        </svg>
      )}
      {children}
    </div>
  )
}
