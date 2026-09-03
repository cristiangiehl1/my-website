'use client'

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

interface ScrollTiltImageProps {
  src: string
  alt: string
}

/** Post images tilt gently into place as they scroll through the viewport. */
export function ScrollTiltImage({ src, alt }: ScrollTiltImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8])
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.4, 1, 1, 0.4]
  )

  return (
    // A markdown image is inline (phrasing) content — its containing `<p>`
    // can hold a `<span>` but not a `<div>`, or hydration mismatches on the
    // invalid nesting. `display: block` still gives it the box model below.
    <motion.span
      ref={ref}
      className='border-border my-6 block max-w-full overflow-hidden rounded-lg border'
      style={
        reducedMotion
          ? { display: 'block' }
          : { display: 'block', transformPerspective: 1000, rotateX, opacity }
      }>
      <Image
        src={src || '/placeholder.svg'}
        alt={alt}
        width={0}
        height={0}
        sizes='100vw'
        style={{ width: '100%', height: 'auto' }}
      />
    </motion.span>
  )
}
