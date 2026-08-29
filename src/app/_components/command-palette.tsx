'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { IconType } from 'react-icons'
import {
  FaAddressCard,
  FaBriefcase,
  FaDownload,
  FaEnvelope,
  FaHouse,
  FaLaptopCode,
} from 'react-icons/fa6'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/_components/ui/command'
import { getResumeHref } from '@/helpers/get-resume-href'
import { useRouter } from '@/i18n/navigation'

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()

  const navItems: Array<{ href: string; label: string; icon: IconType }> = [
    { href: '/', label: t('nav.home'), icon: FaHouse },
    { href: '/about', label: t('nav.about'), icon: FaAddressCard },
    { href: '/skills', label: t('nav.skills'), icon: FaLaptopCode },
    { href: '/portfolio', label: t('nav.portfolio'), icon: FaBriefcase },
    { href: '/contact', label: t('nav.contact'), icon: FaEnvelope },
  ]

  function go(href: string) {
    onOpenChange(false)
    router.push(href)
  }

  function downloadResume() {
    onOpenChange(false)
    const link = document.createElement('a')
    link.href = getResumeHref(locale)
    link.download = ''
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('commandPalette.placeholder')}
      description={t('commandPalette.placeholder')}>
      <CommandInput placeholder={t('commandPalette.placeholder')} />
      <CommandList>
        <CommandEmpty>{t('commandPalette.empty')}</CommandEmpty>
        <CommandGroup heading={t('commandPalette.groupNavigation')}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <CommandItem key={href} onSelect={() => go(href)}>
              <Icon />
              {label}
            </CommandItem>
          ))}
          <CommandItem onSelect={downloadResume}>
            <FaDownload />
            {t('downloadResume')}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
