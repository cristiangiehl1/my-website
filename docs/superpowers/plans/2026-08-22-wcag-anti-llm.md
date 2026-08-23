# WCAG + anti-LLM + polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve accessibility (WCAG) and remove the "LLM-looking" visuals (glow blobs, floating code blocks, floating icons, pulse-glow), keeping the brutalist dark identity.

**Architecture:** Replace the home hero's floating-code-blocks/glow with a static mono "terminal panel"; strip decorative glow/float animations everywhere and honor `prefers-reduced-motion`; rebuild the mobile menu on Radix Dialog for real focus management; fix the low-contrast featured badge; drop the unused `next-themes` dependency.

**Tech Stack:** Next.js 16 (App Router, Turbopack, React Compiler), React 19, next-intl v4, Tailwind 4, Radix UI (`@radix-ui/react-dialog` via `src/app/_components/ui/dialog.tsx`).

## Global Constraints

- Package manager **pnpm**; verification gate is `pnpm build` succeeding + the manual checks per task. No unit-test runner exists — do NOT add one.
- Code style: single quotes, NO semicolons (Prettier), `simple-import-sort` order.
- Commit scope must be valid per commitlint (`i18n` INVALID). Use `web`. No `Co-Authored-By: Claude` line and no `🤖 Generated with Claude Code` footer.
- Do NOT run `pnpm lint:fix` (whole-repo prettier pollutes commits). Stage only intended files with explicit `git add <paths>`; the husky lint-staged hook formats staged files.
- Dark theme; single acid-lime accent `#c4f000`; true-neutral surfaces. Do not introduce off-palette hues.
- Do not regress i18n/PWA: `<html lang={locale}>` stays dynamic; manifest and service worker untouched.
- Work on branch `feat/wcag-anti-llm` (already created; spec committed there).

---

### Task 1: Home hero → static terminal panel

**Files:**

- Create: `src/app/_components/pages/home/terminal-panel.tsx`
- Modify: `src/app/[locale]/(app)/(home)/page.tsx`
- Modify: `messages/pt-BR.json`, `messages/en-US.json` (add `home.terminal.*`)

**Interfaces:**

- Produces: `TerminalPanel` — `function TerminalPanel({ role, location }: { role: string; location: string })`, a static (non-animated) presentational component.
- Consumes: `getTranslations('home')` already in the home page for `role`/`location` values.

- [ ] **Step 1: Add `home.terminal` keys to both message files**

`messages/pt-BR.json` → inside the existing `home` object add:

```json
"terminal": { "role": "Desenvolvedor Full-Stack", "location": "Itapema/SC · remoto" }
```

`messages/en-US.json` → inside `home` add:

```json
"terminal": { "role": "Full-Stack Developer", "location": "Itapema/SC · remote" }
```

- [ ] **Step 2: Create `src/app/_components/pages/home/terminal-panel.tsx`**

Static, mono, on-palette (no yellow — use destructive/muted-foreground/primary dots). No `animate-*`.

```tsx
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
```

- [ ] **Step 3: Use it in the home page, removing the floating-code-blocks column**

In `src/app/[locale]/(app)/(home)/page.tsx`:

- Add import: `import { TerminalPanel } from '@/app/_components/pages/home/terminal-panel'`.
- Replace the entire right-column block — the `<div className='hidden items-center justify-center lg:flex'>` ... `</div>` that contains the two floating code blocks, the center glow, and the center icon — with:

```tsx
<div className='hidden items-center justify-center lg:flex'>
  <TerminalPanel role={t('terminal.role')} location={t('terminal.location')} />
</div>
```

- Remove any now-unused imports in the file (e.g. `BiCodeAlt` is still used by the left-column badge — keep it; only remove imports that become unused after deleting the right column).

- [ ] **Step 4: Build + check**

Run `pnpm build`. Then `pnpm dev`: `/` shows the static terminal panel on desktop (no motion), `/en-US` shows the English role/location. No leftover floating blocks/glow.

- [ ] **Step 5: Commit**

```bash
git add "src/app/_components/pages/home/terminal-panel.tsx" "src/app/[locale]/(app)/(home)/page.tsx" messages/pt-BR.json messages/en-US.json
git commit -m "feat(web): replace home hero visual with static terminal panel"
```

---

### Task 2: Strip decorative motion + honor prefers-reduced-motion

**Files:**

