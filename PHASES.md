# Development Phases

This document outlines the planned development phases for Mundo Invest MVP based on the PRD.

## Phase 1: Foundation (Week 1)

**Goal**: Set up the core infrastructure and authentication

### Tasks
- [ ] Supabase project setup
- [ ] Database schema design and creation
  - [ ] Users table with profiles
  - [ ] Risk profile assessment
  - [ ] Chat history table
  - [ ] Portfolio table
- [ ] Backend server initialization
- [ ] Frontend scaffolding with Vite + React
- [ ] API authentication endpoints
  - [ ] Sign up
  - [ ] Login
  - [ ] Logout
  - [ ] Profile retrieval
- [ ] User risk assessment questionnaire UI
- [ ] Zustand store setup for auth state

### Deliverables
- Functional login/signup flow
- User profiles with risk assessment
- Basic dashboard layout

### Dependencies
- Supabase account
- OpenAI API key (for Phase 3)

---

## Phase 2: Market Data Integration (Week 2)

**Goal**: Implement real-time market data visualization

### Tasks
- [ ] CoinGecko API integration
  - [ ] Fetch cryptocurrency prices
  - [ ] Implement caching (Redis or in-memory)
- [ ] Asset list CRUD operations
- [ ] Historical price fetching
- [ ] Chart rendering with Recharts
  - [ ] Single asset charts
  - [ ] Timeframe selection (1D, 1W, 1M, YTD)
- [ ] Real-time price update mechanism
- [ ] Asset search and filtering UI
- [ ] Dashboard showing top assets

### Deliverables
- Live cryptocurrency dashboard
- Historical price charts
- Asset filtering and search

### Performance Considerations
- Implement caching to reduce API costs
- Use WebSocket for potential real-time updates (if budget allows)
- Optimize chart rendering for large datasets

---

## Phase 3: AI Integration & Chat (Week 3)

**Goal**: Implement AI-powered educational chat with market data grounding

### Tasks
- [ ] Vercel AI SDK setup
- [ ] Chat endpoint with streaming
- [ ] System prompt implementation
  - [ ] Educational focus
  - [ ] Risk profile adaptation
  - [ ] Automatic disclaimers
- [ ] Message history storage
- [ ] Data grounding system
  - [ ] Fetch live prices before responding
  - [ ] Include asset context in responses
- [ ] Chat UI component
  - [ ] Message display
  - [ ] Input with auto-completion
  - [ ] Streaming response display
- [ ] Daily quota enforcement (5 questions/day for free tier)
- [ ] Response formatting with disclaimers

### Deliverables
- Functional AI chat on dashboard
- Educational responses with current data
- Quota management for free tier

### Important Notes
- ALL AI responses must include disclaimers
- Responses are educational, NOT investment advice
- Only discuss high-liquidity assets (Bitcoin, IBOV, etc.)

---

## Post-MVP Considerations (Phase 2+)

- [ ] Portfolio simulation with buy/sell controls
- [ ] Performance tracking and analytics
- [ ] Yahoo Finance integration for stocks/FIIs
- [ ] Premium tier features (unlimited questions)
- [ ] Email notifications for market alerts
- [ ] Advanced charting tools
- [ ] Social features (share portfolios, discussions)

---

## Risk Mitigation

### Trademark Risk
- [ ] Verify "Mundo Invest" with INPI (Brazilian trademark office)
- [ ] Consider alternative names if needed

### API Cost Management
- [ ] Implement caching strategy from Day 1
- [ ] Set up cost monitoring for OpenAI API usage
- [ ] Use free APIs when possible (CoinGecko free tier)

### Compliance
- [ ] Review all AI responses for regulatory compliance
- [ ] Ensure disclaimers are visible and clear
- [ ] Manual review of system prompt before launch
- [ ] Track user interactions for audit trail

---

## Success Metrics (MVP)

- [ ] User authentication working
- [ ] Real-time price data displaying
- [ ] AI chat responding within 2 seconds
- [ ] 99.9% uptime during testing
- [ ] Zero trademark conflicts
- [ ] All AI responses include disclaimers

---

## Timeline

- **Start Date**: [INSERT DATE]
- **Week 1 Deadline**: Foundation complete
- **Week 2 Deadline**: Market data live
- **Week 3 Deadline**: AI chat operational
- **MVP Launch**: End of Week 3

---

## Team Assignments

- **Backend**: [INSERT NAME]
- **Frontend**: [INSERT NAME]
- **DevOps/Infra**: [INSERT NAME]
- **AI/ML**: [INSERT NAME]
- **Product**: [INSERT NAME]
