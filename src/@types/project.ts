import type { Author } from './author'
import type { Category } from './category'
import type { TechnologyName } from './technology'

export type Project = {
  id: number

  slug: string
  coverUrl?: string

  technologies: TechnologyName[]
  category: Category

  author: Author
  github?: string
  deploy?: string

  featured: boolean
  /** MM/DD/YYYY */
  createdAt: string
  /** MM/DD/YYYY — only set when the post is meaningfully revised */
  updatedAt?: string
}
