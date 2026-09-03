'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
}

/** Fades a block up into place the first time it scrolls into view. */
export function Reveal({ children, className }: RevealProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}
