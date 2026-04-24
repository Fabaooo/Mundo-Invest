# API Implementation Guide

This guide outlines the API endpoints, request/response formats, and implementation details for Mundo Invest.

## Authentication Endpoints

### POST /api/auth/signup
Create a new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "fullName": "User Name"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "User Name"
  },
  "session": {
    "access_token": "jwt_token",
    "expires_in": 3600
  }
}
```

**Error Codes:**
- 400: Invalid email or password too weak
- 409: Email already registered

---

### POST /api/auth/login
Authenticate user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt_token",
    "expires_in": 3600
  }
}
```

---

### POST /api/auth/logout
Logout user

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET /api/auth/profile
Get current user profile

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "User Name",
  "riskProfile": "MODERATE",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### PUT /api/auth/profile/risk-assessment
Update user risk profile

**Request:**
```json
{
  "riskProfile": "AGGRESSIVE"
}
```

**Response:**
```json
{
  "message": "Profile updated",
  "riskProfile": "AGGRESSIVE"
}
```

---

## Asset Endpoints

### GET /api/assets
List all available assets

**Query Parameters:**
- `type`: Filter by type (CRYPTO, STOCK, FII, ETF)
- `search`: Search by symbol or name
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "symbol": "BTC",
      "name": "Bitcoin",
      "type": "CRYPTO",
      "currentPrice": 45000.50,
      "priceChange24h": 2.5,
      "marketCap": 900000000000
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

---

### GET /api/assets/:id
Get specific asset details

**Response:**
```json
{
  "id": "uuid",
  "symbol": "BTC",
  "name": "Bitcoin",
  "type": "CRYPTO",
  "description": "First and largest cryptocurrency",
  "currentPrice": 45000.50,
  "priceChange24h": 2.5,
  "marketCap": 900000000000,
  "volume24h": 25000000000,
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

---

## Price Endpoints

### GET /api/prices
Get current prices for assets

**Query Parameters:**
- `symbols`: Comma-separated list (e.g., "BTC,ETH,IBOV")

**Response:**
```json
{
  "BTC": {
    "price": 45000.50,
    "change24h": 2.5,
    "volume": 25000000000
  },
  "ETH": {
    "price": 2500.75,
    "change24h": 1.8,
    "volume": 15000000000
  }
}
```

---

### GET /api/prices/history
Get historical price data

**Query Parameters:**
- `assetId`: Asset UUID (required)
- `from`: Start date (ISO format)
- `to`: End date (ISO format)
- `interval`: '1D', '1W', '1M' (default: '1D')

**Response:**
```json
{
  "assetId": "uuid",
  "symbol": "BTC",
  "data": [
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "price": 44500.00,
      "volume": 25000000000
    },
    {
      "timestamp": "2024-01-14T00:00:00Z",
      "price": 44000.00,
      "volume": 23000000000
    }
  ]
}
```

---

## Chat Endpoints

### POST /api/chat
Send a chat message

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request:**
```json
{
  "message": "What is Bitcoin?",
  "assetContext": ["BTC"],
  "conversationId": "optional-uuid"
}
```

**Response (Streaming):**
```json
{
  "id": "message-uuid",
  "role": "assistant",
  "content": "Bitcoin is the first and most well-known cryptocurrency...",
  "disclaimer": "⚠️ This is educational information only and NOT personalized investment advice.",
  "relatedAssets": ["BTC"],
  "tokensUsed": 180
}
```

**Error Codes:**
- 429: Daily quota exceeded
- 401: Unauthorized

---

### GET /api/chat/history
Get chat message history

**Query Parameters:**
- `limit`: Number of messages (default: 50)
- `conversationId`: Optional conversation filter

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "What is Bitcoin?",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Bitcoin is...",
      "createdAt": "2024-01-15T10:30:05Z"
    }
  ]
}
```

---

## Portfolio Endpoints

### GET /api/portfolio
Get user portfolios

**Response:**
```json
{
  "portfolios": [
    {
      "id": "uuid",
      "name": "Meu Portfólio",
      "totalInvested": 10000.00,
      "totalValue": 11500.00,
      "gainLoss": 1500.00,
      "gainLossPercentage": 15.0,
      "assets": [
        {
          "assetId": "uuid",
          "symbol": "BTC",
          "quantity": 0.25,
          "buyPrice": 40000.00,
          "currentValue": 11250.00,
          "percentageOfPortfolio": 97.8
        }
      ]
    }
  ]
}
```

---

### POST /api/portfolio
Create a new portfolio

**Request:**
```json
{
  "name": "Portfólio Agressivo",
  "assets": [
    {
      "assetId": "uuid",
      "quantity": 1,
      "buyPrice": 45000.00
    }
  ]
}
```

**Response:**
```json
{
  "id": "portfolio-uuid",
  "name": "Portfólio Agressivo",
  "totalInvested": 45000.00,
  "totalValue": 45000.00,
  "gainLoss": 0,
  "gainLossPercentage": 0
}
```

---

### PUT /api/portfolio/:id
Update portfolio

**Request:**
```json
{
  "name": "Novo Nome"
}
```

---

### DELETE /api/portfolio/:id
Delete portfolio

**Response:**
```json
{
  "message": "Portfolio deleted"
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED`: Missing or invalid authentication
- `FORBIDDEN`: User not allowed to access resource
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `QUOTA_EXCEEDED`: Rate limit or daily quota exceeded
- `INTERNAL_ERROR`: Server error

---

## Rate Limiting

- **Free Tier**: 5 chat questions per day, 100 API calls per hour
- **Premium Tier**: Unlimited (Phase 2)

---

## Caching Strategy

- **Asset Prices**: 5 minutes
- **Historical Data**: 1 hour
- **Asset List**: 24 hours

Implement using Redis or in-memory cache to minimize API costs.
