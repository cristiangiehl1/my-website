# i18n Foundation (pt-BR / en-US) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full pt-BR / en-US internationalization to the portfolio site (UI, page copy, portfolio/skills data, and blog posts), fixing the WCAG 3.1.1 `lang` violation.

**Architecture:** `next-intl` v4 with a `[locale]` route segment. `pt-BR` is the default locale served without a URL prefix (`/portfolio`); `en-US` is served under `/en-US/…`. A `proxy.ts` middleware detects `Accept-Language` on first visit and persists manual choice in a cookie. All user-facing strings move to `messages/pt-BR.json` and `messages/en-US.json`; long-form data (portfolio descriptions, posts) is localized per key / per file.

**Tech Stack:** Next.js 16 (App Router, React Compiler), React 19, `next-intl` v4, Tailwind 4, TypeScript, pnpm.

## Global Constraints

- Package manager: **pnpm** (`pnpm add`, `pnpm build`). Node from `.nvmrc`.
- Locales: exactly `['pt-BR', 'en-US']`. `defaultLocale: 'pt-BR'`. `localePrefix: 'as-needed'`.
- Commits: **Conventional Commits** (commitlint `config-conventional` is enforced via husky). Type must be one of feat/fix/docs/refactor/chore/etc.
- Commit messages MUST NOT contain a `Co-Authored-By: Claude` line or a `🤖 Generated with Claude Code` footer (user global rule).
- No unit-test runner exists in this repo. The verification gate for every task is: `pnpm build` succeeds (type-check + `generateStaticParams`) and, where noted, a manual route check with `pnpm dev`.
- Do not translate proper nouns / tech names (React, Node.js, OracleDB, Claude Code, opencode, WSJF, etc.). Translate surrounding prose only.
- Keep existing code style: single quotes, no semicolons (Prettier config), `simple-import-sort` order. Run `pnpm lint:fix` before each commit if unsure.
- Work happens on branch `feat/i18n-foundation` (already created; spec committed there).

---

### Task 1: next-intl core setup + `[locale]` route restructure

This is one atomic task: App Router cannot be half-migrated and still build. At the end, the app builds and serves `/` (pt-BR) and `/en-US` (en-US); all copy is still hardcoded pt-BR (later tasks externalize it), so `/en-US` temporarily shows Portuguese text — that is expected and builds fine.

**Files:**

- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/proxy.ts`
- Create: `messages/pt-BR.json`, `messages/en-US.json` (start with one key each)
- Create: `src/app/[locale]/layout.tsx`
- Modify: `src/app/layout.tsx` (becomes pass-through)
- Modify: `next.config.ts` (wrap with `createNextIntlPlugin`)
- Move: entire `src/app/(app)/` tree → `src/app/[locale]/(app)/` (keep filenames)

**Interfaces:**

- Produces: `routing` (from `src/i18n/routing.ts`) with `routing.locales`, `routing.defaultLocale`.
- Produces: `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `src/i18n/navigation.ts` (locale-aware; later tasks import these instead of `next/link` / `next/navigation`).
- Produces: `[locale]/layout.tsx` renders `<html lang={locale}>` + `<NextIntlClientProvider>` and wraps the existing `<Providers>`, fonts, and `(app)` layout children.

- [ ] **Step 1: Install next-intl**

Run:

```bash
pnpm add next-intl
```

Expected: `next-intl` (v4.x) added to `dependencies` in `package.json`.

- [ ] **Step 2: Create routing config**

Create `src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt-BR', 'en-US'],
  defaultLocale: 'pt-BR',
  localePrefix: 'as-needed',
  localeCookie: {
    maxAge: 200 * 24 * 60 * 60,
  },
})
```

- [ ] **Step 3: Create navigation helpers**

Create `src/i18n/navigation.ts`:

```ts
import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

- [ ] **Step 4: Create request config**

Create `src/i18n/request.ts`:

```ts
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import * as rootParams from 'next/root-params'
import { notFound } from 'next/navigation'

import { routing } from './routing'

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale()
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue
    } else {
      notFound()
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 5: Create middleware (`proxy.ts`)**

Create `src/proxy.ts` (Next 16 uses `proxy.ts`, not `middleware.ts`):

```ts
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Skip /api, Next internals, and files with an extension (e.g. favicon.ico)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
```

- [ ] **Step 6: Wire the next-intl plugin in `next.config.ts`**

Modify `next.config.ts`:

```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(nextConfig)
```

- [ ] **Step 7: Seed message files**

Create `messages/pt-BR.json`:

```json
{
  "common": {
    "brandAlt": "Logo do site de Cristian Giehl"
  }
}
```

Create `messages/en-US.json`:

```json
{
  "common": {
    "brandAlt": "Cristian Giehl website logo"
  }
}
```

- [ ] **Step 8: Move the `(app)` route group under `[locale]`**

Run:

```bash
mkdir -p src/app/\[locale\]
git mv "src/app/(app)" "src/app/[locale]/(app)"
```

Expected: all of `about/`, `contact/`, `(home)/`, `portfolio/`, `post/`, `skills/`, and `layout.tsx` now live under `src/app/[locale]/(app)/`.

- [ ] **Step 9: Create the `[locale]` layout (fonts + html + providers)**

Move the font setup and `<html>`/`<body>` from the old root layout into `src/app/[locale]/layout.tsx`:

```tsx
import '../globals.css'

import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'

import { websiteMetadata } from '../metadata'
import { Providers } from '../providers'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

export const metadata = websiteMetadata

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html lang={locale}>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} flex min-h-screen w-full flex-col antialiased`}>
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 10: Reduce the root layout to a pass-through**

