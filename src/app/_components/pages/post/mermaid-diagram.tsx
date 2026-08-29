'use client'

import { useEffect, useId, useRef, useState } from 'react'

import {
  CODE_BLOCK_CODE_CLASSES,
  CODE_BLOCK_PRE_CLASSES,
} from './code-block-classes'

interface MermaidDiagramProps {
  chart: string
}

const MERMAID_THEME_VARIABLES = {
  darkMode: true,
  background: '#0a0a0a',
  primaryColor: '#141413',
  primaryTextColor: '#fafaf7',
  primaryBorderColor: '#3a3a34',
  lineColor: '#c4f000',
  secondaryColor: '#171716',
  tertiaryColor: '#1e1e1b',
  nodeBorder: '#3a3a34',
  nodeTextColor: '#fafaf7',
  clusterBkg: '#171716',
  clusterBorder: '#3a3a34',
  edgeLabelBackground: '#0a0a0a',
  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
  fontSize: '14px',
}

let mermaidInitialized = false

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const rawId = useId()
  const diagramId = `mermaid-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const containerRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function renderDiagram() {
      setFailed(false)
      try {
        const { default: mermaid } = await import('mermaid')

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: MERMAID_THEME_VARIABLES,
            securityLevel: 'strict',
            flowchart: { curve: 'basis' },
          })
          mermaidInitialized = true
        }

        const { svg } = await mermaid.render(diagramId, chart)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Mermaid diagram failed to render:', error)
          setFailed(true)
        }
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [chart, diagramId])

  if (failed) {
    return (
      <pre className={CODE_BLOCK_PRE_CLASSES}>
        <code className={CODE_BLOCK_CODE_CLASSES}>{chart}</code>
      </pre>
    )
  }

  return (
    <div
      ref={containerRef}
      className='mb-5 overflow-x-auto rounded-lg [&_svg]:mx-auto [&_svg]:max-w-full'
    />
  )
}