- Modify: `src/app/_components/container.tsx`
- Modify: `src/app/[locale]/not-found.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**

- Consumes/Produces: none cross-task. Self-contained visual/CSS changes.

- [ ] **Step 1: Remove the glow blobs from `container.tsx`**

In `src/app/_components/container.tsx`, delete the entire "Animated Background Elements" block:

```tsx
{
  /* Animated Background Elements */
}
;<div className='pointer-events-none absolute inset-0 overflow-hidden'>
  <div className='bg-primary/10 animate-glow absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl' />
  <div className='bg-secondary/10 animate-glow absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl' />
</div>
```

Leave the rest of `Container` (the wrapper div + `{children}`) intact.

- [ ] **Step 2: De-animate `src/app/[locale]/not-found.tsx`**

- Delete the `FloatingIcons` function entirely and remove `<FloatingIcons />` from the JSX.
- Remove the now-unused icon imports `Code2, Cpu, Terminal` from the `lucide-react` import (keep `ArrowLeft`).
- In `TerminalWindow`, remove `animate-pulse-glow` from the container className (keep the rest) and remove `animate-pulse` from the caret span.
- Gate the typing effect for reduced motion. Replace the `useEffect` body with:

```tsx
useEffect(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    setDisplayText(fullText)
    return
  }
  let index = 0
  const interval = setInterval(() => {
    if (index <= fullText.length) {
      setDisplayText(fullText.slice(0, index))
      index++
    } else {
      clearInterval(interval)
    }
  }, 30)
  return () => clearInterval(interval)
}, [])
```

- [ ] **Step 3: De-animate `src/app/not-found.tsx` (root bilingual fallback)**

Apply the exact same three edits as Step 2 to this file: delete `FloatingIcons` + its usage, drop unused `Code2, Cpu, Terminal` imports, remove `animate-pulse-glow` and the caret `animate-pulse`, and gate the typing `useEffect` with the same `prefers-reduced-motion` check shown above.

- [ ] **Step 4: Clean `globals.css` + add reduced-motion rule**

In `src/app/globals.css`:

- Delete the now-unused keyframes and helper classes: `@keyframes float`, `@keyframes glow`, `@keyframes pulse-glow`, `@keyframes typing`, `@keyframes blink-caret`, and the `.animate-float`, `.animate-glow`, `.animate-pulse-glow` class rules. (Nothing references them after Tasks 1–2; the 404 typing uses JS, not the `typing` keyframe.)
- Append this global rule (after `@layer base`):

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

- [ ] **Step 5: Build + checks**

Run `pnpm build`. Then:

- `grep -rn "animate-float\|animate-glow\|animate-pulse-glow" src` → returns nothing.
- `pnpm dev`: no glow blobs on any page; 404 has no floating icons and no pulse-glow. In DevTools with "Emulate prefers-reduced-motion: reduce", the 404 text appears immediately (no typing).

- [ ] **Step 6: Commit**

```bash
git add src/app/_components/container.tsx "src/app/[locale]/not-found.tsx" src/app/not-found.tsx src/app/globals.css
git commit -m "feat(web): remove decorative glow/float motion and honor reduced-motion"
```

---

### Task 3: Accessible mobile menu via Radix Dialog

**Files:**

- Modify: `src/app/_components/app-header.tsx`

**Interfaces:**

- Consumes: `Dialog, DialogTrigger, DialogContent, DialogTitle` from `@/app/_components/ui/dialog`; `NavMenuItems`, `LanguageSwitcher` (existing); `useTranslations('common')`.

- [ ] **Step 1: Rewrite the mobile menu with Radix Dialog**

In `src/app/_components/app-header.tsx`:

- Remove the manual mobile state and markup: the `useState` `isOpen`, the `menuBtnClass` hamburger `<button>` with the three animated bars, the OVERLAY `<div>`, and the MENU `<div id='navbar'>` with its `onFocus/onBlur` handlers.
- Keep the desktop `NavMenuItems` + `LanguageSwitcher` (the `hidden md:flex` ones) exactly as-is.
- Add imports:

```tsx
import { Menu } from 'lucide-react'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
```

- Replace the mobile section with a Radix Dialog. The trigger is an icon button (visible only under `md`); the content holds the nav + switcher. Radix handles focus-trap, Esc, `aria-modal`, focus restore, and scroll-lock. Use a visually-hidden `DialogTitle` for the accessible name. `NavMenuItems` accepts an `onClick` (already used to close) — pass a close handler via `DialogClose` wrapping, or keep the dialog open state controlled. Simplest controlled approach:

```tsx
'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { NavLinkWithSubRoutes } from '@/@types/nav-links'
import { Link } from '@/i18n/navigation'

