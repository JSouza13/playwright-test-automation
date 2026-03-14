# Objetivo

Entregar uma base de testes automatizados pronta para crescimento, com foco em:

- confiabilidade de execução
- manutenção simples (POM + dados separados)
- padronização de código e revisão
- leitura rápida para times técnicos e recrutadores

## Stack Principal

- **Linguagem:** JavaScript (ESM)
- **Framework de teste:** Playwright Test
- **Arquitetura:** Page Object Model (POM)
- **Dados dinâmicos:** Faker (`@faker-js/faker`)
- **API support:** Axios + camada `Api`
- **Qualidade estática:** ESLint + Prettier + SonarJS + JSDoc + plugin Playwright
- **Report:** Smart Reporter + JUnit XML
- **Configuração de ambiente:** Dotenv

## Arquitetura do Projeto

```text
api/               # Camada de APIs e utilitários de request
data/              # Massas de teste versionadas por domínio
helpers/           # Fixtures customizadas, ambiente e navegação
pages/             # Page Objects (encapsulamento de ações e validações)
tests/             # Cenários automatizados (AAA)
utils/             # Logger e utilitários transversais
coverageFeatureMap.yml  # Mapeamento funcional de cobertura
```

## Conceitos e Soluções Aplicadas

### 1) Testes orientados a legibilidade e manutenção

- Padrão **Arrange / Act / Assert** nos cenários
- Reuso de ações por meio de **Page Objects**
- Separação clara entre teste, dados e interação de UI

### 2) Dados de teste resilientes

- Massa de cadastro com dados únicos em runtime (nome, e-mail, senha)
- Redução de flakiness causada por colisão de dados

### 3) Extensão de fixtures do Playwright

- Contexto de `page` estendido com pages customizadas
- Contexto de `request` estendido com serviços de API
- Menor acoplamento e testes mais expressivos

### 4) Qualidade de engenharia no dia a dia

- Regras de lint robustas (Playwright, Sonar, JSDoc, estilo)
- Checklist de Merge Request orientado a qualidade
- Convenções de nomenclatura e organização por responsabilidade

### 5) Observabilidade e rastreabilidade

- Logs centralizados para execução de testes
- Relatórios HTML/JUnit para análise local e integração em pipeline
- Feature map para cálculo de cobertura funcional

## Cenário Automatizado exemplo

Fluxo de **cadastro de usuário** com validações de ponta a ponta:

1. acesso à tela de login
2. navegação para cadastro
3. preenchimento de formulário com dados dinâmicos
4. submissão e validação de sucesso (usuário autenticado)

## Como Executar

### Pré-requisitos

- Node.js 20+
- npm 10+

### Setup

```bash
npm install
```

### Qualidade estática

```bash
npm run eslint
npm run eslint-fix
```

### Executar testes

```bash
npx playwright test
```
