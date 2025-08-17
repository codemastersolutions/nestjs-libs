# Contribuindo para NestJS Libs

**📖 Choose your language / Escolha seu idioma / Elige tu idioma:**

- [🇺🇸 English](CONTRIBUTING.md)
- [🇧🇷 Português](CONTRIBUTING.pt-BR.md)
- [🇪🇸 Español](CONTRIBUTING.es.md)

---

Damos as boas-vindas às contribuições para o monorepo `nestjs-libs`! Este documento fornece diretrizes e informações para contribuidores trabalhando em qualquer uma de nossas bibliotecas NestJS.

## Índice

- [Código de Conduta](#código-de-conduta)
- [Primeiros Passos](#primeiros-passos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Testes](#testes)
- [Documentação](#documentação)
- [Processo de Pull Request](#processo-de-pull-request)
- [Relatório de Issues](#relatório-de-issues)
- [Processo de Release](#processo-de-release)

## Código de Conduta

Ao participar deste projeto, você concorda em seguir nosso Código de Conduta. Por favor, seja respeitoso e construtivo em todas as interações.

## Primeiros Passos

### Pré-requisitos

- Node.js 18+ e pnpm
- Git
- Conhecimento básico de NestJS e TypeScript
- Compreensão da biblioteca específica que você deseja contribuir

### Fork e Clone

1. Faça um fork do repositório no GitHub
2. Clone seu fork localmente:
   ```bash
   git clone https://github.com/SEU_USUARIO/nestjs-libs.git
   cd nestjs-libs
   ```

## Configuração do Ambiente

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Navegue para a biblioteca específica que você deseja trabalhar:

   ```bash
   cd libs/<nome-da-biblioteca>
   ```

3. Execute os testes para garantir que tudo está funcionando:

   ```bash
   pnpm test
   ```

4. Faça o build da biblioteca:
   ```bash
   pnpm run build
   ```

## Estrutura do Projeto

```
nestjs-libs/
├── .github/                        # Workflows e templates do GitHub
├── libs/                           # Todas as bibliotecas NestJS
│   └── <nome-da-biblioteca>/
│       ├── src/
│       │   ├── *.constants.ts      # Constantes e tokens
│       │   ├── *.module.ts         # Definição do módulo NestJS
│       │   ├── *.service.ts        # Implementações de serviços
│       │   ├── *.types.ts          # Interfaces TypeScript
│       │   └── index.ts            # Exportações da API pública
│       ├── *.spec.ts               # Testes unitários
│       ├── jest.config.cjs         # Configuração do Jest
│       ├── package.json            # Configuração do pacote
│       ├── tsconfig.*.json         # Configurações do TypeScript
│       └── README*.md              # Documentação da biblioteca
├── scripts/                        # Scripts de build e gerenciamento
├── src/                           # Aplicações de exemplo
├── package.json                    # Configuração do pacote raiz
└── pnpm-workspace.yaml            # Configuração do workspace
```

## Fluxo de Desenvolvimento

### Nomenclatura de Branches

Use nomes descritivos para branches:

- `feature/<nome-da-biblioteca>/add-oauth-support`
- `fix/<nome-da-biblioteca>/middleware-cors-issue`
- `docs/<nome-da-biblioteca>/update-readme`
- `refactor/<nome-da-biblioteca>/service-cleanup`

### Mensagens de Commit

Siga o formato de commits convencionais:

```
type(scope): description

[optional body]

[optional footer]
```

Exemplos:

- `feat(better-auth): add session validation method`
- `fix(better-auth): resolve CORS configuration issue`
- `docs(better-auth): update installation instructions`
- `test(better-auth): add unit tests for auth methods`

### Tipos:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Mudanças de estilo de código (formatação, etc.)
- `refactor`: Refatoração de código
- `test`: Adição ou atualização de testes
- `chore`: Tarefas de manutenção

## Padrões de Código

### TypeScript

- Use configuração estrita do TypeScript
- Prefira interfaces em vez de types para formas de objetos
- Use modificadores de acesso apropriados (`private`, `protected`, `public`)
- documente APIs públicas com comentários JSDoc

### Estilo de Código

- Siga o estilo de código existente (configuração do Prettier)
- Use nomes significativos para variáveis e funções
- Mantenha funções pequenas e focadas
- Prefira composição em vez de herança

### Exemplo de Estilo de Código:

```typescript
/**
 * Manipula requisições de serviço para integração com biblioteca
 * @param request - A requisição recebida
 * @returns Promise que resolve para a resposta do serviço
 */
async handleRequest(request: ServiceRequest): Promise<ServiceResponse> {
  // Validar entrada
  if (!this.isValidRequest(request)) {
    throw new BadRequestException('Requisição de serviço inválida');
  }

  // Processar requisição
  return this.processRequest(request);
}
```

## Testes

### Testes Unitários

- Escreva testes unitários para toda nova funcionalidade
- Mantenha pelo menos 80% de cobertura de código
- Use nomes descritivos para testes
- Siga o padrão AAA (Arrange, Act, Assert)

### Estrutura de Teste:

```typescript
describe('LibraryService', () => {
  describe('handleRequest', () => {
    it('deve processar com sucesso uma requisição de serviço válida', async () => {
      // Arrange
      const mockRequest = createMockRequest();
      const expectedResponse = createExpectedResponse();

      // Act
      const result = await service.handleRequest(mockRequest);

      // Assert
      expect(result).toEqual(expectedResponse);
    });
  });
});
```

### Executando Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com cobertura
pnpm test:cov

# Executar arquivo de teste específico
pnpm test <nome-da-biblioteca>.service.spec.ts
```

## Documentação

### Documentação de Código

- Documente todas as APIs públicas com JSDoc
- Inclua descrições de parâmetros e tipos de retorno
- Adicione exemplos de uso para funcionalidades complexas

### Atualizações do README

- Atualize todas as versões de idioma (EN, PT-BR, ES)
- Inclua novas funcionalidades nos exemplos
- Atualize opções de configuração
- Adicione informações de solução de problemas se necessário

## Processo de Pull Request

### Antes de Enviar

1. **Teste suas mudanças:**

   ```bash
   pnpm test
   pnpm run build
   ```

2. **Verifique o estilo do código:**

   ```bash
   pnpm run lint
   pnpm run format
   ```

3. **Atualize a documentação** se necessário

4. **Adicione testes** para nova funcionalidade

### Diretrizes do PR

1. **Título:** Use títulos claros e descritivos
2. **Descrição:** Explique quais mudanças foram feitas e por quê
3. **Testes:** Descreva como as mudanças foram testadas
4. **Breaking Changes:** Marque claramente qualquer mudança que quebra compatibilidade
5. **Documentação:** Note qualquer atualização de documentação

### Template do PR

```markdown
## Descrição

Breve descrição das mudanças

## Tipo de Mudança

- [ ] Correção de bug
- [ ] Nova funcionalidade
- [ ] Mudança que quebra compatibilidade
- [ ] Atualização de documentação

## Testes

- [ ] Testes unitários passam
- [ ] Testes de integração passam
- [ ] Testes manuais completados

## Checklist

- [ ] Código segue as diretrizes de estilo do projeto
- [ ] Auto-revisão completada
- [ ] Documentação atualizada
- [ ] Testes adicionados/atualizados
```

## Relatório de Issues

### Relatórios de Bug

Inclua:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs comportamento atual
- Detalhes do ambiente (versão do Node.js, versão do NestJS, etc.)
- Exemplos de código se aplicável

### Solicitações de Funcionalidade

Inclua:

- Descrição clara da funcionalidade proposta
- Caso de uso e motivação
- Possível abordagem de implementação
- Exemplos de como seria usado

## Processo de Release

A biblioteca usa releases automatizados:

1. **Desenvolvimento:** Trabalhe em branches de funcionalidade
2. **Pull Request:** Envie PR para a branch `main`
3. **Revisão:** Revisão de código e aprovação
4. **Merge:** Merge do PR dispara build e release automatizados
5. **Versionamento:** Versionamento semântico baseado em mensagens de commit

### Incremento de Versão

- `feat:` → Incremento de versão menor
- `fix:` → Incremento de patch
- `BREAKING CHANGE:` → Incremento de versão maior

## Obtendo Ajuda

- **Documentação:** Verifique os arquivos README
- **Issues:** Pesquise issues existentes no GitHub
- **Discussões:** Use GitHub Discussions para perguntas
- **Documentação da Biblioteca:** Consulte o README e documentação da biblioteca específica

## Reconhecimento

Contribuidores são reconhecidos em:

- Lista de contribuidores do GitHub
- Notas de release para contribuições significativas
- Campo contributors do package.json

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a Licença MIT.

---

Obrigado por contribuir para `nestjs-libs`! 🚀
