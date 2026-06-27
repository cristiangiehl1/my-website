## 📋 Sobre o Projeto

O Voting Lists é um sistema completo de criação e gerenciamento de listas de votação. Cada usuário pode criar listas personalizadas, convidar participantes, cadastrar candidatos (pessoas, objetos, filmes, etc.) e acompanhar os resultados em tempo real. As listas podem ter uma data de expiração ou permanecer abertas indefinidamente.

🎯 **Arquitetura e Abordagem**

O projeto foi desenvolvido com Next.js 16 (App Router) seguindo uma arquitetura moderna com server components por padrão e TanStack Query para gerenciamento de estado no cliente. A autenticação é feita via NextAuth.js com estratégia JWT, e o banco de dados PostgreSQL é acessado através do Prisma ORM com suporte a Neon e PostgreSQL tradicional. O sistema conta com três grupos de rotas: landing page pública, autenticação (login/register) e área protegida (dashboard, listas, votação).

🔧 **Diferenciais**

- **Listas Públicas e Privadas:** Controle de visibilidade e participação
- **Votação Ranqueada:** Suporte a múltiplos votos por lista
- **Upload de Imagens:** Integração com Cloudinary para upload de fotos dos candidatos
- **Notificações em Tempo Real:** Alertas sobre novos votos e participantes
- **Temas Claro/Escuro:** Suporte a next-themes

## ✨ Funcionalidades

- 📝 **Criação de Listas**: Crie listas com nome, descrição e data de expiração opcional
- 👥 **Convite por Email**: Convide participantes diretamente por email
- 🏆 **Cadastro de Candidatos**: Adicione pessoas, objetos, filmes ou qualquer item para votação
- ✅ **Votação Restrita**: Apenas participantes podem votar em listas privadas
- 📊 **Resultados em Tempo Real**: Ranking com percentuais e estatísticas
- 🔗 **Listas Públicas**: Qualquer pessoa pode votar sem necessidade de convite
- 🌓 **Modo Claro/Escuro**: Interface adaptável com next-themes

## 🚀 Tecnologias Utilizadas

### Framework

- **Next.js 16** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React 19** - Biblioteca de interface

### Banco de Dados

- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM com suporte a Neon e PostgreSQL

### Autenticação

- **NextAuth.js** - Autenticação com credentials provider e JWT
- **bcryptjs** - Hash de senhas

### Frontend

- **Tailwind CSS 4** - Estilização utility-first
- **shadcn/ui** - Componentes de interface base-nova
- **TanStack Query** - Gerenciamento de estado e cache no cliente
- **GSAP** - Animações de scroll e entrada
- **Zod** - Validação de schemas (cliente e servidor)

### Infraestrutura

- **Docker** - Banco de dados PostgreSQL em container
- **Cloudinary** - Upload e gerenciamento de imagens

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── (home)/          # Landing page pública
│   ├── (auth)/          # Login, registro, recuperação
│   ├── (protected)/     # Dashboard e páginas autenticadas
│   ├── api/             # Route Handlers
│   └── globals.css      # Estilos globais Tailwind v4
├── components/          # Componentes compartilhados
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── queries/         # TanStack Query hooks (leitura)
│   └── mutations/       # TanStack Query hooks (escrita)
├── lib/
│   ├── repositories/    # Camada de repositório (Prisma)
│   ├── schemas/         # Schemas Zod por domínio
│   ├── auth.ts          # Configuração NextAuth
│   ├── api-client.ts    # Cliente HTTP para chamadas internas
│   └── query-keys.ts    # Chaves centralizadas do TanStack Query
├── emails/              # Templates de email (React Email)
├── data/                # Dados estáticos
└── generated/
    └── prisma/          # Prisma Client gerado
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 20 ou superior)
- Docker (para banco local)
- npm

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/cristiangiehl1/voting-system.git
cd voting-system
```

2. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

3. **Inicie o banco de dados**

```bash
docker compose up -d
```

4. **Instale as dependências e execute as migrações**

```bash
npm install
npm run db:migrate
npm run db:seed
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Dados de Teste

O seed cria um usuário demo:

- **Email:** `demo@votinglists.app`
- **Senha:** `demo123`

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL com Prisma ORM. O schema inclui modelos para usuários, listas, participantes, candidatos, votos e notificações, com constraints de unicidade compostas para garantir integridade dos dados.

### Comandos Úteis

```bash
# Executar migrations
npm run db:migrate

# Popular banco com dados iniciais
npm run db:seed

# Abrir Prisma Studio
npm run db:studio
```

## 🌐 Deploy

O projeto está configurado para deploy na Vercel com PostgreSQL via Neon. O comando `npm run vercel-build` executa `prisma db push` seguido de `prisma generate` e `next build`.

### Deploy Manual

1. Configure as variáveis de ambiente na Vercel
2. Faça o deploy

```bash
npx vercel --prod
```
