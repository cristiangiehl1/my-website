import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { IconType } from 'react-icons'
import { BiCodeAlt } from 'react-icons/bi'
import { FaArrowRight, FaDownload } from 'react-icons/fa'

import { Container, MainContainer } from '@/app/_components/container'
import { TerminalPanel } from '@/app/_components/pages/home/terminal-panel'
import { SocialLink } from '@/app/_components/social-link'
import { Button } from '@/app/_components/ui/button'
import { __SOCIAL__ } from '@/constants/social'
import { Link } from '@/i18n/navigation'

const CTA_BUTTONS: Array<{ icon: IconType; href: string; label: string }> = [
  {
    icon: __SOCIAL__.github.icon,
    href: __SOCIAL__.github.href,
    label: 'Github',
  },
  {
    icon: __SOCIAL__.linkedin.icon,
    href: __SOCIAL__.linkedin.href,
    label: 'Linkedin',
  },
  {
    icon: __SOCIAL__.whatsapp.icon,
    href: __SOCIAL__.whatsapp.href,
    label: 'Whatsapp',
  },
]

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const tc = await getTranslations('common')

  return (
    <Container>
      {/* Main Content */}
      <MainContainer className='grid gap-12 lg:grid-cols-2'>
        {/* Left Column - Text Content */}
        <div className='space-y-8 text-center lg:text-left'>
          {/* Badge */}
          <div className='bg-muted/50 border-border inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm'>
            <BiCodeAlt size={16} className='text-primary' />
            <span className='text-muted-foreground text-sm'>{t('badge')}</span>
          </div>

          {/* Headline */}
          <div className='space-y-4'>
            <h1 className='text-5xl leading-tight font-bold text-balance sm:text-6xl lg:text-7xl'>
              {t.rich('headline', {
                hl: (c) => <span className='text-primary'>{c}</span>,
              })}
            </h1>
            <p className='text-muted-foreground max-w-2xl text-xl leading-relaxed text-pretty'>
              {t('subhead')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col justify-center gap-4 sm:flex-row lg:justify-start'>
            <Button
              size='lg'
              className='bg-primary text-primary-foreground hover:bg-primary/90 group'
              asChild>
              <Link href={'/portfolio'}>
                {t('ctaProjects')}
                <FaArrowRight
                  className='ml-2 transition-transform group-hover:translate-x-1'
                  size={20}
                />
              </Link>
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-border hover:bg-muted bg-transparent'
              asChild>
              <Link href={'/contact'}>{t('ctaContact')}</Link>
            </Button>
            <Button
              size='lg'
              variant='outline'
              className='border-border hover:bg-muted bg-transparent'
              asChild>
              <a href={`/resume/cristian-giehl-${locale}.pdf`} download>
                <FaDownload className='mr-2' size={16} />
                {tc('downloadResume')}
              </a>
            </Button>
          </div>

          {/* Social Links */}
          <div className='flex justify-center gap-4 pt-4 lg:justify-start'>
            {CTA_BUTTONS.map(({ icon: Icon, href, label }, i) => (
              <SocialLink key={i} Icon={Icon} href={href} ariaLabel={label} />
            ))}
          </div>
        </div>

        {/* Right Column - Visual Element */}
        <div className='hidden items-center justify-center lg:flex'>
          <TerminalPanel
            role={t('terminal.role')}
            location={t('terminal.location')}
          />
        </div>
      </MainContainer>
    </Container>
  )
}
