# Home Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the home page (`/`) content depth (stack + featured projects) and two signature interactions (looping terminal typing, Cmd+K command palette) without touching the existing "Brutalist Mono" visual identity or introducing any new dependency.

**Architecture:** Four independent, additive changes on top of the existing home route (`src/app/[locale]/(app)/(home)/page.tsx`): (1) a CSS-only typing-loop animation on the existing `TerminalPanel`, (2) a new `StackMarquee` section, (3) a new `FeaturedProjects` bento section, (4) a global `CommandPalette` wired into `AppHeader`. All four reuse existing data sources (`TECHNOLOGY_DATA`, `__PORTFOLIO__`) and existing UI primitives (`ui/command.tsx`, `Button`, `cn`) — no new files outside `src/app/_components/`.

**Tech Stack:** Next.js 16 App Router (Server Components by default), Tailwind CSS v4 (tokens in `src/app/globals.css`, no `tailwind.config.ts`), `next-intl` for i18n/routing, `cmdk` (already installed, currently unused) for the command palette, plain CSS `@keyframes` for all motion (no GSAP, no Framer Motion).

## Global Constraints

- No new dependency in `package.json` — `cmdk` and `react-icons` are already installed and cover everything needed.
- Site is dark-only (`.dark` is identical to `:root` in `globals.css`) — do not introduce a light variant or theme toggle.
- All new motion must be pure CSS `@keyframes`/`animation` (no JS-driven motion) so it inherits the existing global rule for free:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
  (`src/app/globals.css:174-183`) — verify this still holds for each new animation instead of writing new reduced-motion handling.
- Any new copy must be added to **both** `messages/en-US.json` and `messages/pt-BR.json` in the same step that references it — never land a translation key in only one locale.
- This project has no automated test suite (no Jest/Vitest/Playwright config, no `*.test.*` files, `package.json` only has `dev`/`build`/`start`/`lint`). Verification in every task below is `pnpm build` (type-check + build) plus a manual check with `pnpm dev` — this matches the spec's own "Estratégia de teste" section and is intentional, not a shortcut.
- Follow existing conventions: page-specific components live in `src/app/_components/pages/home/`, class merging goes through `cn` from `@/lib/utils`, technology icons/colors always come from `TECHNOLOGY_DATA` (`@/constants/technology-data`), locale-aware routing always uses `Link`/`useRouter` from `@/i18n/navigation` (never `next/link` or `next/navigation`).

---

### Task 1: Terminal panel — looping typing animation (CSS-only)

**Files:**

- Modify: `src/app/globals.css` (append keyframes after line 183)
- Modify: `src/app/_components/pages/home/terminal-panel.tsx`

**Interfaces:**

- Consumes: nothing new.
- Produces: `TerminalPanel({ role, location }: { role: string; location: string })` — **signature unchanged**, still consumed by `src/app/[locale]/(app)/(home)/page.tsx:108-111` exactly as today. No caller needs to change for this task.

- [ ] **Step 1: Append the typing-loop keyframes to `globals.css`**

Open `src/app/globals.css` and append this block right after the closing `}` of the `@media (prefers-reduced-motion: reduce)` rule (the file currently ends at line 183 with that `}`):

```css
/* Home hero — terminal typing loop (CSS-only, 5s cycle, repeats forever) */
@keyframes terminal-type-whoami {
  0% {
    width: 0;
    animation-timing-function: steps(6, jump-end);
  }
  7% {
    width: 6ch;
  }
  100% {
    width: 6ch;
  }
}

@keyframes terminal-reveal-value-1 {
  0% {
    opacity: 0;
  }
  8% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

@keyframes terminal-type-stack {
  0% {
    width: 0;
  }
  26% {
    width: 0;
    animation-timing-function: steps(11, jump-end);
  }
  38% {
    width: 11ch;
  }
  100% {
    width: 11ch;
  }
}

@keyframes terminal-reveal-value-2 {
  0% {
    opacity: 0;
  }
  39% {
    opacity: 0;
  }
  41% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

@keyframes terminal-type-location {
  0% {
    width: 0;
  }
  57% {
    width: 0;
    animation-timing-function: steps(8, jump-end);
  }
  66% {
    width: 8ch;
  }
  100% {
    width: 8ch;
  }
}

@keyframes terminal-reveal-value-3 {
  0% {
    opacity: 0;
  }
  67% {
    opacity: 0;
  }
  69% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

@keyframes terminal-cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
```

