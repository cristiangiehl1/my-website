import type { Project } from '@/@types/projects'

export const PROJECTS: Array<Project> = [
  {
    title: 'E-commerce Sneakers Store',
    description: 'Plataforma completa de e-commerce especializada em tênis...',
    technologies: [
      'Next.js',
      'TypeScript',
      'PostgreSQL',
      'Tailwind',
      'Node.js',
    ],
    github: 'https://github.com/seu-usuario/ecommerce-store',
    demo: 'https://sneakers-store-demo.vercel.app',
    featured: true,
  },
  {
    title: 'API REST de Gerenciamento Financeiro',
    description: 'API robusta desenvolvida em Rust...',
    technologies: ['Rust', 'PostgreSQL'],
    github: 'https://github.com/seu-usuario/finance-api',
    featured: true,
  },
  {
    title: 'Landing Page Interativa - SaaS Marketing',
    description: 'Landing page moderna para produto SaaS...',
    technologies: ['React', 'TypeScript', 'GSAP', 'Tailwind'],
    github: 'https://github.com/seu-usuario/saas-landing',
    demo: 'https://saas-landing-demo.vercel.app',
    featured: false,
  },
  {
    title: 'Dashboard Analytics em Tempo Real',
    description: 'Dashboard para visualização de métricas...',
    technologies: [
      'Next.js',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Tailwind',
    ],
    github: 'https://github.com/seu-usuario/analytics-dashboard',
    demo: 'https://analytics-demo.vercel.app',
    featured: false,
  },
  {
    title: 'Sistema de Machine Learning para Predição',
    description: 'Pipeline completo de machine learning...',
    technologies: ['Python', 'PostgreSQL', 'React', 'TypeScript'],
    github: 'https://github.com/seu-usuario/ml-prediction',
    featured: true,
  },
  {
    title: 'Portfolio Criativo com Animações 3D',
    description: 'Website de portfólio pessoal...',
    technologies: ['Next.js', 'TypeScript', 'GSAP', 'Tailwind'],
    demo: 'https://portfolio-3d-demo.vercel.app',
    featured: false,
  },
]
