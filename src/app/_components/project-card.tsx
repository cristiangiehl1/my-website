'use client'

import Image from 'next/image'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa6'

import type { Project } from '@/@types/work'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'

import { Button } from './ui/button'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({
  project: { description, featured, image, technologies, title, demo, github },
}: ProjectCardProps) {
  return (
    <div className='group bg-card border-border hover:border-primary hover:shadow-primary/20 relative flex flex-col justify-between overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl'>
      {featured && (
        <div className='bg-primary text-primary-foreground absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-bold'>
          Destaque
        </div>
      )}

      {/* Image */}
      <div className='bg-muted relative h-48 overflow-hidden'>
        <Image
          src={image || '/images/project-placeholder.jpg'}
          alt={title}
          fill
          sizes='
                        (min-width: 1280px) 33vw,
                        (min-width: 768px) 50vw,
                        100vw
                      '
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
        />
        <div className='from-card absolute inset-0 bg-linear-to-t to-transparent opacity-60' />
      </div>

      {/* Content */}
      <div className='flex h-[60%] flex-col space-y-4 p-6'>
        <h3 className='group-hover:text-primary text-xl font-bold text-balance transition-colors'>
          {title}
        </h3>

        <p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed text-pretty'>
          {description}
        </p>

        <div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
          {technologies.map((tech, idx) => {
            const { icon, style } = TECHNOLOGY_DATA[tech]

            const Icon = icon

            return (
              <span
                key={idx}
                className='text-muted-foreground flex items-center gap-1 text-sm'
              >
                <Icon className={style?.iconColor} />
                {tech}
              </span>
            )
          })}
        </div>

        {/* Actions */}
        <div className='mt-auto flex gap-3 pt-2'>
          {github && (
            <Button
              asChild
              variant='outline'
              size='sm'
              className='hover:bg-primary hover:text-primary-foreground hover:border-primary flex-1 bg-transparent transition-all'
            >
              <a href={github} target='_blank' rel='noopener noreferrer'>
                <FaGithub className='mr-2' size={16} />
                Código
              </a>
            </Button>
          )}
          {demo && (
            <Button
              asChild
              size='sm'
              className='bg-primary text-primary-foreground hover:bg-primary/90 flex-1'
            >
              <a href={demo} target='_blank' rel='noopener noreferrer'>
                <FaExternalLinkAlt className='mr-2' size={14} />
                Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
