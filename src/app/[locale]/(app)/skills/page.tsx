import { Cpu } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import type { Skill } from '@/@types/skill'
import { Container, MainContainer } from '@/app/_components/container'
import { SkillCard } from '@/app/_components/pages/skills/skill-card'
import { SoftSkills } from '@/app/_components/pages/skills/soft-skills'
import { softSkillsCount } from '@/app/_components/pages/skills/soft-skills-data'

const frontendSkills: Skill[] = [
  { name: 'react', level: 'Avançado', yearsOfExperience: 2 },
  { name: 'next', level: 'Avançado', yearsOfExperience: 2 },
  {
    name: 'typescript',
    level: 'Avançado',
    yearsOfExperience: 2,
  },
  {
    name: 'javascript',
    level: 'Avançado',
    yearsOfExperience: 2,
  },
  { name: 'tailwind', level: 'Expert', yearsOfExperience: 2 },
  { name: 'html', level: 'Avançado', yearsOfExperience: 3 },
  { name: 'css', level: 'Avançado', yearsOfExperience: 3 },
  {
    name: 'react-hook-form',
    level: 'Avançado',
    yearsOfExperience: 2,
  },
  {
    name: 'tanstack',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'react-markdown',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'react-native',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  { name: 'threejs', level: 'Basico', yearsOfExperience: 1 },
  { name: 'gsap', level: 'Basico', yearsOfExperience: 1 },
  { name: 'shadcn', level: 'Avançado', yearsOfExperience: 2 },
  { name: 'radix', level: 'Avançado', yearsOfExperience: 2 },
]

const backendSkills: Skill[] = [
  { name: 'node', level: 'Avançado', yearsOfExperience: 2 },
  {
    name: 'express',
    level: 'Intermediario',
    yearsOfExperience: 2,
  },
  {
    name: 'nextauth',
    level: 'Avançado',
    yearsOfExperience: 2,
  },
  { name: 'zod', level: 'Avançado', yearsOfExperience: 2 },
  {
    name: 'bullmq',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'rust',
    level: 'Intermediario',
    yearsOfExperience: 2,
  },
  { name: 'python', level: 'Basico', yearsOfExperience: 1 },
]

const databaseSkills: Skill[] = [
  {
    name: 'postgresql',
    level: 'Avançado',
    yearsOfExperience: 2,
  },
  {
    name: 'oracle',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'redis',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'supabase',
    level: 'Intermediario',
    yearsOfExperience: 2,
  },
  {
    name: 'prisma',
    level: 'Intermediario',
    yearsOfExperience: 2,
  },
  {
    name: 'pgvector',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'neondb',
    level: 'Intermediario',
    yearsOfExperience: 2,
  },
]

const aiSkills: Skill[] = [
  {
    name: 'openai',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'langchain',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'huggingface',
    level: 'Basico',
    yearsOfExperience: 1,
  },
  {
    name: 'openrouter',
    level: 'Basico',
    yearsOfExperience: 1,
  },
]

const toolsSkills: Skill[] = [
  {
    name: 'docker',
    level: 'Intermediario',
    yearsOfExperience: 2,
  },
  {
    name: 'netlify',
    level: 'Intermediario',
    yearsOfExperience: 2,
  },
  {
    name: 'eslint',
    level: 'Avançado',
    yearsOfExperience: 2,
  },
  {
    name: 'cloudinary',
    level: 'Basico',
    yearsOfExperience: 1,
  },
  {
    name: 'telegram',
    level: 'Basico',
    yearsOfExperience: 1,
  },
  {
    name: 'playwright',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'resend',
    level: 'Intermediario',
    yearsOfExperience: 1,
  },
  {
    name: 'react-email',
    level: 'Intermediario',
    yearsOfExperience: 1,
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
              color='border-2 border-primary bg-transparent'
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
