import { Bot, Code, Download, Server } from 'lucide-react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'

import { BlobBackground } from '@/app/_components/blob-background'
import { Button } from '@/app/_components/ui/button'
import { getResumeHref } from '@/helpers/get-resume-href'

export function AboutHero() {
  const t = useTranslations('about')
  const tc = useTranslations('common')
  const locale = useLocale()

  return (
    <section className='flex flex-col gap-8'>
      <div className='flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-12'>
        <BlobBackground className='relative h-28 w-28 shrink-0 sm:h-40 sm:w-40'>
          <div className='ring-border absolute inset-0 overflow-hidden rounded-full ring-4'>
            <Image
              src='/images/me.jpeg'
              alt='Cristian Giehl'
              fill
              sizes='(min-width: 640px) 144px, 112px'
              className='object-cover'
              priority
            />
          </div>
        </BlobBackground>
        <div className='flex flex-col gap-4'>
          <h1 className='text-foreground text-4xl font-bold tracking-tight text-balance lg:text-5xl'>
            {t.rich('hero.title', {
              hl: (c) => <span className='text-primary'>{c}</span>,
            })}
          </h1>
          <p className='text-muted-foreground max-w-2xl text-lg leading-relaxed text-pretty'>
            {t.rich('hero.intro', {
              b: (c) => (
                <span className='text-foreground font-medium'>{c}</span>
              ),
            })}
          </p>
          <div className='pt-2'>
            <Button
              asChild
              variant='outline'
              className='border-border hover:bg-muted bg-transparent'>
              <a href={getResumeHref(locale)} download>
                <Download className='mr-2 h-4 w-4' />
                {tc('downloadResume')}
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Code className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>
              {t('hero.cards.frontend.title')}
            </p>
            <p className='text-muted-foreground text-sm'>
              {t('hero.cards.frontend.desc')}
            </p>
          </div>
        </div>

        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Server className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>
              {t('hero.cards.backend.title')}
            </p>
            <p className='text-muted-foreground text-sm'>
              {t('hero.cards.backend.desc')}
            </p>
          </div>
        </div>

        <div className='group border-border bg-card hover:border-primary/40 flex flex-col gap-3 rounded-xl border p-5 transition-colors'>
          <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
            <Bot className='h-5 w-5' />
          </div>
          <div>
            <p className='text-card-foreground font-semibold'>
              {t('hero.cards.ai.title')}
            </p>
            <p className='text-muted-foreground text-sm'>
              {t('hero.cards.ai.desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
