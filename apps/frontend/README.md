# Frontend Application

React + Next.js frontend for Mundo Invest, featuring real-time market dashboards and AI-powered chat.

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Dashboard/
│   ├── Chat/
│   ├── Portfolio/
│   ├── Layout/
│   └── Common/
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── services/           # API clients and services
├── styles/             # Global styles and Tailwind config
├── types/              # TypeScript type definitions
└── App.tsx
```

## Key Technical Decisions

- **State Management**: Zustand for lightweight, performant state
- **UI Library**: Recharts for financial data visualization
- **Styling**: Tailwind CSS for rapid development
- **API Communication**: Axios with custom hooks
- **Authentication**: Supabase Auth

## Development

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Features to Implement (Phase 1-3)

### Phase 1: Foundation
- [ ] Authentication flow with Supabase
- [ ] User profile setup with risk assessment questionnaire
- [ ] Dashboard layout scaffolding

### Phase 2: Market Data
- [ ] Asset list display
- [ ] Real-time price updates
- [ ] Historical price charts
- [ ] Asset search and filtering

### Phase 3: AI Integration
- [ ] Chat interface
- [ ] Message history
- [ ] Asset context integration

## Environment Variables

Required in `.env.local`:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000/api
```
