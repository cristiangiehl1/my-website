'use client'

import { useTranslations } from 'next-intl'

import { softSkillsData } from './soft-skills-data'

export function SoftSkills() {
  const t = useTranslations('skills')

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {softSkillsData.map((skill) => (
        <div
          key={skill.name}
          className='group bg-card border-border hover:border-primary/40 hover:shadow-soft-stack flex items-start gap-4 rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors'>
            {skill.icon}
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-card-foreground text-sm font-bold'>
              {t(`softSkillNames.${skill.name}`)}
            </span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              {t(`softSkillDescriptions.${skill.name}`)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
