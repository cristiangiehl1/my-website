import { AppFooter } from '../_components/app-footer'
import { AppHeader } from '../_components/app-header'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  )
}
