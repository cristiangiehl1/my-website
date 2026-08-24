'use client'

import { useTranslations } from 'next-intl'

import type { Skill, SkillLevel } from '@/@types/skill'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

import { Badge } from '../../ui/badge'
import { Progress } from '../../ui/progress'

const levelConfig: Record<
  SkillLevel,
  { progress: number; color: string; badgeClass: string }
> = {
  // Single-accent, WCAG AA: four distinct tiers using only lime + neutrals —
  // ascending emphasis (muted outline → neutral outline → lime tint+outline →
  // solid lime), never a low-contrast text color.
  Basico: {
    progress: 25,
    color: 'text-muted-foreground',
    badgeClass: 'border-border bg-transparent text-muted-foreground',
  },
  Intermediario: {
    progress: 50,
    color: 'text-foreground',
    badgeClass: 'border-border bg-transparent text-foreground',
  },
  Avançado: {
    progress: 75,
    color: 'text-primary',
    badgeClass: 'border-primary bg-primary/15 text-primary',
  },
  Expert: {
    progress: 95,
    color: 'text-primary',
    badgeClass: 'border-transparent bg-primary text-primary-foreground',
  },
}

export function SkillCard({ skill }: { skill: Skill }) {
  const t = useTranslations('skills')
  const config = levelConfig[skill.level]
  const label = TECHNOLOGY_DATA[skill.name].label
  const Icon = TECHNOLOGY_DATA[skill.name].icon
  const description = t(`items.${skill.name}.description`)
  const levelLabel = t(`levels.${skill.level}.label`)

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
            <span className='text-muted-foreground text-xs'>{description}</span>
          </div>
        </div>
        <Badge className={cn('shrink-0 text-[10px]', config.badgeClass)}>
          {levelLabel}
        </Badge>
      </div>

      {/* Progress */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-xs'>
            {t('proficiency')}
          </span>
          <span className={cn('text-xs font-semibold', config.color)}>
            {config.progress}%
          </span>
        </div>
        <Progress value={config.progress} className='bg-muted h-2' />
      </div>

      {/* Years */}
      <div className='border-border flex items-center justify-between border-t pt-3'>
        <span className='text-muted-foreground text-xs'>{t('experience')}</span>
        <div className='flex items-baseline gap-1'>
          <span className='text-card-foreground text-lg font-bold'>
            {skill.yearsOfExperience}
          </span>
          <span className='text-muted-foreground text-xs'>
            {skill.yearsOfExperience === 1
              ? t('yearSingular')
              : t('yearPlural')}
          </span>
        </div>
      </div>
    </div>
  )
}
