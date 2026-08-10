# Design — Portfolio entry "Gestão de Despesas"

## Objetivo

Registrar no portfólio um sistema **interno** da empresa (setor varejista) chamado
**Gestão de Despesas**, composto por dois repositórios que formam um único sistema:

- **Web app** (Next.js 15) — pipeline de aprovação de despesas de "compras não revenda"
  por papéis, integração com o ERP corporativo, jobs em background.
- **Worker de ingestão** (Node/TS) — extração de documentos fiscais (XML/LLM) a partir
  de pastas monitoradas, validação fiscal e persistência no Oracle.

Como é um projeto interno, **não há URL pública nem repositório no GitHub** — esse
detalhe deve ficar explícito no post.

## Decisões (confirmadas com o usuário)

1. **Escopo:** um único item de portfólio + um post cobrindo os dois componentes como
   um sistema unificado.
2. **Sigilo:** totalmente anônimo — seguir a convenção do post "AI Agent":
   "empresa do setor varejista", "ERP corporativo". **Não** citar nome da empresa,
   nome do ERP (Consinco/C5), IPs, hostnames, domínios internos, nomes de pessoas,
   schema do banco ou URLs internas.
3. **Capa:** diagrama de arquitetura próprio (gerado), sem dados sensíveis.
4. **Título:** "Gestão de Despesas" → slug `gestao-de-despesas`.

## Alterações

### 1. `src/data/portfolio.ts`

Novo objeto `id: 5`:

- `title: 'Gestão de Despesas'`
- Sem `github` nem `deploy` (o card esconde ambos os botões automaticamente).
- `featured: true`, `createdAt: '08/09/2026'`, `category: 'full-stack'`.
- `technologies`: `typescript, next, react, tailwind, oracle, redis, bullmq, docker,
openai, zod, nextauth, node` — todas já existem em `technology-data.ts`
  (**nenhum badge novo necessário**).
- `description`: resumo anonimizado (2–3 frases) deixando claro que é um sistema
  interno sem URL/repo público.

### 2. `public/posts/gestao-de-despesas.md`

Mesmo estilo de seções do post do RAG Lab, totalmente anonimizado. Seções:

- **Sobre o Projeto** — callout de que é sistema interno, sem URL pública nem repo.
- **O Problema** — despesas de compras não revenda chegando de forma dispersa, sem
  rastreabilidade de aprovação nem integração com o ERP.
- **Arquitetura** — diagrama ASCII: Ingestão (worker) → Base Oracle → Web app
  (aprovação por papéis) → Integração no ERP.
- **Pipeline de Ingestão** — watch de pastas, XML vs LLM, validação fiscal
  (CNPJ mod-11, chave), score de confiança + roteamento.
- **Regras de Negócio** — máquina de estados de aprovação, alçada por valor +
  escalonamento, férias/substituto, cálculo de DIFAL.
- **Integrações** — autenticação no ERP, fila de integração, sidecar NFe→PDF
  (descritos genericamente).
- **Principais Dificuldades** — confiabilidade da extração, transação atômica
  cabeçalho+itens, nuance fiscal/DIFAL, idempotência, jobs + filas.
- **Tecnologias / Notas Técnicas**.

### 3. `public/images/gestao-de-despesas.png`

Capa gerada: página HTML no tema escuro do site, renderizada via Playwright e
capturada como PNG ~16:9. Sem dados sensíveis.

## Fora de escopo

- Nenhum badge de tecnologia novo em `technology-data.ts`.
- Nenhuma alteração de componente/UI.