Replace `src/app/layout.tsx` entirely with:

```tsx
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
```

(The `<html>`/`<body>` now live in `[locale]/layout.tsx`. `metadata.ts`/`sitemap.ts`/`robot.ts`/`not-found.tsx` stay at `src/app/` root for now — SEO handled in Task 9.)

- [ ] **Step 11: Add `setRequestLocale` to the inner `(app)` layout**

Modify `src/app/[locale]/(app)/layout.tsx` so static rendering stays enabled. It currently takes no params; leave it as-is (it renders `<AppHeader/>{children}<AppFooter/>`). No change required unless build warns about dynamic rendering; if it does, convert page components to `await params` + `setRequestLocale(locale)` in Task 3+.

- [ ] **Step 12: Build**

Run:

```bash
pnpm build
```

Expected: build succeeds. Routes generated for both locales (e.g. `/` and `/en-US`).

- [ ] **Step 13: Manual route check**

Run `pnpm dev`, then verify:

- `http://localhost:3000/` → 200, renders home (pt-BR text).
- `http://localhost:3000/en-US` → 200, renders home (still pt-BR text — expected).
- `http://localhost:3000/en-US/portfolio` → 200.

- [ ] **Step 14: Commit**

```bash
pnpm lint:fix
git add -A
git commit -m "feat(i18n): add next-intl core and [locale] route segment"
```

---

### Task 2: `common` namespace, language switcher, header nav

**Files:**

- Create: `src/app/_components/language-switcher.tsx`
- Modify: `src/app/_components/app-header.tsx`
- Modify: `src/app/_components/nav-menu-items.tsx` (no string change, but nav labels now come from messages via header)
- Modify: `src/app/_components/app-footer.tsx`
- Modify: `messages/pt-BR.json`, `messages/en-US.json`

**Interfaces:**

- Consumes: `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`; `routing.locales`.
- Produces: `<LanguageSwitcher />` used inside `AppHeader` (desktop + mobile).

- [ ] **Step 1: Add `common` keys to both message files**

Add to `messages/pt-BR.json` `common`:

```json
{
  "common": {
    "brandAlt": "Logo do site de Cristian Giehl",
    "nav": {
      "portfolio": "Portfólio",
      "about": "Sobre",
      "skills": "Skills",
      "contact": "Contato"
    },
    "menu": {
      "open": "Abrir o menu de navegação",
      "close": "Fechar o menu de navegação"
    },
    "language": { "label": "Idioma", "pt-BR": "Português", "en-US": "English" },
    "footer": { "rights": "© 2026 Cristian Giehl" }
  }
}
```

Add the en-US equivalent to `messages/en-US.json` `common`:

```json
{
  "common": {
    "brandAlt": "Cristian Giehl website logo",
    "nav": {
      "portfolio": "Portfolio",
      "about": "About",
      "skills": "Skills",
      "contact": "Contact"
    },
    "menu": {
      "open": "Open navigation menu",
      "close": "Close navigation menu"
    },
    "language": {
      "label": "Language",
      "pt-BR": "Português",
      "en-US": "English"
    },
    "footer": { "rights": "© 2026 Cristian Giehl" }
  }
}
```

- [ ] **Step 2: Create the language switcher**

Create `src/app/_components/language-switcher.tsx`:

```tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
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
            hrefLang={loc}
            aria-current={active ? 'true' : undefined}
            disabled={isPending || active}
            onClick={() => switchTo(loc)}
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
```

- [ ] **Step 2b: Verify the switcher renders and toggles**

Run `pnpm dev`. On `/`, the header shows PT/EN. Clicking EN navigates to `/en-US` preserving the route; clicking PT returns to unprefixed path. The cookie `NEXT_LOCALE` is set. (Header wiring happens in the next steps; if temporarily placing the switcher, remove after.)

- [ ] **Step 3: Refactor the header to use messages + localized Link**

Modify `src/app/_components/app-header.tsx`:

- Replace `import Link from 'next/link'` with `import { Link } from '@/i18n/navigation'`.
- Build `navLinks` from translations:

```tsx
'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { NavLinkWithSubRoutes } from '@/@types/nav-links'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { LanguageSwitcher } from './language-switcher'
import { NavMenuItems } from './nav-menu-items'
```

- Inside the component, replace the module-level `navLinks` array with:

```tsx
const t = useTranslations('common')
const navLinks: Array<NavLinkWithSubRoutes> = [
  { label: t('nav.portfolio'), href: '/portfolio' },
  { label: t('nav.about'), href: '/about' },
  { label: t('nav.skills'), href: '/skills' },
  { label: t('nav.contact'), href: '/contact' },
]
```

