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
    icon: IconType
    iconColor?: string
    category: TechonologyCategory
  }
> = {
  JavaScript: {
    value: 'javascript',
    icon: SiJavascript,
    iconColor: 'text-yellow-500',
    category: 'Programming Language',
  },

  TypeScript: {
    value: 'typescript',
    icon: SiTypescript,
    iconColor: 'text-blue-600',
    category: 'Programming Language',
  },

  Rust: {
    value: 'rust',
    icon: SiRust,
    iconColor: 'text-orange-600',
    category: 'Programming Language',
  },

  Python: {
    value: 'python',
    icon: SiPython,
    iconColor: 'text-blue-400',
    category: 'Programming Language',
  },

  Node: {
    value: 'node',
    icon: SiNodedotjs,
    iconColor: 'text-green-600',
    category: 'Runtime',
  },

  React: {
    value: 'react',
    icon: SiReact,
    iconColor: 'text-cyan-400',
    category: 'Framework',
  },

  Next: {
    value: 'next',
    icon: SiNextdotjs,
    iconColor: 'text-white',
    category: 'Framework',
  },

  Loco: {
    value: 'loco',
    icon: GiSteamLocomotive,
    iconColor: 'text-red-500',
    category: 'Framework',
  },

  GSAP: {
    value: 'gsap',
    icon: TbBrandFramerMotion,
    iconColor: 'text-green-500',
    category: 'Animation',
  },

  Zod: {
    value: 'zod',
    icon: SiZod,
    iconColor: 'text-blue-500',
    category: 'Validation',
  },

  TanStack: {
    value: 'tanstack',
    icon: LuTreePalm,
    iconColor: 'text-orange-500',
    category: 'State Management',
  },

  Docker: {
    value: 'docker',
    icon: FaDocker,
    iconColor: 'text-blue-500',
    category: 'DevOps',
  },

  Jest: {
    value: 'jest',
    icon: SiJest,
    iconColor: 'text-red-500',
    category: 'Testing',
  },

  Cypress: {
    value: 'cypress',
    icon: TbBrandCypress,
    iconColor: 'text-teal-500',
    category: 'Testing',
  },

  PostgreSQL: {
    value: 'postgresql',
    icon: SiPostgresql,
    iconColor: 'text-blue-700',
    category: 'Database',
  },

  Redis: {
    value: 'redis',
    icon: DiRedis,
    iconColor: 'text-red-500',
    category: 'Database',
  },

  SeaORM: {
    value: 'seaorm',
    icon: GiWaveCrest,
    iconColor: 'text-cyan-500',
    category: 'ORM',
  },

  Prisma: {
    value: 'prisma',
    icon: SiPrisma,
    iconColor: 'text-cyan-500',
    category: 'ORM',
  },

  Tailwind: {
    value: 'tailwind',
    icon: SiTailwindcss,
    iconColor: 'text-cyan-500',
    category: 'Styling',
  },
  Fastify: {
    value: 'fastify',
    icon: SiFastify,
    iconColor: 'text-black dark:text-white',
    category: 'Framework',
  },

  Express: {
    value: 'express',
    icon: SiExpress,
    iconColor: 'text-gray-700 dark:text-gray-200',
    category: 'Framework',
  },

  Axios: {
    value: 'axios',
    icon: SiAxios,
    iconColor: 'text-purple-500',
    category: 'Tool',
  },
}

export function getTechOptions(): Array<MultiSelectGroup> {
  const groupMap = new Map<TechnologyName, Array<MultiSelectOption>>()

  for (const [techName, { category, icon, value, iconColor }] of Object.entries(
    TECHNOLOGY_DATA
  )) {
    const options = groupMap.get(category)

    if (!options) {
      groupMap.set(category, [
        { label: techName, value, icon, style: { iconColor } },
      ])
      continue
    }
    options.push({ label: techName, value, icon, style: { iconColor } })
  }

  const optionsArr = Array.from(groupMap.entries()).map(
    ([heading, options]) => ({ heading, options })
  )

  return optionsArr
}
