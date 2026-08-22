## 📋 About the Project

Vinyl Store is a full-featured e-commerce platform specialized in vinyl records. The application offers a modern, intuitive experience for collectors and analog music lovers, enabling browsing, searching, and purchasing vinyl across a variety of musical genres.

🎯 **Architecture and Approach**

This project was developed following a minimalist full-stack architecture built on the Express framework, prioritizing simplicity and efficiency. The system implements a robust cookie-based HTTP authentication mechanism, where credentials are transmitted securely through request headers. To ensure control and security, user sessions are persisted in the PostgreSQL database, enabling continuous validation and centralized management of active sessions.

🔧 **Planned Improvements**

- **Payment Gateway:** Integration with payment providers (Stripe, PayPal, Mercado Pago)
- **Image Lazy Loading:** Load optimization for better performance
- **Messaging Service:** Notification and communication system for users (email, SMS)

## ✨ Features

- 🛍️ **Product Catalog**: Browse the full selection of available vinyl records
- 🔍 **Search System**: Find vinyl by artist, album, or genre
- 🛒 **Shopping Cart**: Add and manage your items
- 👤 **User Authentication**: Login and registration system
- 📦 **Order Management**: Track your purchases
- 📱 **Responsive Design**: Works seamlessly across all devices

## 🚀 Technologies Used

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Minimalist web framework
- **PostgreSQL** - Relational database
- **node-pg-migrate** - Database migration management

### Frontend

- **HTML5/CSS3** - Structure and styling
- **JavaScript** - Client-side interactivity

### Development Tools

- **ESLint** - JavaScript code linting
- **Prettier** - Code formatting

### Deploy

- **Netlify** - Hosting and serverless functions
- **Netlify Functions** - Serverless functions

## 📦 Project Structure

```
vinyl-store/
├── controllers/       # Application controllers
├── routes/            # Route definitions
├── middleware/        # Custom middleware
├── infra/             # Infrastructure and DB configuration
├── public/            # Static files (CSS, JS, images)
├── netlify/
│   └── functions/    # Serverless functions
├── data.js           # Data and models
├── package.json      # Project dependencies
├── netlify.toml      # Netlify configuration
└── .example.env      # Environment variables example
```

## 🛠️ Installation and Setup

### Prerequisites

- Node.js (version 22 or higher)
- PostgreSQL (version 16 or higher)
- npm

### Step by Step

1. **Clone the repository**

```bash
git clone https://github.com/cristiangiehl1/vinyl-store.git
cd vinyl-store
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .example.env .env
```

Edit the `.env` file with your settings:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/vinyl_store
PORT=3000
NODE_ENV=development
```

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:8000`

## 🗄️ Database

The project uses PostgreSQL as its database and node-pg-migrate for migration management. Migrations ensure the database schema is always up to date and versioned.

### Running Migrations

```bash
# Apply all pending migrations
npm run migrations:up

# Revert the last migration
npm run migrations:down

# Create a new migration
npm run migrations:create nome-da-migracao
```

## 🌐 Deploy

The project is configured for automatic deployment on Netlify. The `netlify.toml` file contains all necessary configuration.

### Manual Deploy

1. Log in to the Netlify CLI

```bash
netlify login
```

2. Deploy

```bash
npm run deploy
```