import { LanguageSwitcher } from './language-switcher'
import { NavMenuItems } from './nav-menu-items'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'

export function AppHeader() {
  const t = useTranslations('common')
  const [open, setOpen] = useState(false)

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
        <LanguageSwitcher className='hidden md:flex' />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            aria-label={t('menu.open')}
            className='text-foreground p-2 md:hidden'>
            <Menu className='h-6 w-6' />
          </DialogTrigger>
          <DialogContent className='top-20 translate-y-0 gap-6'>
            <DialogTitle className='sr-only'>{t('nav.portfolio')}</DialogTitle>
            <NavMenuItems
              navLinks={navLinks}
              className='flex-col items-start'
              onClick={() => setOpen(false)}
            />
            <LanguageSwitcher />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  )
}
```

Note: the `DialogTitle` provides the required accessible name (Radix warns without one); `sr-only` keeps it visually hidden. The `onClick={() => setOpen(false)}` on `NavMenuItems` closes the dialog after navigating (NavMenuItems already forwards `onClick` to its `NavLink`s).

- [ ] **Step 2: Build + a11y check**

Run `pnpm build`. Then `pnpm dev` at a narrow width:

- Click the menu icon → dialog opens with nav + switcher.
- `Tab` cycles only within the dialog (focus trapped); `Esc` closes it; focus returns to the trigger; the body is scroll-locked while open.
- Clicking a nav link navigates and closes the dialog.
- Desktop (≥ md) is unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/app/_components/app-header.tsx
git commit -m "feat(web): rebuild mobile menu on Radix Dialog for accessibility"
```

---

### Task 4: Contrast fix + remove unused next-themes

**Files:**

- Modify: `src/app/_components/portfolio-item-card.tsx`
- Modify: `package.json`, `pnpm-lock.yaml`

**Interfaces:**

- Consumes/Produces: none cross-task.

- [ ] **Step 1: Fix the featured-badge contrast**

In `src/app/_components/portfolio-item-card.tsx`, the featured badge uses light text on the lime accent. Change its className from:

```tsx
<div className='bg-primary absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-bold text-white text-shadow-black text-shadow-xs'>
```

to (dark text on lime = high contrast; drop the text-shadow):

```tsx
<div className='bg-primary text-primary-foreground absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-bold'>
```

Leave the badge text (`t('featured')`) unchanged.

- [ ] **Step 2: Remove the unused `next-themes` dependency**

First confirm it's unused:

```bash
grep -rn "next-themes" src
```

Expected: nothing. Then:

```bash
pnpm remove next-themes
```

Expected: `next-themes` removed from `package.json` dependencies and `pnpm-lock.yaml` updated.

- [ ] **Step 3: Build**

Run `pnpm build`.
Expected: succeeds. `grep -rn "next-themes" src package.json` returns nothing.

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/portfolio-item-card.tsx package.json pnpm-lock.yaml
git commit -m "fix(web): fix featured-badge contrast and drop unused next-themes"
```

---

## Self-Review notes (author)

- **Spec coverage:** terminal panel hero → Task 1; remove glow blobs → Task 2; 404 de-animation + reduced-motion + keyframe cleanup → Task 2; Radix Dialog menu → Task 3; contrast fix → Task 4; remove next-themes → Task 4. All spec sections mapped.
- **Placeholder scan:** every code step has full content; no TODOs.
- **Type consistency:** `TerminalPanel({ role, location })` used consistently; Dialog imports match `ui/dialog.tsx` exports (`Dialog`, `DialogTrigger`, `DialogContent`, `DialogTitle`).
- **Ordering:** Task 1 removes home's `animate-float`/`animate-pulse` usage; Task 2 removes container/404 usages, so removing the keyframes/classes in Task 2 Step 4 leaves no dangling references. `animate-pulse` (Tailwind built-in) elsewhere is neutralized by the reduced-motion rule.
- **Note:** the reduced-motion rule also affects the contact-form `Loader2` spinner (it effectively stops under reduced-motion) — this is acceptable WCAG behavior, not a regression.
