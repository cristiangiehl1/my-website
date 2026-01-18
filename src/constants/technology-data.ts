import type { IconType } from 'react-icons'
import { DiRedis } from 'react-icons/di'
import { FaDocker } from 'react-icons/fa'
import { GiSteamLocomotive, GiWaveCrest } from 'react-icons/gi'
import { LuTreePalm } from 'react-icons/lu'
import {
  SiAxios,
  SiExpress,
  SiFastify,
  SiJavascript,
  SiJest,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRust,
  SiTailwindcss,
  SiTypescript,
  SiZod,
} from 'react-icons/si'
import { TbBrandCypress, TbBrandFramerMotion } from 'react-icons/tb'

import type { TechnologyName, TechonologyCategory } from '@/@types/technology'
import type {
  MultiSelectGroup,
  MultiSelectOption,
} from '@/app/_components/ui/multi-select'

export const TECHNOLOGY_DATA: Record<
  string,
  {
    value: string
    label: string
    icon: IconType
    style?: {
      /** Custom badge color */
      badgeColor?: string
      /** Custom icon color */
      iconColor?: string
      /** Gradient background for badge */
      gradient?: string
    }
    category: TechonologyCategory
  }
> = {
  javascript: {
    value: 'javascript',
    label: 'Javascript',
    icon: SiJavascript,
    style: { iconColor: 'text-yellow-500' },
    category: 'Programming Language',
  },

  typescript: {
    value: 'typescript',
    label: 'Typescript',
    icon: SiTypescript,
    style: { iconColor: 'text-blue-600' },
    category: 'Programming Language',
  },

  rust: {
    value: 'rust',
    label: 'Rust',
    icon: SiRust,
    style: { iconColor: 'text-orange-600' },
    category: 'Programming Language',
  },

  python: {
    value: 'python',
    label: 'Python',
    icon: SiPython,
    style: { iconColor: 'text-blue-400' },
    category: 'Programming Language',
  },

  node: {
    value: 'node',
    label: 'Node.js',
    icon: SiNodedotjs,
    style: { iconColor: 'text-green-600' },
    category: 'Runtime',
  },

  react: {
    value: 'react',
    label: 'React',
    icon: SiReact,
    style: { iconColor: 'text-cyan-400' },
    category: 'Framework',
  },

  next: {
    value: 'next',
    label: 'Next.js',
    icon: SiNextdotjs,
    style: { iconColor: 'text-white' },
    category: 'Framework',
  },

  loco: {
    value: 'loco',
    label: 'Loco.rs',
    icon: GiSteamLocomotive,
    style: { iconColor: 'text-red-500' },
    category: 'Framework',
  },

  gsap: {
    value: 'gsap',
    label: 'GSAP',
    icon: TbBrandFramerMotion,
    style: { iconColor: 'text-green-500' },
    category: 'Animation',
  },

  zod: {
    value: 'zod',
    label: 'Zod',
    icon: SiZod,
    style: { iconColor: 'text-blue-500' },
    category: 'Validation',
  },

  tanstack: {
    value: 'tanstack',
    label: 'TanStack',
    icon: LuTreePalm,
    style: { iconColor: 'text-orange-500' },
    category: 'State Management',
  },

  docker: {
    value: 'docker',
    label: 'Docker',
    icon: FaDocker,
    style: { iconColor: 'text-blue-500' },
    category: 'DevOps',
  },

  jest: {
    value: 'jest',
    label: 'Jest',
    icon: SiJest,
    style: { iconColor: 'text-red-500' },
    category: 'Testing',
  },

  cypress: {
    value: 'cypress',
    label: 'Cypress',
    icon: TbBrandCypress,
    style: { iconColor: 'text-teal-500' },
    category: 'Testing',
  },

  postgresql: {
    value: 'postgresql',
    label: 'PostgreSQL',
    icon: SiPostgresql,
    style: { iconColor: 'text-blue-700' },
    category: 'Database',
  },

  redis: {
    value: 'redis',
    label: 'Redis',
    icon: DiRedis,
    style: { iconColor: 'text-red-500' },
    category: 'Database',
  },

  seaorm: {
    value: 'seaorm',
    label: 'SeaORM',
    icon: GiWaveCrest,
    style: { iconColor: 'text-cyan-500' },
    category: 'ORM',
  },

  prisma: {
    value: 'prisma',
    label: 'Prisma',
    icon: SiPrisma,
    style: { iconColor: 'text-cyan-500' },
    category: 'ORM',
  },

  tailwind: {
    value: 'tailwind',
    label: 'Tailwind',
    icon: SiTailwindcss,
    style: { iconColor: 'text-cyan-500' },
    category: 'Styling',
  },

  fastify: {
    value: 'fastify',
    label: 'Fastify',
    icon: SiFastify,
    style: { iconColor: 'text-black dark:text-white' },
    category: 'Framework',
  },

  express: {
    value: 'express',
    label: 'Express',
    icon: SiExpress,
    style: { iconColor: 'text-gray-700 dark:text-gray-200' },
    category: 'Framework',
  },

  axios: {
    value: 'axios',
    label: 'Axios',
    icon: SiAxios,
    style: { iconColor: 'text-purple-500' },
    category: 'Tool',
  },
}

export function getTechOptions(): Array<MultiSelectGroup> {
  const groupMap = new Map<TechnologyName, Array<MultiSelectOption>>()

  for (const [, tech] of Object.entries(TECHNOLOGY_DATA)) {
    const { category, ...techData } = tech
    const options = groupMap.get(category)

    if (!options) {
      groupMap.set(category, [techData])
      continue
    }
    options.push(techData)
  }

  const optionsArr = Array.from(groupMap.entries()).map(
    ([heading, options]) => ({ heading, options })
  )

  return optionsArr
}
