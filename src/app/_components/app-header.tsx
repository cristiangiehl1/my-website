'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { NavLinkWithSubRoutes } from '@/@types/nav-links'
import { Link } from '@/i18n/navigation'

import { LanguageSwitcher } from './language-switcher'
import { NavMenuItems } from './nav-menu-items'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'

export function AppHeader() {
  const t = useTranslations('common')
  const [open, setOpen] = useState(false)

  const navLinks: Array<NavLinkWithSubRoutes> = [
    { label: t('nav.portfolio'), href: '/portfolio' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.skills'), href: '/skills' },
    { label: t('nav.contact'), href: '/contact' },
  ]

  return (
    <header className='bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b px-4 py-5 backdrop-blur-md sm:px-6 lg:px-8'>
      <div className='relative mx-auto flex max-w-7xl items-center justify-between'>
        <Link href='/' className='flex items-center gap-2 overflow-hidden'>
          <Image
            src='/icons/android-chrome-512x512.png'
            alt={t('brandAlt')}
            width={40}
            height={40}
          />
        </Link>

        <NavMenuItems navLinks={navLinks} className='hidden md:flex' />
        <LanguageSwitcher className='hidden md:flex' />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            aria-label={t('menu.open')}
            className='text-foreground p-2 md:hidden'>
            <Menu className='h-6 w-6' />
          </DialogTrigger>
          <DialogContent className='top-20 translate-y-0 gap-6'>
            <DialogTitle className='sr-only'>{t('menu.title')}</DialogTitle>
            <NavMenuItems
              navLinks={navLinks}
              className='flex-col items-start'
              onClick={() => setOpen(false)}
            />
            <LanguageSwitcher />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
