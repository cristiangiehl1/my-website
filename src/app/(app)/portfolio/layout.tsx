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

      {/* Grid Pattern Overlay */}
      <div
        className='pointer-events-none fixed inset-0 opacity-20'
        style={{
          backgroundImage: `
                linear-gradient(to right, rgb(var(--color-border) / 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgb(var(--color-border) / 0.1) 1px, transparent 1px)
              `,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Main Content */}
      {children}
    </>
  )
}
