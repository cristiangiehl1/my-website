# Tech/skills update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the GSAP icon and add 5 real technologies (Playwright, shadcn/ui, Radix UI, Resend, React Email) to the technology registry and the skills page.

**Architecture:** Add the new techs to the shared `TECHNOLOGY_DATA` registry (which drives the skills icons, the about badge wall, and the portfolio filter) plus two new category values; then list them as rated skills on `/skills` with localized descriptions.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, next-intl v4, Tailwind 4, `react-icons`.

## Global Constraints

- Package manager **pnpm**; verification gate is `pnpm build` succeeding + the manual checks per task. No unit-test runner — do NOT add one.
- Code style: single quotes, NO semicolons (Prettier), `simple-import-sort` order.
- Commit scope must be valid per commitlint (`i18n` INVALID). Use `web`. No `Co-Authored-By: Claude` line and no `🤖 Generated with Claude Code` footer.
- Do NOT run `pnpm lint:fix` (whole-repo prettier pollutes commits). Stage only intended files with explicit `git add <paths>`; the husky lint-staged hook formats staged files.
- Do not translate proper nouns / product names (Playwright, shadcn/ui, Radix UI, Resend, React Email, GSAP). Translate only prose descriptions.
- `SkillLevel` values are exactly `'Basico' | 'Intermediario' | 'Avançado' | 'Expert'` (note: `Avançado` keeps its accent; `Basico`/`Intermediario` do not). `skill.name` must be a key of `TECHNOLOGY_DATA`.
- Icons verified present in `react-icons`: `SiGreensock`, `SiShadcnui`, `SiRadixui`, `SiResend` (from `react-icons/si`); `TbMasksTheater`, `TbMailCode` (from `react-icons/tb`).
- Work on branch `feat/tech-update` (already created; spec committed there).

---

### Task 1: Registry + category types (GSAP fix + 5 new techs)

**Files:**

- Modify: `src/@types/technology.ts` (add `'UI'` and `'Communication'` to `TechonologyCategory`)
- Modify: `src/constants/technology-data.ts` (fix GSAP icon; add 5 entries + imports)

**Interfaces:**

- Produces: 5 new keys on `TECHNOLOGY_DATA` — `playwright`, `shadcn`, `radix`, `resend`, `react-email` — each usable as a `TechnologyName`. Consumed by Task 2's skills arrays and by `SkillCard` (icon/label).

- [ ] **Step 1: Add the two category values**

In `src/@types/technology.ts`, extend the `TechonologyCategory` union with two members (place them logically):

```ts
  | 'UI'
  | 'Communication'
```

(Final union includes the existing 16 members plus these two.)

- [ ] **Step 2: Fix the GSAP icon + add imports in `technology-data.ts`**

- In the `react-icons/si` import block, add `SiGreensock`, `SiRadixui`, `SiResend`, `SiShadcnui` (keep alphabetical/simple-import-sort order).
- In the `react-icons/tb` import block, add `TbMailCode` and `TbMasksTheater`. Remove `TbBrandFramerMotion` from that import **only if** it is no longer referenced after Step 3 (it was used solely by the `gsap` entry).
- Change the `gsap` entry's icon from `TbBrandFramerMotion` to `SiGreensock` (leave its `value`, `label`, `style.iconColor: 'text-green-500'`, `category: 'Animation'`, and `link` unchanged).

- [ ] **Step 3: Add the 5 registry entries**

Add these entries to the `TECHNOLOGY_DATA` object (anywhere inside the object literal; grouping near related items is fine):

```ts
  playwright: {
    value: 'playwright',
    label: 'Playwright',
    icon: TbMasksTheater,
    style: { iconColor: 'text-emerald-500' },
    category: 'Testing',
    link: 'https://playwright.dev/',
  },
  shadcn: {
    value: 'shadcn',
    label: 'shadcn/ui',
    icon: SiShadcnui,
    style: { iconColor: 'text-foreground' },
    category: 'UI',
    link: 'https://ui.shadcn.com/',
  },
  radix: {
    value: 'radix',
    label: 'Radix UI',
    icon: SiRadixui,
    style: { iconColor: 'text-foreground' },
    category: 'UI',
    link: 'https://www.radix-ui.com/',
  },
  resend: {
    value: 'resend',
    label: 'Resend',
    icon: SiResend,
    style: { iconColor: 'text-foreground' },
    category: 'Communication',
    link: 'https://resend.com/',
  },
  'react-email': {
    value: 'react-email',
    label: 'React Email',
    icon: TbMailCode,
    style: { iconColor: 'text-amber-400' },
    category: 'Communication',
    link: 'https://react.email/',
  },
```

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: succeeds (the `satisfies Record<...>` on `TECHNOLOGY_DATA` type-checks the new `category` values against the extended union; the new keys widen `TechnologyName`).

