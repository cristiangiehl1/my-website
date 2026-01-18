import type { TechnologyName } from './technology'

export interface Project {
  id: string
  title: string
  description: string
  technologies: Array<TechnologyName>
  image?: string
  github?: string
  demo?: string
  featured: boolean
}
