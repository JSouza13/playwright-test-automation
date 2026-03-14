# 📋 Informações Gerais do Teste

- **Nº Roteiro:** 01
- **Nr issue Jira:** XXXX
- **Tipo:** Teste de cadastro
- **Nome:** Cadastro de usuário
- **Data Criação:** 29/10/2025
- **Descrição:** Teste de cadastro de usuário

---

## 🤖 **INSTRUÇÕES PARA A IA - EVITAR TIMEOUT**

> **🚨 IMPORTANTE:**
>
> - **Siga o workflow** definido em `.github/copilot-instructions.md` (ler módulos, criar TODO, analisar, implementar)
> - **Comando inicial obrigatório no Playwright CLI:** `playwright-cli open https://front.serverest.dev/login`
> - **Após o comando inicial, seguir as ações do cenário no contexto aberto pelo Playwright CLI**

- [ ] Deverá reaproveitar os recursos já existentes no projeto sempre que possível, evitando a criação de novos métodos desnecessários.

---

## 🏗️ **Estrutura de Arquivos Necessários**

### **📁 Arquivos a Criar**

- **Teste:** `tests\cadastro\usuario.spec.js`
- **Page Object:** `pages\usuarioPage.js`
- **Dados JSON:** `data\cadastro\usuarioJson.js`

### **📁 Arquivos a Atualizar** sem remover código

- **Coverage:** `coverageFeatureMap.yml`
- **Helpers:** `helpers/index.js`

---

## **1. 🖥️ Criar JSONs completos sem omitir dados**

**JSONs Necessários:**

```javascript
import { fakerPT_BR as faker } from '@faker-js/faker';

// Gera dados diferentes a cada execução do teste
export const JSON_CADASTROUSUARIO = {
  nome: faker.person.fullName(),
  email: `qa_${Date.now()}_${faker.string.alphanumeric(6)}@mailinator.com`.toLowerCase(),
  senha: faker.internet.password({
    length: 12,
    memorable: false,
    pattern: /[A-Za-z0-9!@#$%]/,
  }),
};
```

## **1. 🛣️ Implementação do Cenário 01 - Testa o CRUD principal de negócio**

### **1. 🖥️ Acessar a tela**

- **Ações:**
  - **Referência Page:** `pages\usuarioPage.js`
    - **Ação:** Acessar `https://front.serverest.dev/login`.
    - Validar `Login` está visível.

### **2. 🖥️ Cadastrar usuario**

- **Ações:**
  - **Referência Page:** `pages\usuarioPage.js`
    - **Ação:** Executar o metodo `usuarioPage.acessarTela(USUARIO.URL)`.
    - **Ação:** Clicar em `Cadastre-se`.
    - **Validação:** Validar `Cadastro` está visível.
    - **Ação:** Preencher `Digite seu nome` com `JSON_CADASTROUSUARIO.nome`.
    - **Ação:** Preencher `Digite seu email` com `JSON_CADASTROUSUARIO.email`.
    - **Ação:** Preencher `Digite sua senha` com `JSON_CADASTROUSUARIO.senha`.
    - **Ação:** Clicar em `Cadastrar`.
    - **Validação:** Validar `Logout` está visível.

---

## ✅ **Checklist de Validação**

- [ ] Todas as regras de implementação seguidas
