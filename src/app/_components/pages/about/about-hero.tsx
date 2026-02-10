import { Code, Cpu, Server } from 'lucide-react'

export function AboutHero() {
  return (
    <section className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-foreground text-4xl font-bold tracking-tight text-balance lg:text-5xl'>
          Desenvolvedor <span className='text-primary'>Full Stack</span>
        </h1>
        <p className='text-muted-foreground max-w-2xl text-lg leading-relaxed text-pretty'>
          Mais de 1 ano de experiencia atuando em uma startup americana,
          construindo interfaces modernas e backends robustos.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Code className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>Frontend</p>
            <p className='text-muted-foreground text-sm'>
              TypeScript & Next.js
            </p>
          </div>
        </div>

        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Server className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>Backend</p>
            <p className='text-muted-foreground text-sm'>Rust & Node.js</p>
          </div>
        </div>

        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Cpu className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>Afinidade</p>
            <p className='text-muted-foreground text-sm'>
              React e Next.js (maior profundidade)
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
