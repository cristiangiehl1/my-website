function Line({
  cmd,
  cmdAnimation,
  value,
  valueAnimation,
}: {
  cmd: string
  cmdAnimation: string
  value: string
  valueAnimation: string
}) {
  return (
    <div className='flex flex-col'>
      <p className='text-foreground'>
        <span className='text-primary'>$</span>{' '}
        <span
          className='inline-block overflow-hidden align-bottom whitespace-nowrap'
          style={{ animation: `${cmdAnimation} 5s linear infinite` }}>
          {cmd}
        </span>
      </p>
      <p
        className='text-muted-foreground'
        style={{ animation: `${valueAnimation} 5s linear infinite` }}>
        <span className='text-primary'>&gt;</span> {value}
      </p>
    </div>
  )
}

export function TerminalPanel({
  role,
  location,
}: {
  role: string
  location: string
}) {
  return (
    <div className='border-border bg-card shadow-soft-stack w-full max-w-md rounded-lg border font-mono text-sm'>
      <div className='border-border flex items-center gap-2 border-b px-4 py-3'>
        <span className='bg-destructive h-3 w-3 rounded-full' />
        <span className='bg-muted-foreground h-3 w-3 rounded-full' />
        <span className='bg-primary h-3 w-3 rounded-full' />
        <span className='text-muted-foreground ml-2 text-xs'>~/cristian</span>
      </div>
      <div className='flex flex-col gap-3 p-4'>
        <Line
          cmd='whoami'
          cmdAnimation='terminal-type-whoami'
          value={role}
          valueAnimation='terminal-reveal-value-1'
        />
        <Line
          cmd='stack --top'
          cmdAnimation='terminal-type-stack'
          value='TypeScript · Next.js · Rust · Python'
          valueAnimation='terminal-reveal-value-2'
        />
        <Line
          cmd='location'
          cmdAnimation='terminal-type-location'
          value={location}
          valueAnimation='terminal-reveal-value-3'
        />
        <p className='text-primary'>
          ${' '}
          <span
            className='bg-primary inline-block h-4 w-2 align-middle'
            style={{
              animation: 'terminal-cursor-blink 1s steps(1, jump-end) infinite',
            }}
          />
        </p>
      </div>
    </div>
  )
}
