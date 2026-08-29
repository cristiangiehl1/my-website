# Design — Home mais impactante (Terminal Panel + Stack + Featured Projects + Cmd+K)

**Data:** 2026-08-29

## Objetivo

A home hoje é só hero (badge + headline + CTAs + links sociais) e um
`TerminalPanel` estático — zero rolagem, sem prévia de projetos nem de stack.
Todo o conteúdo rico (7 projetos com tecnologias em `portfolio.ts`, dezenas
de tecnologias com ícone/categoria em `technology-data.ts`) só existe nas
páginas `/portfolio` e `/skills`, nunca aparece na home. Objetivo: dar corpo
à landing page reaproveitando esse conteúdo, sem recorrer a padrões
genéricos de landing page gerada por IA (gradiente blob, depoimentos fake,
contadores animados) e sem contradizer a decisão de produto já tomada no
projeto de remover motion decorativo por acessibilidade (commit
`1765739 feat(web): remove decorative glow/float motion and honor
reduced-motion`).

## Decisões (fechadas com o usuário)

- Direção escolhida: manter a identidade "Brutalist Mono" (dark, lima
  ácido, tipografia mono) e atacar o problema real — home sem conteúdo —
  em vez de importar estética alheia (glass, gradiente, halftone) das
  referências (originkit.dev, skiper-ui.com, cult-ui.com).
- `TerminalPanel`: digitação em **loop contínuo** (não uma vez só, não
  manter estático).
- Projetos em destaque: **bento com 3 projetos** (1 grande + 2 compactos),
  não grid uniforme nem carousel.
- Faixa de stack: **curadoria manual de ~12-15 tecnologias**, não a lista
  inteira de `technology-data.ts` nem omitida.
- Command palette (Cmd+K): escopo **só navegação** (sem ações como copiar
  e-mail/trocar idioma nesta rodada).

## Arquitetura

### 1. Ordem das seções na home

Hero (existente, só o `TerminalPanel` muda) → **Stack marquee** (nova) →
**Featured Projects bento** (nova) → footer (existente, `AppFooter`). O
Cmd+K não é uma seção de página — é global, montado no `AppHeader`.

### 2. `TerminalPanel` — loop de digitação (CSS puro)

Modificar `src/app/_components/pages/home/terminal-panel.tsx`:

- Efeito de máquina de escrever via `steps()` no `width` (medido em `ch`,
  compatível com fonte monoespaçada) + cursor piscando via `animation`
  `steps(1)` — sem JS, sem lib nova.
- Coreografia por `animation-delay` crescente por linha: `whoami` digita →
  pausa → `stack --top` digita → pausa → `location` digita → pausa →
  reinicia o ciclo inteiro (`animation-iteration-count: infinite` no
  container, ou uma única `@keyframes` longa reaproveitada por todas as
  linhas com delays diferentes).
- **Reduced motion:** nenhuma lógica nova necessária. A regra global já
  existente em `globals.css:174-183` zera duração de toda
  `animation`/`transition` quando `prefers-reduced-motion: reduce` —
  como o efeito é 100% CSS, a animação simplesmente salta pro keyframe
  final (texto completo, sem cursor piscando), que é um fallback estático
  válido.
- Conteúdo das linhas não muda (mesmos `role`/`stack --top`/`location`
  vindos de `t('terminal.*')`).

### 3. Stack marquee (novo componente)

Novo arquivo `src/app/_components/pages/home/stack-marquee.tsx`:

- Lista curada de 14 chaves de `TECHNOLOGY_DATA` (mesma fonte de ícones
  usada em `PortfolioItemCard` e nas páginas de skills), escolhidas para
  cobrir linguagem/framework/infra/IA sem repetir o que o terminal já
  mostra (`TypeScript · Next.js · Rust · Python`):
  ```
  typescript, rust, python, node, react, next, tailwind, gsap,
  docker, postgresql, redis, prisma, langchain, claude
  ```
- Renderiza a lista duas vezes lado a lado (`flex`, conteúdo duplicado) e
  anima `transform: translateX(0% → -50%)` em loop linear — como as duas
  metades são idênticas, o loop é visualmente contínuo/sem costura.
- Pausa a animação no `:hover` (`animation-play-state: paused`).
- **Reduced motion:** mesma lógica do item 2 — é CSS puro e a metade final
  (-50%) é visualmente idêntica ao início (lista duplicada), então a regra
  global existente já entrega um fallback estático coerente sem tratamento
  especial.
- Cada item: ícone (`TECHNOLOGY_DATA[key].icon`, cor
  `TECHNOLOGY_DATA[key].style.iconColor`) + `label`.

### 4. Featured Projects — bento (novo componente)

Novo arquivo `src/app/_components/pages/home/featured-projects.tsx`:

- Fonte de dados: `__PORTFOLIO__` (de `src/data/portfolio.ts`), filtra
  `featured: true`, ordena por `createdAt` desc, pega os 3 primeiros. Com
  os dados atuais isso resolve para `gestao-de-projetos-mcp` (08/19),
  `gestao-de-despesas` (08/09) e `langchain-rag-lab` (08/09, empate
  resolvido pela ordem de declaração/`id`) — não precisa de flag manual
  nova, só a ordenação por data já existente no schema.