- Replace the logo `alt` with `alt={t('brandAlt')}`.
- Replace the hamburger `aria-label` with `aria-label={isOpen ? t('menu.close') : t('menu.open')}`.
- Add `aria-expanded={isOpen}` and `aria-controls='navbar'` to the hamburger button.
- Render `<LanguageSwitcher className='hidden md:flex' />` next to `NavMenuItems` (desktop), and `<LanguageSwitcher />` inside the mobile `#navbar` panel below `NavMenuItems`.

- [ ] **Step 4: Localize the footer**

Modify `src/app/_components/app-footer.tsx`: make it a client component or pass the string in. Simplest — convert to use translations:

```tsx
'use client'

import { useTranslations } from 'next-intl'
import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface AppFooterProps extends HTMLAttributes<HTMLElement> {
  className?: string
}

export function AppFooter({ className, ...props }: AppFooterProps) {
  const t = useTranslations('common.footer')
  return (
    <footer
      className={cn('border-border mt-auto w-full border-t py-6', className)}
      {...props}>
      <p className='text-muted-foreground text-center text-xs'>{t('rights')}</p>
    </footer>
  )
}
```

- [ ] **Step 5: Build + manual check**

Run `pnpm build`, then `pnpm dev`:

- Nav labels show PT on `/` and EN on `/en-US`.
- Switcher toggles locale, preserving the current path (test on `/about` and `/en-US/about`).
- Reload after switching to EN → stays EN (cookie persisted).

- [ ] **Step 6: Commit**

```bash
pnpm lint:fix
git add -A
git commit -m "feat(i18n): add language switcher and localize header/footer"
```

---

### Task 3: Home page copy

**Files:**

- Modify: `src/app/[locale]/(app)/(home)/page.tsx`
- Modify: `messages/pt-BR.json`, `messages/en-US.json`

**Interfaces:**

- Consumes: `getTranslations`, `setRequestLocale` from `next-intl/server` (server component).

- [ ] **Step 1: Add `home` namespace**

`messages/pt-BR.json` → add:

```json
{
  "home": {
    "badge": "Desenvolvedor Full-Stack",
    "headline": "Transformo <hl>ideias</hl> em <hl>experiências</hl> digitais",
    "subhead": "Especialista em criar aplicações web modernas e escaláveis que conectam usuários e impulsionam negócios",
    "ctaProjects": "Ver Projetos",
    "ctaContact": "Entre em Contato"
  }
}
```

`messages/en-US.json` → add:

```json
{
  "home": {
    "badge": "Full-Stack Developer",
    "headline": "I turn <hl>ideas</hl> into digital <hl>experiences</hl>",
    "subhead": "Specialized in building modern, scalable web applications that connect users and drive business",
    "ctaProjects": "View Projects",
    "ctaContact": "Get in Touch"
  }
}
```

- [ ] **Step 2: Localize the page**

Modify `src/app/[locale]/(app)/(home)/page.tsx`:

- Make the component async, accept `params`, call `setRequestLocale(locale)`, and use `getTranslations('home')`.
- Replace the badge text with `{t('badge')}`.
- Replace the `<h1>` inner markup using `t.rich('headline', { hl: (c) => <span className='text-primary'>{c}</span> })`.
- Replace the `<p>` subhead with `{t('subhead')}`.
- Replace the two CTA labels with `{t('ctaProjects')}` / `{t('ctaContact')}`.
- Change `import Link from 'next/link'` → `import { Link } from '@/i18n/navigation'`.
- Leave the decorative floating code blocks and the string `"Full-Stack"` inside the `<pre>` as-is (decorative code sample, not UI copy).

Header of the file becomes:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { IconType } from 'react-icons'
import { BiCodeAlt } from 'react-icons/bi'
import { FaArrowRight } from 'react-icons/fa'

import { Container, MainContainer } from '@/app/_components/container'
import { SocialLink } from '@/app/_components/social-link'
import { Button } from '@/app/_components/ui/button'
import { __SOCIAL__ } from '@/constants/social'
import { Link } from '@/i18n/navigation'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  // ...rest unchanged except the string replacements above
}
```

- [ ] **Step 3: Build + check**

Run `pnpm build`; then `pnpm dev`: `/` shows Portuguese headline with the two words highlighted; `/en-US` shows the English headline. No hydration warnings.

- [ ] **Step 4: Commit**

```bash
pnpm lint:fix
git add -A
git commit -m "feat(i18n): localize home page"
```

---

### Task 4: About page (hero, experience, personal)

**Files:**

- Modify: `src/app/_components/pages/about/about-hero.tsx`
- Modify: `src/app/_components/pages/about/about-experience.tsx`
- Modify: `src/app/_components/pages/about/about-personal.tsx`
- Modify: `messages/pt-BR.json`, `messages/en-US.json`

**Interfaces:**

- Consumes: `useTranslations` (these are server components today with no hooks; add `useTranslations` from `next-intl` — it works in server components too, or keep them server and use `getTranslations`). Use `useTranslations('about')`.

- [ ] **Step 1: Add `about` namespace**

Add an `about` object to both files. pt-BR values are the exact current strings; en-US are faithful translations. Keys:

```
about.hero.titlePrefix = "Desenvolvedor " / "Full Stack" (highlight) — use t.rich with <hl>
about.hero.title (rich) = "Desenvolvedor <hl>Full Stack</hl>"
about.hero.intro (rich, uses <b> for the <span className='text-foreground font-medium'> parts) —
  pt-BR verbatim from about-hero.tsx:26-33 (keep "Grupo Koch SA", "Claude Code", "opencode", "OpenAI" as literals inside <b>)
