'use client'

import { useEffect, useState } from 'react'

/**
 * Tracks which of the given heading ids is currently topmost in the
 * viewport. The offset accounts for the app's fixed header so a heading
 * counts as "active" once it clears it, not once it touches y=0.
 */
export function useScrollSpy(ids: string[], offset = 120) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null)

  useEffect(() => {
    if (ids.length === 0) return

    function update() {
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - offset < 0) current = id
      }
      setActiveId(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids, offset])

  return activeId
}
