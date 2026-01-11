'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { NavLink } from './nav-link'
import { Button } from './ui/button'

const navLinks: Array<{ label: string; href: string }> = [
  { label: 'Home', href: '/' },
  { label: 'Sobre', href: '/about' },
  { label: 'Projetos', href: '/projects' },
  { label: 'Skills', href: '/skills' },
  { label: 'Contato', href: '/contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
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
          <div className='hidden items-center gap-8 md:flex'>
            {navLinks.map(({ label, href }, i) => (
              <NavLink key={i} label={label} href={href} />
            ))}
          </div>

          {/* CTA Button */}
          <div className='hidden md:block'>
            <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
              Contratar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-foreground hover:text-primary p-2 transition-colors md:hidden'
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='border-border flex flex-col items-start space-y-4 border-t py-4 md:hidden'>
            {navLinks.map(({ label, href }, i) => (
              <NavLink key={i} label={label} href={href} />
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
