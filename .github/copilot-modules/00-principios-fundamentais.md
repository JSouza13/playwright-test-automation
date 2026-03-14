# 🎯 **Princípios Fundamentais - Leia Primeiro**

> **Módulo 00:** Filosofia de uso das instruções + Referências obrigatórias

---

## 🎭 **DOCUMENTAÇÃO PLAYWRIGHT - SEMPRE CONSULTAR**

> **⚠️ REGRA ABSOLUTA:** As instruções deste projeto **complementam** a documentação oficial do Playwright, não a substituem.

### **📚 Referências Obrigatórias**

| Tópico | Link | Quando Consultar |
|--------|------|------------------|
| **Locators** | https://playwright.dev/docs/locators | Antes de criar qualquer locator |
| **Best Practices** | https://playwright.dev/docs/best-practices | Antes de qualquer implementação |
| **Assertions** | https://playwright.dev/docs/test-assertions | Ao validar elementos ou estados |
| **Auto-waiting** | https://playwright.dev/docs/actionability | Ao trabalhar com timeouts/waits |
| **Writing Tests** | https://playwright.dev/docs/writing-tests | Antes de criar arquivos .spec.js |
| **Page Object Model** | https://playwright.dev/docs/pom | Antes de criar Page Objects |

---

## 🧠 **Filosofia das Instruções**

### **O QUE ESTÁ NAS INSTRUÇÕES:**

✅ **Decisões arquiteturais do projeto:**
- Idioma português para nomenclatura
- Estrutura de diretórios e arquivos
- Padrão AAA com comentários específicos
- Convenções de instanciação (helpers/index.js)
- Tags e annotations específicas do projeto

✅ **Regras específicas do contexto:**
- Componentes PrimeNG customizados
- Estratégias de desambiguação do projeto
- Padrões de JSON e dados de teste
- Integração com coverageFeatureMap.yml

### **O QUE NÃO ESTÁ (consulte Playwright):**

❌ **Fundamentos do Playwright:**
- Como criar locators (getByRole, getByText, etc.)
- Ordem de prioridade de locators
- Como usar assertions (toBeVisible, toHaveText, etc.)
- Auto-waiting e actionability
- Estrutura de testes (describe, test, beforeEach)

---

## 🎯 **Como Usar as Instruções**

### **PASSO 1: Entender o Problema**
- Identificar o tipo de tarefa (criar Page, criar teste, etc.)

### **PASSO 2: Consultar Playwright Docs**
- Ler seção relevante da documentação oficial
- Entender best practices do Playwright

### **PASSO 3: Consultar Módulo Específico**
- Encontrar decisões do projeto aplicáveis
- Verificar templates e exemplos

### **PASSO 4: Aplicar Clean Code + SOLID**
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- Single Responsibility

### **PASSO 5: Validar**
- ESLint passou?
- Imports corretos?
- Seguiu padrões do projeto?
- Consultou Playwright docs?

---

## ✅ **Checklist de Autonomia**

Antes de implementar, pergunte:

- [ ] **Li a documentação do Playwright** sobre o tópico?
- [ ] **Entendi as best practices** oficiais?
- [ ] **Identifiquei decisões específicas** do projeto?
- [ ] **Apliquei Clean Code** e princípios SOLID?
- [ ] **Validei com grep_search** (imports)?

---

## 🚫 **Anti-Padrões Críticos**

### **❌ Dependência Excessiva:**

```javascript
// ❌ ERRADO - Seguir template cegamente
await this.locators.botao.waitFor({ state: 'visible' }); // Playwright usa expect()
```

```javascript
// ✅ CORRETO - Consultar Playwright best practices
await expect(this.locatorConfirmarButton).toBeVisible(); // Assertion correta
```

### **❌ Micro-Gerenciamento:**

```markdown
❌ Instruções: "Use expect().toBeVisible() para validar visibilidade"
✅ Melhor: "Consulte Playwright assertions docs para validações"
```

### **❌ Ignorar Documentação Oficial:**

```javascript
// ❌ ERRADO - Criar locator sem consultar docs
this.locatorGenericDiv = this.page.locator('.classe-complexa[attr="valor"]');
```

```javascript
// ✅ CORRETO - Prioridade Playwright: getByRole > getByText > getByLabel
this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
```

---

## 💡 **Princípio de Ouro**

> **"As instruções do projeto definem O QUE fazer (decisões arquiteturais).**
> **A documentação do Playwright define COMO fazer (implementação técnica)."**

**Exemplo:**

- **Instrução (O QUE):** "Métodos em português, locators diretos no constructor"
- **Playwright (COMO):** "Use getByRole() com prioridade, expect() para assertions"

---

## 🎓 **Responsabilidade da IA**

1. **Consultar Playwright docs** antes de decidir implementação técnica
2. **Seguir best practices** oficiais (locators, assertions, waits)
3. **Aplicar decisões do projeto** (idioma, estrutura, convenções)
4. **Usar Clean Code** e princípios de engenharia
5. **Validar autonomamente** (ESLint, imports, fluxo)

---

## 🔗 **Hierarquia de Prioridades**

```
┌─────────────────────────────────────────┐
│  1. Playwright Best Practices          │
│  (Documentação oficial - COMO fazer)   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. Clean Code + SOLID                  │
│  (Engenharia de software universal)     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. Instruções do Projeto               │
│  (Decisões específicas - O QUE fazer)   │
└─────────────────────────────────────────┘
```

**Em caso de dúvida:**
- **Técnica de implementação?** → Playwright docs
- **Convenção do projeto?** → Módulos de instruções
- **Qualidade de código?** → Clean Code + SOLID

---

## 🚀 **Conclusão**

**Este projeto confia na sua capacidade de:**
1. Ler e interpretar documentação técnica (Playwright)
2. Aplicar boas práticas de engenharia (Clean Code)
3. Adaptar ao contexto específico (instruções do projeto)

**Não siga instruções cegamente. Pense, consulte, decida.**
