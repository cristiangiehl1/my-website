import { TECHNOLOGY_DATA } from '@/constants/technology-data'

import { Badge } from '../../ui/badge'
import { Separator } from '../../ui/separator'

export function AboutExperience() {
  return (
    <section className='flex flex-col gap-6 pt-16'>
      <Separator className='mb-2' />
      <h2 className='text-foreground text-2xl font-bold tracking-tight'>
        Experiência & Stack
      </h2>

      <div className='border-border bg-card rounded-xl border p-6'>
        <p className='text-muted-foreground leading-relaxed'>
          Atualmente atuo como{' '}
          <span className='text-foreground font-medium'>
            desenvolvedor pleno no Grupo Koch SA
          </span>
          , onde venho me especializando em Inteligência Artificial aplicada ao
          desenvolvimento de plataformas corporativas com integração de
          multi-agentes. Utilizo ferramentas como{' '}
          <span className='text-foreground font-medium'>Claude Code</span>,{' '}
          <span className='text-foreground font-medium'>opencode</span> e{' '}
          <span className='text-foreground font-medium'>OpenAI</span> para
          orquestrar agentes inteligentes que automatizam processos e
          centralizam interações internas.
        </p>
      </div>

      <div className='border-border bg-card rounded-xl border p-6'>
        <p className='text-muted-foreground leading-relaxed'>
          Ao longo de mais de 2 anos de experiência, adquiri sólida base no
          ecossistema frontend com{' '}
          <span className='text-foreground font-medium'>TanStack</span>,{' '}
          <span className='text-foreground font-medium'>shadcn/ui</span>,{' '}
          <span className='text-foreground font-medium'>Zod</span> e{' '}
          <span className='text-foreground font-medium'>Tailwind CSS</span>,
          além de boas práticas de testes com{' '}
          <span className='text-foreground font-medium'>Jest</span> e{' '}
          <span className='text-foreground font-medium'>Cypress</span>. No
          backend, trabalho com Node.js e Next.js (Server Actions), bancos{' '}
          <span className='text-foreground font-medium'>OracleDB</span> e{' '}
          <span className='text-foreground font-medium'>
            PostgreSQL / pgvector
          </span>
          , filas assíncronas com{' '}
          <span className='text-foreground font-medium'>Redis</span> e{' '}
          <span className='text-foreground font-medium'>BullMQ</span>, e
          integrações com ERPs e sistemas legados. Também construo pipelines de{' '}
          <span className='text-foreground font-medium'>RAG</span> e ingestão de
          documentos com LLMs usando{' '}
          <span className='text-foreground font-medium'>LangChain</span>,{' '}
          <span className='text-foreground font-medium'>OpenAI</span> e{' '}
          <span className='text-foreground font-medium'>HuggingFace</span>.
        </p>
      </div>

      <div className='flex flex-wrap gap-2'>
        {Object.values(TECHNOLOGY_DATA).map(
          ({ label, icon: Icon, style, link }) => (
            <a href={link} key={label}>
              <Badge
                variant='outline'
                className='hover:border-primary gap-2 border-2 px-4 py-2 [&>svg]:size-5'>
                <Icon className={style.iconColor} />
                {label}
              </Badge>
            </a>
          )
        )}
      </div>
    </section>
  )
}
