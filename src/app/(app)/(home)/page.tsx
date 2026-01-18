import Link from 'next/link'
import type { IconType } from 'react-icons'
import { BiCodeAlt } from 'react-icons/bi'
import {
  FaArrowRight,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
} from 'react-icons/fa'

import { Button } from '@/app/_components/ui/button'

const CTA_BUTTONS: Array<{ icon: IconType; href: string }> = [
  { icon: FaGithub, href: 'https://github.com/cristiangiehl1' },
  {
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/cristian-giehl-5b3539b4/',
  },
  { icon: FaEnvelope, href: 'mailto:cristiangiehl@email.com' },
  { icon: FaWhatsapp, href: 'https://wa.me/+5521999815903' },
]

export default function HomePage() {
  return (
    <div className='bg-background h-screen w-full'>
      {/* Animated Background Elements */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/10 animate-glow absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl' />
        <div className='bg-secondary/10 animate-glow absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl' />
      </div>

      {/* Main Content */}
      <main className='relative flex h-full items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2'>
          {/* Left Column - Text Content */}
          <div className='space-y-8 text-center lg:text-left'>
            {/* Badge */}
            <div className='bg-muted/50 border-border inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm'>
              <BiCodeAlt size={16} className='text-primary' />
              <span className='text-muted-foreground text-sm'>
                Desenvolvedor Full-Stack
              </span>
            </div>

            {/* Headline */}
            <div className='space-y-4'>
              <h1 className='text-5xl leading-tight font-bold text-balance sm:text-6xl lg:text-7xl'>
                Transformo <span className='text-primary'>ideias</span> em{' '}
                <span className='text-secondary'>experiências</span> digitais
              </h1>
              <p className='text-muted-foreground max-w-2xl text-xl leading-relaxed text-pretty'>
                Especialista em criar aplicações web modernas e escaláveis que
                conectam usuários e impulsionam negócios
              </p>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col justify-center gap-4 sm:flex-row lg:justify-start'>
              <Button
                size='lg'
                className='bg-primary text-primary-foreground hover:bg-primary/90 group'
                asChild
              >
                <Link href={'/portfolio/projects'}>
                  Ver Projetos
                  <FaArrowRight
                    className='ml-2 transition-transform group-hover:translate-x-1'
                    size={20}
                  />
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-border hover:bg-muted bg-transparent'
              >
                Entre em Contato
              </Button>
            </div>

            {/* Social Links */}
            <div className='flex justify-center gap-4 pt-4 lg:justify-start'>
              {CTA_BUTTONS.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='bg-muted hover:bg-primary hover:text-primary-foreground flex h-12 w-12 transform items-center justify-center rounded-lg transition-all duration-300 hover:scale-110'
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className='hidden items-center justify-center lg:flex'>
            <div className='relative aspect-square w-full max-w-md'>
              {/* Floating Code Blocks */}
              <div
                className='bg-card border-border animate-float absolute top-0 right-0 rounded-lg border p-4 shadow-2xl'
                style={{ animationDelay: '0s' }}
              >
                <div className='mb-2 flex items-center gap-2'>
                  <div className='bg-destructive h-3 w-3 rounded-full' />
                  <div className='h-3 w-3 rounded-full bg-yellow-500' />
                  <div className='bg-primary h-3 w-3 rounded-full' />
                </div>
                <pre className='text-muted-foreground font-mono text-xs'>
                  <code>{`const dev = {
  name: "Full-Stack",
  passion: "Code"
}`}</code>
                </pre>
              </div>

              <div
                className='bg-card border-border animate-float absolute bottom-0 left-0 rounded-lg border p-4 shadow-2xl'
                style={{ animationDelay: '2s' }}
              >
                <div className='mb-2 flex items-center gap-2'>
                  <div className='bg-destructive h-3 w-3 rounded-full' />
                  <div className='h-3 w-3 rounded-full bg-yellow-500' />
                  <div className='bg-primary h-3 w-3 rounded-full' />
                </div>
                <pre className='text-muted-foreground font-mono text-xs'>
                  <code>{`function create() {
  return magic();
}`}</code>
                </pre>
              </div>

              {/* Center Glow */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='bg-primary/20 h-64 w-64 animate-pulse rounded-full blur-3xl' />
              </div>

              {/* Center Icon */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='bg-primary flex h-32 w-32 transform items-center justify-center rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-110'>
                  <BiCodeAlt size={64} className='text-primary-foreground' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
