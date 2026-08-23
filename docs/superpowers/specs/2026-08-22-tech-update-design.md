# Design — Atualização de tecnologias/skills

**Data:** 2026-08-22
**Fatia:** 4 (última) do portfolio my-website. Depende das Fatias 1–3 (i18n,
PWA, WCAG+anti-LLM), já mergeadas na main. Cobre o requisito 5 (informações
atualizadas com as tecnologias comumente utilizadas).

## Objetivo

Deixar a página de skills e o registro de tecnologias atualizados e corretos:
corrigir o ícone do GSAP (hoje usa o do Framer Motion) e adicionar tecnologias
reais em uso no projeto/rotina.

## Decisões (fechadas com o usuário)

- **Corrigir** o ícone do GSAP: `TbBrandFramerMotion` → `SiGreensock`.
- **Adicionar** 5 tecnologias: Playwright, shadcn/ui, Radix UI, Resend,
  React Email.
- **Ícones** (verificados no `react-icons`): Playwright → `TbMasksTheater`
  (o logo do Playwright são máscaras de teatro), shadcn/ui → `SiShadcnui`,
  Radix UI → `SiRadixui`, Resend → `SiResend`, React Email → `TbMailCode`.
- **Categorias:** criar `UI` para shadcn/ui e Radix; Resend e React Email em
  `Communication`; Playwright em `Testing`.
- **Níveis (revisados/aprovados pelo usuário):** shadcn/ui = Avançado (2 anos),
  Radix UI = Avançado (2 anos), Playwright = Intermediário (1 ano), Resend =
  Intermediário (1 ano), React Email = Intermediário (1 ano).
- Sonner NÃO entra (fora do escopo desta atualização).

## Arquitetura

### 1. Registro de tecnologias — `src/constants/technology-data.ts`

- Corrigir o `gsap`: trocar `icon: TbBrandFramerMotion` por `SiGreensock`
  (ajustar imports; remover `TbBrandFramerMotion` se ficar sem uso). Manter
  `iconColor` verde do GSAP.
- Adicionar 5 entradas ao objeto `TECHNOLOGY_DATA` (mesma forma das existentes:
  `value`, `label`, `icon`, `style.iconColor`, `category`, `link`):
  - `playwright`: `TbMasksTheater`, categoria `Testing`, https://playwright.dev/
  - `shadcn`: `SiShadcnui`, categoria `UI`, https://ui.shadcn.com/
  - `radix`: `SiRadixui`, categoria `UI`, https://www.radix-ui.com/
  - `resend`: `SiResend`, categoria `Communication`, https://resend.com/
  - `react-email`: `TbMailCode`, categoria `Communication`, https://react.email/
- Os `iconColor` seguem a convenção existente (cores de marca por ícone; isso é
  padrão do arquivo, não fere a paleta do site).

### 2. Tipo de categoria — `src/@types/technology.ts`

- Adicionar `'UI'` à união `TechonologyCategory`.

### 3. Página de skills — `src/app/[locale]/(app)/skills/page.tsx`

- Adicionar as 5 skills aos arrays existentes, com `name` batendo a chave em
  `TECHNOLOGY_DATA` (para o ícone), `level` e `yearsOfExperience` (o `description`
  no array fica `''`, como as demais — o texto vem das messages):
  - `frontendSkills`: `shadcn` (Avançado, 2), `radix` (Avançado, 2)
  - `toolsSkills` (seção "DevOps & Ferramentas"): `playwright` (Intermediário, 1),
    `resend` (Intermediário, 1), `react-email` (Intermediário, 1)
- Os totais (`totalTechnologies`) recalculam automaticamente.

### 4. Descrições — `messages/pt-BR.json` e `messages/en-US.json`

- Adicionar `skills.items.<name>.description` (pt verbatim / en fiel) para os 5
  novos nomes (`shadcn`, `radix`, `playwright`, `resend`, `react-email`),
  mantendo o padrão dos existentes. Nomes de produto não se traduzem.
  Sugestões de descrição (pt / en):
  - shadcn: "Componentes acessíveis sobre Radix, design system" /
    "Accessible components on top of Radix, design system"
  - radix: "Primitivos de UI acessíveis (Dialog, Popover, etc.)" /
    "Accessible UI primitives (Dialog, Popover, etc.)"
  - playwright: "Testes E2E e automação de navegador" /
    "E2E tests and browser automation"
  - resend: "E-mail transacional (API, templates e webhooks)" /
    "Transactional email (API, templates and webhooks)"
  - react-email: "Templates de e-mail com componentes React" /
    "Email templates with React components"

### 5. Ícone do SkillCard

- O `SkillCard` resolve o ícone via `TECHNOLOGY_DATA[skill.name]`; como cada nova
  skill tem entrada correspondente (passo 1), o ícone aparece sem mudança no
  componente. (Verificar na implementação que `skill-card.tsx` usa
  `TECHNOLOGY_DATA` por `name`; se usar outro caminho, ajustar mínimo.)

## Componentes afetados (mapa de arquivos)

- **Modificar:** `src/constants/technology-data.ts`, `src/@types/technology.ts`,
  `src/app/[locale]/(app)/skills/page.tsx`, `messages/pt-BR.json`,
  `messages/en-US.json`.
- Possivelmente verificar (sem mudar, salvo necessidade): `skill-card.tsx`,
  `use-filtered-works` (o filtro do portfólio usa `getTechOptions()`; os novos
  aparecerão como opções — comportamento desejado).

## Estratégia de teste / verificação

- `pnpm build` passa (sem test runner; gate = build + checagem manual).
- `/skills` e `/en-US/skills` mostram os 5 novos com ícone + nível + descrição
  corretos nos dois idiomas; `totalTechnologies` reflete o novo total.
- O ícone do GSAP aparece correto onde é usado (badge wall do about
  "Experiência & Stack", páginas de post).
- O multi-select de filtro do portfólio lista os novos (agrupados por categoria,
  incluindo o novo grupo `UI`) sem quebrar.
- Sem regressão de i18n/PWA/WCAG.

## Fora de escopo

- Sonner e outras libs não selecionadas.
- Redesenho da página de skills além de acrescentar os itens.
- Revisão dos níveis/anos das skills já existentes.