about.hero.cards.frontend.title = "Frontend"; .desc = "TypeScript & Next.js"
about.hero.cards.backend.title = "Backend"; .desc = "Node.js, Oracle & Filas" / "Node.js, Oracle & Queues"
about.hero.cards.ai.title = "IA & Agentes" / "AI & Agents"; .desc = "OpenAI, RAG & Multiagentes" / "OpenAI, RAG & Multi-agents"
about.experience.title = "Experiência & Stack" / "Experience & Stack"
about.experience.p1 (rich <b>) = verbatim from about-experience.tsx:15-28
about.experience.p2 (rich <b>) = verbatim from about-experience.tsx:32-56
about.personal.title = "Sobre" / "About"
about.personal.creditAnalyst = about-personal.tsx:17-18
about.personal.currentRole (rich <b>) = about-personal.tsx:24-29
about.personal.games (rich <b>) = about-personal.tsx:34-37
about.personal.gym (rich <b>) = about-personal.tsx:42-45
```

For each `rich` string use the `<hl>` tag for `text-primary` spans and `<b>` for `text-foreground font-medium` spans. Provide the render callbacks in the components:

```tsx
t.rich('experience.p1', {
  b: (c) => <span className='text-foreground font-medium'>{c}</span>,
})
```

- [ ] **Step 2: Localize the three components**

In each component add `const t = useTranslations('about')` (import from `next-intl`) and replace the hardcoded JSX text with `t(...)` / `t.rich(...)` per the keys above. The `TECHNOLOGY_DATA` badge loop in `about-experience.tsx` is unchanged (tech names are not translated).

- [ ] **Step 3: Build + check**

`pnpm build`; `pnpm dev`: `/about` (PT) and `/en-US/about` (EN) both render, highlighted/bold spans preserved.

- [ ] **Step 4: Commit**

```bash
pnpm lint:fix
git add -A
git commit -m "feat(i18n): localize about page"
```

---

### Task 5: Skills page + skill data

**Files:**

- Modify: `src/app/[locale]/(app)/skills/page.tsx`
- Modify: `src/app/_components/pages/skills/soft-skills.tsx` (read it first — it holds `softSkills` data + copy)
- Modify: `src/app/_components/pages/skills/skill-card.tsx` (read it first — may render `level` text)
- Modify: `src/constants/technology-data.ts` (only the multi-select category headings, if surfaced)
- Modify: `messages/pt-BR.json`, `messages/en-US.json`

**Interfaces:**

- Consumes: `useTranslations('skills')`.
- Produces: skill `level` and `description` are looked up by skill `name`, e.g. `t('items.react.description')`, `t('levels.Avançado')`.

- [ ] **Step 1: Read the two skills components** to catalog remaining strings

Run:

```bash
sed -n '1,200p' src/app/_components/pages/skills/soft-skills.tsx src/app/_components/pages/skills/skill-card.tsx
```

Note every user-facing string (soft-skill names/descriptions, any "anos"/"years" label, level chips).

- [ ] **Step 2: Add `skills` namespace** covering:

```
skills.eyebrow = "Habilidades Técnicas" / "Technical Skills"
skills.title (rich <hl>) = "Minhas <hl>Skills</hl>" / "My <hl>Skills</hl>"
skills.intro = skills/page.tsx:283-286 (translate)
skills.stats.technologies = "Tecnologias" / "Technologies"
skills.stats.experience = "Anos de experiência" / "Years of experience"
skills.stats.softSkills = "Soft Skills" / "Soft Skills"
skills.sections.frontend = "Frontend"
skills.sections.backend = "Backend & Runtime"
skills.sections.database = "Banco de Dados" / "Databases"
skills.sections.ai = "IA & RAG" / "AI & RAG"
skills.sections.tools = "DevOps & Ferramentas" / "DevOps & Tools"
skills.sections.soft = "Soft Skills"
skills.softIntro = skills/page.tsx:323-326 (translate)
skills.legendTitle = "Legenda de níveis" / "Level legend"
skills.levels.Básico / .Intermediário / .Avançado / .Expert (label + description pairs)
  descriptions from skills/page.tsx:336-355 (translate)
skills.items.<name>.description  — one key per skill in frontend/backend/database/ai/tools arrays,
  value = the exact pt-BR description currently inline; en-US = faithful translation.
