# 🎨 **Locators Semânticos - Estratégias do Projeto**

> **🚨 CONSULTE ESTE ARQUIVO AO ESCOLHER ESTRATÉGIA DE LOCATOR**

## 🎭 **SEMPRE CONSULTAR PLAYWRIGHT DOCS PRIMEIRO**

> **⚠️ Documentação oficial obrigatória:**
>
> - **Locators Guide:** https://playwright.dev/docs/locators
> - **Auto-waiting:** https://playwright.dev/docs/actionability
> - **Strict Mode:** https://playwright.dev/docs/locators#strictness

**Este módulo:** Estratégias específicas para componentes do projeto (PrimeNG, menus dinâmicos, strict mode).

---

## 📋 **Ordem de Prioridade (Reforçando Playwright)**

> **🚨 REGRA ABSOLUTA: SEMPRE seguir esta ordem. Data attributes de teste (data-cy, data-testid) são para Cypress/outras ferramentas, NÃO para Playwright.**

| Prioridade | Localizador | Quando Usar | ❌ NÃO Use |
|-----------|-------------|-------------|-----------|
| **1** | `getByRole()` | **SEMPRE que possível**. Para elementos com papel claro de Acessibilidade (botões, links, headings, etc.). Mais resiliente a mudanças no DOM. | ❌ `getByTestId('action-button')` |
| **2** | Encadeamento / `.filter()` | **Para precisão e performance**. Refina busca após localizador estável. Ex: `getByRole('list').filter({hasText: 'Ativo'})` | ❌ `locator('[data-cy="..."]')` |
| **3** | `getByLabel()` / `getByPlaceholder()` | **Para Inputs**. Campos de formulário com `<label>` ou `placeholder` visível. | ❌ `locator('#input-id')` |
| **4** | `getByText()` | **Para conteúdo de texto**. Spans, parágrafos ou texto visível. Use **Regex** para resiliência. | ❌ `locator('.text-class')` |
| **5** | `getByAltText()` / `getByTitle()` | **Para elementos visuais/ícones**. Imagens (`alt`) ou botões/ícones com `title` ou `aria-label`. | ❌ `locator('img')` |
| **6** | `locator('[attr=value]')` | **Fallback de Atributo Estável**. Quando semânticos falham, use atributo estático: `[name="user-form"]`, `[value="123"]`. **NUNCA data-cy ou data-testid** | ❌ `locator('[data-*]')` |
| **7** | `locator('#ID')` / `locator('.class')` | **Fallback de Implementação**. **Último recurso**. IDs podem ser dinâmicos, classes mudam com estilização. | ❌ `locator('[id*="dynamic"]')` |

### **🚫 PROIBIDO: Data Attributes de Teste**

```javascript
// ❌ COMPLETAMENTE ERRADO (Cypress/outras ferramentas)
page.getByTestId('action-button')
page.locator('[data-cy="action-button"]')
page.locator('[data-testid="submit"]')
```

```javascript
// ✅ CORRETO (Playwright semântico)
page.getByRole('button', { name: 'Ações' })
page.getByRole('button', { name: 'Submit' })
```

**Por quê?**
- `data-cy`, `data-testid` são para **Cypress e outras ferramentas**
- Playwright prioriza **acessibilidade** (getByRole, getByText, etc.)
- Locators semânticos são mais **resilientes e mantíveis**

### **Notas Importantes**

- ⚠️ **`<a>` em menus dinâmicos sem `href`** → Use `getByText()` ou `locator().filter()`
- ⚠️ **NUNCA use `getByRole('columnheader')`** para cabeçalhos de tabela
- ⚠️ Use `exact: true` quando necessário para garantir correspondência exata

---

## 🔧 **Expressões Regulares para Conteúdo Dinâmico**

### **Contadores**

```javascript
this.locatorTabComContadorLink = this.frame.getByRole('link', { name: /{Texto} \(\d+\)/ });
```

### **Datas**

```javascript
this.locatorDataText = this.frame.getByText(/\d{2}\/\d{2}\/\d{4}/);
```

### **Valores Monetários**

```javascript
this.locatorValorText = this.frame.getByText(/R\$ \d+,\d{2}/);
```

---

## 📊 **Validação de Tabelas**

### **Padrão de Implementação**

```javascript
// Âncora da tabela
this.locatorRegistrosTable = this.frame.getByRole('table');
this.locatorCabecalhoRow = this.locatorRegistrosTable.locator('thead tr');

// Primeira linha (mais comum em Abre Telas)
this.locatorPrimeiraLinhaRow = this.locatorRegistrosTable.locator('tbody tr').first();

// Elementos na linha baseados no HTML real
this.locatorElementoLinhaGeneric = this.locatorPrimeiraLinhaRow.getByRole('{role}', { name: '{nome}' });
// ou
this.locatorElementoLinhaGeneric = this.locatorPrimeiraLinhaRow.locator('{seletor}').filter({ hasText: '{texto}' });
```

