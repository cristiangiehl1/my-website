## Sobre o Projeto

O **LangChain RAG Lab** é um laboratório interativo de _Retrieval-Augmented Generation_ (RAG). Ele permite carregar documentos (`.txt`, `.md`, `.pdf`), inspecionar como eles são divididos em _chunks_, gerar embeddings via **HuggingFace Inference API**, persistir os vetores no **PostgreSQL + pgvector** e, por fim, conversar com o conteúdo através de um LLM com **respostas em streaming** e **citação das fontes recuperadas**.

O objetivo é ser transparente: cada etapa do pipeline (split, embedding, recuperação, geração) é explícita, pré-visualizável e configurável pela interface.

**Diferenciais**

- **Pré-visualização de chunks** antes de qualquer gravação — nada é embutido ou persistido até a confirmação.
- **Embeddings remotos** via HuggingFace Inference API (modelo multilíngue de 384 dimensões) — sem modelo local, pronto para _serverless_.
- **Busca por similaridade** (distância de cosseno) sobre índice **HNSW** no pgvector.
- **Chat RAG com streaming** e exibição das fontes com o respectivo _score_ de similaridade.
- **Controle fino da geração**: `temperature`, `top_p`, `top_k`, `max_tokens`, `frequency/presence penalty` e `system prompt` — parâmetros desligados não são enviados à API.
- **Ambiente validado com zod** no boot e **camada de domínio OOP** (services + repository) com uma `CONFIG` central congelada.

## Arquitetura

O projeto separa a interface (Next.js App Router), controllers finos (Route Handlers) e uma camada de domínio orientada a objetos que concentra toda a lógica de RAG.

```
Cliente (Next.js App Router)
  /ingest ─┐
  /chat  ──┤
           ▼
API Routes (controllers finos)
  /api/preview   → split sem persistir
  /api/embed     → gera e grava embeddings
  /api/chat      → RAG + streaming
           ▼
Camada de domínio (src/server)
  DocumentLoader        → carrega txt/md/pdf
  DocumentProcessor     → split via LangChain
  EmbeddingsService     → HuggingFace Inference API
  VectorStoreRepository → PGVectorStore + stats/clear
  ChatService           → retrieval + geração em streaming
           ▼
Infraestrutura
  PostgreSQL + pgvector (Supabase em prod)
  HuggingFace Inference API  → embeddings
  OpenRouter                 → LLM de chat
```

**Fluxo resumido:** o documento é carregado (`DocumentLoader`), dividido (`DocumentProcessor`), embutido pela HuggingFace Inference API (`EmbeddingsService`) e persistido (`VectorStoreRepository`). No chat, o `ChatService` embute a pergunta, recupera os _chunks_ mais similares e monta o contexto para o LLM.

## Pipeline de Ingestão

![Página de ingestão do LangChain RAG Lab](/images/rag-ingestao.png)

A página `/ingest` expõe cada etapa da preparação dos documentos:

1. **Documento** — cole o texto ou anexe `.txt` / `.md` / `.pdf` (PDF via `PDFLoader` do LangChain).
2. **Configuração do split** — escolha o splitter (`RecursiveCharacterTextSplitter` ou `CharacterTextSplitter`), `chunkSize`, `chunkOverlap` e separadores opcionais.
3. **Pré-visualizar chunks** — mostra todos os chunks numerados e com tamanho. **Nada é enviado ao modelo nem ao banco nesta etapa.**
4. **Confirmar e gerar embeddings** — cada chunk é embutido via HuggingFace Inference API e gravado no pgvector com metadados (`source`, `chunkIndex`, etc.). Alterar o texto ou a configuração invalida o preview e exige pré-visualizar novamente.

## Chat com RAG

![Página de chat RAG do LangChain RAG Lab](/images/rag-chat.png)

Na página `/chat`, o app embute a pergunta, busca os `topK` chunks mais similares no pgvector, monta o contexto e chama o LLM via OpenRouter **com streaming**.

- Cada resposta exibe as **fontes recuperadas** com o **score de similaridade** (cosseno), o modelo usado e os **parâmetros aplicados**.
- O **painel lateral** é totalmente configurável e persistido em `localStorage`:
  - **Recuperação:** `topK` e limiar mínimo de score.
  - **Geração:** `temperature`, `top_p`, `top_k` (sampling — distinto do `topK` de recuperação), `max_tokens`, `frequency_penalty`, `presence_penalty` e `system prompt`.
- O **prompt é estruturado** (`promptConfig` + templates) e montado em `SystemMessage` (persona/regras) + `HumanMessage` (contexto/pergunta), com _override_ opcional por system prompt livre.

## Tecnologias Utilizadas

### Framework

- **Next.js 15** — Framework React com App Router
- **React 19** — Biblioteca de interface
- **TypeScript** — Tipagem estática em todo o projeto

### Orquestração RAG

- **LangChain** (`@langchain/core`, `@langchain/community`, `@langchain/textsplitters`, `@langchain/openai`) — splitters, loaders e integração com o vector store
- **HuggingFace Inference API** — embeddings com o modelo `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (384 dimensões)
- **OpenRouter** — LLM de chat (modelo `:free` configurável) com respostas em streaming

### Banco de Dados

- **PostgreSQL 16** — Persistência principal
- **pgvector** — Armazenamento de vetores com índice HNSW e distância de cosseno
- **Supabase** — Base vetorial em produção (Transaction pooler)

### Frontend

- **Tailwind CSS** — Estilização utility-first
- **shadcn/ui** — Componentes baseados em Radix UI
- **React Hook Form** — Gerenciamento de formulários
- **React Markdown** (`react-markdown` + `remark-gfm`) — Renderização das respostas
- **Zod** — Validação de schemas (rotas + variáveis de ambiente)

### Infraestrutura

- **Docker** — PostgreSQL + pgvector local em desenvolvimento
- **Vercel + Supabase** — Deploy da aplicação e da base vetorial em produção

## Notas Técnicas

- **Similaridade exibida** = `1 - distância_cosseno` do pgvector (0..1, maior = mais similar).
- `serverExternalPackages` no `next.config.mjs` evita empacotar `pdf-parse` e `pg` no bundle do servidor; `outputFileTracingIncludes` garante que os arquivos de prompt (lidos via `fs`) sigam junto na função da Vercel.
- O endpoint de chat envia primeiro um bloco JSON com as fontes, um delimitador, e então faz o streaming dos tokens da resposta (protocolo em `src/lib/stream.ts`).
- A dimensão do vetor (`384`) é acoplada ao modelo de embeddings; trocar o modelo requer re-ingerir os documentos.
- Toda variável de ambiente é validada com zod no boot (`src/lib/env.ts`) — se algo estiver faltando ou inválido, a aplicação falha na inicialização com uma mensagem clara.
