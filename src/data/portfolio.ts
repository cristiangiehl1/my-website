import type { Project } from '@/@types/project'
import { generateImgUrl } from '@/helpers/generate-img-url'
import { getAuthorBySlug } from '@/helpers/get-author'

export const __PORTFOLIO__: Project[] = [
  {
    id: 1,

    title: 'Vinyl Store',
    description:
      'Plataforma completa de e-commerce especializada em discos de vinil. Desenvolvido com arquitetura minimalista full stack usando Express, implementa autenticação baseada em cookies HTTP e sessões persistidas no PostgreSQL. Oferece navegação intuitiva, sistema de busca, carrinho de compras e design responsivo para colecionadores e amantes de música analógica.',
    coverUrl: generateImgUrl('vinyl-store.png'),

    technologies: [
      'express',
      'javascript',
      'postgresql',
      'html',
      'css',
      'node',
      'netlify',
      'node-pg-migrate',
      'eslint',
      'bcryptjs',
      'cookieparser',
      'serverless-http',
      'validator',
    ],
    category: 'full-stack',

    author: getAuthorBySlug('cristian-giehl'),
    github: 'https://github.com/cristiangiehl1/vinyl-store',
    deploy: 'https://vinyl-market.netlify.app/',

    featured: false,
    createdAt: '03/02/2026',
  },
  {
    id: 2,

    title: 'Voting Lists',
    description:
      'Sistema de criação de listas para votação com Next.js. Cada usuário pode criar listas, adicionar participantes, cadastrar candidatos e acompanhar os resultados em tempo real. Suporte a listas públicas e privadas, convite por email, votação restrita a participantes, ranking com percentuais e temas claro/escuro.',
    coverUrl: generateImgUrl('voting-system.png'),

    technologies: [
      'typescript',
      'next',
      'react',
      'tailwind',
      'postgresql',
      'prisma',
      'neondb',
      'docker',
      'zod',
      'tanstack',
      'nextauth',
      'cloudinary',
      'threejs',
      'gsap',
    ],
    category: 'full-stack',

    author: getAuthorBySlug('cristian-giehl'),
    github: 'https://github.com/cristiangiehl1/voting-system',
    deploy: 'https://voting-system-nu-gray.vercel.app/',

    featured: true,
    createdAt: '06/26/2026',
  },
  {
    id: 3,
    title: 'AI Agent',
    coverUrl: generateImgUrl('ai-agent.png'),
    description:
      'Plataforma corporativa de assistente com IA que centraliza interações internas via chat. Utiliza agentes orquestrados com OpenAI Responses API, busca semântica com embeddings, autenticação LDAP/Active Directory e integração com sistemas legados corporativos. Inclui automação de processos operacionais, filas assíncronas com Redis/BullMQ e integração com Telegram como canal adicional. Desenvolvido com Next.js 16 e conteinerizado com Docker.',
    technologies: [
      'typescript',
      'next',
      'react',
      'tailwind',
      'docker',
      'redis',
      'oracle',
      'supabase',
      'openai',
      'bullmq',
      'telegram',
      'zod',
      'tanstack',
    ],
    category: 'full-stack',
    author: getAuthorBySlug('cristian-giehl'),
    featured: true,
    createdAt: '06/27/2026',
  },
  {
    id: 4,
    title: 'LangChain RAG Lab',
    coverUrl: generateImgUrl('rag-chat.png'),
    description:
      'Estudo de caso de Retrieval-Augmented Generation (RAG) construído com Next.js e LangChain, focado nos trade-offs de rodar um RAG sobre recursos gratuitos (modelos free tier, embeddings de baixa dimensionalidade e quantização). Permite carregar documentos (.txt, .md, .pdf), pré-visualizar como são divididos em chunks, gerar embeddings via HuggingFace Inference API (384d) e persistir os vetores no PostgreSQL + pgvector (índice HNSW / cosseno). O chat responde em streaming via OpenRouter, exibindo as fontes recuperadas com seus scores de similaridade e controle fino de cada parâmetro do pipeline (splitter, topK, temperature, top_p, penalties e system prompt). Camada de domínio OOP com ambiente validado por zod e deploy em Vercel + Supabase.',
    technologies: [
      'typescript',
      'next',
      'react',
      'tailwind',
      'langchain',
      'huggingface',
      'openrouter',
      'postgresql',
      'pgvector',
      'supabase',
      'zod',
      'docker',
      'react-hook-form',
      'react-markdown',
    ],
    category: 'full-stack',
    author: getAuthorBySlug('cristian-giehl'),
    github:
      'https://github.com/cristiangiehl1/langchain-rag-document-extraction',
    deploy: 'https://langchain-rag-document-extraction-chi.vercel.app/',
    featured: true,
    createdAt: '08/09/2026',
  },
  {
    id: 5,
    title: 'Gestão de Despesas',
    coverUrl: generateImgUrl('gestao-de-despesas.png'),
    description:
      'Sistema interno de uma empresa do setor varejista para gestão de despesas de compras não revenda. É composto por um worker de ingestão que extrai notas fiscais (XML, PDF e imagens) de pastas monitoradas — via parsing direto de XML ou LLM para documentos não estruturados — valida os dados fiscais e persiste no OracleDB, e por uma aplicação web em Next.js 15 que conduz cada nota por um fluxo de aprovação por papéis (comprador, aprovador, controladoria, fiscal), com alçadas por valor, escalonamento, substituto de férias e integração automática de volta ao ERP corporativo. Jobs agendados e filas assíncronas (Redis/BullMQ) orquestram o processamento em background. Por ser um projeto interno, não possui URL pública nem repositório disponível.',
    technologies: [
      'typescript',
      'next',
      'react',
      'tailwind',
      'oracle',
      'redis',
      'bullmq',
      'docker',
      'openai',
      'zod',
      'nextauth',
      'node',
    ],
    category: 'full-stack',
    author: getAuthorBySlug('cristian-giehl'),
    featured: true,
    createdAt: '08/09/2026',
  },
]