- [ ] **Step 5: Manual check**

`pnpm dev`, open `/about`: the "Experiência & Stack" badge wall now shows GSAP with the correct GreenSock icon and includes Playwright / shadcn/ui / Radix UI / Resend / React Email badges. `/portfolio` filter multi-select shows new `UI` and `Communication` groups.

- [ ] **Step 6: Commit**

```bash
git add src/@types/technology.ts src/constants/technology-data.ts
git commit -m "feat(web): fix GSAP icon and register Playwright, shadcn/ui, Radix, Resend, React Email"
```

---

### Task 2: List the new techs as rated skills

**Files:**

- Modify: `src/app/[locale]/(app)/skills/page.tsx` (add to `frontendSkills` and `toolsSkills`)
- Modify: `messages/pt-BR.json`, `messages/en-US.json` (add `skills.items.<name>.description` ×5)

**Interfaces:**

- Consumes: the 5 registry keys from Task 1. `SkillCard` renders each via `TECHNOLOGY_DATA[skill.name]` (icon/label) + `t('items.<name>.description')` + `t('levels.<level>.label')`.

- [ ] **Step 1: Add the skill entries to `skills/page.tsx`**

Append to the `frontendSkills` array (after the existing last entry `gsap`):

```ts
  { name: 'shadcn', level: 'Avançado', yearsOfExperience: 2, description: '' },
  { name: 'radix', level: 'Avançado', yearsOfExperience: 2, description: '' },
```

Append to the `toolsSkills` array (after the existing last entry `telegram`):

```ts
  {
    name: 'playwright',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'resend',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
  {
    name: 'react-email',
    level: 'Intermediario',
    yearsOfExperience: 1,
    description: '',
  },
```

(`description: ''` matches every other entry — the visible text comes from messages.)

- [ ] **Step 2: Add the descriptions to both message files**

Inside `skills.items` in `messages/pt-BR.json`, add:

```json
"shadcn": { "description": "Componentes acessíveis sobre Radix, design system" },
"radix": { "description": "Primitivos de UI acessíveis (Dialog, Popover, etc.)" },
"playwright": { "description": "Testes E2E e automação de navegador" },
"resend": { "description": "E-mail transacional (API, templates e webhooks)" },
"react-email": { "description": "Templates de e-mail com componentes React" }
```

Inside `skills.items` in `messages/en-US.json`, add the parallel keys:

```json
"shadcn": { "description": "Accessible components on top of Radix, design system" },
"radix": { "description": "Accessible UI primitives (Dialog, Popover, etc.)" },
"playwright": { "description": "E2E tests and browser automation" },
"resend": { "description": "Transactional email (API, templates and webhooks)" },
"react-email": { "description": "Email templates with React components" }
```

Keep valid JSON; do not disturb existing keys. Each value is an object with a `description` field (matching the existing `skills.items.<name>` shape that `SkillCard` reads via `items.<name>.description`).

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: succeeds. A missing `skills.items.<name>` key would surface as a missing-message error, so a green build confirms all five resolve.

- [ ] **Step 4: Manual check**

`pnpm dev`:

- `/skills` — Frontend section shows shadcn/ui + Radix UI (Avançado, 75%, 2 anos); "DevOps & Ferramentas" shows Playwright + Resend + React Email (Intermediário, 50%, 1 ano) with correct icons and PT descriptions. The "Tecnologias" stat count increased by 5.
- `/en-US/skills` — same, with English descriptions and "year"/"years" wording.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/(app)/skills/page.tsx" messages/pt-BR.json messages/en-US.json
git commit -m "feat(web): add shadcn, Radix, Playwright, Resend, React Email to skills"
```

---

## Self-Review notes (author)

- **Spec coverage:** GSAP icon fix → T1; register 5 techs + `UI`/`Communication` categories → T1; list as rated skills with levels → T2; localized descriptions → T2. All spec sections mapped.
- **Placeholder scan:** every code step has full content; no TODOs.
- **Type consistency:** new `skill.name` values (`shadcn`, `radix`, `playwright`, `resend`, `react-email`) exist as `TECHNOLOGY_DATA` keys after T1, so they satisfy `TechnologyName` in T2; `level` values use the exact `SkillLevel` spelling (`Avançado`, `Intermediario`); category values (`UI`, `Communication`, `Testing`) are all in the union after T1 Step 1.
- **Ordering:** T1 must precede T2 (T2's `skill.name` keys and `SkillCard` icon lookup depend on the T1 registry entries).
- **Note:** `telegram` stays `category: 'Tool'` (unchanged) — moving it into `Communication` is out of scope.