Notes on the numbers (so you don't need to re-derive them):

- Each `terminal-type-*` animates `width` from `0` to a fixed `Nch`, where `N` is the exact character count of the hardcoded command text (`whoami` = 6, `stack --top` = 11, `location` = 8). The `steps(N, jump-end)` on the keyframe that starts the width change makes it reveal one character at a time.
- Each `terminal-reveal-value-*` is a plain opacity fade-in (the command's _output_ appears at once after the command "runs" — real terminals don't type out their own output character by character, only the command you type does).
- All six share one 5-second cycle (`animation-duration: 5s` applied in the component, not here): line 1 types at 0%-7%, its value fades in at 8%-10%, holds; line 2 types at 26%-38%, value fades 39%-41%, holds; line 3 types at 57%-66%, value fades 67%-69%, then holds until 100% before the whole thing loops.
- Under `prefers-reduced-motion: reduce`, the global rule forces `animation-iteration-count: 1` and a ~0 duration, so every element jumps straight to its `100%` keyframe (full text, `opacity: 1`) on first paint and never loops — a correct static fallback, no extra code needed.

- [ ] **Step 2: Rewrite `terminal-panel.tsx` to use the new animations**

Replace the full contents of `src/app/_components/pages/home/terminal-panel.tsx` with:

```tsx
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
```

- [ ] **Step 3: Build and verify**

Run: `pnpm build`
Expected: build completes with no type errors (this task touches no types, only JSX/CSS).

- [ ] **Step 4: Manual visual check**

Run `pnpm dev`, open `http://localhost:3000` (desktop width, ≥1024px so the terminal column is visible), and confirm:

- The three lines type out one after another in a loop (whoami → stack --top → location → pause → restarts).
- The cursor block at the bottom blinks continuously the whole time.
- In DevTools, toggle "Emulate CSS prefers-reduced-motion: reduce" (Rendering tab) and reload — all three lines should show fully typed immediately, cursor solid (not blinking), no animation loop.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/_components/pages/home/terminal-panel.tsx
git commit -m "feat(web): loop terminal panel typing animation"
```

---

### Task 2: Stack marquee section

**Files:**

- Create: `src/app/_components/pages/home/stack-marquee.tsx`
- Modify: `src/app/globals.css` (append marquee keyframes/classes)
- Modify: `src/app/[locale]/(app)/(home)/page.tsx` (mount the section)
- Modify: `messages/en-US.json`, `messages/pt-BR.json` (new `home.stack.title` key)

**Interfaces:**

- Consumes: `TECHNOLOGY_DATA` from `@/constants/technology-data` (shape confirmed: `{ value, label, icon: IconType, style?: { iconColor?: string }, category, link }`), `TechnologyName` type from `@/@types/technology`.
- Produces: `StackMarquee({ title }: { title: string })`, default export none (named export), mounted once in `page.tsx` in this same task.

- [ ] **Step 1: Append the marquee keyframes to `globals.css`**

Append this block at the end of `src/app/globals.css` (after the block added in Task 1):

```css
/* Home — stack marquee: two identical tracks side by side, scrolled by
   exactly one track width so the loop is seamless; paused on hover. */
@keyframes stack-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.stack-marquee-track {
  animation: stack-marquee 30s linear infinite;
}

.stack-marquee:hover .stack-marquee-track {
  animation-play-state: paused;
}
```

- [ ] **Step 2: Create `stack-marquee.tsx`**

Create `src/app/_components/pages/home/stack-marquee.tsx`:

```tsx
import type { TechnologyName } from '@/@types/technology'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { cn } from '@/lib/utils'

const FEATURED_STACK: TechnologyName[] = [
  'typescript',
  'rust',
  'python',
  'node',
  'react',
  'next',
  'tailwind',
  'gsap',
  'docker',
  'postgresql',
  'redis',
  'prisma',
  'langchain',
  'claude',
]

function StackTrack({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className='flex shrink-0 items-center gap-8 pr-8'
      aria-hidden={ariaHidden}>
      {FEATURED_STACK.map((key) => {
        const { icon: Icon, label, style } = TECHNOLOGY_DATA[key]
        return (
          <div
            key={key}
            className='text-muted-foreground flex items-center gap-2 text-sm font-medium whitespace-nowrap'>
            <Icon className={cn('size-5', style?.iconColor)} />
            {label}
          </div>
        )
      })}
    </div>
  )
}

export function StackMarquee({ title }: { title: string }) {
  return (
    <section className='border-border border-t py-12'>
      <h2 className='text-muted-foreground mb-6 text-center text-sm font-semibold tracking-widest uppercase'>
        {title}
      </h2>
      <div className='stack-marquee overflow-hidden'>
        <div className='stack-marquee-track flex w-max'>
          <StackTrack />
          <StackTrack ariaHidden />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add the `home.stack.title` translation key**

In `messages/en-US.json`, inside the `"home"` object (currently lines 33-43), add `"stack"` right after `"ctaContact"` and before `"terminal"`:

```json
    "ctaContact": "Get in Touch",
    "stack": { "title": "Tech Stack" },
    "terminal": {
```

In `messages/pt-BR.json`, same position (currently lines 29-39):

```json
    "ctaContact": "Entre em Contato",
    "stack": { "title": "Stack" },
    "terminal": {
```

- [ ] **Step 4: Mount `StackMarquee` in the home page**

In `src/app/[locale]/(app)/(home)/page.tsx`, add the import next to the existing `TerminalPanel` import:

```tsx
import { StackMarquee } from '@/app/_components/pages/home/stack-marquee'
import { TerminalPanel } from '@/app/_components/pages/home/terminal-panel'
```

`MainContainer` (`src/app/_components/container.tsx:32`) renders a `<main>`
element — the hero's `MainContainer` above is already the page's one `<main>`
landmark, so the new sections below it must NOT be wrapped in another
`MainContainer` (that would produce two `<main>` tags on one page, which is
invalid HTML and breaks landmark navigation for assistive tech). Wrap them in
a plain `<div>` with the same centering/width classes instead.

Render the section as a sibling right after the closing `</MainContainer>`
tag, still inside `<Container>` (the file currently ends with
`</MainContainer>\n    </Container>\n  )\n}` around lines 113-116):

```tsx
      </MainContainer>

      <div className='mx-auto h-full w-full max-w-7xl'>
        <StackMarquee title={t('stack.title')} />
      </div>
    </Container>
  )
}
```

- [ ] **Step 5: Build and verify**

Run: `pnpm build`
Expected: build completes with no type errors. If `FEATURED_STACK` has a typo'd key, TypeScript fails here with "Element implicitly has an 'any' type" or a literal-type mismatch on `TECHNOLOGY_DATA[key]` — fix the key name against the list in `src/constants/technology-data.ts` if that happens.

- [ ] **Step 6: Manual visual check**

Run `pnpm dev`, open `http://localhost:3000`, scroll below the hero and confirm:

- A "Tech Stack" / "Stack" row of icons+labels scrolls continuously and loops with no visible seam or jump.
- Hovering over the row pauses the scroll; moving the mouse away resumes it.
- With DevTools "prefers-reduced-motion: reduce" enabled, the row is static (no scrolling) but still shows the full icon list (not frozen mid-scroll).

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/_components/pages/home/stack-marquee.tsx src/app/[locale]/\(app\)/\(home\)/page.tsx messages/en-US.json messages/pt-BR.json
git commit -m "feat(web): add curated tech stack marquee to home"
```

---

### Task 3: Featured projects bento section

**Files:**

- Create: `src/app/_components/pages/home/featured-projects.tsx`
- Modify: `src/app/[locale]/(app)/(home)/page.tsx` (mount the section)
- Modify: `messages/en-US.json`, `messages/pt-BR.json` (new `home.projects.title`/`home.projects.viewAll` keys)

**Interfaces:**

- Consumes: `__PORTFOLIO__` from `@/data/portfolio`, `Project` type from `@/@types/project` (`{ id, slug, coverUrl?, technologies: TechnologyName[], category, author, github?, deploy?, featured, createdAt }`), `TECHNOLOGY_DATA` from `@/constants/technology-data`, i18n namespace `portfolio.projects.{slug}.title` / `.description` (already exists for every project, confirmed for the 3 slugs used here), `Link` from `@/i18n/navigation`.
- Produces: `FeaturedProjects({ title, viewAll }: { title: string; viewAll: string })`, mounted once in `page.tsx` in this same task.

- [ ] **Step 1: Create `featured-projects.tsx`**

Create `src/app/_components/pages/home/featured-projects.tsx`:

```tsx
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import type { Project } from '@/@types/project'
import { TECHNOLOGY_DATA } from '@/constants/technology-data'
import { __PORTFOLIO__ } from '@/data/portfolio'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

function getFeaturedProjects(): Project[] {
  return [...__PORTFOLIO__]
    .filter((project) => project.featured)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3)
}

async function ProjectCard({
  project,
  variant,
  className,
}: {
  project: Project
  variant: 'large' | 'compact'
  className?: string
}) {
  const t = await getTranslations('portfolio')
  const title = t(`projects.${project.slug}.title`)
  const description = t(`projects.${project.slug}.description`)
  const isLarge = variant === 'large'
  const maxTech = isLarge ? 5 : 3

  return (
    <Link
      href={`/post/${project.slug}`}
      className={cn(
        'group border-border bg-card hover:border-primary relative flex flex-col overflow-hidden rounded-lg border transition-colors',
        className
      )}>
      <div
        className={cn(
          'bg-muted relative overflow-hidden',
          isLarge ? 'h-56' : 'h-36'
        )}>
        <Image
          src={project.coverUrl || '/images/project-placeholder.jpg'}
          alt={title}
          fill
          sizes='(min-width: 768px) 50vw, 100vw'
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
      </div>
      <div className='flex flex-1 flex-col gap-2 p-5'>
        <h3 className='group-hover:text-primary text-lg font-bold text-balance transition-colors'>
          {title}
        </h3>
        {isLarge && (
          <p className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'>
            {description}
          </p>
        )}
        <div className='mt-auto flex flex-wrap gap-2 pt-2'>
          {project.technologies.slice(0, maxTech).map((tech) => {
            const { icon: Icon, style } = TECHNOLOGY_DATA[tech]
            return (
              <span
                key={tech}
                className='border-border bg-muted/50 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs'>
                <Icon className={cn('size-3.5', style?.iconColor)} />
                {tech}
              </span>
            )
          })}
        </div>
      </div>
    </Link>
  )
}

export async function FeaturedProjects({
  title,
  viewAll,
}: {
  title: string
  viewAll: string
}) {
  const [main, ...rest] = getFeaturedProjects()

  return (
    <section className='border-border border-t py-12'>
      <div className='mb-8 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <Link
          href='/portfolio'
          className='text-primary text-sm font-medium hover:underline'>
          {viewAll}
        </Link>
      </div>
      <div className='grid gap-6 md:grid-cols-3 md:grid-rows-2'>
        {main && (
          <ProjectCard
            project={main}
            variant='large'
            className='md:col-span-2 md:row-span-2'
          />
        )}
        {rest.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            variant='compact'
            className={
              i === 0
                ? 'md:col-start-3 md:row-start-1'
                : 'md:col-start-3 md:row-start-2'
            }
          />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add the `home.projects.*` translation keys**

In `messages/en-US.json`, in the `"home"` object, add `"projects"` right after `"stack"` (added in Task 2) and before `"terminal"`:

```json
    "stack": { "title": "Tech Stack" },
    "projects": { "title": "Featured Projects", "viewAll": "View all projects" },
    "terminal": {
```

In `messages/pt-BR.json`, same position:

```json
    "stack": { "title": "Stack" },
    "projects": { "title": "Projetos em Destaque", "viewAll": "Ver todos os projetos" },
    "terminal": {
```

- [ ] **Step 3: Mount `FeaturedProjects` in the home page**

In `src/app/[locale]/(app)/(home)/page.tsx`, add the import next to `StackMarquee`:

```tsx
import { FeaturedProjects } from '@/app/_components/pages/home/featured-projects'
import { StackMarquee } from '@/app/_components/pages/home/stack-marquee'
```

Then render it right after `StackMarquee`, inside the same wrapper `<div>`
added in Task 2 (not a `MainContainer` — see Task 2 Step 4's note: the hero's
`MainContainer` is already the page's one `<main>` landmark):

```tsx
      <div className='mx-auto h-full w-full max-w-7xl'>
        <StackMarquee title={t('stack.title')} />
        <FeaturedProjects
          title={t('projects.title')}
          viewAll={t('projects.viewAll')}
        />
      </div>
    </Container>
  )
}
```

- [ ] **Step 4: Build and verify**

Run: `pnpm build`
Expected: build completes with no type errors. `getFeaturedProjects()` must return exactly 3 projects with the current data (`gestao-de-projetos-mcp`, `gestao-de-despesas`, `langchain-rag-lab`, in that order) — if the build succeeds but you want to double check the order, temporarily add `console.log(getFeaturedProjects().map(p => p.slug))` in the component, run `pnpm dev`, check the server log, then remove the `console.log` before committing.

- [ ] **Step 5: Manual visual check**

Run `pnpm dev`, open `http://localhost:3000`, scroll to the new section and confirm:

- Section title "Featured Projects" / "Projetos em Destaque" with a "View all projects" link that goes to `/portfolio`.
- One large card (image + title + description + up to 5 tech badges) on the left spanning two rows, two compact cards (image + title + up to 3 tech badges, no description) stacked on the right.
- Clicking any card navigates to `/post/<slug>` and shows the real project detail page.
- At mobile width (~375px), all three cards stack in a single column in a sensible order (large card first).

- [ ] **Step 6: Commit**

```bash
git add src/app/_components/pages/home/featured-projects.tsx src/app/\[locale\]/\(app\)/\(home\)/page.tsx messages/en-US.json messages/pt-BR.json
git commit -m "feat(web): add featured projects bento section to home"
```

---

### Task 4: Command palette (Cmd+K), navigation only

**Files:**

- Create: `src/app/_components/command-palette.tsx`
- Modify: `src/app/_components/app-header.tsx`
- Modify: `messages/en-US.json`, `messages/pt-BR.json` (new `common.nav.home` key, new `common.commandPalette.*` keys)

**Interfaces:**

- Consumes: `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem` from `@/app/_components/ui/command` (already exist, confirmed unused elsewhere), `useRouter` from `@/i18n/navigation`, `useLocale`/`useTranslations` from `next-intl`.
- Produces: `CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void })`, a fully controlled component — `app-header.tsx` owns the `open` state and the keyboard shortcut listener.

- [ ] **Step 1: Add the new translation keys**

In `messages/en-US.json`, add `"home"` to the `"nav"` object (currently lines 15-20) as the first entry, and add a new `"commandPalette"` object right after `"language"` (currently lines 26-30) and before `"footer"`:

```json
    "nav": {
      "home": "Home",
      "portfolio": "Portfolio",
      "about": "About",
      "skills": "Skills",
      "contact": "Contact"
    },
```

```json
    "language": {
      "label": "Language",
      "pt-BR": "Português",
      "en-US": "English"
    },
    "commandPalette": {
      "placeholder": "Type a command or search...",
      "groupNavigation": "Navigation",
      "empty": "No results found."
    },
    "footer": { "rights": "© 2026 Cristian Giehl" }
```

In `messages/pt-BR.json`, same positions:

```json
    "nav": {
      "home": "Início",
      "portfolio": "Portfólio",
      "about": "Sobre",
      "skills": "Skills",
      "contact": "Contato"
    },
```

```json
    "language": { "label": "Idioma", "pt-BR": "Português", "en-US": "English" },
    "commandPalette": {
      "placeholder": "Digite um comando ou busque...",
      "groupNavigation": "Navegação",
      "empty": "Nenhum resultado encontrado."
    },
    "footer": { "rights": "© 2026 Cristian Giehl" }
```

- [ ] **Step 2: Create `command-palette.tsx`**

Create `src/app/_components/command-palette.tsx`:

```tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { IconType } from 'react-icons'
import {
  FaAddressCard,
  FaBriefcase,
  FaDownload,
  FaEnvelope,
  FaHouse,
  FaLaptopCode,
} from 'react-icons/fa6'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/_components/ui/command'
import { useRouter } from '@/i18n/navigation'

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const t = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()

  const navItems: Array<{ href: string; label: string; icon: IconType }> = [
    { href: '/', label: t('nav.home'), icon: FaHouse },
    { href: '/about', label: t('nav.about'), icon: FaAddressCard },
    { href: '/skills', label: t('nav.skills'), icon: FaLaptopCode },
    { href: '/portfolio', label: t('nav.portfolio'), icon: FaBriefcase },
    { href: '/contact', label: t('nav.contact'), icon: FaEnvelope },
  ]

  function go(href: string) {
    onOpenChange(false)
    router.push(href)
  }

  function downloadResume() {
    onOpenChange(false)
    const link = document.createElement('a')
    link.href = `/resume/cristian-giehl-${locale}.pdf`
    link.download = ''
    link.click()
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('commandPalette.placeholder')}
      description={t('commandPalette.placeholder')}>
      <CommandInput placeholder={t('commandPalette.placeholder')} />
      <CommandList>
        <CommandEmpty>{t('commandPalette.empty')}</CommandEmpty>
        <CommandGroup heading={t('commandPalette.groupNavigation')}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <CommandItem key={href} onSelect={() => go(href)}>
              <Icon />
              {label}
            </CommandItem>
          ))}
          <CommandItem onSelect={downloadResume}>
            <FaDownload />
            {t('downloadResume')}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

- [ ] **Step 3: Wire it into `AppHeader`**

Replace the full contents of `src/app/_components/app-header.tsx` with:

```tsx
'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import type { NavLinkWithSubRoutes } from '@/@types/nav-links'
import { Link } from '@/i18n/navigation'

import { CommandPalette } from './command-palette'
import { LanguageSwitcher } from './language-switcher'
import { NavMenuItems } from './nav-menu-items'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function AppHeader() {
  const t = useTranslations('common')
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navLinks: Array<NavLinkWithSubRoutes> = [
    { label: t('nav.portfolio'), href: '/portfolio' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.skills'), href: '/skills' },
    { label: t('nav.contact'), href: '/contact' },
  ]

  return (
    <header className='bg-background/80 border-border fixed top-0 right-0 left-0 z-50 border-b px-4 py-5 backdrop-blur-md sm:px-6 lg:px-8'>
      <div className='relative mx-auto flex max-w-7xl items-center justify-between'>
        <Link href='/' className='flex items-center gap-2 overflow-hidden'>
          <Image
            src='/icons/android-chrome-512x512.png'
            alt={t('brandAlt')}
            width={40}
            height={40}
          />
        </Link>

        <NavMenuItems navLinks={navLinks} className='hidden md:flex' />

        <div className='hidden items-center gap-3 md:flex'>
          <button
            type='button'
            onClick={() => setCommandOpen(true)}
            className='border-border text-muted-foreground hover:border-primary hover:text-foreground rounded-md border px-2 py-1 font-mono text-xs transition-colors'>
            ⌘K
          </button>
          <LanguageSwitcher />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t('menu.open')}
            className='text-foreground focus-visible:ring-ring rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none md:hidden'>
            <Menu className='h-6 w-6' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            {navLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href} className='w-full cursor-pointer'>
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <div className='px-2 py-1.5'>
              <LanguageSwitcher />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </header>
  )
}
```

Note what changed vs. the original: `LanguageSwitcher` moved from a standalone `className='hidden md:flex'` sibling into a shared `<div className='hidden items-center gap-3 md:flex'>` alongside the new "⌘K" trigger button (so its own `className` prop is dropped — the wrapping div now controls visibility).

- [ ] **Step 4: Build and verify**

Run: `pnpm build`
Expected: build completes with no type errors.

- [ ] **Step 5: Manual verification**

Run `pnpm dev`, open `http://localhost:3000` (desktop width) and confirm:

- A small "⌘K" pill is visible in the header next to the language switcher.
- Clicking it opens the command palette; pressing `Ctrl+K` (or `Cmd+K` on macOS) from anywhere on any page (try `/about` too) toggles it open/closed.
- Typing filters the list (built-in `cmdk` fuzzy search — no extra code needed for this).
- Selecting "Portfolio"/"Skills"/etc. closes the palette and navigates to that page, preserving the current locale (test this from a `/pt-BR/...` URL).
- Selecting "Download résumé" closes the palette and triggers a PDF download instead of navigating away.

- [ ] **Step 6: Commit**

```bash
git add src/app/_components/command-palette.tsx src/app/_components/app-header.tsx messages/en-US.json messages/pt-BR.json
git commit -m "feat(web): add Cmd+K command palette for site navigation"
```

## Self-Review Notes

- **Spec coverage:** all 6 sections of the design spec map to a task — §2 Terminal → Task 1, §3 Stack marquee → Task 2, §4 Featured projects → Task 3, §5 Command palette → Task 4, §6 i18n → split across Tasks 2-4 (each task adds its own keys), §1 (section order: Hero → Stack → Featured Projects → footer) → enforced by both sections rendering as siblings inside the single home-page `MainContainer`, in that order.
- **Type consistency check:** `StackMarquee({ title })` (Task 2) and `FeaturedProjects({ title, viewAll })` (Task 3) prop names match exactly how `page.tsx` calls them in Task 3 Step 3. `CommandPalette({ open, onOpenChange })` (Task 4) matches exactly how `app-header.tsx` renders it. No mismatches found.
- **No placeholders:** every step has complete, copy-pasteable code; no "TBD"/"handle edge cases" left in.
