import { TECHNOLOGY_DATA } from '../constants/technology-data'

export type TechnologyName = keyof typeof TECHNOLOGY_DATA
export type TechonologyCategory =
  | 'Programming Language'
  | 'Runtime'
  | 'Framework'
  | 'Database'
  | 'ORM'
  | 'Testing'
  | 'Styling'
  | 'Animation'
  | 'State Management'
  | 'Validation'
  | 'DevOps'
  | 'Tool'
