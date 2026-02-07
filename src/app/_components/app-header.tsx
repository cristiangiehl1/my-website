'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { NavLinkWithSubRoutes } from '@/@types/nav-links'
import { cn } from '@/lib/utils'

import { NavMenuItems } from './nav-menu-items'

const navLinks: Array<NavLinkWithSubRoutes> = [
  {
    label: 'Portfólio',
    href: '/portfolio',
  },
  { label: 'Sobre', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Contato', href: '/contact' },
]

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const menuBtnClass = 'h-0.5 w-5 origin-center bg-white duration-400'

  return (
    <header className='bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md'>
      <div className='relative mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2 overflow-hidden'>
          <Image
            src={'/icons/android-chrome-512x512.png'}
            alt='Cristian Giehl website logo'
            width={40}
            height={40}
          />
        </Link>

        {/* Desktop Navigation */}
        <NavMenuItems navLinks={navLinks} className='hidden md:flex' />

        {/* Mobile Menu Button */}
        <button
          className='space-y-2 p-2 md:hidden'
          aria-label={`botão para ${isOpen ? 'fechar' : 'abrir'} o menu de navegação`}
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
        </div>
      </div>
    </header>
  )
}
