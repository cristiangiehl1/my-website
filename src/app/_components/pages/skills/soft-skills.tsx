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

import type { SoftSkill } from '@/@types/skill'

export const softSkills: SoftSkill[] = [
  {
    name: 'Comunicação',
    icon: <MessageSquare className='h-5 w-5' />,
    description: 'Clareza na transmissao de ideias tecnicas e nao-tecnicas',
  },
  {
    name: 'Trabalho em Equipe',
    icon: <Users className='h-5 w-5' />,
    description: 'Colaboracao efetiva em equipes multidisciplinares',
  },
  {
    name: 'Resolulçao de Problemas',
    icon: <Lightbulb className='h-5 w-5' />,
    description: 'Pensamento critico e analitico para encontrar solucoes',
  },
  {
    name: 'Gestao de Tempo',
    icon: <Clock className='h-5 w-5' />,
    description: 'Organização e priorizacao de tarefas e prazos',
  },
  {
    name: 'Foco em Resultados',
    icon: <Target className='h-5 w-5' />,
    description: 'Orientação a entregas de valor e metas claras',
  },
  {
    name: 'Aprendizado Continuo',
    icon: <BookOpen className='h-5 w-5' />,
    description: 'Busca constante por novas tecnologias e conhecimentos',
  },
  {
    name: 'Empatia',
    icon: <Heart className='h-5 w-5' />,
    description: 'Compreensao das necessidades de usuarios e colegas',
  },
  {
    name: 'Adaptabilidade',
    icon: <Zap className='h-5 w-5' />,
    description: 'Flexibilidade para lidar com mudancas e novos desafios',
  },
]

export function SoftSkills() {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {softSkills.map((skill) => (
        <div
          key={skill.name}
          className='group bg-card border-border hover:border-primary/40 hover:shadow-soft-stack flex items-start gap-4 rounded-xl border p-5 transition-all'>
          <div className='bg-primary/10 text-primary group-hover:bg-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors'>
            {skill.icon}
          </div>
          <div className='flex flex-col gap-1'>
            <span className='text-card-foreground text-sm font-bold'>
              {skill.name}
            </span>
            <span className='text-muted-foreground text-xs leading-relaxed'>
              {skill.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
