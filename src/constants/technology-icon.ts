import type { IconType } from 'react-icons'
import {
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRust,
  SiTailwindcss,
  SiTypescript,
  SiZod,
} from 'react-icons/si'
import { TbBrandFramerMotion } from 'react-icons/tb'

import type { Technology } from '@/@types/technology'
import type { MultiSelectOption } from '@/app/_components/ui/multi-select'

export const TECHNOLOGY_ICON: Record<
  Technology,
  { icon: IconType; className?: string }
> = {
  'Next.js': { icon: SiNextdotjs, className: 'text-white' },
  TypeScript: { icon: SiTypescript, className: 'text-blue-600' },
  PostgreSQL: { icon: SiPostgresql, className: 'text-blue-700' },
  Tailwind: { icon: SiTailwindcss, className: 'text-cyan-500' },
  'Node.js': { icon: SiNodedotjs, className: 'text-green-600' },
  React: { icon: SiReact, className: 'text-cyan-400' },
  Rust: { icon: SiRust, className: 'text-orange-600' },
  Python: { icon: SiPython, className: 'text-blue-400' },
  GSAP: { icon: TbBrandFramerMotion, className: 'text-green-500' },
  Zod: { icon: SiZod, className: 'text-blue-500' },
}

export const TECH_OPTIONS: MultiSelectOption[] = (
  Object.keys(TECHNOLOGY_ICON) as Technology[]
).map((tech) => ({
  label: tech,
  value: tech,
  icon: TECHNOLOGY_ICON[tech].icon,
  style: {
    iconColor: TECHNOLOGY_ICON[tech].className,
  },
}))
