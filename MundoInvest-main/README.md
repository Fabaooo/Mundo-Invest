# 🚀 Mundo Invest

SaaS platform for financial education and simulation with AI-powered insights.

<img src="./docs/images/hero.png" width="100%" />

## 📸 Product Preview

### 🌐 Landing Page
![Landing](./docs/images/landing.png)

### 📊 Dashboard
![Dashboard](./docs/images/dashboard.png)

### 🧠 AI Financial Assistant
![AI Chat](./docs/images/chat.png)
## 📋 Overview

Mundo Invest is a platform that democratizes investment knowledge through:
- **AI Chat**: Educational copilot explaining market concepts and assets
- **Live Dashboard**: Real-time market data visualization
- **Portfolio Simulation**: Test investment strategies risk-free
- **Personalized Education**: Adapted to user's risk profile

## 🏗️ Project Structure

```
mundo-invest/
├── apps/
│   ├── frontend/          # Next.js + React web application
│   └── backend/           # Express.js API server
├── packages/
│   └── shared/            # Shared types and utilities
└── docs/                  # Documentation
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Zustand, Recharts
- **Backend**: Express.js, TypeScript, Vercel AI SDK
- **Database**: Supabase (PostgreSQL + Auth)
- **State Management**: Zustand
- **External APIs**: CoinGecko, Yahoo Finance
- **Caching**: Redis (optional)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mundo-invest
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start development servers
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend API runs on `http://localhost:3000`

## 📅 Development Phases

### Phase 1 (Week 1): Foundation
- [ ] Supabase Auth setup
- [ ] Database schema creation
- [ ] Backend scaffolding
- [ ] Frontend scaffolding

### Phase 2 (Week 2): Market Data
- [ ] CoinGecko integration
- [ ] Chart rendering
- [ ] Real-time data updates

### Phase 3 (Week 3): AI Integration
- [ ] Vercel AI SDK setup
- [ ] Chat system prompt
- [ ] Data grounding system

## 📦 Available Scripts

### Root
- `npm run dev` - Start all services in development mode
- `npm run build` - Build all workspaces
- `npm run lint` - Lint all workspaces
- `npm run type-check` - Type check all workspaces

## 🔐 Security & Compliance

- All AI responses include disclaimers
- No financial advice recommendations
- Educational focus only
- High-liquidity assets only (MVP)

## 📝 License

TBD

## 👤 Contributing

Internal project. Contributions follow the established development phases.
