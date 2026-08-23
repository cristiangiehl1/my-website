# Design — WCAG + anti-LLM + polimento

**Data:** 2026-08-22
**Fatia:** 3 (portfolio my-website). Depende das Fatias 1 (i18n) e 2 (PWA), já
mergeadas na main. Próxima fatia (fora deste spec): atualização de
skills/tecnologias.

## Objetivo

Elevar acessibilidade (WCAG) e remover os elementos visuais "cara de LLM",
mantendo a identidade brutalist dark. Cobre os requisitos 1 (WCAG), 2 (evitar
fontes/cores/animações típicas de LLM) e parte do 3 (responsivo/menu).

## Contexto do problema

- **Animações "de LLM":** `Container` renderiza dois blobs `blur-3xl animate-glow`
  em toda página; a home tem "floating code blocks" (`animate-float`) + glow
  central (`animate-pulse`); o 404 tem `FloatingIcons` (float), `animate-pulse-glow`
  e caret `animate-pulse`. Nenhuma animação respeita `prefers-reduced-motion`
  (viola WCAG 2.3.3/2.2.2). São justamente os clichês de hero gerado por IA.
- **Menu mobile:** artesanal, sem focus-trap, sem fechar no Esc, sem `aria-modal`.
- **Contraste:** o badge "Destaque" (`portfolio-item-card.tsx`) usa `text-white`
  sobre o acento limão `#c4f000` — contraste insuficiente.
- **Tema:** `next-themes` está nas dependências mas não é usado.

## Decisões (fechadas com o usuário)

- **Tema:** dark-only assumido como decisão de design; **remover** a dependência
  `next-themes`. Sem toggle.
- **Hero:** substituir os floating code blocks por um **painel terminal
  estático** (mono, dados reais, sem animação).
- **Blobs de glow globais:** remover de todas as páginas.
- **Movimento restante:** gate por `prefers-reduced-motion`; remover keyframes de
  float/glow/pulse-glow.
- **Menu mobile:** reescrever com **Radix Dialog** (já instalado).
- **Contraste:** corrigir o badge "Destaque" e o que reprovar em AA.

### Alternativas descartadas

- Tema claro + toggle — esforço de paleta/contraste maior; dark-only é uma
  decisão de identidade válida.
- Hero só-texto / grid de stats — descartados a favor do painel terminal.
- Consertar o menu artesanal no lugar — mais código de a11y à mão e mais frágil
  que o Radix Dialog.

## Arquitetura

### A. Movimento & anti-LLM

- **`src/app/_components/container.tsx`:** remover o bloco dos dois blobs
  (`bg-primary/10 animate-glow blur-3xl` e `bg-secondary/10 animate-glow`). O
  `Container` passa a não ter camada de fundo animada.
- **`src/app/[locale]/(app)/(home)/page.tsx`:** remover a coluna direita inteira
  (floating code blocks + glow central + ícone com `hover:scale`), substituindo
  por `<TerminalPanel />`. Manter a coluna esquerda (badge, headline, CTAs,
  sociais).
- **`src/app/_components/pages/home/terminal-panel.tsx` (novo):** card estático
  com "chrome" de terminal (três pontos) e linhas mono de prompt:
  `$ whoami` → valor localizado, `$ stack --top` → "TS · Next · Rust · Python"
  (literais de tech, não traduzidos), `$ location` → valor localizado,
  `$ _` (cursor estático). Sem `animate-*`. Server component; textos via
  `getTranslations('home')`.
- **404 (`src/app/not-found.tsx` e `src/app/[locale]/not-found.tsx`):** remover
  `FloatingIcons`, `animate-pulse-glow` (no TerminalWindow) e o caret
  `animate-pulse`. Manter o efeito de digitação, mas quando
  `prefers-reduced-motion: reduce`, renderizar o texto completo imediatamente
  (sem o `setInterval`). Usar `window.matchMedia('(prefers-reduced-motion: reduce)')`
  no efeito. (Obs.: `src/app/not-found.tsx` é o fallback estático da raiz — se ele
  não usa as animações, apenas garantir que não as reintroduz; o 404 localizado
  é `[locale]/not-found.tsx`.)
- **`src/app/globals.css`:** remover os `@keyframes float`, `glow`, `pulse-glow` e
  as classes `.animate-float`, `.animate-glow`, `.animate-pulse-glow` (ficam sem
  uso). Manter `typing`/`blink-caret` apenas se ainda usados pelo 404; caso
  contrário remover. Adicionar, dentro de `@layer base`, um bloco global:

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

### B. Acessibilidade

- **Menu mobile (`src/app/_components/app-header.tsx`):** substituir o
  dropdown/overlay artesanal por um **Radix Dialog** (via
  `src/app/_components/ui/dialog.tsx`). O botão hamburger vira o `DialogTrigger`
  (mantendo `aria-label` traduzido); o conteúdo do dialog contém os `NavMenuItems`
  e o `LanguageSwitcher`. Radix fornece focus-trap, Esc, `aria-modal`, restauração
  de foco e scroll-lock. Remover o estado manual `isOpen`, o overlay
  `onPointerDown` e os handlers `onFocus/onBlur`. A navegação desktop permanece.
- **Contraste:** em `src/app/_components/portfolio-item-card.tsx`, o badge
  "Destaque" troca `text-white` por `text-primary-foreground` (escuro `#0a0a0a`
  sobre o limão) e remove o `text-shadow` desnecessário. Auditar os demais usos
  de `text-muted-foreground` e `text-primary` como texto; corrigir os que
  reprovarem em AA (≥4.5:1 texto normal, ≥3:1 texto grande).

### C. Tema

- **Remover `next-themes`** de `package.json` (e lockfile). Confirmar por grep
  que nada importa `next-themes` (o `Providers` não usa). Nenhuma mudança de
  comportamento (o site já era dark-only via CSS).

## Componentes afetados (mapa de arquivos)

- **Criar:** `src/app/_components/pages/home/terminal-panel.tsx`.
- **Modificar:** `src/app/globals.css`, `src/app/_components/container.tsx`,
  `src/app/[locale]/(app)/(home)/page.tsx`,
  `src/app/[locale]/not-found.tsx`, `src/app/not-found.tsx` (se necessário),
  `src/app/_components/app-header.tsx`,
  `src/app/_components/portfolio-item-card.tsx`,
  `messages/pt-BR.json`, `messages/en-US.json` (chaves `home.terminal.*`),
  `package.json` + lockfile (remover next-themes).

## Estratégia de teste / verificação

- `pnpm build` passa (sem test runner; gate = build + checagem manual/Playwright).
- `grep -rn "next-themes" src` → vazio; `grep -rn "animate-float\|animate-glow\|animate-pulse-glow" src` → vazio.
- Menu mobile: abre/fecha pelo hamburger, fecha no Esc, foco preso enquanto
  aberto, foco volta ao trigger ao fechar, scroll do body travado.
- `prefers-reduced-motion: reduce` (emulado no DevTools): sem float/glow; o 404
  mostra o texto de imediato.
- Contraste: badge "Destaque" e textos principais passam AA (verificar com
  Lighthouse/axe).
- Sem regressão de i18n/PWA: `<html lang>` dinâmico, manifest e SW intactos.

## Fora de escopo (próxima fatia)

- Atualização de skills/tecnologias (ícone do GSAP, incluir Playwright/shadcn/
  etc.).
- Tema claro / toggle.
- Redesenho de outras páginas além do necessário para remover os elementos de
  LLM e corrigir a11y/contraste.
