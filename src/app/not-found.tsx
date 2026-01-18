'use client'

import { ArrowLeft, Code2, Cpu, Terminal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useIsMobile } from '@/hooks/use-is-mobile'

import { Button } from './_components/ui/button'

function GlitchText({ children }: { children: string }) {
  return (
    <div className='relative'>
      <span className='relative z-10'>{children}</span>
      <span
        className='text-primary absolute inset-0 opacity-70'
        aria-hidden='true'
      >
        {children}
      </span>
      <span
        className='text-secondary absolute inset-0 opacity-70'
        style={{ animationDelay: '0.1s' }}
        aria-hidden='true'
      >
        {children}
      </span>
    </div>
  )
}

function CircuitGrid() {
  return (
    <div className='pointer-events-none absolute inset-0 overflow-hidden'>
      {/* Horizontal lines */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`h-${i}`}
          className='bg-border/30 absolute h-px'
          style={{
            top: `${(i + 1) * 5}%`,
            left: 0,
            right: 0,
          }}
        />
      ))}
      {/* Vertical lines */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`v-${i}`}
          className='bg-border/30 absolute w-px'
          style={{
            left: `${(i + 1) * 5}%`,
            top: 0,
            bottom: 0,
          }}
        />
      ))}
    </div>
  )
}

function TerminalWindow({ route }: { route: string }) {
  const [displayText, setDisplayText] = useState('')
  const fullText = `> ERROR_CODE: 404
> STATUS: PAGE_NOT_FOUND
> PATH: ${route}
> TIMESTAMP: ${new Date().toISOString()}
> SUGGESTION: return_to_home()`

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='border-border bg-card/50 animate-pulse-glow mx-auto mt-8 w-full max-w-lg overflow-hidden rounded-lg border backdrop-blur-sm'>
      <div className='border-border bg-muted/50 flex items-center gap-2 border-b px-4 py-2'>
        <div className='bg-destructive h-3 w-3 rounded-full' />
        <div className='bg-chart-4 h-3 w-3 rounded-full' />
        <div className='bg-primary h-3 w-3 rounded-full' />
        <span className='text-muted-foreground ml-2 font-mono text-xs'>
          error.log
        </span>
      </div>
      <div className='p-4 font-mono text-sm'>
        <pre className='text-primary whitespace-pre-wrap'>{displayText}</pre>
        <span className='bg-primary ml-1 inline-block h-4 w-2 animate-pulse' />
      </div>
    </div>
  )
}

function FloatingIcons() {
  return (
    <>
      <div className='animate-float absolute top-20 left-10 opacity-20'>
        <Terminal className='text-primary h-16 w-16' />
      </div>
      <div
        className='animate-float absolute top-40 right-20 opacity-20'
        style={{ animationDelay: '1s' }}
      >
        <Code2 className='text-secondary h-12 w-12' />
      </div>
      <div
        className='animate-float absolute bottom-40 left-20 opacity-20'
        style={{ animationDelay: '2s' }}
      >
        <Cpu className='text-primary h-14 w-14' />
      </div>
    </>
  )
}

export default function NotFound() {
  const isMobile = useIsMobile()
  const pathName = usePathname()

  return (
    <main className='bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4'>
      {!isMobile && <CircuitGrid />}
      <FloatingIcons />

      <div className='relative z-10 text-center'>
        {/* 404 Number with Glitch Effect */}
        <div className='font-mono text-[10rem] leading-none font-bold tracking-tighter md:text-[14rem]'>
          <GlitchText>404</GlitchText>
        </div>

        {/* Subtitle */}
        <h1 className='text-foreground mt-4 text-2xl font-semibold md:text-3xl'>
          <span className='text-primary'>{'<'}</span>
          Página &quot;{pathName.slice(1)}&quot; não encontrada
          <span className='text-primary'>{' />'}</span>
        </h1>

        <p className='text-muted-foreground mx-auto mt-4 max-w-md'>
          Parece que você tentou acessar uma rota que não existe no meu sistema.
          O endpoint solicitado retornou um erro.
        </p>

        {/* Terminal Window */}
        <TerminalWindow route={pathName} />

        {/* CTA Button */}
        <div className='mt-8'>
          <Button autoFocus={true} asChild size='lg' variant={'default'}>
            <Link href='/'>
              <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
              Voltar ao início
            </Link>
          </Button>
        </div>

        {/* Code snippet decoration */}
        <div className='text-muted-foreground/50 mt-12 font-mono text-xs'>
          <span className='text-secondary'>{'// '}</span>
          <span>
            desenvolvedor.portfolio.redirect(
            <span className='text-primary'>{'"/"'}</span>)
          </span>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className='from-primary/5 pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t to-transparent' />
    </main>
  )
}
