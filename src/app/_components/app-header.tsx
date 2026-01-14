'use client'

import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { NavLink } from './nav-link'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const navLinks: Array<{ label: string; href: string }> = [
  { label: 'Home', href: '/' },
  { label: 'Sobre', href: '#' },
  { label: 'Projetos', href: '#' },
  { label: 'Skills', href: '#' },
  { label: 'Contato', href: '#' },
]

export function AppHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const menuBtnClass = 'h-0.5 w-5 origin-center bg-white duration-400'

  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <header className='bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md'>
      <div className='relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
            <span className='text-primary-foreground text-lg font-bold'>
              {'</>'}
            </span>
          </div>
          <span className='hidden text-lg font-bold sm:block'>
            DevPortfolio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden items-center gap-8 md:flex'>
          {navLinks.map(({ label, href }, i) => (
            <NavLink key={i} label={label} href={href} />
          ))}
        </nav>

        {/* CTA Button */}
        <div className='hidden md:block'>
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
            Contratar
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='space-y-2 p-2 md:hidden'
          aria-label={`botão para ${isOpen ? 'fechar' : 'abrir'} o menu de navegação`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
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
            'inset-0 z-10 h-screen w-full',
            isOpen ? 'fixed' : 'hidden'
          )}
          onPointerDown={() => setIsOpen(false)}
        />

        {/* MENU */}
        <nav
          className={cn(
            'bg-background/90 boder-white absolute left-0 z-20 flex w-[50%] flex-col items-start gap-4 border p-4 transition-all duration-400 md:hidden',
            isOpen
              ? 'top-[110%] opacity-100'
              : 'pointer-events-none top-[80%] opacity-0'
          )}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {navLinks.map(({ label, href }, i) => (
            <NavLink
              key={i}
              label={label}
              href={href}
              handleClick={handleNavClick}
              className={cn(
                "relative after:content-['']",
                'after:ml-2 after:h-1.5 after:w-1.5',
                'after:rounded-full after:bg-current',
                'after:scale-0 after:transition-transform after:duration-200',
                'hover:after:scale-100 focus-visible:after:scale-100'
              )}
            />
          ))}
        </nav>
      </div>
    </header>
  )
}
