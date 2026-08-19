---
name: novo-projeto-portfolio
description: Use SEMPRE que for adicionar um novo projeto ao portfólio deste site (my-website) — criar o card do projeto E o post detalhado. Dispara quando o usuário pede para "adicionar projeto", "criar post de projeto", "colocar tal projeto no portfólio", "novo projeto no site". Garante que a entrada em src/data/portfolio.ts, os badges de tecnologia em src/constants/technology-data.ts, a imagem de capa e o markdown em public/posts/ fiquem todos consistentes e com o slug batendo.
---

# Adicionar um novo projeto + post ao portfólio

Um projeto no portfólio tem **quatro peças** que precisam estar consistentes entre si. Esquecer qualquer uma quebra a página ou deixa o projeto sem post/badge/capa.

| Peça                 | Arquivo                                                | Obrigatório                    |
| -------------------- | ------------------------------------------------------ | ------------------------------ |
| Entrada do projeto   | `src/data/portfolio.ts` (array `__PORTFOLIO__`)        | Sim                            |
| Badges de tecnologia | `src/constants/technology-data.ts` (`TECHNOLOGY_DATA`) | Sim (só se faltar alguma tech) |
| Imagem de capa       | `public/images/<nome>.png`                             | Sim                            |
| Post em markdown     | `public/posts/<slug>.md`                               | Sim                            |

## A regra do slug (a que mais quebra)

O post é resolvido por `getProjectBySlug` + `getMarkdown` a partir do **título**, via `slugify` (`src/helpers/slugify.ts`):

```
slugify(title) = lowercase → remove acentos → remove tudo que não for [a-z0-9 -] → espaços viram "-"
```

O arquivo do post **DEVE** se chamar exatamente `public/posts/<slugify(title)>.md`. Exemplos:

- `"Gestão de Despesas"` → `gestao-de-despesas.md`
- `"LangChain RAG Lab"` → `langchain-rag-lab.md`
- `"Gestão de Projetos MCP"` → `gestao-de-projetos-mcp.md`

Se o nome do arquivo não bater com o slug, a página do post dá **404**. Calcule o slug antes de criar o arquivo.

## Checklist (siga na ordem)

Crie um todo por item.

### 1. Levantar os dados do projeto

Pergunte ao usuário (ou infira do repositório do projeto) e defina cada campo do tipo `Project` (`src/@types/project.ts`):

- `id` — **próximo número livre** no array (olhe o maior `id` atual e some 1).
- `title` — título exibido; dele sai o slug.
- `description` — parágrafo único, denso, em PT-BR (mesmo tom das entradas existentes).
- `technologies` — lista de chaves válidas de `TECHNOLOGY_DATA` (ver passo 2).
- `category` — uma de: `'game' | 'full-stack' | 'backend' | 'frontend' | 'poc' | 'component'`.
- `author` — normalmente `getAuthorBySlug('cristian-giehl')`.
- `github` / `deploy` — **opcionais**. Omita para projetos internos/privados (siga o padrão de "Gestão de Despesas").
- `featured` — `true` para aparecer em destaque.
- `createdAt` — formato **`MM/DD/YYYY`** (ex.: `'08/19/2026'`).
- `coverUrl` — `generateImgUrl('<nome-kebab>.png')`; use o **mesmo slug** do post para o nome do arquivo (`<slug>.png`).

### 2. Garantir que os badges de tecnologia existem

Para **cada** tech em `technologies`, confirme que a chave existe em `TECHNOLOGY_DATA` (`src/constants/technology-data.ts`).

**Se uma tecnologia não existe, ADICIONE antes de referenciá-la.** Não descarte a tech só porque falta o badge — foi assim que "Claude" e "MCP" ficaram de fora na primeira versão. Cada entrada precisa de:

```ts
mcp: {
  value: 'mcp',
  label: 'MCP',
  icon: TbProtocol,               // importe de react-icons (si/tb/fa/...)
  style: { iconColor: 'text-emerald-400' },
  category: 'AI',                 // uma TechonologyCategory já existente
  link: 'https://modelcontextprotocol.io/',
},
```

