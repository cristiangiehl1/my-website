import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt-BR', 'en-US'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed',
  localeCookie: {
    maxAge: 200 * 24 * 60 * 60,
  },
})
