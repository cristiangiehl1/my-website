import type { Author } from './author'
import type { Category } from './category'
import type { TechnologyName } from './technology'

export type Project = {
  id: number

  title: string
  description: string
  coverUrl?: string

  technologies: TechnologyName[]
  category: Category

  author: Author
  github?: string
  deploy?: string

  featured: boolean
  createdAt: string
}
