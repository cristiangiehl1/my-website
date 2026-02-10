import { Toaster } from 'sonner'

interface ProvidersProps {
  children: Readonly<React.ReactNode>
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <Toaster position='top-center' />
      {children}
    </>
  )
}
