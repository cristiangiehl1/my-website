'use client'

import { useParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'

import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('common.language')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const [isPending, startTransition] = useTransition()

  function switchTo(next: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- params carry the current dynamic segments
        { pathname, params },
        { locale: next }
      )
    })
  }

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role='group'
      aria-label={t('label')}>
      {routing.locales.map((loc) => {
        const active = loc === locale
        return (
          <button
            key={loc}
            type='button'
            aria-pressed={active}
            aria-disabled={isPending || active}
            disabled={isPending}
            onClick={() => {
              if (!active) switchTo(loc)
            }}
            className={cn(
              'rounded px-2 py-1 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}>
            {loc === 'pt-BR' ? 'PT' : 'EN'}
          </button>
        )
      })}
    </div>
  )
}
