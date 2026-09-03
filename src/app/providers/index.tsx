import { Toaster } from 'sonner'

import { SmoothScroll } from '@/app/_components/smooth-scroll'

interface ProvidersProps {
  children: Readonly<React.ReactNode>
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SmoothScroll>
      <Toaster position='top-center' />
      {children}
    </SmoothScroll>
  )
}
