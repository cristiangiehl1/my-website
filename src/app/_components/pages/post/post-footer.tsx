import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function PostFooter() {
  return (
    <footer className='border-border mt-12 border-t pt-8'>
      <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
        <Link
          href='/portfolio'
          className='text-muted-foreground hover:text-primary group inline-flex items-center gap-2 text-sm transition-colors'>
          <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
          <span>Voltar ao portfólio</span>
        </Link>

        <p className='text-muted-foreground text-xs'>{'Obrigado por ler!'}</p>
      </div>
    </footer>
  )
}
