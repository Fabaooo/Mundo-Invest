# Database Schema

This document outlines the Supabase PostgreSQL schema for Mundo Invest.

## Tables

### users
Extends Supabase auth.users with custom profile data

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  risk_profile VARCHAR(50) CHECK (risk_profile IN ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### assets
Available financial assets in the platform

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('CRYPTO', 'STOCK', 'FII', 'ETF')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_symbol (symbol),
  INDEX idx_type (type)
);
```

### price_history
Historical price data (snapshot approach)

```sql
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  price DECIMAL(20, 8) NOT NULL,
  volume DECIMAL(20, 2),
  market_cap DECIMAL(20, 2),
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_asset_timestamp (asset_id, timestamp DESC),
  INDEX idx_timestamp (timestamp DESC)
);
```

### portfolios
User investment portfolios (simulated)

```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'Meu Portfólio',
  total_invested DECIMAL(15, 2) NOT NULL DEFAULT 0,
  total_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id)
);
```

### portfolio_assets
Assets within a portfolio

```sql
CREATE TABLE portfolio_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  quantity DECIMAL(20, 8) NOT NULL,
  buy_price DECIMAL(20, 8) NOT NULL,
  bought_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_portfolio_id (portfolio_id),
  INDEX idx_asset_id (asset_id),
  UNIQUE (portfolio_id, asset_id)
);
```

### chat_messages
Chat history for user-AI interactions

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  asset_context JSONB,
  tokens_used INT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at DESC)
);
```

### daily_quota_usage
Track free tier question limits

```sql
CREATE TABLE daily_quota_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  questions_used INT NOT NULL DEFAULT 0,
  questions_limit INT NOT NULL DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_date (user_id, date),
  UNIQUE (user_id, date)
);
```

## Indexes and Performance

- Primary indexes on user_id for user-related queries
- Composite indexes on (user_id, date) for quota lookups
- Timestamp indexes for efficient historical data queries
- Symbol index on assets for quick lookups

## Security

- Row-level security (RLS) policies should be implemented
- Users can only access their own data
- Service role key for backend operations
- Anon key restricted to public read-only data

## Triggers and Functions

### Auto-update portfolio value
Trigger to automatically calculate portfolio value on portfolio_assets changes

### Daily quota reset
Update daily quotas at midnight for each user

## Migration Management

Use Supabase migrations or a migration tool (Flyway, Liquibase) to manage schema versions.
