'use client'

import { ArrowLeft, Calendar, Clock, ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import type { Project } from '@/@types/project'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

import { Button } from '../../ui/button'

interface PostHeaderProps {
  project: Project & { title: string; description: string; readTime: string }
}

export function PostHeader({
  project: {
    author,
    createdAt,
    description,
    readTime,
    technologies,
    title,
    coverUrl,
    deploy,
    github,
  },
}: PostHeaderProps) {
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(createdAt))

  const { back } = useRouter()

  return (
    <header className='mb-10 w-full'>
      <button
        onClick={() => back()}
        className='text-muted-foreground hover:text-primary group mb-8 inline-flex items-center gap-2 text-sm transition-colors'>
        <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
        <span>Voltar</span>
      </button>

      {/* Cover image */}
      {coverUrl && (
        <div className='border-border relative mb-8 aspect-16/8 overflow-hidden rounded-xl border'>
          <Image
            src={coverUrl || '/images/project-placeholder.jpg'}
            alt={`Capa do post: ${title}`}
            fill
            className='object-cover'
            priority
          />
          <div className='from-background/80 absolute inset-0 bg-linear-to-t via-transparent to-transparent' />
        </div>
      )}

      {/* Title */}
      <h1 className='text-foreground mb-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
        {title}
      </h1>

      {/* Description */}
      <p className='text-muted-foreground mb-6 text-lg leading-relaxed'>
        {description}
      </p>

      {/* Author & Meta info */}
      <div className='text-muted-foreground flex flex-wrap items-center gap-5 text-sm'>
        <a
          href={author.github}
          target='_blank'
          rel='noopener noreferrer'
          className='group/author hover:text-foreground flex items-center gap-2.5 transition-colors'>
          <Image
            src={author.avatar || '/placeholder.svg'}
            alt={author.name}
            width={32}
            height={32}
            className='ring-border group-hover/author:ring-primary/50 rounded-full ring-2 transition-all'
          />
          <span className='text-foreground group-hover/author:text-primary font-medium transition-colors'>
            {author.name}
          </span>
        </a>
        <span className='text-border hidden sm:inline' aria-hidden='true'>
          |
        </span>
        <div className='flex items-center gap-1.5'>
          <Calendar className='text-primary h-4 w-4' />
          <time dateTime={createdAt}>{formattedDate}</time>
        </div>
        <div className='flex items-center gap-1.5'>
          <Clock className='text-primary h-4 w-4' />
          <span>{readTime} de leitura</span>
        </div>
      </div>

      {/* Technologies */}
      <div className='mt-6 flex flex-wrap items-center gap-x-4 gap-y-2'>
        {technologies.sort().map((tech, idx) => {
          const { icon: Icon, style, link } = TECHNOLOGY_DATA[tech]
          return (
            <Button key={idx} asChild variant={'outline'}>
              <a href={link} target='_blank'>
                <Icon className={cn(style?.iconColor, 'text-lg')} />
                {tech}
              </a>
            </Button>
          )
        })}
      </div>

      {/* GitHub & Demo links */}
      {(github || deploy) && (
        <div className='mt-6 flex flex-wrap items-center gap-3'>
          {github && (
            <a
              href={github}
              target='_blank'
              rel='noopener noreferrer'
              className='border-border bg-card text-foreground hover:border-primary/40 hover:text-primary inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors'>
              <Github className='h-4 w-4' />
              Repositorio
            </a>
          )}
          {deploy && (
            <a
              href={deploy}
              target='_blank'
              rel='noopener noreferrer'
              className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors'>
              <ExternalLink className='h-4 w-4' />
              Ver demo
            </a>
          )}
        </div>
      )}

      <div className='bg-border mt-8 h-px' />
    </header>
  )
}
