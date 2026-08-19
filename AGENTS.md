# my-website — AGENTS.md

Personal portfolio website built with Next.js 16 (App Router), Tailwind CSS v4, Radix/shadcn/ui, and Resend for email.

## Commands

| Command           | Action                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `pnpm dev`        | Dev server (localhost:3000)                                            |
| `pnpm build`      | Production build (also the typecheck — no separate `typecheck` script) |
| `pnpm lint`       | ESLint (flat config, v9)                                               |
| `pnpm lint:check` | Prettier check                                                         |
| `pnpm lint:fix`   | Prettier write                                                         |
| `pnpm dev:email`  | React Email dev server (`--dir src/emails`)                            |
| `pnpm prepare`    | Install husky hooks (run after clone)                                  |

## Key facts

- **Package manager**: pnpm 10 — use `pnpm`, never `npm` or `yarn`.
- **Node version**: 20.18.2 (`.nvmrc`).
- **No tests**: No test framework or test scripts exist. Do not attempt to run tests.
- **ESLint 9 flat config** in `eslint.config.mjs` (not `.eslintrc*`).
- **Tailwind v4**: CSS-first config via `@theme` in `src/app/globals.css`. No `tailwind.config.ts`. Uses `@tailwindcss/postcss`, not the v3 plugin.
- **React Compiler**: enabled in `next.config.ts` (`reactCompiler: true`).
- **shadcn/ui**: new-york style, components in `src/app/_components/ui/`. Alias `@/components` → `src/app/_components`, `@/ui` → `src/app/_components/ui`, `@/lib` → `src/lib`, `@/hooks` → `src/hooks`.
- **Import alias**: `@/*` → `./src/*`.
- **Commit convention**: Conventional Commits with commitlint + husky. Scopes must match the enum in `commitlint.config.ts` (20 scopes like `ui`, `api`, `config`, etc.).
- **Husky hooks**: `pre-commit` runs `lint-staged` (concurrent: false). `pre-push` runs `build`. `commit-msg` runs `commitlint`.
- **CI**: GitHub Actions on PRs only — runs prettier check + eslint.
- **`.env` is intentionally committed** (`.gitignore` allows opting in). Do not modify or remove `.env`. API keys are live.
- **Blog posts**: Markdown files in `public/posts/` loaded via `fs.readFile` in `src/helpers/get-markdown.ts`.
- **Contact form**: Uses `react-hook-form` + `zod` + Resend SDK. API route at `POST /api/emails/contact`.
- **Email dev**: `pnpm dev:email` serves `src/emails/` for visual preview.
- **Images**: Remote images allowed only from `github.com` (see `next.config.ts`).

## Architecture

```
src/
  app/              Next.js App Router pages + layouts + API routes
    _components/    Private components (pages/, ui/ — shadcn copies)
    (app)/          Route group (header/footer layout)
  @types/           Shared type definitions
  constants/        Social links, technology data
  data/             Static portfolio projects, authors
  emails/           React Email templates
  helpers/          Pure functions (markdown, slugify, reading time, etc.)
  hooks/            Custom React hooks
  lib/              cn() utility (clsx + tailwind-merge)
  schemas/          Zod validation schemas
  services/         Resend email client
```

## Conventions

- Server components fetch data directly (no React Query, no external fetching libs).
- Client components use `'use client'` directive.
- Import sorting is enforced by `eslint-plugin-simple-import-sort` (error level).
- Prettier: `semi: false`, `singleQuote: true`, `jsxSingleQuote: true`, `trailingComma: 'es5'`, `bracketSameLine: true`.

## Design language — "Brutalist Mono, Dark"

The theme lives entirely in `src/app/globals.css` design tokens. Keep changes coherent with it; do not reintroduce generic "AI-generated" aesthetics.

- **Fonts**: Space Grotesk (`--font-sans`) + JetBrains Mono (`--font-mono`), loaded in `layout.tsx`. Never fall back to Inter/Roboto/Arial/Geist/system defaults.
- **Palette**: near-black true-neutral background (`#0A0A0A`), off-white foreground, a **single** acid-lime accent (`#C4F000`). No violet/purple tint on neutrals, no multi-accent (green+cyan+magenta) mixes.
- **Corners**: moderately rounded — `--radius: 0.5rem` (rounded, not pill). All `--radius-sm/md/lg/xl` derive from it; change the single token, not per-component.
- **Contrast over glow**: prefer prominent borders and high contrast. Avoid soft glowing blurred blobs and neon shadows (legacy `animate-glow`/`animate-pulse-glow` are being phased out).
- To change direction, add a token set and preview it, don't hardcode colors/fonts in components.
