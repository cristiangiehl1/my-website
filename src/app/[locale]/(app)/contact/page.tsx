import { Terminal } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container, MainContainer } from '@/app/_components/container'
import { ContactForm } from '@/app/_components/pages/contact/contact-form'
import { ContactInfo } from '@/app/_components/pages/contact/contact-info'

export const metadata: Metadata = {
  title: 'Contato',
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <Container>
      <MainContainer>
        <div className='relative flex-col gap-16'>
          {/* Header */}
          <section className='flex flex-col gap-6'>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Terminal className='text-primary h-5 w-5' />
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
              <p className='text-muted-foreground max-w-xl text-lg leading-relaxed'>
                {t('intro')}
              </p>
            </div>
          </section>

          {/* Content grid */}
          <div className='mt-4 flex w-full flex-col items-start gap-12 lg:flex-row lg:justify-between'>
            {/* Left column - Info */}
            <ContactInfo />

            {/* Right column - Form */}
            <section
              id='contact-form'
              className='bg-card border-border shadow-soft-stack rounded-2xl border p-6 lg:w-225 lg:p-8'>
              <div className='mb-6 flex flex-col gap-1'>
                <h2 className='text-card-foreground text-xl font-bold'>
                  {t('formTitle')}
                </h2>
                <p className='text-muted-foreground text-sm'>
                  {t('formSubtitle')}
                </p>
              </div>
              <ContactForm />
            </section>
          </div>
        </div>
      </MainContainer>
    </Container>
  )
}
