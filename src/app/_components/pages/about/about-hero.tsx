import { Bot, Code, Server } from 'lucide-react'
import Image from 'next/image'

import { BlobBackground } from '@/app/_components/blob-background'

export function AboutHero() {
  return (
    <section className='flex flex-col gap-8'>
      <div className='flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-12'>
        <BlobBackground className='relative h-28 w-28 shrink-0 sm:h-40 sm:w-40'>
          <div className='ring-border absolute inset-0 overflow-hidden rounded-full ring-4'>
            <Image
              src='/images/me.jpeg'
              alt='Cristian Giehl'
              fill
              sizes='(min-width: 640px) 144px, 112px'
              className='object-cover'
              priority
            />
          </div>
        </BlobBackground>
        <div className='flex flex-col gap-4'>
          <h1 className='text-foreground text-4xl font-bold tracking-tight text-balance lg:text-5xl'>
            Desenvolvedor <span className='text-primary'>Full Stack</span>
          </h1>
          <p className='text-muted-foreground max-w-2xl text-lg leading-relaxed text-pretty'>
            Ha mais de 2 anos construindo solucoes completas — do frontend ao
            backend. Atualmente sou desenvolvedor pleno no{' '}
            <span className='text-foreground font-medium'>Grupo Koch SA</span> e
            me especializo em Inteligencia Artificial, criando plataformas com
            integracao de multiagentes usando Claude Code, opencode e OpenAI.
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Code className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>Frontend</p>
            <p className='text-muted-foreground text-sm'>
              TypeScript & Next.js
            </p>
          </div>
        </div>

        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Server className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>Backend</p>
            <p className='text-muted-foreground text-sm'>Node.js & APIs</p>
          </div>
        </div>

        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Bot className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>IA & Agentes</p>
            <p className='text-muted-foreground text-sm'>
              OpenAI & Multiagentes
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