- Escolha o ícone em `react-icons` e confirme que ele existe na versão instalada (ex.: `grep SiClaude node_modules/react-icons/si/index.d.ts`). Adicione o import na lista correta (mantendo a ordem alfabética que o ESLint espera).
- Reaproveite uma `category` existente quando fizer sentido (`AI`, `Framework`, `Database`, `Tool`, `Styling`, ...).

### 3. Adicionar a imagem de capa

Coloque o arquivo em `public/images/<slug>.png` (kebab-case, minúsculas). Se você não tem a imagem, **avise o usuário** que precisa fornecê-la — o card renderiza quebrado sem ela. Só imagens remotas de `github.com` são permitidas no `next.config.ts`; a capa é local, em `/public/images`.

### 4. Adicionar a entrada em `portfolio.ts`

Insira o objeto no array `__PORTFOLIO__` (normalmente no topo, para os mais novos aparecerem primeiro). Respeite o Prettier do repo: `semi: false`, aspas simples, `trailingComma: 'es5'`.

### 5. Escrever o post em `public/posts/<slug>.md`

Markdown puro (sem front-matter — o título/tempo de leitura vêm do `Project` e do `generateReadingTime`). Siga o esqueleto e o tom dos posts existentes (`public/posts/gestao-de-despesas.md` é a melhor referência):

````
## Sobre o Projeto        — o que é, para quem, em 1-2 parágrafos
> ⚠️ Aviso              — SE for projeto interno/sem link público, deixe explícito
## O Problema             — a dor que o projeto resolve
## Arquitetura            — visão geral; use um diagrama ASCII em bloco ``` quando ajudar
## <seções específicas>   — regras de negócio, pipeline, fluxos, integrações...
## Principais Dificuldades — decisões técnicas difíceis e como foram resolvidas
## Tecnologias Utilizadas  — agrupadas, batendo com os badges
## Notas Técnicas          — decisões de design e (se interno) nota de anonimização
````

Regras de conteúdo:

- **Fidelidade:** descreva o projeto **real**. Se precisar, inspecione o código-fonte do projeto (ex.: outro repositório) para não inventar features, nomes de ferramentas ou fluxos.
- **Anonimização:** para projetos corporativos, não exponha endpoints internos, credenciais, schema de banco, URLs ou nomes de sistemas proprietários. Diga isso numa nota ao final.
- **PT-BR**, mesmo registro técnico dos outros posts.

### 6. Validar

- `pnpm build` — é o typecheck oficial (não há script `typecheck` separado). Confirma que `category` e todas as `technologies` são válidas. Alternativa rápida só de tipos: `npx tsc --noEmit`.
- `pnpm lint` (ESLint) e `pnpm lint:check` (Prettier) — o `pre-commit` (husky + lint-staged) roda de qualquer forma.
- Rode `pnpm dev` e abra `/portfolio` e `/post/<slug>` para conferir card, badges, capa e post renderizando (o `pre-push` roda `build`).

### 7. Commitar

Use **pnpm** (nunca npm/yarn) e **Conventional Commits** com escopo do enum em `commitlint.config.ts`. Escopos úteis aqui: `web`, `pages`, `content` não existe → use `web`; para os badges use `config` ou `ui`. Ex.:

```
feat(web): add <Projeto> project to portfolio + post
```

Siga as instruções de commit do usuário (sem `Co-Authored-By`, sem rodapé de geração automática).

## Erros comuns

- **Post 404** → nome do arquivo `.md` não bate com `slugify(title)`.
- **Card sem imagem** → faltou `public/images/<slug>.png`.
- **Tech sumida do card** → a chave não existe em `TECHNOLOGY_DATA`; adicione o badge em vez de remover a tech.
- **`id` duplicado** → sempre use o próximo número livre.
- **Build quebra em `category`/`technologies`** → valor fora dos tipos aceitos; confira `src/@types/project.ts` e as chaves de `TECHNOLOGY_DATA`.
