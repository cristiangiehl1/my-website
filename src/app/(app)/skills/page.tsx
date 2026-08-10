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
    description: 'App Router, SSR/ISR, Server Actions, Route Handlers',
  },
  {
    name: 'typescript',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Generics, utility types, tipagem ponta a ponta',
  },
  {
    name: 'javascript',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'ES moderno, assincronismo, DOM',
  },
  {
    name: 'tailwind',
    level: 'Expert',
    yearsOfExperience: 2,
    description: 'Design systems, responsividade, tema dark',
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
    description: 'Layouts, animações, responsividade',
  },
  {
    name: 'react-hook-form',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Formularios performaticos integrados ao Zod',
  },
  {
    name: 'tanstack',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'TanStack Query: cache e sincronização de dados',
  },
  {
    name: 'react-markdown',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'Renderização de markdown com remark-gfm',
  },
  {
    name: 'react-native',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'Apps mobile cross-platform',
  },
  {
    name: 'threejs',
    level: 'Basico',
    yearsOfExperience: 1,
    description: 'Cenas 3D e elementos interativos',
  },
  {
    name: 'gsap',
    level: 'Basico',
    yearsOfExperience: 1,
    description: 'Animações e transições',
  },
]

const backendSkills: Skill[] = [
  {
    name: 'node',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'APIs REST, workers, jobs agendados',
  },
  {
    name: 'express',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'APIs minimalistas, middlewares, sessões',
  },
  {
    name: 'nextauth',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Auth v5, JWT, provider customizado (ERP/LDAP)',
  },
  {
    name: 'zod',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Validação de schemas e env em todo o stack',
  },
  {
    name: 'bullmq',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'Filas assincronas e workers com Redis',
  },
  {
    name: 'rust',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'APIs com Loco.rs e SeaORM',
  },
  {
    name: 'python',
    level: 'Basico',
    yearsOfExperience: 1,
    description: 'Scripts, automação, data analysis',
  },
]

const databaseSkills: Skill[] = [
  {
    name: 'postgresql',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Modelagem, SQL, migrations, otimização',
  },
  {
    name: 'oracle',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'OracleDB corporativo, pool de conexões, transações',
  },
  {
    name: 'redis',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'Cache e backing das filas BullMQ',
  },
  {
    name: 'supabase',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'Postgres gerenciado + pgvector em produção',
  },
  {
    name: 'prisma',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'ORM type-safe, schema e migrations',
  },
  {
    name: 'pgvector',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'Busca vetorial (HNSW, cosseno) para RAG',
  },
  {
    name: 'neondb',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'Postgres serverless',
  },
]

const aiSkills: Skill[] = [
  {
    name: 'openai',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'Agentes, function calling, structured outputs',
  },
  {
    name: 'langchain',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: 'Splitters, loaders e orquestração de RAG',
  },
  {
    name: 'huggingface',
    level: 'Basico',
    yearsOfExperience: 1,
    description: 'Embeddings via Inference API',
  },
  {
    name: 'openrouter',
    level: 'Basico',
    yearsOfExperience: 1,
    description: 'LLMs de chat com streaming',
  },
]

const toolsSkills: Skill[] = [
  {
    name: 'docker',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'Containers, Docker Compose, multi-serviço',
  },
  {
    name: 'netlify',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: 'Deploy de apps e funções serverless',
  },
  {
    name: 'eslint',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: 'Padronização e qualidade de código',
  },
  {
    name: 'cloudinary',
    level: 'Basico',
    yearsOfExperience: 1,
    description: 'Upload e otimização de midia',
  },
  {
    name: 'telegram',
    level: 'Basico',
    yearsOfExperience: 1,
    description: 'Bots como canal de mensagens',
  },
]

const skillSections: { title: string; color: string; skills: Skill[] }[] = [
  { title: 'Frontend', color: 'bg-primary', skills: frontendSkills },
  { title: 'Backend & Runtime', color: 'bg-secondary', skills: backendSkills },
  { title: 'Banco de Dados', color: 'bg-chart-1', skills: databaseSkills },
  { title: 'IA & RAG', color: 'bg-chart-2', skills: aiSkills },
  {
    title: 'DevOps & Ferramentas',
    color: 'bg-chart-3',
    skills: toolsSkills,
  },
]

const totalTechnologies = skillSections.reduce(
  (total, section) => total + section.skills.length,
  0
)

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
            <StatItem value={`${totalTechnologies}+`} label='Tecnologias' />
            <StatItem value='2+' label='Anos de experiencia' />
            <StatItem
              value={softSkills.length.toString()}
              label='Soft Skills'
            />
          </div>
        </header>

        {/* Technical Skills */}
        {skillSections.map((section) => (
          <section key={section.title} className='flex flex-col gap-6'>
            <div className='flex items-center gap-3'>
              <div className={`${section.color} h-1 w-8 rounded-full`} />
              <h2 className='text-foreground text-2xl font-bold'>
                {section.title}
              </h2>
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {section.skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </section>
        ))}

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