skills.items.<name>.level (optional) — if the card shows the level text, translate via skills.levels lookup instead.
```

Also unify the accent-inconsistent keys: keep `level` values as the canonical strings `'Básico' | 'Intermediário' | 'Avançado' | 'Expert'` and translate through `skills.levels`.

- [ ] **Step 3: Localize `skills/page.tsx`**: make it read `useTranslations('skills')` (convert to a client component OR use `getTranslations` server-side — prefer server + `setRequestLocale`). Replace the section-title map to use `t('sections.*')`, stats labels, legend, and pull each skill `description`/`level` from messages keyed by `skill.name`.

- [ ] **Step 4: Localize `soft-skills.tsx` and `skill-card.tsx`** per strings found in Step 1.

- [ ] **Step 5: Multi-select category headings** — if `getTechOptions()` headings (`'Programming Language'`, `'Framework'`, …) are shown to users in the portfolio filter, map them through a `common.techCategories.*` message in Task 7; for now leave `technology-data.ts` untouched.

- [ ] **Step 6: Build + check + commit**

```bash
pnpm build
pnpm lint:fix
git add -A
git commit -m "feat(i18n): localize skills page and skill data"
```

Manual: `/skills` (PT) and `/en-US/skills` (EN) render; totals still compute; levels/legend translated.

---

### Task 6: Contact page (page, info, form, validation)

**Files:**

- Modify: `src/app/[locale]/(app)/contact/page.tsx`
- Modify: `src/app/_components/pages/contact/contact-info.tsx`
- Modify: `src/app/_components/pages/contact/contact-form.tsx`
- Modify: `src/schemas/contact.ts` (validation messages)
- Modify: `messages/pt-BR.json`, `messages/en-US.json`

**Interfaces:**

- Consumes: `useTranslations('contact')`.
- Produces: a `makeContactSchema(t)` factory so Zod messages are localized. Signature: `makeContactSchema(t: (key: string) => string) => ZodType<ContactFormData>`. `ContactFormData` type stays exported from the schema module (derive from a base schema so the type is stable).

- [ ] **Step 1: Add `contact` namespace** covering all strings from the four files:

```
contact.eyebrow = "Disponível para projetos" / "Available for projects"
contact.title (rich <hl>) = "Entre em <hl>contato</hl>" / "Get in <hl>touch</hl>"
contact.intro = contact/page.tsx:32-35 (translate)
contact.formTitle = "Envie uma mensagem" / "Send a message"
contact.formSubtitle = contact/page.tsx:52-54 (translate)
contact.info.heading = "Vamos conversar?" / "Let's talk?"
contact.info.body = contact-info.tsx:52-56 (translate)
contact.info.socialsTitle = "Redes sociais" / "Social media"
contact.info.cards.whatsapp.label/value/description  (value "+55 (21) 99981-5903" stays; description translate)
contact.info.cards.email.label = "E-mail"; value = "Envie pelo formulário" / "Send via form"; description translate
contact.info.cards.location.label = "Localização" / "Location"; value "Itapema/SC, Brasil" / "Itapema/SC, Brazil"; description translate
contact.form.name / email / subject / phone / phoneOptional / message (labels)
contact.form.placeholders.name/email/subject/phone/message
contact.form.submit = "Enviar mensagem" / "Send message"; contact.form.submitting = "Enviando..." / "Sending..."
contact.form.toastUnexpected = "Erro inesperado. Tente novamente." / "Unexpected error. Please try again."
contact.form.toastUnexpectedWhatsapp = contact-form.tsx:57-59 (translate)
contact.validation.name / emailInvalid / phoneFormat / subjectRequired / subjectMax / messageRequired / scriptInjection
  (from schemas/contact.ts)
```

- [ ] **Step 2: Make the Zod schema locale-aware**

Rewrite `src/schemas/contact.ts` as a factory:

```ts
import { z } from 'zod'

type T = (key: string) => string

export function makeContactSchema(t: T) {
  return z.object({
    name: z.string().min(1, t('validation.name')),
    email: z.email(t('validation.emailInvalid')),
    phone: z
      .string()
      .refine((val) => val === '' || /^\(\d{2}\) \d{4,5}-\d{4}$/.test(val), {
        message: t('validation.phoneFormat'),
      })
      .optional()
      .or(z.literal('')),
    subject: z
      .string()
      .nonempty(t('validation.subjectRequired'))
      .max(256, t('validation.subjectMax')),
    message: z
      .string()
      .min(1, t('validation.messageRequired'))
      .refine((val) => !/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(val), {
        message: t('validation.scriptInjection'),
      }),
  })
}

