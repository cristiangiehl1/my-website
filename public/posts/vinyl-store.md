## 📋 Sobre o Projeto

O Vinyl Store é uma plataforma completa de e-commerce especializada em discos de vinil. A aplicação oferece uma experiência moderna e intuitiva para colecionadores e amantes de música analógica, permitindo a navegação, busca e compra de vinis de diversos gêneros musicais.

🎯 **Arquitetura e Abordagem**

Este projeto foi desenvolvido seguindo uma arquitetura minimalista full stack com o framework Express, priorizando simplicidade e eficiência. O sistema implementa um robusto mecanismo de autenticação baseado em cookies HTTP, onde as credenciais são transmitidas de forma segura através dos headers nas requisições. Para garantir controle e segurança, as sessões dos usuários são persistidas no banco de dados PostgreSQL, permitindo validação contínua e gerenciamento centralizado de sessões ativas.

🔧 **Melhorias Necessárias**

- **Gateway de Pagamento:** Integração com provedores de pagamento (Stripe, PayPal, Mercado Pago)
- **Lazy Loading de Imagens:** Otimização de carregamento para melhor performance
- **Serviço de Mensageria:** Sistema de notificações e comunicação com usuários (email, SMS)

## ✨ Funcionalidades

- 🛍️ **Catálogo de Produtos**: Navegação completa pelos vinis disponíveis
- 🔍 **Sistema de Busca**: Encontre vinis por artista, álbum ou gênero
- 🛒 **Carrinho de Compras**: Adicione e gerencie seus itens
- 👤 **Autenticação de Usuários**: Sistema de login e registro
- 📦 **Gerenciamento de Pedidos**: Acompanhe suas compras
- 📱 **Design Responsivo**: Funciona perfeitamente em todos os dispositivos

## 🚀 Tecnologias Utilizadas

### Backend

- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL** - Banco de dados relacional
- **node-pg-migrate** - Gerenciamento de migrações de banco de dados

### Frontend

- **HTML5/CSS3** - Estrutura e estilização
- **JavaScript** - Interatividade do cliente

### Ferramentas de Desenvolvimento

- **ESLint** - Linting de código JavaScript
- **Prettier** - Formatação de código

### Deploy

- **Netlify** - Hospedagem e serverless functions
- **Netlify Functions** - Funções serverless

## 📦 Estrutura do Projeto

```
vinyl-store/
├── controllers/       # Controladores da aplicação
├── routes/            # Definição de rotas
├── middleware/        # Middlewares personalizados
├── infra/             # Infraestrutura e configurações de BD
├── public/            # Arquivos estáticos (CSS, JS, imagens)
├── netlify/
│   └── functions/    # Serverless functions
├── data.js           # Dados e modelos
├── package.json      # Dependências do projeto
├── netlify.toml      # Configurações do Netlify
└── .example.env      # Exemplo de variáveis de ambiente
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 22 ou superior)
- PostgreSQL (versão 16 ou superior)
- npm

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/cristiangiehl1/vinyl-store.git
cd vinyl-store
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .example.env .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/vinyl_store
PORT=3000
NODE_ENV=development
```

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8000`

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL como banco de dados e node-pg-migrate para gerenciamento de migrações. As migrações garantem que o schema do banco de dados esteja sempre atualizado e versionado.

### Executar Migrações

```bash
# Aplicar todas as migrações pendentes
npm run migrations:up

# Reverter a última migração
npm run migrations:down

# Criar uma nova migração
npm run migrations:create nome-da-migracao
```

## 🌐 Deploy

O projeto está configurado para deploy automático no Netlify. O arquivo `netlify.toml` contém todas as configurações necessárias.

### Deploy Manual

1. Faça login no Netlify CLI

```bash
netlify login
```

2. Faça o deploy

```bash
npm run deploy
```
