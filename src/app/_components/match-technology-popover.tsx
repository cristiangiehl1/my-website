import { HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { Info } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Checkbox } from './ui/checkbox'
import { HoverCard } from './ui/hover-card'

interface MatchTechnologyPopoverProps {
  value: boolean
  onChange: (value: boolean) => void
  containerClassName?: string
}

export function MatchTechnologyPopover({
  onChange,
  value,
  containerClassName,
}: MatchTechnologyPopoverProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-start gap-2',
        containerClassName
      )}
    >
      {/* Checkbox */}
      <Checkbox
        id='match-all-tech'
        checked={value}
        onCheckedChange={(checked) => onChange(Boolean(checked))}
      />

      <label
        htmlFor='match-all-tech'
        className='text-muted-foreground cursor-pointer text-sm'
      >
        Match all technologies
      </label>

      {/* Info popover */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <button
            type='button'
            className='text-muted-foreground hover:text-foreground mb-1'
          >
            <Info className='h-4 w-4' />
          </button>
        </HoverCardTrigger>

        <HoverCardContent
          side='top'
          align='start'
          className='bg-background/90 w-72 rounded-md p-4 text-xs leading-relaxed shadow-lg'
        >
          <p className='mb-1 font-medium'>How this filter works</p>

          <p>
            <strong>Enabled:</strong> Projects must include
            <strong> all selected technologies</strong>.
          </p>

          <p className='mt-1'>
            <strong>Disabled:</strong> Projects are shown if they include{' '}
            <strong>at least one</strong> selected technology.
          </p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
