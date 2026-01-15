import type { Technology } from './technology'

export interface Project {
  title: string
  description: string
  technologies: Array<Technology>
  image?: string
  github?: string
  demo?: string
  featured: boolean
}
