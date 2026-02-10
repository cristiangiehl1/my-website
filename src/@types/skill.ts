import type { TechnologyName } from './technology'

export type SkillLevel = 'Basico' | 'Intermediario' | 'Avançado' | 'Expert'

export interface SkillBase {
  description: string
}

export interface Skill extends SkillBase {
  name: TechnologyName
  level: SkillLevel
  yearsOfExperience: number
}

export interface SoftSkill extends SkillBase {
  name: string
  icon: React.ReactNode
}
