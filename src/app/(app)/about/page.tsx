import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Mim',
}

export default function AboutPage() {
  return (
    <div className='min-h-[92vh] w-full'>
      <h1>Sobre Mim</h1>
    </div>
  )
}