// Stable type derived from a schema built with an identity translator
export type ContactFormData = z.infer<ReturnType<typeof makeContactSchema>>
```

Note: `src/app/api/emails/contact/route.ts` imports `contactSchema` — update it to build the schema server-side. Read that route first; if it validates, use `makeContactSchema((k) => k)` (messages are user-facing on the client; the API only needs the shape) or import the messages via `getTranslations`. Keep the API returning localized messages out of scope — the API stays as-is functionally; only fix the import so the build passes.

- [ ] **Step 3: Localize the form** — in `contact-form.tsx` add `const t = useTranslations('contact')`, build the resolver with `zodResolver(makeContactSchema((k) => t(k)))`, and replace all labels/placeholders/toasts with `t(...)`.

- [ ] **Step 4: Localize `contact-info.tsx` and `contact/page.tsx`** per the keys above. Convert the module-level `SocialLinks` array into one built inside the component from `t(...)`.

- [ ] **Step 5: Build + check + commit**

```bash
pnpm build
pnpm lint:fix
git add -A
git commit -m "feat(i18n): localize contact page and validation messages"
```

Manual: submit the form with empty fields on `/contact` and `/en-US/contact` → error messages appear in the right language.

---

### Task 7: Portfolio (data text migration + components + filters)

**Files:**

- Modify: `src/data/portfolio.ts` (remove `title`/`description` text; keep structure + add stable `slug`)
- Modify: `src/@types/project.ts` (make `title`/`description` optional-at-source, add `slug`)
- Modify: `src/app/[locale]/(app)/portfolio/page.tsx`
- Modify: `src/app/_components/pages/portfolio/portfolio.tsx`
- Modify: `src/app/_components/portfolio-item-card.tsx`
- Modify: `src/app/_components/portfolio-filters.tsx`
- Modify: `src/constants/technology-data.ts` (category headings via message lookup at render, not in the data)
- Modify: helpers `get-project.ts`, `get-nearby-projects.ts`, `sitemap.ts` (they call `slugify(item.title)` — switch to a stable `slug` field)
- Modify: `messages/pt-BR.json`, `messages/en-US.json`

**Interfaces:**

- Produces: each project gains a stable `slug: string` field (replaces `slugify(title)` everywhere). Title/description are read from messages: `t('portfolio.projects.<slug>.title' | '.description')`.
- Consumes: `useTranslations('portfolio')`.

- [ ] **Step 1: Add a stable `slug` to every project** in `src/data/portfolio.ts` using the current slugified titles:
  - `gestão de projetos mcp` → confirm with `node -e "console.log(require('./src/helpers/slugify'))"` is not trivial; instead compute once: run `pnpm dev` isn't needed — read `slugify.ts` and derive. Add these slugs:
    - "Gestão de Projetos MCP" → `gestao-de-projetos-mcp`
    - "Orchestrator Agent" → `orchestrator-agent`
    - "Gestão de Despesas" → `gestao-de-despesas`
    - "LangChain RAG Lab" → `langchain-rag-lab`
    - "Voting Lists" → `voting-lists`
    - "Vinyl Store" → `vinyl-store`
      (Verify each against `slugify()` output; these must match the existing `public/posts/<slug>.md` filenames — they do.)

- [ ] **Step 2: Move title/description into messages**

Add `portfolio.projects.<slug>.title` and `.description` for all six, per locale. pt-BR values = the exact current strings from `src/data/portfolio.ts`; en-US = faithful translations (keep product/tech names). Then delete the `title`/`description` string literals from `portfolio.ts` (keep `slug`, `coverUrl`, `technologies`, `category`, `author`, `github`, `deploy`, `featured`, `createdAt`).

Update `src/@types/project.ts`: replace `title`/`description` with `slug`, and add a separate render-time `LocalizedProject = Project & { title: string; description: string }` used by components after they resolve messages.

- [ ] **Step 3: Resolve titles/descriptions at render**

- `portfolio/page.tsx`: keep sorting by `featured`; pass items down. Because the card needs localized text, resolve it in the client components via `useTranslations('portfolio')` keyed by `item.slug`.
- `portfolio.tsx` (`PorfolioMain`, `PortfolioHeader`, `PortfolioEmptyDataFallback`): replace hardcoded `title`/`description` props with `t('header.title')` (rich `<hl>`), `t('header.description')`, `t('empty.title')`, `t('empty.hint')` ("Tente selecionar outras tecnologias" / "Try selecting other technologies").
- `portfolio-item-card.tsx`: `Destaque` → `t('featured')`; `"{n} mais..."` → `t('more', { count })`; `Código`/`Demo` → `t('code')` / `t('demo')`; card image `aria-label` → `t('goToPost', { title })`; resolve `title`/`description` from messages by `slug`; change `Link href={/post/${slugify(title)}}` → `href={/post/${slug}}` and import `Link` from `@/i18n/navigation`.
- `portfolio-filters.tsx`: `Filtrar por tecnologias` → `t('filters.title')`; `Selecione as tecnologias...` → `t('filters.placeholder')`; results count → `t('filters.results', { count })` (use ICU plural for the s/es).

Keys to add under `portfolio`:

```
portfolio.header.title (rich) = "Meus <hl>Projetos</hl>" / "My <hl>Projects</hl>"
portfolio.header.description = portfolio/page.tsx:21-22 (translate)
portfolio.empty.title = "Nenhum projeto encontrado" / "No projects found"
portfolio.empty.hint = "Tente selecionar outras tecnologias" / "Try selecting other technologies"
portfolio.featured = "Destaque" / "Featured"
portfolio.more = "{count} mais..." / "{count} more..."
portfolio.code = "Código" / "Code"
portfolio.demo = "Demo"
portfolio.goToPost = "Navegue até a postagem sobre {title}" / "Go to the post about {title}"
portfolio.filters.title = "Filtrar por tecnologias" / "Filter by technologies"
portfolio.filters.placeholder = "Selecione as tecnologias..." / "Select technologies..."
portfolio.filters.results = "{count, plural, one {# resultado encontrado} other {# resultados encontrados}}" /
                            "{count, plural, one {# result found} other {# results found}}"
