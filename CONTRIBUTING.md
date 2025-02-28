# Guia de Contribuição

Obrigado por considerar contribuir com o Gestly! Este documento fornece diretrizes e melhores práticas para contribuir com o projeto.

## Código de Conduta

Este projeto segue um Código de Conduta. Ao participar, você concorda em seguir suas diretrizes.

## Como Contribuir

1. Fork o repositório
2. Clone seu fork: `git clone https://github.com/seu-usuario/gestly.git`
3. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
4. Faça suas alterações
5. Execute os testes: `npm run test`
6. Commit suas mudanças: `git commit -m 'feat: add nova funcionalidade'`
7. Push para sua branch: `git push origin feature/nome-da-feature`
8. Abra um Pull Request

## Padrões de Código

### Commits

Usamos commits semânticos seguindo o padrão:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção

### TypeScript

- Use tipos explícitos
- Evite `any`
- Documente funções complexas
- Mantenha interfaces e types em arquivos separados

### React

- Use componentes funcionais
- Prefira hooks personalizados para lógica reutilizável
- Mantenha componentes pequenos e focados
- Use prop-types ou TypeScript para props

### Testes

- Escreva testes para novas funcionalidades
- Mantenha cobertura de testes acima de 80%
- Use mocks apropriadamente
- Teste casos de erro

## Processo de Review

1. Dois aprovadores são necessários
2. CI deve passar
3. Documentação deve ser atualizada
4. Código deve seguir padrões do projeto

## Reportando Bugs

Use o template de issue para bugs:

```markdown
**Descrição**
Descrição clara e concisa do bug.

**Para Reproduzir**
Passos para reproduzir o comportamento:
1. Vá para '...'
2. Clique em '....'
3. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [ex: Windows]
- Browser: [ex: Chrome 88]
- Versão: [ex: 22]
```

## Sugerindo Melhorias

Use o template de feature request:

```markdown
**Problema Relacionado**
Descrição clara do problema que sua feature resolve.

**Solução Proposta**
Descrição da solução que você propõe.

**Alternativas Consideradas**
Outras soluções que você considerou.

**Contexto Adicional**
Qualquer outro contexto ou screenshots.
```

## Setup de Desenvolvimento

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Execute as migrations:
```bash
npm run migrate
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
gestly/
├── src/
│   ├── components/     # Componentes React
│   ├── lib/           # Funções utilitárias
│   ├── pages/         # Páginas da aplicação
│   └── types/         # Tipos TypeScript
├── packages/
│   ├── api/          # API REST
│   └── auth/         # Autenticação
├── migrations/       # Migrations do banco
└── docs/            # Documentação
```

## Recursos Úteis

- [Documentação da API](docs/api.md)
- [Guia de Estilo](docs/style-guide.md)
- [Arquitetura](docs/architecture.md)

## Dúvidas?

- Abra uma issue
- Entre em contato: support@gestly.co