'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import type { NavLinkWithSubRoutes } from '@/@types/nav-links'
import { Link } from '@/i18n/navigation'

import { CommandPalette } from './command-palette'
import { LanguageSwitcher } from './language-switcher'
import { NavMenuItems } from './nav-menu-items'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AppHeader() {
  const t = useTranslations('common')
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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

        <div className='hidden items-center gap-3 md:flex'>
          <button
            type='button'
            onClick={() => setCommandOpen(true)}
            aria-label='Open command palette'
            aria-keyshortcuts='Meta+K Control+K'
            className='border-border text-muted-foreground hover:border-primary hover:text-foreground rounded-md border px-2 py-1 font-mono text-xs transition-colors'>
            ⌘K
          </button>
          <LanguageSwitcher />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t('menu.open')}
            className='text-foreground focus-visible:ring-ring rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none md:hidden'>
            <Menu className='h-6 w-6' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            {navLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className='w-full cursor-pointer'>
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className='px-2 py-1.5'>
              <LanguageSwitcher />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </header>
  )
}
