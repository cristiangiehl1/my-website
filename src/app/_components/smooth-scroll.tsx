'use client'

import { ReactLenis } from 'lenis/react'

interface SmoothScrollProps {
  children: Readonly<React.ReactNode>
}

// Lenis honors prefers-reduced-motion on its own (respectReducedMotion
// defaults to true), so no extra check is needed here.
export function SmoothScroll({ children }: SmoothScrollProps) {
  return <ReactLenis root>{children}</ReactLenis>
}
