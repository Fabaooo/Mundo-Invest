# Debugar erro de login "Login failed"

Segue instruções para identificar o problema:

## 1. Abra as DevTools (F12 ou Ctrl+Shift+I)

## 2. Vá para a aba "Console"

## 3. Tente fazer login novamente

## 4. Procure por mensagens de erro no console

Você deve ver uma das seguintes mensagens ou um erro diferente.

## Possíveis Erros e Soluções

### Erro: "Network Error" ou "Failed to fetch"
- **Causa**: O backend não está rodando ou a porta está errada
- **Solução**: Verifique se ambos os servidores estão rodando:
  - Backend: `http://localhost:3000` (deve responder)
  - Frontend: `http://localhost:5174`

### Erro: "CORS policy"
- **Causa**: O CORS está bloqueando a requisição
- **Solução**: Reinicie os servidores (`npm run dev`)

### Erro: "User not found"
- **Causa**: As credenciais não estão registradas
- **Solução**: Use as credenciais corretas:
  ```
  Email: teste@email.com
  Password: 123456
  ```
  Ou crie uma nova conta no signup

### Erro: "Invalid password"
- **Causa**: A senha está incorreta
- **Solução**: Verifique se digitou a senha corretamente (case-sensitive)

## 5. Verifique a aba "Network"

1. Limpe o histórico de rede
2. Tente fazer login novamente
3. Procure por uma requisição POST para `/api/auth/login`
4. Clique nela e veja:
   - **Status**: Deve ser 200 (sucesso) ou 401 (não autorizado)
   - **Response**: A resposta do servidor
   - **Headers**: Se o Content-Type está correto

## 6. Teste manualmente no terminal

Execute este comando para verificar se o backend está respondendo:

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\": \"teste@email.com\", \"password\": \"123456\"}'
```

A resposta deve ser algo como:
```json
{
  "user": {
    "id": "user_001",
    "email": "teste@email.com",
    "full_name": "Usuário Teste"
  },
  "session": {
    "access_token": "mock_access_...",
    "refresh_token": "mock_refresh_...",
    "expires_in": 3600
  }
}
```

## 7. Verifique o console do backend

No terminal onde você rodou `npm run dev`, procure por:
- `🔐 Mock Auth - Attempting login: teste@email.com`
- `✅ Login successful: teste@email.com`

Se ver essas mensagens, o backend está funcionando, então o problema está no frontend.

---

**Envie a screenshot do console do navegador para que eu possa ajudar com mais precisão!**
