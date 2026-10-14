import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

import { getProjectBySlug } from '@/helpers/get-project'

export const ogSize = { width: 1200, height: 630 }

const BG = '#0A0A0A'
const FG = '#F5F5F5'
const ACCENT = '#C4F000'
const MUTED = '#8A8A8A'

export async function renderPostOgImage(locale: string, slug: string) {
  const project = getProjectBySlug(slug)
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  const tMeta = await getTranslations({ locale, namespace: 'meta' })

  const title = t(`projects.${slug}.title`)
  const technologies = [...project.technologies].sort().slice(0, 6)

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: BG,
        color: FG,
        padding: 64,
        border: `10px solid ${ACCENT}`,
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 28,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: ACCENT,
        }}>
        <span>{project.category}</span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            color: MUTED,
          }}>
          <span>Cristian Giehl</span>
          <span style={{ fontSize: 22, letterSpacing: 2, marginTop: 6 }}>
            {tMeta('jobTitle')}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: title.length > 40 ? 68 : 84,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: -2,
        }}>
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {technologies.map((tech) => (
            <div
              key={tech}
              style={{
                display: 'flex',
                border: `3px solid ${FG}`,
                borderRadius: 8,
                padding: '8px 18px',
                fontSize: 26,
              }}>
              {tech}
            </div>
          ))}
        </div>
      </div>
    </div>,
    ogSize
  )
}
