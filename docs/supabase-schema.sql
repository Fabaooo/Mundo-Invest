-- Mundo Invest Supabase Schema
-- Execute these SQL commands in the Supabase SQL Editor

-- Create users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  risk_profile VARCHAR(50) DEFAULT 'MODERATE' CHECK (risk_profile IN ('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- User can only read/update their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('CRYPTO', 'STOCK', 'FII', 'ETF')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assets_symbol ON assets(symbol);
CREATE INDEX idx_assets_type ON assets(type);

-- Enable RLS on assets table (public read-only)
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assets are public" ON assets FOR SELECT USING (true);

-- Create price_history table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  price DECIMAL(20, 8) NOT NULL,
  volume DECIMAL(20, 2),
  market_cap DECIMAL(20, 2),
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_price_history_asset_timestamp ON price_history(asset_id, timestamp DESC);
CREATE INDEX idx_price_history_timestamp ON price_history(timestamp DESC);

-- Enable RLS on price_history (public read-only)
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Price history is public" ON price_history FOR SELECT USING (true);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'Meu Portfólio',
  total_invested DECIMAL(15, 2) NOT NULL DEFAULT 0,
  total_value DECIMAL(15, 2) NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);

-- Enable RLS on portfolios
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own portfolios" ON portfolios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create portfolios" ON portfolios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" ON portfolios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios" ON portfolios
  FOR DELETE USING (auth.uid() = user_id);

-- Create portfolio_assets table
CREATE TABLE IF NOT EXISTS portfolio_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  quantity DECIMAL(20, 8) NOT NULL,
  buy_price DECIMAL(20, 8) NOT NULL,
  bought_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(portfolio_id, asset_id)
);

CREATE INDEX idx_portfolio_assets_portfolio_id ON portfolio_assets(portfolio_id);
CREATE INDEX idx_portfolio_assets_asset_id ON portfolio_assets(asset_id);

-- Enable RLS on portfolio_assets
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their portfolio assets" ON portfolio_assets
  FOR SELECT USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can manage their portfolio assets" ON portfolio_assets
  FOR INSERT WITH CHECK (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update their portfolio assets" ON portfolio_assets
  FOR UPDATE USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete their portfolio assets" ON portfolio_assets
  FOR DELETE USING (
    portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
  );

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  asset_context JSONB,
  tokens_used INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable RLS on chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create daily_quota_usage table
CREATE TABLE IF NOT EXISTS daily_quota_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  questions_used INT NOT NULL DEFAULT 0,
  questions_limit INT NOT NULL DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_quota_usage_user_date ON daily_quota_usage(user_id, date);

-- Enable RLS on daily_quota_usage
ALTER TABLE daily_quota_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their quota" ON daily_quota_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Insert some initial assets (Bitcoin, Ethereum)
INSERT INTO assets (symbol, name, type, description) VALUES
  ('BTC', 'Bitcoin', 'CRYPTO', 'The first and most well-known cryptocurrency'),
  ('ETH', 'Ethereum', 'CRYPTO', 'A decentralized platform for smart contracts'),
  ('IBOV', 'Ibovespa', 'STOCK', 'Brazilian stock market index'),
  ('PETR4', 'Petrobras', 'STOCK', 'Major Brazilian energy company'),
  ('VALE3', 'Vale', 'STOCK', 'Major Brazilian mining company')
ON CONFLICT (symbol) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.assets TO authenticated;
GRANT ALL ON public.price_history TO authenticated;
GRANT ALL ON public.portfolios TO authenticated;
GRANT ALL ON public.portfolio_assets TO authenticated;
GRANT ALL ON public.chat_messages TO authenticated;
GRANT ALL ON public.daily_quota_usage TO authenticated;

-- Grant read-only permissions to anon role
GRANT SELECT ON public.assets TO anon;
GRANT SELECT ON public.price_history TO anon;
