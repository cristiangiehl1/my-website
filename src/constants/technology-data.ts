import type { IconType } from 'react-icons'
import { BiLogoPostgresql } from 'react-icons/bi'
import { DiRedis } from 'react-icons/di'
import { FaDocker, FaNode } from 'react-icons/fa'
import { GiSteamLocomotive, GiWaveCrest } from 'react-icons/gi'
import { GrValidate } from 'react-icons/gr'
import { LuTreePalm } from 'react-icons/lu'
import { MdHttp } from 'react-icons/md'
import {
  SiAuth0,
  SiAxios,
  SiCloudinary,
  SiCookiecutter,
  SiCryptpad,
  SiCss3,
  SiDotenv,
  SiEslint,
  SiExpress,
  SiFastify,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiNodemon,
  SiPrisma,
  SiPython,
  SiReact,
  SiRust,
  SiServerless,
  SiSocketdotio,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiZod,
} from 'react-icons/si'
import {
  TbBrandCypress,
  TbBrandFramerMotion,
  TbBrandReactNative,
} from 'react-icons/tb'

import type { TechonologyCategory } from '@/@types/technology'
import type {
  MultiSelectGroup,
  MultiSelectOption,
} from '@/app/_components/ui/multi-select'

export const TECHNOLOGY_DATA = {
  // Programming Languages
  javascript: {
    value: 'javascript',
    label: 'Javascript',
    icon: SiJavascript,
    style: { iconColor: 'text-yellow-500' },
    category: 'Programming Language',
    link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  typescript: {
    value: 'typescript',
    label: 'Typescript',
    icon: SiTypescript,
    style: { iconColor: 'text-blue-600' },
    category: 'Programming Language',
    link: 'https://github.com/microsoft/TypeScript',
  },
  rust: {
    value: 'rust',
    label: 'Rust',
    icon: SiRust,
    style: { iconColor: 'text-orange-600' },
    category: 'Programming Language',
    link: 'https://github.com/rust-lang/rust',
  },
  python: {
    value: 'python',
    label: 'Python',
    icon: SiPython,
    style: { iconColor: 'text-blue-400' },
    category: 'Programming Language',
    link: 'https://www.python.org/',
  },

  // Runtime
  node: {
    value: 'node',
    label: 'Node.js',
    icon: SiNodedotjs,
    style: { iconColor: 'text-green-600' },
    category: 'Runtime',
    link: 'https://github.com/nodejs/node',
  },

  // Frameworks
  react: {
    value: 'react',
    label: 'React',
    icon: SiReact,
    style: { iconColor: 'text-cyan-400' },
    category: 'Framework',
    link: 'https://github.com/facebook/react',
  },
  'react-native': {
    value: 'react-native',
    label: 'React Native',
    icon: TbBrandReactNative,
    style: { iconColor: 'text-cyan-400' },
    category: 'Framework',
    link: 'https://reactnative.dev/',
  },
  next: {
    value: 'next',
    label: 'Next.js',
    icon: SiNextdotjs,
    style: { iconColor: 'text-white' },
    category: 'Framework',
    link: 'https://github.com/vercel/next.js',
  },
  loco: {
    value: 'loco',
    label: 'Loco.rs',
    icon: GiSteamLocomotive,
    style: { iconColor: 'text-red-500' },
    category: 'Framework',
    link: 'https://github.com/loco-rs/loco',
  },
  fastify: {
    value: 'fastify',
    label: 'Fastify',
    icon: SiFastify,
    style: { iconColor: 'text-black dark:text-white' },
    category: 'Framework',
    link: 'https://github.com/fastify/fastify',
  },
  express: {
    value: 'express',
    label: 'Express',
    icon: SiExpress,
    style: { iconColor: 'text-gray-700 dark:text-gray-200' },
    category: 'Framework',
    link: 'https://github.com/expressjs/express',
  },

  // Animation
  gsap: {
    value: 'gsap',
    label: 'GSAP',
    icon: TbBrandFramerMotion,
    style: { iconColor: 'text-green-500' },
    category: 'Animation',
    link: 'https://github.com/greensock/GSAP',
  },
  threejs: {
    value: 'threejs',
    label: 'Three.js',
    icon: SiThreedotjs,
    style: { iconColor: 'text-blue-500' },
    category: 'Animation',
    link: 'https://github.com/mrdoob/three.js/',
  },

  // Validation
  zod: {
    value: 'zod',
    label: 'Zod',
    icon: SiZod,
    style: { iconColor: 'text-blue-500' },
    category: 'Validation',
    link: 'https://github.com/colinhacks/zod',
  },
  validator: {
    value: 'validator',
    label: 'Validator',
    icon: GrValidate,
    style: { iconColor: 'text-purple-500' },
    category: 'Validation',
    link: 'https://github.com/validatorjs/validator.js',
  },

  // State Management
  tanstack: {
    value: 'tanstack',
    label: 'TanStack',
    icon: LuTreePalm,
    style: { iconColor: 'text-orange-500' },
    category: 'State Management',
    link: 'https://github.com/TanStack/query',
  },

  // DevOps / Deployment
  docker: {
    value: 'docker',
    label: 'Docker',
    icon: FaDocker,
    style: { iconColor: 'text-blue-500' },
    category: 'DevOps',
    link: 'https://github.com/docker',
  },
  netlify: {
    value: 'netlify',
    label: 'Netlify',
    icon: SiNetlify,
    style: { iconColor: 'text-cyan-400' },
    category: 'Deploy',
    link: 'https://www.netlify.com/',
  },
  'serverless-http': {
    value: 'serverless-http',
    label: 'Serverless HTTP',
    icon: MdHttp,
    style: { iconColor: 'text-teal-500' },
    category: 'Deploy',
    link: 'https://github.com/dougmoscrop/serverless-http',
  },
  cloudinary: {
    value: 'cloudinary',
    label: 'Cloudinary',
    icon: SiCloudinary,
    style: { iconColor: 'text-blue-500' },
    category: 'Deploy',
    link: 'https://cloudinary.com/',
  },

  // Testing
  jest: {
    value: 'jest',
    label: 'Jest',
    icon: SiJest,
    style: { iconColor: 'text-red-500' },
    category: 'Testing',
    link: 'https://github.com/jestjs/jest',
  },
  cypress: {
    value: 'cypress',
    label: 'Cypress',
    icon: TbBrandCypress,
    style: { iconColor: 'text-teal-500' },
    category: 'Testing',
    link: 'https://github.com/cypress-io/cypress',
  },

  // Database / ORM
  postgresql: {
    value: 'postgresql',
    label: 'PostgreSQL',
    icon: BiLogoPostgresql,
    style: { iconColor: 'text-blue-700' },
    category: 'Database',
    link: 'https://www.postgresql.org/',
  },
  redis: {
    value: 'redis',
    label: 'Redis',
    icon: DiRedis,
    style: { iconColor: 'text-red-500' },
    category: 'Database',
    link: 'https://redis.io/',
  },
  prisma: {
    value: 'prisma',
    label: 'Prisma',
    icon: SiPrisma,
    style: { iconColor: 'text-cyan-500' },
    category: 'ORM',
    link: 'https://github.com/prisma/prisma',
  },
  seaorm: {
    value: 'seaorm',
    label: 'SeaORM',
    icon: GiWaveCrest,
    style: { iconColor: 'text-cyan-500' },
    category: 'ORM',
    link: 'https://github.com/SeaQL/sea-orm',
  },
  'node-pg-migrate': {
    value: 'node-pg-migrate',
    label: 'Node PG Migrate',
    icon: FaNode,
    style: { iconColor: 'text-orange-400' },
    category: 'Database',
    link: 'https://github.com/salsita/node-pg-migrate',
  },
  neondb: {
    value: 'neondb',
    label: 'NeonDB',
    icon: SiServerless,
    style: { iconColor: 'text-green-500' },
    category: 'Database',
    link: 'https://neon.tech/',
  },

  // Tool
  axios: {
    value: 'axios',
    label: 'Axios',
    icon: SiAxios,
    style: { iconColor: 'text-purple-500' },
    category: 'Tool',
    link: 'https://github.com/axios/axios',
  },
  socketio: {
    value: 'socketio',
    label: 'Socket.io',
    icon: SiSocketdotio,
    style: { iconColor: 'text-white dark:text-black' },
    category: 'Tool',
    link: 'https://github.com/socketio/socket.io',
  },
  nodemon: {
    value: 'nodemon',
    label: 'Nodemon',
    icon: SiNodemon,
    style: { iconColor: 'text-green-400' },
    category: 'Tool',
    link: 'https://github.com/remy/nodemon',
  },
  dotenv: {
    value: 'dotenv',
    label: 'Dotenv',
    icon: SiDotenv,
    style: { iconColor: 'text-green-600' },
    category: 'Tool',
    link: 'https://github.com/motdotla/dotenv',
  },
  cookieparser: {
    value: 'cookie-parser',
    label: 'Cookie Parser',
    icon: SiCookiecutter,
    style: { iconColor: 'text-orange-400' },
    category: 'Tool',
    link: 'https://github.com/expressjs/cookie-parser',
  },
  bcryptjs: {
    value: 'bcryptjs',
    label: 'Bcrypt.js',
    icon: SiCryptpad,
    style: { iconColor: 'text-red-600' },
    category: 'Security',
    link: 'https://github.com/dcodeIO/bcrypt.js',
  },
  nextauth: {
    value: 'nextauth',
    label: 'NextAuth.js',
    icon: SiAuth0,
    style: { iconColor: 'text-blue-500' },
    category: 'Security',
    link: 'https://next-auth.js.org/',
  },

  tailwind: {
    value: 'tailwind',
    label: 'Tailwind',
    icon: SiTailwindcss,
    style: { iconColor: 'text-cyan-500' },
    category: 'Styling',
    link: 'https://github.com/tailwindlabs/tailwindcss',
  },

  css: {
    value: 'css',
    label: 'CSS',
    icon: SiCss3,
    style: { iconColor: 'text-blue-500' },
    category: 'Styling',
    link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  },

  html: {
    value: 'html',
    label: 'HTML',
    icon: SiHtml5,
    style: { iconColor: 'text-orange-500' },
    category: 'Styling',
    link: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  },

  // Linter
  eslint: {
    value: 'eslint',
    label: 'ESLint',
    icon: SiEslint,
    style: { iconColor: 'text-purple-400' },
    category: 'Dev Tool',
    link: 'https://github.com/eslint/eslint',
  },
} as const satisfies Record<
  string,
  {
    value: string
    label: string
    icon: IconType
    style?: {
      badgeColor?: string
      iconColor?: string
      gradient?: string
    }
    category: TechonologyCategory
    link: string
  }
>

export function getTechOptions(): Array<MultiSelectGroup> {
  const groupMap = new Map<TechonologyCategory, Array<MultiSelectOption>>()

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
