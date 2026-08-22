export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Background Elements */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='bg-primary/10 animate-glow absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl' />
        <div
          className='bg-secondary/10 animate-glow absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl'
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Main Content */}
      {children}
    </>
  )
}
