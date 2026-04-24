# 🚀 Getting Started - Mundo Invest MVP

Welcome! Your complete monorepo structure for Mundo Invest is ready. Follow these steps to start development.

## 1️⃣ Install Dependencies

```bash
npm install
```

This installs all dependencies across frontend, backend, and shared packages.

## 2️⃣ Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new account
2. Create a new project (choose a region close to your users)
3. Wait for the project to initialize
4. In the dashboard:
   - Go to Settings → API
   - Copy your **Project URL** and **Anon Public Key**
   - Separately, get your **Service Role Key** (scroll down)

## 3️⃣ Configure Environment Variables

```bash
# Copy the template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

**Key variables to fill:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
OPENAI_API_KEY=sk-your-key (get from OpenAI)
```

## 4️⃣ Create Database Schema

In Supabase dashboard:

1. Go to **SQL Editor**
2. Create a new query
3. Copy schema from [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)
4. Execute the SQL

Or use the migrations approach:
```bash
# If using Supabase CLI
supabase db push
```

## 5️⃣ Start Development

```bash
# Terminal 1 - Frontend + Backend
npm run dev

# Or separately:
npm run dev --workspace=apps/frontend
npm run dev --workspace=apps/backend
```

**Access Points:**
- 🖥️ Frontend: [http://localhost:5173](http://localhost:5173)
- 🔧 Backend: [http://localhost:3000](http://localhost:3000)
- 📚 API Health: [http://localhost:3000/health](http://localhost:3000/health)

## 📋 Directory Structure

```
mundo-invest/
├── apps/
│   ├── frontend/              # React + Vite app
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── pages/         # Page components
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── stores/        # Zustand stores
│   │   │   ├── services/      # API clients
│   │   │   ├── index.css      # Global styles
│   │   │   ├── App.tsx        # Main component
│   │   │   └── main.tsx       # Entry point
│   │   ├── vite.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── backend/               # Express + Node.js
│       ├── src/
│       │   ├── routes/        # API endpoints
│       │   ├── controllers/   # Request handlers
│       │   ├── services/      # Business logic
│       │   ├── middleware/    # Express middleware
│       │   └── index.ts       # Server entry
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/                # Shared code
│       ├── src/
│       │   ├── types.ts       # Shared types
│       │   ├── constants.ts   # Constants
│       │   └── utils.ts       # Utilities
│       └── package.json
│
├── docs/
│   ├── DATABASE_SCHEMA.md     # Database design
│   └── API_GUIDE.md           # API documentation
│
├── PHASES.md                  # 3-week development plan
├── MVP_CHECKLIST.md           # Task checklist
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── tsconfig.json              # Root TypeScript config
└── package.json               # Root package config
```

## 📚 Documentation

Read these in order:

1. **[README.md](README.md)** - Project overview
2. **[PHASES.md](PHASES.md)** - Development roadmap (Week 1-3)
3. **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Database structure
4. **[docs/API_GUIDE.md](docs/API_GUIDE.md)** - API endpoints and formats
5. **[MVP_CHECKLIST.md](MVP_CHECKLIST.md)** - Task tracking

## 🔑 Key Features by Phase

### Phase 1 (Week 1) - Foundation
- ✅ Supabase Auth Integration
- ✅ User Registration & Login
- ✅ Risk Assessment Questionnaire
- ✅ Dashboard Layout

### Phase 2 (Week 2) - Market Data
- ✨ CoinGecko Integration
- ✨ Real-time Price Updates
- ✨ Historical Charts
- ✨ Asset Search

### Phase 3 (Week 3) - AI Chat
- 🤖 Vercel AI SDK Integration
- 🤖 Educational Chat Interface
- 🤖 Data-Grounded Responses
- 🤖 Daily Quota System

## 🛠️ Common Commands

```bash
# Development
npm run dev                    # All services
npm run dev --workspace=apps/frontend
npm run dev --workspace=apps/backend

# Testing & Building
npm run build                  # Build all
npm run lint                   # Lint all
npm run type-check            # Type check all

# From specific workspace
cd apps/frontend
npm run dev
npm run build
npm run preview
```

## 🔐 Security Notes

- Never commit `.env.local` (already in .gitignore)
- Keep API keys secure - never share them
- Use environment variables for sensitive data
- Supabase provides auth out of the box
- Implement row-level security (RLS) on database

## 🚨 Important Reminders

⚠️ **AI Disclaimers** - All AI responses must include:
```
⚠️ This is educational information only and NOT personalized investment advice.
Always consult a financial advisor before making investment decisions.
```

💰 **Cost Management** - From day 1:
- Implement caching for API responses
- Monitor OpenAI API usage
- Use CoinGecko free tier

✅ **MVP Focus** - Only high-liquidity assets:
- Bitcoin (BTC)
- Brazilian Index (IBOV)
- Selected ETFs

## 📞 Support

If you need help:
1. Check the docs/ folder
2. Review PHASES.md for guidance
3. Check API_GUIDE.md for endpoint details
4. Review MVP_CHECKLIST.md for current progress

## 🎯 Next Immediate Actions

1. ✅ Install dependencies: `npm install`
2. ✅ Create Supabase project
3. ✅ Set up environment variables
4. ✅ Create database schema
5. ✅ Run: `npm run dev`
6. ✅ Start Phase 1 (Authentication)

---

**Happy coding! 🚀** Build something amazing with Mundo Invest.