```

- [ ] **Step 4: Fix slug consumers**

In `get-project.ts` and `get-nearby-projects.ts`, replace `slugify(item.title)` / `slugify(p.title)` with `item.slug` / `p.slug`. In `sitemap.ts`, replace `slugify(project.title)` with `project.slug`.

- [ ] **Step 5: Build + check + commit**

```bash
pnpm build
pnpm lint:fix
git add -A
git commit -m "feat(i18n): localize portfolio and move project copy to messages"
```

Manual: `/portfolio` and `/en-US/portfolio` render all six cards with translated title/description; filter counts pluralize; clicking a card opens `/post/<slug>` (and `/en-US/post/<slug>`).

---

### Task 8: Posts (locale-aware markdown + `.en.md` + post components + metadata)

**Files:**

- Modify: `src/helpers/get-markdown.ts` (accept locale + fallback)
- Modify: `src/helpers/generate-reading-time.ts` (locale-aware label)
- Modify: `src/app/[locale]/(app)/post/[slug]/page.tsx` (pass locale, `generateStaticParams`, localized metadata)
- Modify: `src/app/_components/pages/post/post-header.tsx`
- Modify: `src/app/_components/pages/post/post-footer.tsx`
- Modify: `src/app/_components/pages/post/post-aside.tsx`
- Create: `public/posts/<slug>.en.md` for all six posts
- Modify: `messages/pt-BR.json`, `messages/en-US.json`

**Interfaces:**

- Produces: `getMarkdown(slug: string, locale: string): Promise<{ content: string; isFallback: boolean }>`.
- Produces: `generateReadingTime(text, { minutesLabel })` or pass the unit from messages; returns `{ words, minutes, text }` where `text` is `"{minutes} min"` (unit is locale-neutral "min" — keep, but the "de leitura"/"read" suffix moves to messages).

- [ ] **Step 1: Make `getMarkdown` locale-aware with fallback**

```ts
import fs from 'node:fs/promises'
import path from 'node:path'

