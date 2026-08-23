function Line({ cmd, value }: { cmd: string; value: string }) {
  return (
    <div className='flex flex-col'>
      <p className='text-foreground'>
        <span className='text-primary'>$</span> {cmd}
      </p>
      <p className='text-muted-foreground'>
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
        <Line cmd='whoami' value={role} />
        <Line cmd='stack --top' value='TypeScript · Next.js · Rust · Python' />
        <Line cmd='location' value={location} />
        <p className='text-primary'>
          $ <span className='bg-primary inline-block h-4 w-2 align-middle' />
        </p>
      </div>
    </div>
  )
}
