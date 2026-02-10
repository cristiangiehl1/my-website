'use client'

import type { Skill, SkillLevel } from '@/@types/skill'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

import { Badge } from '../../ui/badge'
import { Progress } from '../../ui/progress'

const levelConfig: Record<
  SkillLevel,
  { progress: number; color: string; badgeClass: string }
> = {
  Basico: {
    progress: 25,
    color: 'text-chart-1',
    badgeClass: 'border-chart-1/30 bg-chart-1/10 text-chart-1',
  },
  Intermediario: {
    progress: 50,
    color: 'text-secondary',
    badgeClass: 'border-secondary/30 bg-secondary/10 text-secondary',
  },
  Avançado: {
    progress: 75,
    color: 'text-primary',
    badgeClass: 'border-primary/30 bg-primary/10 text-primary',
  },
  Expert: {
    progress: 95,
    color: 'text-chart-4',
    badgeClass: 'border-chart-4/30 bg-chart-4/10 text-chart-4',
  },
}

export function SkillCard({ skill }: { skill: Skill }) {
  const config = levelConfig[skill.level]
  const label = TECHNOLOGY_DATA[skill.name].label
  const Icon = TECHNOLOGY_DATA[skill.name].icon

  return (
    <div className='group bg-card border-border hover:border-primary/30 hover:shadow-soft-stack flex flex-col gap-4 rounded-xl border p-5 transition-all'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-muted text-primary group-hover:bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors'>
            <Icon className='size-5' />
          </div>
          <div className='flex flex-col'>
            <span className='text-card-foreground text-sm font-bold'>
              {label}
            </span>
            <span className='text-muted-foreground text-xs'>
              {skill.description}
            </span>
          </div>
        </div>
        <Badge className={cn('shrink-0 text-[10px]', config.badgeClass)}>
          {skill.level}
        </Badge>
      </div>

      {/* Progress */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-xs'>Proficiencia</span>
          <span className={cn('text-xs font-semibold', config.color)}>
            {config.progress}%
          </span>
        </div>
        <Progress value={config.progress} className='bg-muted h-2' />
      </div>

      {/* Years */}
      <div className='border-border flex items-center justify-between border-t pt-3'>
        <span className='text-muted-foreground text-xs'>Experiencia</span>
        <div className='flex items-baseline gap-1'>
          <span className='text-card-foreground text-lg font-bold'>
            {skill.yearsOfExperience}
          </span>
          <span className='text-muted-foreground text-xs'>
            {skill.yearsOfExperience === 1 ? 'ano' : 'anos'}
          </span>
        </div>
      </div>
    </div>
  )
}