---

## 🚫 **Tratamento de IDs Dinâmicos**

### **IDs Instáveis (NUNCA USE)**

❌ **Evitar:**
- `#ui-panel-{número}-label`
- `#s-button-{número}`
- `#dialog-{timestamp}`

### **Alternativas Estáveis (USE)**

```javascript
// Com âncora
this.locatorContainerInput = this.frame.getByRole('{role}', { name: '{nome}' });
this.locatorElementoInput = this.locatorContainerInput.getByRole('{role}');
this.locatorElementoAninhadoInput = this.frame.getByLabel('{label}').getByText('{texto}');

// Com atributos de estado
this.locatorAtivoInput = this.frame.getByRole('{role}', { expanded: true });
// Com filtros
this.locatorFiltradoInput = this.frame.getByRole('{role}').filter({ hasText: '{texto}' });
```

---

## 🎯 **Estratégias de Resolução para Strict Mode Violations**

### **Problema**

Múltiplos elementos correspondem ao mesmo locator (ex: `name: ''`, tabs sem identificadores únicos).

### **Soluções**

#### **1. Hierarquia de Containers**

```javascript
// Identifique containers únicos primeiro
this.locatorSecaoConfigRegion = this.frame.getByRole('region', { name: 'Configuração' });
this.locatorConfigTab = this.locatorSecaoConfigRegion.getByRole('tab');
```

#### **2. Atributos de Estado**

```javascript
this.locatorAtivaTab = this.frame.getByRole('tab', { expanded: true });
this.locatorsInativasTab = this.frame.getByRole('tab', { expanded: false });
```

#### **3. Filtros por Conteúdo**

```javascript
this.locatorComTextoTab = this.frame.getByRole('tab').filter({ hasText: 'Configurações' });
this.locatorComIconeTab = this.frame.getByRole('tab').filter({ has: this.frame.locator('.icon') });
```

#### **4. Combinação de Estratégias**

```javascript
this.locatorPainelPrincipalMain = this.frame.getByRole('main');
this.locatorAtivaTab = this.locatorPainelPrincipalMain
  .getByRole('tab', { expanded: true })
  .filter({ hasText: 'Config' });
```

---

## ⚠️ **Componentes de Menu (p-tieredmenu, p-menu)**

### **Problema**

`getByRole('link')` não funciona em menus dinâmicos (`<a>` sem `href`).

### **Solução**

```javascript
// ❌ INCORRETO - Falha em menus dinâmicos
this.locatorMenuItemLink = this.frame.getByRole('link', { name: '{Item Menu}' });
```

```javascript
// ✅ CORRETO - Opção 1: getByText
this.locatorMenuItemText = this.frame.getByText('{Item Menu}', { exact: true });

// ✅ CORRETO - Opção 2: locator + filter
this.locatorMenuItemLink = this.frame.locator('a').filter({ hasText: '{Item Menu}' });
```

**Identificação:** HTML contém `<p-tieredmenu>`, `<p-menu>`, ou `<a>` sem atributo `href`.

---

## 🔄 **Tratamento de Try/Catch**

### **Para ações de negócio com elementos dinâmicos**

```javascript
/**
 * Exclui registro selecionado com recuperação automática
 */
async excluirRegistro() {
  try {
    await this.locatorAcoesButton.click({ force: true });
    await this.locatorExcluirLink.click({ force: true });
  } catch {
    await this.locatorAcoesButton.click({ force: true });
    await this.locatorExcluirLink.click({ force: true });
  }

  await this.locatorConfirmarExclusaoButton.click();
  await expect(this.locatorMensagemSucessoAlert).toBeVisible();
}
```

---

## ✅ **Checklist Final**

- [ ] Localizadores seguem ordem de prioridade (1-7)?
- [ ] Cabeçalhos usam `getByRole('heading')`?
- [ ] Botões usam `getByRole('button')`?
- [ ] Menus dinâmicos usam `getByText()` ou `locator().filter()`?
- [ ] Âncoras usadas para elementos múltiplos?
- [ ] `exact: true` usado quando necessário?
- [ ] **NUNCA** `getByRole('columnheader')`?
- [ ] Ausência de strict mode violations confirmada?
- [ ] IDs dinâmicos evitados?

---

> **💡 Priorize localizadores semânticos (getByRole, getByLabel) sobre seletores CSS/ID.**