export async function getMarkdown(slug: string, locale: string) {
  const dir = path.join('public', 'posts')
  const localized = path.join(dir, `${slug}.en.md`)
  const base = path.join(dir, `${slug}.md`)

  if (locale === 'en-US') {
    try {
      return {
        content: await fs.readFile(localized, 'utf-8'),
        isFallback: false,
      }
    } catch {
      return { content: await fs.readFile(base, 'utf-8'), isFallback: true }
    }
  }
  return { content: await fs.readFile(base, 'utf-8'), isFallback: false }
}
```

- [ ] **Step 2: Add `post` namespace**

```
post.back = "Voltar" / "Back"
post.backToPortfolio = "Voltar ao portfólio" / "Back to portfolio"
post.related = "Posts relacionados" / "Related posts"
post.thanks = "Obrigado por ler!" / "Thanks for reading!"
post.readingTime = "{minutes} min de leitura" / "{minutes} min read"
post.repository = "Repositório" / "Repository"
post.viewDemo = "Ver demo" / "View demo"
post.coverAlt = "Capa do post: {title}" / "Post cover: {title}"
post.fallbackNotice = "Este conteúdo está disponível apenas em português." / "This content is only available in Portuguese."
```

- [ ] **Step 3: Localize post components**
- `post-header.tsx` / `post-aside.tsx`: change `new Intl.DateTimeFormat('pt-BR', …)` to use the active locale (`useLocale()` from `next-intl`); replace `{readTime} de leitura` with `t('readingTime', { minutes })`; `Voltar` → `t('back')`; `Repositorio` → `t('repository')`; `Ver demo` → `t('viewDemo')`; cover `alt` → `t('coverAlt', { title })`. These are `'use client'`; use `useTranslations('post')` and `useLocale()`. Title/description now come from messages by slug (Task 7) — pass them in as props from the page.
- `post-footer.tsx`: `Posts relacionados` → `t('related')`; `Voltar ao portfólio` → `t('backToPortfolio')`; `Obrigado por ler!` → `t('thanks')`; use `Link` from `@/i18n/navigation`; related-card title/description from messages by slug.

- [ ] **Step 4: Localize the post page + metadata + static params**
- Add `generateStaticParams` returning `[locale] × [slug]` for all six projects.
- `await params` to get `{ locale, slug }`; `setRequestLocale(locale)`.
- Resolve title/description from messages (`getTranslations('portfolio')`, key `projects.<slug>`).
- `getMarkdown(slug, locale)`; if `isFallback`, render a small notice using `post.fallbackNotice` above the content.
- `generateMetadata`: localized `title`/`description` + `alternates.languages` for the two locales + `openGraph.images` from `coverUrl`.

- [ ] **Step 5: Generate the six `.en.md` files**

For each of `gestao-de-projetos-mcp`, `orchestrator-agent`, `gestao-de-despesas`, `langchain-rag-lab`, `voting-lists`, `vinyl-store`: create `public/posts/<slug>.en.md` as a faithful English translation of `public/posts/<slug>.md`. Preserve markdown structure, headings, code fences, links, and any frontmatter keys; translate only prose. Keep product/tech names untranslated.

- [ ] **Step 6: Build + check + commit**

```bash
pnpm build
pnpm lint:fix
git add -A
git commit -m "feat(i18n): localize posts with per-locale markdown and metadata"
```

Manual: `/post/vinyl-store` (PT date + "min de leitura") and `/en-US/post/vinyl-store` (EN date + "min read", English body). Temporarily rename one `.en.md` to confirm the fallback notice, then restore.

---

### Task 9: SEO metadata, sitemap, robots, not-found

**Files:**

- Modify: `src/app/metadata.ts` (per-locale metadata factory)
- Modify: `src/app/[locale]/layout.tsx` (use `generateMetadata` with locale + alternates)
- Modify: `src/app/sitemap.ts` (emit both locales)
- Modify: `src/app/robot.ts` (unchanged host; verify sitemap URL)
- Modify: `src/app/not-found.tsx` (localize copy; keep it under root or add `[locale]/not-found.tsx`)
- Modify: `messages/pt-BR.json`, `messages/en-US.json`

**Interfaces:**

- Produces: `buildMetadata(locale: string): Metadata` in `metadata.ts` with localized `title`/`description`, `openGraph.locale`, and `alternates.languages` mapping `'pt-BR'` and `'en-US'` to their URLs.

- [ ] **Step 1: Add `metadata` + `notFound` namespaces** with `siteTitle`, `siteDescription`, OG description, and the 404 strings (`404` heading `Página "{path}" não encontrada` / `Page "{path}" not found`, the paragraph, and `Voltar ao início` / `Back home`). Keep the terminal ASCII/log text as-is (decorative), but translate the human sentence and the CTA.

- [ ] **Step 2: Convert `metadata.ts` to a locale factory** `buildMetadata(locale)` and add `alternates: { languages: { 'pt-BR': '/', 'en-US': '/en-US' } }` (compute per route where relevant). Keep `metadataBase`.

- [ ] **Step 3: `[locale]/layout.tsx` `generateMetadata`** — replace the static `export const metadata` with an async `generateMetadata({ params })` that calls `buildMetadata(locale)`.

- [ ] **Step 4: Sitemap for both locales** — for each route and each post slug, emit the pt-BR URL (unprefixed) and the en-US URL (`/en-US/...`), with `alternates.languages` on each entry. Use `project.slug` (from Task 7).

- [ ] **Step 5: Localize `not-found.tsx`** — `'use client'`, `useTranslations('notFound')`, `Link` from `@/i18n/navigation`. Replace the human sentence + CTA. (Note: `new Date().toISOString()` in the terminal block is fine; it's decorative.)

- [ ] **Step 6: Build + check + commit**

```bash
pnpm build
pnpm lint:fix
git add -A
git commit -m "feat(i18n): localize metadata, sitemap, robots and 404"
```

Manual: view page source on `/about` and `/en-US/about` → `<html lang>` correct, `<link rel="alternate" hreflang>` present for both; `/sitemap.xml` lists both locales; a bad URL renders the localized 404.

---

### Task 10: Final verification pass

**Files:** none (verification only).

- [ ] **Step 1: Full build**

Run: `pnpm build`
Expected: no errors; all `[locale]` × routes and posts prerendered.

- [ ] **Step 2: Grep for leftover hardcoded pt-BR / stale imports**

Run:

```bash
grep -rnE "from 'next/link'|from 'next/navigation'" src/app --include=*.tsx | grep -v _components/ui
grep -rn "slugify(item.title)\|slugify(project.title)\|slugify(p.title)" src
```

Expected: no `next/link` where a localized `Link` is needed (UI primitives may keep native imports); no remaining `slugify(...title)` in helpers/sitemap. Fix any hits.

- [ ] **Step 3: Manual matrix check via Playwright** (or manual browser)

For each route in `[/, /portfolio, /about, /skills, /contact, /post/vinyl-store]` and its `/en-US` counterpart: page returns 200, copy is in the expected language, switcher preserves the route, cookie persists across reload. Record results.

- [ ] **Step 4: Accessibility spot-check**

Confirm `<html lang>` matches the locale on both trees (fixes WCAG 3.1.1); language switcher has `role='group'` + `aria-label` and `hrefLang` on controls.

- [ ] **Step 5: Final commit if any fixes**

```bash
pnpm lint:fix
git add -A
git commit -m "fix(i18n): resolve leftover hardcoded strings and imports"
```

---

## Self-Review notes (author)

- **Spec coverage:** routing/structure → T1; messages org → T2–T9; portfolio/skills data → T5,T7; posts `.en.md` + fallback → T8; detection+switcher → T1(proxy)+T2; SEO/alternates/lang → T9; verification → every task + T10. All spec sections mapped.
- **Type consistency:** `Project` loses `title`/`description`, gains `slug` (T7); `getMarkdown` returns `{ content, isFallback }` (T8) — post page updated in same task; `makeContactSchema(t)` + stable `ContactFormData` (T6) — API route import updated in same task.
- **Known follow-ups (out of scope):** localizing API email responses; translating `createdAt` string format source (kept as `MM/DD/YYYY` literal, formatted per-locale at render).
