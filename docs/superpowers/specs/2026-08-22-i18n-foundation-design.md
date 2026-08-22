# Design — Fundação i18n (pt-BR / en-US)

**Data:** 2026-08-22
**Fatia:** 1 de N (portfolio my-website). Próximas fatias (fora deste spec): PWA; WCAG + anti-LLM; atualização de skills/tecnologias.

## Objetivo

Adicionar internacionalização completa pt-BR / en-US ao site, cobrindo UI,
textos de página, dados de portfólio/skills e os posts do blog. Corrige de
quebra a violação WCAG 3.1.1 (hoje `<html lang='en'>` com conteúdo pt-BR).

## Decisões (fechadas com o usuário)

- **Biblioteca:** `next-intl` v4 (compatível com Next.js 16 App Router, `proxy.ts`).
- **Locale padrão:** `pt-BR`, **sem prefixo** de URL. `en-US` servido em `/en-US/…`.
  - `localePrefix: 'as-needed'`.
- **Abrangência da tradução:** tudo — UI, textos de página, dados de
  portfolio/skills e os 6 posts markdown.
- **Autoria das traduções:** o assistente gera o en-US (mensagens + posts
  `.en.md`); o usuário revisa antes do merge.
- **Detecção:** 1ª visita via `Accept-Language`; escolha manual salva em cookie
  (~200 dias) e passa a prevalecer. Switcher acessível no header.

### Alternativas descartadas

- **Paraglide JS** — bom tree-shaking, porém integração de rotas mais manual e
  menos convencional para o time.
- **i18n nativo do Next** — sem SSR de mensagens/formatação ICU pronto; retrabalho.

## Arquitetura

### Estrutura de rotas

Mover as rotas de `src/app/(app)/` para dentro de um segmento `[locale]`.

```
src/app/
  layout.tsx              # mínimo (repassa children) ou removido
  [locale]/
    layout.tsx            # <html lang={locale}>, fontes, Providers, NextIntlClientProvider
    (app)/
      (home)/page.tsx
      portfolio/…  about/…  skills/…  contact/…
      post/[slug]/page.tsx
  api/…                   # FORA de [locale] — não localizado
  sitemap.ts / robot.ts   # entradas para os 2 locales
src/i18n/
  routing.ts              # locales ['pt-BR','en-US'], defaultLocale 'pt-BR', localePrefix 'as-needed', localeCookie
  request.ts              # getRequestConfig — carrega messages/<locale>.json
  navigation.ts           # Link/redirect/usePathname/useRouter localizados
src/proxy.ts              # createMiddleware(routing); matcher exclui /api, /trpc, /_next, /_vercel, arquivos com ponto
messages/
  pt-BR.json  en-US.json
```

- `<html lang={locale}>` passa a viver em `[locale]/layout.tsx` (as fontes
  Space Grotesk / JetBrains Mono e `<Providers>` migram para lá).
- `generateStaticParams` gera cada `locale` (e `[locale] × [slug]` para posts).
- `setRequestLocale(locale)` em layout e páginas para habilitar render estático.
- URLs: `/portfolio` (pt-BR) e `/en-US/portfolio`. `/en-US/…` redundante em
  pt-BR → 307 para a versão limpa.

### Organização das mensagens

`messages/pt-BR.json` e `messages/en-US.json`, por namespace de rota:
`common` (nav, botões, footer, switcher), `home`, `about`, `skills`,
`contact`, `portfolio`, `post`. Componentes usam `useTranslations('<ns>')`
(client) ou `getTranslations` (server).

### Dados de portfolio/skills

- **Portfolio (`src/data/portfolio.ts`):** separar estrutura de texto.
  - Ficam no `.ts`: slug, imagem, tecnologias, links, `featured`, datas.
  - Migram para `messages` sob `portfolio.<slug>.title` / `.description`.
  - O card lê o texto pelo slug no locale ativo.
- **Skills (`src/app/(app)/skills/page.tsx`):** mover `level`, `description` de
  cada skill e títulos de seção/legenda para `messages`
  (`skills.items.<name>.description`, `skills.levels.*`, `skills.sections.*`).
- **`technology-data.ts`:** nomes de tecnologia (React, Node.js…) **não** se
  traduzem (nomes próprios). Apenas os `category` headings usados no
  multi-select passam por `messages`.

### Posts (traduzir tudo)

- Convenção por arquivo: `public/posts/<slug>.md` (pt-BR) e
  `public/posts/<slug>.en.md` (en-US). Gerar os 6 `.en.md`.
- `get-markdown.ts` / `get-project.ts` recebem `locale` e resolvem o arquivo,
  com **fallback** para pt-BR quando faltar o `.en.md` (com aviso sutil de
  "originalmente em português" no en-US).
- Metadados do post (título, tempo de leitura) seguem o locale.
- `generateStaticParams` gera `[locale] × [slug]`.

### Detecção + switcher

- `src/proxy.ts` via `createMiddleware(routing)`: detecta `Accept-Language` na
  1ª visita; escolha manual salva em `localeCookie` (~200 dias) prevalece.
- **Switcher** no header (`app-header.tsx`): controle acessível PT/EN
  (`aria-label`, `hreflang`), usando `Link`/`usePathname` localizados para
  trocar mantendo a rota atual. Variante mobile dentro do menu.

### SEO / metadata

- `generateMetadata` por locale: `title` e `description` traduzidos,
  `openGraph.locale` correto, e `alternates.languages` (`pt-BR` ↔ `en-US`) com
  `hreflang`.
- `sitemap.ts` emite as duas versões de cada rota.
- `metadata.ts` refatorado para produzir metadata por locale.

## Componentes afetados (mapa de arquivos)

- Novo: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`,
  `src/proxy.ts`, `messages/pt-BR.json`, `messages/en-US.json`,
  `public/posts/*.en.md` (6 arquivos).
- Movidos: tudo em `src/app/(app)/**` → `src/app/[locale]/(app)/**`;
  `src/app/layout.tsx` → base de `src/app/[locale]/layout.tsx`.
- Editados: `next.config.ts` (plugin `createNextIntlPlugin`), `metadata.ts`,
  `sitemap.ts`, `robot.ts`, `not-found.tsx`, `app-header.tsx` (switcher +
  nav via messages), `app-footer.tsx`, todas as páginas e componentes de
  página que hoje têm texto pt-BR hardcoded, `src/data/portfolio.ts`,
  `src/app/_components/pages/skills/*`, `technology-data.ts` (categorias),
  helpers `get-markdown.ts` / `get-project.ts` / `get-nearby-projects.ts`.

## Estratégia de teste / verificação

- `pnpm build` passa (inclui checagem de tipos e `generateStaticParams`).
- `/` serve pt-BR; `/en-US` serve inglês; `/en-US` redundante em pt-BR → 307.
- Switcher troca o idioma preservando a rota atual; cookie persiste entre visitas.
- Fallback de post: `.en.md` ausente cai para pt-BR com o aviso.
- Lighthouse/axe: sem erros de `hreflang` e `lang`; `<html lang>` reflete o locale.
- Verificação manual das rotas principais nos dois locales via Playwright.

## Fora de escopo (próximas fatias)

- PWA (manifest, theme-color, Serwist, offline).
- WCAG movimento (`prefers-reduced-motion`), menu Radix, remoção de blobs/glow
  "cara de LLM", toggle de tema, auditoria de contraste.
- Atualização de skills/tecnologias e correção do ícone do GSAP.
