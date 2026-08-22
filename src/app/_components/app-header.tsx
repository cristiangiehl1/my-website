'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { NavLinkWithSubRoutes } from '@/@types/nav-links'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { LanguageSwitcher } from './language-switcher'
import { NavMenuItems } from './nav-menu-items'

export function AppHeader() {
  const t = useTranslations('common')
  const navLinks: Array<NavLinkWithSubRoutes> = [
    { label: t('nav.portfolio'), href: '/portfolio' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.skills'), href: '/skills' },
    { label: t('nav.contact'), href: '/contact' },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const menuBtnClass = 'h-0.5 w-5 origin-center bg-white duration-400'

  return (
    <header
      className={cn(
        'bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b px-4 py-5 backdrop-blur-md sm:px-6 lg:px-8'
      )}>
      <div className='relative mx-auto flex max-w-7xl items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2 overflow-hidden'>
          <Image
            src={'/icons/android-chrome-512x512.png'}
            alt={t('brandAlt')}
            width={40}
            height={40}
          />
        </Link>

        {/* Desktop Navigation */}
        <NavMenuItems navLinks={navLinks} className='hidden md:flex' />

        {/* Desktop Language Switcher */}
        <LanguageSwitcher className='hidden md:flex' />

        {/* Mobile Menu Button */}
        <button
          className='space-y-2 p-2 md:hidden'
          aria-label={isOpen ? t('menu.close') : t('menu.open')}
          aria-expanded={isOpen}
          aria-controls='navbar'
          onClick={() => setIsOpen((prev) => !prev)}>
          <div
            className={cn(
              menuBtnClass,
              'transition-transform',
              isOpen ? 'translate-y-2.5 rotate-45' : 'rotate-0'
            )}
          />

          <div
            className={cn(
              menuBtnClass,
              'transition-opacity',
              isOpen ? 'opacity-0' : 'opacity-100'
            )}
          />

          <div
            className={cn(
              menuBtnClass,
              'transition-transform',
              isOpen ? '-translate-y-2.5 -rotate-45' : 'rotate-0'
            )}
          />
        </button>

        {/* OVERLAY */}
        <div
          className={cn(
            'inset-0 z-10 h-screen w-full md:hidden',
            isOpen ? 'fixed' : 'hidden'
          )}
          onPointerDown={() => setIsOpen(false)}
        />

        {/* MENU */}
        <div
          id='navbar'
          className={cn(
            'bg-background/90 boder-white absolute left-0 z-20 flex flex-col items-start gap-4 border p-4 transition-all duration-400 md:hidden',
            isOpen
              ? 'translate-y-20 opacity-100'
              : 'pointer-events-none translate-y-10 opacity-0'
          )}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            const nextFocused = e.relatedTarget as HTMLElement | null

            if (nextFocused && e.currentTarget.contains(nextFocused)) {
              return
            }

            setIsOpen(false)
          }}>
          <NavMenuItems navLinks={navLinks} onClick={() => setIsOpen(false)} />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