- Layout bento: 1 card grande (o primeiro do array ordenado) ocupando
  2 colunas/linhas — imagem maior, título, descrição (i18n
  `portfolio.projects.{slug}.description`), até 5 badges de tecnologia; 2
  cards compactos ao lado — imagem, título, até 3 badges, sem descrição.
- Reaproveita as mesmas fontes de verdade do `PortfolioItemCard` já
  existente (`TECHNOLOGY_DATA` para ícone/cor, `t('portfolio.projects.*')`
  para título/descrição, `Link href={`/post/${slug}`}` como destino) — não
  duplica lógica de resolução de tecnologia, só monta um layout visual
  diferente (bento em vez de grid uniforme).
- Cabeçalho da seção com título (`home.projects.title`, nova chave i18n) e
  um link "ver todos" apontando para `/portfolio`
  (`home.projects.viewAll`).

### 5. Command Palette (Cmd+K) — global, só navegação

Novo arquivo `src/app/_components/command-palette.tsx` (`'use client'`):

- Usa os primitivos já existentes em `src/app/_components/ui/command.tsx`
  (wrapper shadcn de `cmdk`, já em `package.json`, **hoje não usado em
  lugar nenhum do projeto**) — sem dependência nova.
- Estado de abertura local (`useState`) + `useEffect` com listener de
  `keydown` para `Cmd+K` (mac) / `Ctrl+K` (demais), com
  `e.preventDefault()`.
- Itens (grupo único "Navegação"): Home (`/`), Sobre (`/about`), Skills
  (`/skills`), Portfólio (`/portfolio`), Contato (`/contact`), e "Baixar
  currículo" reaproveitando o mesmo link locale-aware que já existe no
  hero (`/resume/cristian-giehl-${locale}.pdf`).
- Selecionar um item fecha o palette e navega via `router.push` (ou
  `Link`/`useRouter` de `@/i18n/navigation`, mantendo o roteamento
  locale-aware já usado no resto do app).
- Montagem: `AppHeader` (`src/app/_components/app-header.tsx`) ganha um
  trigger visível (pill discreto "⌘K", ao lado do `LanguageSwitcher`,
  visível em `md:flex` como os demais itens de navegação desktop) que abre
  o mesmo componente acionado pelo atalho de teclado.

### 6. i18n — novas chaves

- `home` namespace (`messages/en-US.json`, `messages/pt-BR.json`):
  `stack.title`, `projects.title`, `projects.viewAll`.
- `common` namespace: novas chaves `commandPalette.placeholder` e
  `commandPalette.groupNavigation`. O item "Baixar currículo" reaproveita
  a chave já existente `common.downloadResume` (mesma usada no hero) — não
  cria uma chave duplicada.
- Nenhuma chave nova em `portfolio.projects.*` — o bento reaproveita as já
  existentes.

## Componentes afetados (mapa de arquivos)

- **Novo:** `src/app/_components/pages/home/stack-marquee.tsx`
- **Novo:** `src/app/_components/pages/home/featured-projects.tsx`
- **Novo:** `src/app/_components/command-palette.tsx`
- **Modificar:** `src/app/_components/pages/home/terminal-panel.tsx`
  (animação de digitação em loop, CSS puro)
- **Modificar:** `src/app/[locale]/(app)/(home)/page.tsx` (monta as duas
  seções novas abaixo do hero)
- **Modificar:** `src/app/_components/app-header.tsx` (trigger do Cmd+K)
- **Modificar:** `messages/en-US.json`, `messages/pt-BR.json` (chaves
  listadas no item 6)
- Nenhuma dependência nova em `package.json` (cmdk e react-icons já
  presentes).

## Estratégia de teste / verificação

- `pnpm build` passa (novos componentes client-only não quebram a home,
  que continua Server Component na composição).
- Visitar `/` em PT e EN, viewport mobile (375px) e desktop (1440px):
  terminal digitando em loop, marquee de stack rolando e pausando no
  hover, bento de projetos com o card grande + 2 compactos, sem quebra de
  layout.
- Testar Cmd+K (mac) e Ctrl+K (outro SO/navegador) abrindo o palette em
  qualquer página (não só home, já que mora no `AppHeader`); confirmar
  navegação correta preservando o locale atual.
- Ativar `prefers-reduced-motion: reduce` (DevTools) e confirmar que
  terminal e marquee caem para estado estático coerente (texto completo
  visível, sem corte visual).
- Sem regressão nos CTAs/links sociais existentes no hero.

## Fora de escopo

- Ações extras no Cmd+K (copiar e-mail, trocar idioma) — avaliar depois
  se fizer sentido.
- Scroll-triggered animations (GSAP `ScrollTrigger`) — direção "C"
  descartada nesta rodada.
- Mudança de paleta/tema (glass, gradiente, halftone) — a identidade
  visual atual é mantida.
- Alteração no schema de `Project` (`featured`) — a seleção dos 3 do
  bento usa só `featured` + `createdAt`, já existentes.
