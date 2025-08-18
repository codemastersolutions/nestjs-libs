# 🔐 Configuração do NPM_TOKEN para Publicação Automática

Este documento explica como configurar o `NPM_TOKEN` para habilitar a publicação automática de pacotes no NPM através do GitHub Actions.

## 📋 Pré-requisitos

- Conta no [NPM](https://www.npmjs.com/)
- Permissões de administrador no repositório GitHub
- Pacotes configurados com escopo `@cms-nestjs-libs`

## 🚀 Passo a Passo

### 1. Gerar Token de Acesso NPM

1. Acesse [NPM Settings > Access Tokens](https://www.npmjs.com/settings/tokens)
2. Clique em **"Generate New Token"**
3. Selecione **"Automation"** como tipo de token
4. Defina um nome descritivo (ex: `GitHub Actions - NestJS Libs`)
5. Copie o token gerado (você só verá uma vez!)

### 2. Configurar Secret no GitHub

1. Vá para o repositório no GitHub
2. Acesse **Settings > Secrets and variables > Actions**
3. Clique em **"New repository secret"**
4. Configure:
   - **Name:** `NPM_TOKEN`
   - **Secret:** Cole o token NPM gerado
5. Clique em **"Add secret"**

### 3. Verificar Configuração

Após configurar o secret, o workflow `build-and-release` irá:

✅ **Com NPM_TOKEN configurado:**
- Verificar autenticação NPM
- Publicar pacotes automaticamente no NPM
- Criar releases no GitHub

⚠️ **Sem NPM_TOKEN configurado:**
- Pular a publicação no NPM
- Continuar com build e release no GitHub
- Exibir instruções de configuração

## 🔍 Verificação de Status

O workflow inclui verificação automática do NPM_TOKEN:

```yaml
- name: Check NPM Authentication
  id: npm-auth-check
  run: |
    if [ -z "${{ secrets.NPM_TOKEN }}" ]; then
      echo "⚠️  NPM_TOKEN not configured in repository secrets"
      echo "npm-auth-available=false" >> $GITHUB_OUTPUT
    else
      echo "✅ NPM_TOKEN is configured"
      echo "npm-auth-available=true" >> $GITHUB_OUTPUT
    fi
```

## 🛡️ Segurança

- **Nunca** compartilhe o token NPM
- **Nunca** commite o token no código
- Use apenas tokens do tipo **"Automation"**
- Revogue tokens não utilizados
- Monitore o uso dos tokens no NPM

## 🔧 Troubleshooting

### Erro: `ENEEDAUTH`
```
npm error code ENEEDAUTH
npm error need auth This command requires you to be logged in
```

**Solução:** Verifique se o `NPM_TOKEN` está configurado corretamente nos secrets do repositório.

### Erro: `E403`
```
npm error code E403
npm error 403 Forbidden
```

**Possíveis causas:**
- Token NPM expirado ou inválido
- Falta de permissão para publicar no escopo `@cms-nestjs-libs`
- Versão do pacote já existe no NPM

### Erro: `E404`
```
npm error code E404
npm error 404 Not Found
```

**Solução:** Verifique se o escopo `@cms-nestjs-libs` existe e você tem permissão para publicar nele.

## 📚 Links Úteis

- [NPM Access Tokens](https://docs.npmjs.com/about-access-tokens)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [NPM Publishing](https://docs.npmjs.com/cli/v8/commands/npm-publish)

---

**Nota:** Este documento faz parte da configuração de CI/CD do projeto NestJS Libraries.