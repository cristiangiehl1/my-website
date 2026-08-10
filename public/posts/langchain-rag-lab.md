## Sobre o Projeto

O **LangChain RAG Lab** é um **estudo de caso** sobre _Retrieval-Augmented Generation_ (RAG): um laboratório interativo em que **cada etapa do pipeline é explícita, pré-visualizável e configurável**. Ele permite carregar documentos (`.txt`, `.md`, `.pdf`), inspecionar como eles são divididos em _chunks_, gerar embeddings via **HuggingFace Inference API**, persistir os vetores no **PostgreSQL + pgvector** e, por fim, conversar com o conteúdo através de um LLM com **respostas em streaming** e **citação das fontes recuperadas**.

Mais do que um produto acabado, o foco é **entender os trade-offs** de um RAG construído sobre recursos gratuitos: modelos _free tier_, embeddings de baixa dimensionalidade e LLMs quantizados. A interface expõe deliberadamente os parâmetros de cada etapa (split, embedding, recuperação, geração) para tornar visível **como cada decisão afeta a qualidade e a assertividade** das respostas.

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

## Estudo de Caso: escolhas e trade-offs

Como o objetivo é aprender, o projeto foi montado **inteiramente sobre recursos gratuitos**. Isso é ótimo para custo zero e para deixar o pipeline reproduzível por qualquer pessoa, mas cobra um preço em qualidade — e enxergar esse preço com clareza é justamente o ponto do laboratório.

### 1. Modelos gratuitos (_free tier_)

O LLM de chat usa um modelo `:free` do OpenRouter (por padrão `google/gemma-4-26b-a4b-it:free`). Modelos gratuitos são, em geral, **menores e/ou mais fortemente otimizados** que os pagos, o que se traduz em:

- **Menos capacidade de raciocínio** e maior tendência a alucinar quando o contexto recuperado é fraco ou ambíguo.
- **Rate limits e filas** — a disponibilidade oscila e a latência sobe em horários de pico; ids `:free` podem até sair do ar (por isso o modelo é configurável por env).
- **Janela de contexto e _throughput_ limitados**, restringindo quantos chunks dá para injetar no prompt.

Em um RAG, a qualidade da geração depende **tanto** do modelo **quanto** da qualidade da recuperação. Com um modelo mais fraco, a recuperação precisa ser ainda mais certeira — o que nos leva ao segundo trade-off.

### 2. Dimensionalidade do embedding

Os embeddings usam `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`, um modelo **multilíngue de apenas 384 dimensões** (contra 768, 1024 ou 1536+ de modelos maiores). A dimensão do vetor é, na prática, o "orçamento" que o modelo tem para descrever o significado de um trecho:

- **Menos dimensões = menor poder de representação semântica.** Nuances de sentido "colidem" no mesmo espaço, e a busca por similaridade fica **menos assertiva** — trechos relevantes podem ficar de fora do `topK`, e trechos apenas superficialmente parecidos podem entrar.
- Em compensação, 384d é **mais barato e rápido**: vetores menores ocupam menos espaço no pgvector, o índice HNSW fica mais leve e a latência de busca cai.
- A dimensão é **acoplada ao schema** (`vector(384)`): trocar o modelo de embedding por um de outra dimensão exige recriar a coluna e **re-ingerir todos os documentos**.

Escolher 384d multilíngue foi um trade-off consciente: bom o suficiente para português, barato e serverless-friendly, ao custo de precisão de recuperação.

### 3. Quantização

Reduzir o tamanho do modelo trocando a forma como os pesos são representados. Ex.: passar de 16 bits para 8 bits — ou até 4 bits — **diminui o tamanho do modelo e acelera a inferência**, mas pode **impactar a qualidade** das respostas.

A ideia é reduzir a precisão numérica usada para **armazenar** (e às vezes **calcular**) os pesos, de modo que o modelo ocupe menos memória e rode mais rápido — ao custo de alguma perda de qualidade.

Os **sufixos no nome do modelo** indicam quantos bits são usados. Tomando como exemplo `Llama-3-8B-Instruct-`**`q4f32_1`**`-MLC`:

- **`q4`** → os _pesos_ (weights) do modelo foram armazenados em **4 bits**.
- **`f32`** → as _ativações_ (tensores/cálculos intermediários durante a inferência) ficam em **float32** (32 bits), enquanto o original costuma ser float16.
- **`_1`** → identificador interno da variante/receita de quantização usada pelo MLC (diferenças de algoritmo, calibração, esquema de empacotamento, etc.).

O modelo fica menor **principalmente por causa dos pesos em 4 bits**, enquanto manter as ativações em float32 ajuda a **preservar estabilidade numérica e qualidade** de inferência. Em resumo, a quantização é o botão que troca **precisão** por **memória e velocidade** — e entendê-la é essencial para escolher, comparar ou rodar modelos localmente (por exemplo, builds MLC/WebLLM no navegador).

### Resumindo os trade-offs

| Escolha                    | Ganho                          | Custo                                          |
| -------------------------- | ------------------------------ | ---------------------------------------------- |
| LLM `:free` (OpenRouter)   | Custo zero, sem infra          | Menos capacidade, rate limits, mais alucinação |
| Embedding 384d multilíngue | Rápido, barato, serverless     | Recuperação menos assertiva                    |
| Quantização (ex.: q4)      | Menos memória, mais velocidade | Perda de precisão numérica                     |

**Como mitigar** (caminhos naturais de evolução do estudo): subir para embeddings de maior dimensão, aumentar `topK` com um limiar de score mais rígido, melhorar o _chunking_ (tamanho/overlap por tipo de documento), adicionar _re-ranking_ e, quando o orçamento permitir, trocar o LLM `:free` por um modelo pago ou por um local menos quantizado.

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
