# Design — PWA (offline completo, service worker artesanal)

**Data:** 2026-08-22
**Fatia:** 2 (portfolio my-website). Depende da Fatia 1 (i18n, já mergeada na main).
Próximas fatias (fora deste spec): WCAG + anti-LLM; atualização de skills/tecnologias.

## Objetivo

Tornar o site um PWA instalável e navegável offline. Hoje o
`public/icons/site.webmanifest` está vazio (`name`/`short_name` em branco),
com `theme_color` branco (conflita com o tema dark `#0a0a0a`) e caminhos de
ícone quebrados (referencia `/android-chrome-*.png` na raiz, mas os arquivos
estão em `/icons/`). Não há service worker.

## Decisões (fechadas com o usuário)

- **Nível:** offline completo (não só instalável).
- **Service worker:** artesanal (Cache API), ~100 linhas. Motivo: `@serwist/next`
  não suporta Turbopack (Next 16 usa Turbopack por padrão no dev e build), e o
  `next.config.ts` já é envolvido por `withNextIntl` + React Compiler.
  `@serwist/turbopack` é experimental. Um SW próprio evita acoplamento de build
  e dependência experimental; como os assets do Next são content-hashed, o
  runtime cache cobre tudo.
- **Instalação:** nativa do navegador (sem botão/prompt customizado — YAGNI).
- **Atualização do SW:** auto-update via `skipWaiting` + `clients.claim()`, sem
  prompt de reload.

### Alternativas descartadas

- `@serwist/next` (webpack) — obrigaria `next build --webpack`, abrindo mão do
  Turbopack.
- `@serwist/turbopack` — suporte a Turbopack ainda experimental; mais peças no
  build (route handler + esbuild).

## Arquitetura

### 1. Manifest — `src/app/manifest.ts`

Substitui o `public/icons/site.webmanifest` estático por uma rota de metadata do
Next (`MetadataRoute.Manifest`), que o Next auto-linka via
`<link rel="manifest" href="/manifest.webmanifest">`.

```ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cristian Giehl — Full Stack Developer',
    short_name: 'Cristian Giehl',
    description: 'Portfólio de Cristian Giehl — desenvolvedor Full Stack.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['portfolio', 'technology'],
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
```

Deleta `public/icons/site.webmanifest`.

### 2. theme-color / colorScheme — `src/app/[locale]/layout.tsx`

Adiciona um export `viewport` (API do Next 16 para theme-color):

```ts
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
}
```

### 3. Service worker — `public/sw.js`

JavaScript puro, servido em `/sw.js` (escopo raiz "/"). Versão de cache
constante (bump manual quando quiser invalidar).

- `install`: `caches.open(PRECACHE)` e `addAll` do shell mínimo:
  `['/offline.html', '/icons/android-chrome-192x192.png', '/icons/android-chrome-512x512.png']`.
  Depois `self.skipWaiting()`.
- `activate`: apaga caches cujo nome não seja o da versão atual; `clients.claim()`.
- `fetch` (só same-origin, só GET; ignora `/api/`):
  - **Navegações** (`request.mode === 'navigate'`): **NetworkFirst** — tenta a
    rede, cacheia a resposta ok no cache de runtime; se a rede falhar, tenta o
    cache do runtime para essa URL e, por fim, `/offline.html`.
  - **`/_next/static/`, `/_next/image`, CSS/JS/fontes, imagens (`/icons/`,
    `/images/`)**: **StaleWhileRevalidate** — responde do cache e atualiza em
    background (assets são content-hashed, então é seguro).
  - Demais GET same-origin: NetworkFirst simples com fallback ao cache.
  - Não intercepta requests não-GET, cross-origin ou `/api/`.

### 4. Página offline — `public/offline.html`

HTML estático, bilíngue (PT/EN), com estilos dark inline (self-contained, sem
depender do bundle). Motivo de ser HTML puro e não uma rota Next: após a
reestrutura `[locale]`, o root `layout.tsx` é um pass-through (sem
`<html>/<body>`), então uma rota fora de `[locale]` não teria o shell HTML.
Conteúdo: título "Você está offline / You're offline", uma frase curta nos dois
idiomas e um link para "/". Faz parte do precache do SW.

### 5. Registro do SW — `src/app/_components/service-worker-register.tsx`

Client component (`'use client'`) que, num `useEffect`, registra `/sw.js`
apenas quando `process.env.NODE_ENV === 'production'` e
`'serviceWorker' in navigator`. Renderiza `null`. Montado uma vez no
`src/app/[locale]/layout.tsx` (dentro do `<body>`).

## Componentes afetados (mapa de arquivos)

- **Criar:** `src/app/manifest.ts`, `public/sw.js`, `public/offline.html`,
  `src/app/_components/service-worker-register.tsx`.
- **Modificar:** `src/app/[locale]/layout.tsx` (export `viewport` + montar
  `<ServiceWorkerRegister />`).
- **Deletar:** `public/icons/site.webmanifest`.

## Estratégia de teste / verificação

- `pnpm build` passa (sem test runner no repo; gate é build + checagem manual).
- `/manifest.webmanifest` servido com os campos corretos; `<link rel="manifest">`
  presente; meta `theme-color` = `#0a0a0a`.
- Em `pnpm start` (produção): o SW registra; após visitar rotas, os caches
  populam; em modo offline (DevTools) a navegação para páginas visitadas
  funciona e rotas não visitadas caem em `/offline.html`.
- Lighthouse: PWA "installable" sem erros de manifest/theme-color; sem regressão
  de performance/SEO relevante.
- `<html lang>` continua dinâmico (não regride a Fatia 1).

## Fora de escopo (próximas fatias)

- WCAG movimento (`prefers-reduced-motion`), menu Radix, remoção de blobs/glow
  "cara de LLM", toggle de tema, auditoria de contraste.
- Atualização de skills/tecnologias e correção do ícone do GSAP.
- Ícone maskable dedicado com padding (se o logo cortar nas bordas) — follow-up.
- Prompt/botão customizado de instalação.
