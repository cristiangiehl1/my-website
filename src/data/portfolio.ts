import type { Project } from '@/@types/project'
import { generateImgUrl } from '@/helpers/generate-img-url'
import { getAuthorBySlug } from '@/helpers/get-author'

export const __PORTFOLIO__: Project[] = [
  {
    id: 1,

    title: 'Vinyl Store',
    description:
      'Plataforma completa de e-commerce especializada em discos de vinil. Desenvolvido com arquitetura minimalista full stack usando Express, implementa autenticação baseada em cookies HTTP e sessões persistidas no PostgreSQL. Oferece navegação intuitiva, sistema de busca, carrinho de compras e design responsivo para colecionadores e amantes de música analógica.',
    coverUrl: generateImgUrl('vinyl-store.png'),

    technologies: [
      'express',
      'javascript',
      'postgresql',
      'html',
      'css',
      'node',
      'netlify',
      'node-pg-migrate',
      'eslint',
      'bcryptjs',
      'cookieparser',
      'serverless-http',
      'validator',
    ],
    category: 'full-stack',

    author: getAuthorBySlug('cristian-giehl'),
    github: 'https://github.com/cristiangiehl1/vinyl-store',
    deploy: 'https://vinyl-market.netlify.app/',

    featured: true,
    createdAt: '03/02/2026',
  },
]
