import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: Readonly<React.ReactNode>
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'bg-background h-full w-full flex-1 px-4 pt-28.5 pb-6 sm:px-6 lg:px-8',
        className
      )}
      {...props}>
      {children}
    </div>
  )
}

interface MainContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: Readonly<React.ReactNode>
}

export function MainContainer({
  children,
  className,
  ...props
}: MainContainerProps) {
  return (
    <main
      className={cn('mx-auto h-full w-full max-w-7xl', className)}
      {...props}>
      {children}
    </main>
  )
}
