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
  {
    id: 2,

    title: 'Voting Lists',
    description:
      'Sistema de criação de listas para votação com Next.js. Cada usuário pode criar listas, adicionar participantes, cadastrar candidatos e acompanhar os resultados em tempo real. Suporte a listas públicas e privadas, convite por email, votação restrita a participantes, ranking com percentuais e temas claro/escuro.',
    coverUrl: generateImgUrl('voting-system.png'),

    technologies: [
      'typescript',
      'next',
      'react',
      'tailwind',
      'postgresql',
      'prisma',
      'neondb',
      'docker',
      'zod',
      'tanstack',
      'nextauth',
      'cloudinary',
      'threejs',
      'gsap',
    ],
    category: 'full-stack',

    author: getAuthorBySlug('cristian-giehl'),
    github: 'https://github.com/cristiangiehl1/voting-system',
    deploy: 'https://voting-system-nu-gray.vercel.app/',

    featured: true,
    createdAt: '06/26/2026',
  },
]
