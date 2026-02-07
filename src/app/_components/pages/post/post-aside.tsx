import { Calendar, Clock, ExternalLink, Github } from 'lucide-react'
import Image from 'next/image'

import type { Project } from '@/@types/project'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

interface PostAsideProps {
  project: Project & { readTime: string }
}

export function PostAside({
  project: { author, readTime, technologies, github, deploy, createdAt },
}: PostAsideProps) {
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(createdAt))

  return (
    <aside>
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
            <a
              href={link}
              target='_blank'
              key={idx}
              className='text-foreground hover:border-primary bg-background focus:border-primary flex min-w-40 items-center justify-center gap-1 rounded-sm border p-2 text-sm transition-colors duration-300'>
              <Icon className={cn(style?.iconColor, 'text-lg')} />
              {tech}
            </a>
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
    </aside>
  )
}
