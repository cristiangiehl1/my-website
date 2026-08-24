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

export const softSkillsData: SoftSkill[] = [
  { name: 'Comunicação', icon: <MessageSquare className='h-5 w-5' /> },
  { name: 'Trabalho em Equipe', icon: <Users className='h-5 w-5' /> },
  {
    name: 'Resolução de Problemas',
    icon: <Lightbulb className='h-5 w-5' />,
  },
  { name: 'Gestão de Tempo', icon: <Clock className='h-5 w-5' /> },
  { name: 'Foco em Resultados', icon: <Target className='h-5 w-5' /> },
  { name: 'Aprendizado Contínuo', icon: <BookOpen className='h-5 w-5' /> },
  { name: 'Empatia', icon: <Heart className='h-5 w-5' /> },
  { name: 'Adaptabilidade', icon: <Zap className='h-5 w-5' /> },
]

export const softSkillsCount = softSkillsData.length
