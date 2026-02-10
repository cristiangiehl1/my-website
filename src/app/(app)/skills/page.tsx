import { Cpu } from 'lucide-react'
import type { Metadata } from 'next'

import type { Skill } from '@/@types/skill'
import { Container, MainContainer } from '@/app/_components/container'
import { SkillCard } from '@/app/_components/pages/skills/skill-card'
import {
  SoftSkills,
  softSkills,
} from '@/app/_components/pages/skills/soft-skills'

const frontendSkills: Skill[] = [
  {
    name: 'react',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Hooks, Context, Server Components',
  },
  {
    name: 'next',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'App Router, SSR, ISR, API Routes',
  },
  {
    name: 'typescript',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Types, Generics, Utility Types',
  },
  {
    name: 'tailwind',
    level: 'Expert',
    yearsOfExperience: 2,
    description: 'Design systems, responsividade',
  },
  {
    name: 'react-native',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'Apps mobile cross-platform',
  },
  {
    name: 'html',
    level: 'Avançado',
    yearsOfExperience: 3,
    description: 'Semantica, acessibilidade, animações',
  },
  {
    name: 'css',
    level: 'Avançado',
    yearsOfExperience: 3,
    description: 'Semantica, acessibilidade, animações',
  },
]

const backendSkills: Skill[] = [
  {
    name: 'node',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Express, Fastify, APIs REST',
  },
  {
    name: 'rust',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'Queries, migrations, otimização',
  },
  {
    name: 'python',
    level: 'Basico',
    yearsOfExperience: 1,
    description: 'Scripts, automação, data analysis',
  },
]

const toolsSkills: Skill[] = [
  {
    name: 'postgresql',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'Queries, migrations, otimização',
  },

  {
    name: 'docker',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'Containers, Docker Compose',
  },
]

export const metadata: Metadata = {
  title: 'Skills',
}

export default function SkillsPage() {
  return (
    <Container>
      <MainContainer className='flex flex-col gap-10'>
        {/* Header */}
        <header className='flex flex-col gap-6'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                <Cpu className='text-primary h-5 w-5' />
              </div>
              <div className='bg-primary/20 text-primary rounded-full px-3 py-1 text-xs font-medium'>
                Habilidades Tecnicas
              </div>
            </div>

            <h1 className='text-foreground text-4xl font-bold tracking-tight text-balance lg:text-5xl'>
              Minhas <span className='text-primary'>Skills</span>
            </h1>
            <p className='text-muted-foreground max-w-2xl text-lg leading-relaxed'>
              Tecnologias e ferramentas que utilizo no dia a dia para construir
              aplicações modernas, performaticas e escalaveis.
            </p>
          </div>

          {/* Stats */}
          <div className='mt-2 flex flex-wrap gap-6'>
            <StatItem
              value={
                (
                  frontendSkills.length +
                  backendSkills.length +
                  toolsSkills.length
                ).toString() + '+'
              }
              label='Tecnologias'
            />
            <StatItem value='1.5+' label='Anos de experiencia' />
            <StatItem
              value={softSkills.length.toString()}
              label='Soft Skills'
            />
          </div>
        </header>

        {/* Frontend Skills */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary h-1 w-8 rounded-full' />
            <h2 className='text-foreground text-2xl font-bold'>Frontend</h2>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {frontendSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </section>

        {/* Backend Skills */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-secondary h-1 w-8 rounded-full' />
            <h2 className='text-foreground text-2xl font-bold'>Backend</h2>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {backendSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </section>

        {/* Tools Skills */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-secondary h-1 w-8 rounded-full' />
            <h2 className='text-foreground text-2xl font-bold'>Ferramentas</h2>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {toolsSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </section>

        {/* Soft Skills */}
        <section className='flex flex-col gap-6'>
          <div className='flex items-center gap-3'>
            <div className='bg-chart-4 h-1 w-8 rounded-full' />
            <h2 className='text-foreground text-2xl font-bold'>Soft Skills</h2>
          </div>
          <p className='text-muted-foreground max-w-xl leading-relaxed'>
            Alem das habilidades tecnicas, acredito que competencias
            comportamentais sao fundamentais para o sucesso de qualquer projeto.
          </p>
          <SoftSkills />
        </section>

        {/* Legend */}
        <section className='bg-card border-border rounded-xl border p-6'>
          <h3 className='text-card-foreground mb-4 text-sm font-bold tracking-wider uppercase'>
            Legenda de niveis
          </h3>
          <div className='flex flex-wrap gap-6'>
            <LegendItem
              color='bg-chart-1'
              label='Basico'
              description='Conhecimento fundamental'
            />
            <LegendItem
              color='bg-secondary'
              label='Intermediario'
              description='Uso regular em projetos'
            />
            <LegendItem
              color='bg-primary'
              label='Avançado'
              description='Dominio solido e autonomia'
            />
            <LegendItem
              color='bg-chart-4'
              label='Expert'
              description='Referencia e mentoria'
            />
          </div>
        </section>
      </MainContainer>
    </Container>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className='flex items-baseline gap-2'>
      <span className='text-primary text-2xl font-bold'>{value}</span>
      <span className='text-muted-foreground text-sm'>{label}</span>
    </div>
  )
}

function LegendItem({
  color,
  label,
  description,
}: {
  color: string
  label: string
  description: string
}) {
  return (
    <div className='flex items-center gap-2'>
      <div className={`h-3 w-3 rounded-full ${color}`} />
      <span className='text-card-foreground text-sm font-semibold'>
        {label}
      </span>
      <span className='text-muted-foreground hidden text-xs sm:inline'>
        - {description}
      </span>
    </div>
  )
}
