'use client'

import {
  BookOpen,
  Clock,
  Heart,
  Lightbulb,
  MessageSquare,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { SoftSkill } from '@/@types/skill'

const softSkillsData: Omit<SoftSkill, 'description'>[] = [
  { name: 'Comunicação', icon: <MessageSquare className='h-5 w-5' /> },
  { name: 'Trabalho em Equipe', icon: <Users className='h-5 w-5' /> },
  {
    name: 'Resolulçao de Problemas',
    icon: <Lightbulb className='h-5 w-5' />,
  },
  { name: 'Gestao de Tempo', icon: <Clock className='h-5 w-5' /> },
  { name: 'Foco em Resultados', icon: <Target className='h-5 w-5' /> },
  { name: 'Aprendizado Continuo', icon: <BookOpen className='h-5 w-5' /> },
  { name: 'Empatia', icon: <Heart className='h-5 w-5' /> },
  { name: 'Adaptabilidade', icon: <Zap className='h-5 w-5' /> },
]

export const softSkillsCount = softSkillsData.length

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
