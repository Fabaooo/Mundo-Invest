# Phase 1 Setup - Autenticação

Este guia descreve como configurar tudo para Phase 1 funcionar.

## Etapa 1: Criar Conta Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (ou faça login)
3. Crie um novo projeto
4. Escolha uma região próxima (ex: South America - São Paulo)
5. Aguarde o projeto inicializar (2-3 minutos)

## Etapa 2: Obter Credenciais

1. No dashboard do Supabase, vá para **Settings → API**
2. Copie:
   - **Project URL** (ex: `https://xxxxxx.supabase.co`)
   - **Anon Public Key** (anon key)
   - **Service Role Key** (service role key - scrolle para clicar)

## Etapa 3: Executar Migrations de Schema

1. No dashboard do Supabase, vá para **SQL Editor**
2. Crie uma nova query
3. Copie e cole o conteúdo de `docs/supabase-schema.sql`
4. Execute (clique em "Run" ou Ctrl+Enter)

## Etapa 4: Configurar Environment Variables

No arquivo `.env.local` do seu projeto (na raiz):

```bash
# Supabase
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_KEY=sua-chave-service-aqui
SUPABASE_URL=https://seu-projeto-id.supabase.co

# Backend
BACKEND_PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000/api
```

## Etapa 5: Testar Autenticação

1. Certifique-se de que backend e frontend estão rodando:
   ```bash
   npm run dev
   ```

2. Acesse http://localhost:5173 no navegador

3. Você deve ver a página de login

4. Clique em "Criar conta"

5. Preencha:
   - Nome: Seu Nome
   - Email: seu@email.com
   - Senha: 123456 (mínimo 6 caracteres)

6. Clique em "Criar Conta"

7. Se tudo funcionar:
   - Você será redirecionado para o Dashboard
   - Deve ver "Bem-vindo, Seu Nome!"
   - Pode clicar em "Sair" para voltar ao login

## O que foi implementado

### Backend (Express)
✅ Supabase Service com:
- `signUp()` - Criar novo usuário
- `signIn()` - Fazer login
- `getUserProfile()` - Obter perfil
- `updateUserProfile()` - Atualizar perfil

✅ Auth Routes:
- `POST /api/auth/signup` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil (requer auth)
- `PUT /api/auth/profile` - Atualizar perfil (requer auth)
- `POST /api/auth/logout` - Logout

✅ Auth Middleware:
- Token verification
- Protected routes
- Optional auth

### Frontend (React)
✅ Zustand Store:
- `useAuthStore` para gerenciar estado de autenticação
- User, tokens, loading, error

✅ API Client:
- `authService.ts` com funções para:
  - signup()
  - login()
  - getProfile()
  - updateProfile()
  - logout()

✅ Pages:
- `LoginPage` - Página de login
- `SignupPage` - Página de criação de conta
- `DashboardPage` - Dashboard (página protegida)

✅ Routing:
- React Router com proteção de rotas
- Redirect automático para login se não autenticado

## Próximas Etapas (Phase 1.2)

- [ ] Questionário de perfil de risco
- [ ] Salvar perfil de risco no banco
- [ ] Email confirmation (opcional)
- [ ] Password reset (opcional)
- [ ] Profile photo upload (opcional)

## Troubleshooting

### Erro: "Cannot find module 'supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Erro de CORS
Verifique se o CORS está configurado no backend para aceitar `http://localhost:5173`

### Erro: "Supabase credentials not configured"
Verifique que `.env.local` tem as variáveis de ambiente corretas

### Usuário criado mas não consegue fazer login
- Verificar se o email está correto
- Confirmar que a senha tem no mínimo 6 caracteres
- Checar no Supabase console se o usuário foi criado

## URLs Importantes

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Backend Health: http://localhost:3000/health
- Supabase Dashboard: https://supabase.com/dashboard

## Proximos Passos

Quando a autenticação estiver funcionando:
1. Implementar questionário de risco (Phase 1.2)
2. Começar Phase 2 - Market Data Integration
