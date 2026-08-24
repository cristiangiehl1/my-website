import { Cpu } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Skill } from '@/@types/skill'
import { Container, MainContainer } from '@/app/_components/container'
import { SkillCard } from '@/app/_components/pages/skills/skill-card'
import { SoftSkills } from '@/app/_components/pages/skills/soft-skills'
import { softSkillsCount } from '@/app/_components/pages/skills/soft-skills-data'

const frontendSkills: Skill[] = [
  { name: 'react', level: 'Avançado', yearsOfExperience: 2, description: '' },
  { name: 'next', level: 'Avançado', yearsOfExperience: 2, description: '' },
  {
    name: 'typescript',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'javascript',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: '',
  },
  { name: 'tailwind', level: 'Expert', yearsOfExperience: 2, description: '' },
  { name: 'html', level: 'Avançado', yearsOfExperience: 3, description: '' },
  { name: 'css', level: 'Avançado', yearsOfExperience: 3, description: '' },
  {
    name: 'react-hook-form',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'tanstack',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'react-markdown',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'react-native',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  { name: 'threejs', level: 'Basico', yearsOfExperience: 1, description: '' },
  { name: 'gsap', level: 'Basico', yearsOfExperience: 1, description: '' },
  { name: 'shadcn', level: 'Avançado', yearsOfExperience: 2, description: '' },
  { name: 'radix', level: 'Avançado', yearsOfExperience: 2, description: '' },
]

const backendSkills: Skill[] = [
  { name: 'node', level: 'Avançado', yearsOfExperience: 2, description: '' },
  {
    name: 'express',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'nextauth',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: '',
  },
  { name: 'zod', level: 'Avançado', yearsOfExperience: 2, description: '' },
  {
    name: 'bullmq',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'rust',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: '',
  },
  { name: 'python', level: 'Basico', yearsOfExperience: 1, description: '' },
]

const databaseSkills: Skill[] = [
  {
    name: 'postgresql',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'oracle',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'redis',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'supabase',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'prisma',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'pgvector',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'neondb',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: '',
  },
]

const aiSkills: Skill[] = [
  {
    name: 'openai',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'langchain',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'huggingface',
    level: 'Basico',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'openrouter',
    level: 'Basico',
    yearsOfExperience: 1,
    description: '',
  },
]

const toolsSkills: Skill[] = [
  {
    name: 'docker',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'netlify',
    level: 'Intermediario',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'eslint',
    level: 'Avançado',
    yearsOfExperience: 2,
    description: '',
  },
  {
    name: 'cloudinary',
    level: 'Basico',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'telegram',
    level: 'Basico',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'playwright',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'resend',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'react-email',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'skills' })
  return { title: t('metaTitle') }
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('skills')

  const skillSections = [
    {
      key: 'frontend' as const,
      title: t('sections.frontend'),
      color: 'bg-primary',
      skills: frontendSkills,
    },
    {
      key: 'backend' as const,
      title: t('sections.backend'),
      color: 'bg-foreground',
      skills: backendSkills,
    },
    {
      key: 'database' as const,
      title: t('sections.database'),
      color: 'bg-chart-1',
      skills: databaseSkills,
    },
    {
      key: 'ai' as const,
      title: t('sections.ai'),
      color: 'bg-chart-2',
      skills: aiSkills,
    },
    {
      key: 'tools' as const,
      title: t('sections.tools'),
      color: 'bg-chart-3',
      skills: toolsSkills,
    },
  ]

  const totalTechnologies = skillSections.reduce(
    (total, section) => total + section.skills.length,
    0
  )

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
                {t('eyebrow')}
              </div>
            </div>

            <h1 className='text-foreground text-4xl font-bold tracking-tight text-balance lg:text-5xl'>
              {t.rich('title', {
                hl: (c) => <span className='text-primary'>{c}</span>,
              })}
            </h1>
            <p className='text-muted-foreground max-w-2xl text-lg leading-relaxed'>
              {t('intro')}
            </p>
          </div>

          {/* Stats */}
          <div className='mt-2 flex flex-wrap gap-6'>
            <StatItem
              value={`${totalTechnologies}+`}
              label={t('stats.technologies')}
            />
            <StatItem value='2+' label={t('stats.experience')} />
            <StatItem
              value={softSkillsCount.toString()}
              label={t('stats.softSkills')}
            />
          </div>
        </header>

        {/* Technical Skills */}
        {skillSections.map((section) => (
          <section key={section.key} className='flex flex-col gap-6'>
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
            <h2 className='text-foreground text-2xl font-bold'>
              {t('sections.soft')}
            </h2>
          </div>
          <p className='text-muted-foreground max-w-xl leading-relaxed'>
            {t('softIntro')}
          </p>
          <SoftSkills />
        </section>

        {/* Legend */}
        <section className='bg-card border-border rounded-xl border p-6'>
          <h3 className='text-card-foreground mb-4 text-sm font-bold tracking-wider uppercase'>
            {t('legendTitle')}
          </h3>
          <div className='flex flex-wrap gap-6'>
            <LegendItem
              color='bg-muted-foreground'
              label={t('levels.Basico.label')}
              description={t('levels.Basico.description')}
            />
            <LegendItem
              color='bg-foreground'
              label={t('levels.Intermediario.label')}
              description={t('levels.Intermediario.description')}
            />
            <LegendItem
              color='bg-primary'
              label={t('levels.Avançado.label')}
              description={t('levels.Avançado.description')}
            />
            <LegendItem
              color='bg-primary'
              label={t('levels.Expert.label')}
              description={t('levels.Expert.description')}
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
