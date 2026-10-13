'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
}

// A Reveal nested inside another one (a `p` inside a `li` or `blockquote`)
// renders plain — otherwise the two would multiply opacity/translate.
const NestedRevealContext = createContext(false)

/**
 * Fades a block up into place as it scrolls into view, and back out when it
 * leaves — so scrolling back up replays the animation instead of leaving
 * everything revealed.
 */
export function Reveal({ children, className }: RevealProps) {
  const reducedMotion = useReducedMotion()
  const nested = useContext(NestedRevealContext)

  if (reducedMotion || nested)
    return <div className={className}>{children}</div>

  return (
    <NestedRevealContext.Provider value={true}>
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-8% 0px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}>
        {children}
      </motion.div>
    </NestedRevealContext.Provider>
  )
}
