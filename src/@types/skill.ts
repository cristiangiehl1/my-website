import type { TechnologyName } from './technology'

export type SkillLevel = 'Basico' | 'Intermediario' | 'Avançado' | 'Expert'

export interface Skill {
  name: TechnologyName
  level: SkillLevel
  yearsOfExperience: number
}

export interface SoftSkill {
  name: string
  icon: React.ReactNode
}
