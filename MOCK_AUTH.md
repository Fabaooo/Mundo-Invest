# 🧪 Mock Authentication - Testing Guide

## Overview

The application is now running with **mock authentication** enabled! This means you can test the complete signup → risk assessment → dashboard flow **without Supabase configuration**.

## ✅ What's Working

- ✅ Frontend running on **http://localhost:5174**
- ✅ Backend running on **http://localhost:3000**
- ✅ Mock user database with pre-configured test users
- ✅ Complete authentication flow (signup, login, profile, logout)
- ✅ Risk assessment questionnaire
- ✅ Automatic routing based on user profile

## 🔐 Test Credentials

Use these credentials to log in:

| Email | Password | Full Name |
|-------|----------|-----------|
| `teste@email.com` | `123456` | Usuário Teste |
| `demo@email.com` | `demo123` | Demo User |

Or create a new account with any email/password combination.

## 🎯 Quick Start - Test the Full Flow

### Option 1: Using Pre-configured Test User
1. Go to **http://localhost:5174**
2. Click "Já tem conta? Faça login"
3. Enter credentials:
   - Email: `teste@email.com`
   - Password: `123456`
4. Click "Entrar"
5. Complete the risk assessment (5 questions)
6. View your personalized dashboard with risk profile

### Option 2: Create New Test Account
1. Go to **http://localhost:5174**
2. Click "Criar conta"
3. Fill in:
   - Full Name: Your name
   - Email: Any email (e.g., `newuser@test.com`)
   - Password: Any password (min 6 characters)
4. Click "Criar conta"
5. You'll be automatically logged in and redirected to risk assessment
6. Answer 5 questions about your investment profile
7. View dashboard with your calculated risk profile

## 📊 How It Works

### Mock Data Structure

The mock authentication system stores users in **memory only** (lost on server restart). Each user has:

```typescript
{
  id: "user_1234567890",
  email: "exemplo@email.com",
  password: "123456",
  full_name: "Seu Nome",
  risk_profile: "MODERATE" | "CONSERVATIVE" | "AGGRESSIVE"
}
```

### Risk Assessment Results

After completing the 5-question questionnaire, your risk profile is calculated:

- **🛡️ Conservador (CONSERVATIVE)**: Focus on security and capital preservation
- **⚖️ Moderado (MODERATE)**: Balance between security and growth
- **🚀 Agressivo (AGGRESSIVE)**: Focus on growth and higher returns

## 🔄 Authentication Flow

```
signup/login → Validate credentials (mock) → Return mock tokens
                                              ↓
API requests → Include token in header → Verify token (mock)
                                          ↓
                                    Return user data
                                          ↓
                                    Update Zustand store
```

## 🚀 API Endpoints Available

All endpoints work with mock auth:

```
POST   /api/auth/signup              - Create new account
POST   /api/auth/login               - Authenticate user
GET    /api/auth/profile             - Get current user profile
PUT    /api/auth/profile             - Update user profile
POST   /api/auth/logout              - Logout (advisory)
GET    /api/auth/test-credentials    - View available test credentials
```

## ⚙️ How to Switch to Real Supabase

When you're ready to connect Supabase:

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Wait for initialization

2. **Execute Database Schema**
   - Copy contents of `docs/supabase-schema.sql`
   - Open Supabase SQL Editor
   - Paste and execute

3. **Create `.env.local` in project root**
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   ```

4. **Restart dev server**
   ```bash
   npm run dev
   ```

The application will automatically detect Supabase configuration and switch from mock to real authentication. **No code changes needed!**

## 💾 Data Persistence

- **Mock Mode**: Users exist only in memory during the dev server session
  - Restarting the server resets all users
  - Test users are always repopulated on startup

- **Supabase Mode**: Users are persisted to the database
  - Survives server restarts
  - Shared across team members

## 🐛 Troubleshooting

### "Password must be at least 6 characters"
Use a password with minimum 6 characters when creating accounts.

### "User already exists"
That email is already registered. Use a different email or use the test credentials.

### "Invalid token"
Your session expired or the token is corrupted. Try logging out and logging back in.

### Frontend not updating profile after risk assessment
- Check browser console for errors (DevTools > Console)
- Verify the API request is reaching the backend (DevTools > Network)
- Try refreshing the page

## 📝 Example Test Scenarios

### Scenario 1: Conservative Investor
1. Login with `teste@email.com` / `123456`
2. On risk assessment, always choose conservative options
3. See 🛡️ Conservador displayed on dashboard

### Scenario 2: New User Flow
1. Signup with new email
2. Auto-redirect to risk assessment
3. Select mixed responses
4. Auto-redirect to dashboard with calculated profile

### Scenario 3: Update Profile
1. Login and answer risk assessment
2. Later, login again and update profile
3. Changes should persist in mock store

## ✨ What's Next

Once you've tested the complete flow with mock auth:

1. Configure Supabase (see steps above)
2. Test again with persistent database
3. Proceed to Phase 2: Market Data Integration
   - Real-time price data from CoinGecko
   - Interactive charts
   - Asset simulation

---

**Happy testing!** 🎉
