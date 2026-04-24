# Backend API

Express.js API server for Mundo Invest, handling authentication, market data integration, and AI-powered chat.

## Project Structure

```
src/
├── routes/              # API endpoints
│   ├── auth.ts
│   ├── assets.ts
│   ├── chat.ts
│   ├── portfolio.ts
│   └── prices.ts
├── controllers/         # Request handlers
├── services/            # Business logic
│   ├── aiService.ts     # Vercel AI SDK integration
│   ├── marketService.ts # Market data fetching
│   └── supabaseService.ts
├── middleware/          # Express middleware
├── utils/               # Helper functions
├── types/               # TypeScript definitions
└── index.ts
```

## Architecture

The backend follows a layered architecture:
1. **Routes**: HTTP endpoint definitions
2. **Controllers**: Request/response handling
3. **Services**: Business logic and external integrations
4. **Database**: Supabase for persistence

## Key Features

### Authentication
- Supabase Auth integration
- JWT token validation
- User session management

### Market Data Integration
- CoinGecko API for cryptocurrency
- Yahoo Finance API for stocks/FIIs
- Data caching with Redis/in-memory store

### AI Chat System
- Vercel AI SDK integration
- Real-time streaming responses
- Data grounding with current prices
- Automatic disclaimer inclusion

## Development

```bash
npm run dev
```

API runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Assets
- `GET /api/assets` - List all available assets
- `GET /api/assets/:id` - Get specific asset details
- `GET /api/assets/search` - Search assets

### Market Data
- `GET /api/prices` - Get current prices
- `GET /api/prices/history` - Get historical prices

### Chat
- `POST /api/chat` - Send chat message with streaming

### Portfolio
- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio` - Create/update portfolio
- `DELETE /api/portfolio/:id` - Delete portfolio asset

## Environment Variables

Required in `.env`:
```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4
BACKEND_PORT=3000
NODE_ENV=development
REDIS_URL=redis://localhost:6379 (optional)
```

## Development Phases

### Phase 1: Foundation
- [ ] Server setup with Express
- [ ] Supabase Auth integration
- [ ] User profile endpoints
- [ ] Database schema

### Phase 2: Market Data
- [ ] CoinGecko API integration
- [ ] Price caching system
- [ ] Historical data endpoints

### Phase 3: AI Integration
- [ ] Vercel AI SDK setup
- [ ] Chat endpoints with streaming
- [ ] Data grounding system
- [ ] Response disclaimers
