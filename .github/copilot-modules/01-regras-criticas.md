# 🚨 **REGRAS CRÍTICAS DE PRIORIDADE MÁXIMA**

> **⚠️ ESTE MÓDULO TEM PRECEDÊNCIA ABSOLUTA**
>
> **📌 Hierarquia:** Playwright Docs > Módulo 00 > Módulo 01 > Módulos 02-08 > Arquivo Principal
> **📌 LEIA ESTE ARQUIVO COMPLETAMENTE ANTES DE QUALQUER IMPLEMENTAÇÃO**
> **📌 Em caso de conflito com outras instruções: ESTE MÓDULO SEMPRE PREVALECE**

---

## **🎯 7 REGRAS FUNDAMENTAIS**

> **⚠️ LEIA TODAS AS 7 REGRAS ANTES DE QUALQUER IMPLEMENTAÇÃO**

### **REGRA #0: SEMPRE Consultar Playwright Docs Primeiro**

**ANTES de qualquer decisão de implementação:**

1. Consultar documentação oficial: https://playwright.dev/docs/intro
2. Para locators: https://playwright.dev/docs/locators
3. Para assertions: https://playwright.dev/docs/test-assertions
4. Para best practices: https://playwright.dev/docs/best-practices

**As instruções do projeto complementam (não substituem) o Playwright.**

---

### **REGRA #1: TODOS os Locators Estáticos NO CONSTRUCTOR (SEMPRE)**

**🚨 REGRA ABSOLUTA - SEM EXCEÇÕES:**

**ANTES de criar qualquer método em Page Object:**

1. **Identificar TODOS os locators estáticos que o método usará**
2. **Criar TODOS no constructor ANTES de implementar o método**

**DEFINIÇÃO DE "LOCATOR ESTÁTICO":**
- Qualquer `getByText()`, `getByRole()`, `locator()` com **string literal** (texto fixo entre aspas)
- Qualquer ID, Class ou CSS selector usado como **string literal** (`'#id'`, `'.class'`, `'div.class'`)
- Qualquer locator-base usado para `.filter()` ou `.locator()` aninhado

**✅ OBRIGATÓRIO no Constructor:**

```javascript
constructor(page) {
  // ✅ IDs/Classes/CSS SEMPRE com símbolo
  this.ID_ORIGEM_NEGOCIO = '#businessOrigin';
  this.ID_TIPO_NEGOCIO = '#businessType';
  this.CLASS_KANBAN_CARD = '.kanban-card-title';

  // ✅ Locators com strings literais
  this.locatorDataFechamentoText = this.page.getByText('Data de Fechamento -');
  this.locatorValorEstimadoText = this.page.getByText('Valor Estimado R$0,00');

  // ✅ Locators-base para aninhamento
  this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title');
}
```

**❌ PROIBIDO nos Métodos:**

```javascript
async validarDados() {
  // ❌ PROIBIDO - String literal fora do constructor
  await expect(this.page.getByText('Data de Fechamento -')).toBeVisible();

  // ❌ PROIBIDO - ID inline sem constructor
  await this.formUtils.fillFieldPDropdown('#businessOrigin', dados.origem);

  // ❌ PROIBIDO - Locator-base inline
  const locator = this.page.locator('.kanban-card-title').filter({ hasText: dados.descricao });
}
```

**Motivo:** Centralizar TODOS os seletores no constructor facilita manutenção e previne duplicação.

---

### **REGRA #2: Aplicar Locators Semânticos com Prioridade Playwright (SEMPRE)**

**ANTES de criar qualquer locator:**

1. Identificar elemento no HTML com `grep_search`
2. Ler contexto com `read_file` (mínimo 15 linhas antes/depois)
3. Aplicar ordem de prioridade oficial do Playwright: `getByRole > getByText > getByLabel > locator`
4. Usar localizador semântico sempre que aplicável
5. Documentar estratégia de desambiguação quando houver ambiguidade

**Arquivo:** `.github/copilot-modules/03-locators-semanticos.md`

---

### **REGRA #3: Executar Fluxo no Playwright CLI (SEMPRE)**

**ANTES de criar qualquer locator:**

**🚨 EXECUTAR FLUXO FUNCIONAL E CAPTURAR SNAPSHOTS:**

1. Executar `playwright-cli open {url}` no contexto do cenário
2. Capturar snapshot inicial antes das interações
3. Executar ações críticas do fluxo
4. Capturar snapshots intermediários e final
5. Documentar ambiguidades de interação observadas e estratégia adotada no locator final

**DOCUMENTAR:** "Fluxo executado com snapshots. Ajustes de locator aplicados: [estratégia + justificativa]"

---

### **REGRA #4: NUNCA Usar Timeout Customizado**

**EM QUALQUER expect ou ação:**

- ❌ **PROIBIDO:** `.toBeVisible({ timeout: 10000 })`
- ❌ **PROIBIDO:** `.toBeHidden({ timeout: 5000 })`
- ❌ **PROIBIDO:** `.click({ timeout: 3000 })`
- ❌ **PROIBIDO:** Qualquer uso de `{ timeout: X }`
- ✅ **CORRETO:** Usar timeout padrão do `playwright.config.js` (30s)

**Motivo:** Timeout customizado mascara problemas estruturais (seletores lentos, waits incorretos, flakiness). O timeout padrão de 30s do projeto é suficiente para todos os casos.

**Arquivo:** `.github/copilot-modules/05-page-objects.md` (seção "Timeout Personalizado")

---

### **REGRA #5: Validar Presença de iframe (SEMPRE)**

**ANTES de criar constructor do Page Object:**

1. Executar: `grep_search(query="<iframe", includePattern="{arquivo}.html", isRegexp=false)`
2. **SE encontrar `<iframe`:**
   - Constructor usa: `this.frame = this.page.frameLocator('iframe[name="ci"]');`
   - FormUtils usa: `new FormUtils(this.frame)`
   - TODOS os locators usam: `this.frame.getByRole(...)`, `this.frame.getByLabel(...)`
3. **SE NÃO encontrar `<iframe`:**
   - Constructor usa apenas: `this.page = page;`
   - FormUtils usa: `new FormUtils(this.page)`
   - TODOS os locators usam: `this.page.getByRole(...)`, `this.page.getByLabel(...)`
4. **NUNCA misturar:** Usar `this.frame` em alguns locators e `this.page` em outros

**Arquivo:** `.github/copilot-modules/01-regras-criticas.md` + `.github/copilot-modules/05-page-objects.md`

---

### **REGRA #6: Validar TODOS os Imports ANTES de Finalizar (OBRIGATÓRIO)**

**APÓS criar/modificar QUALQUER arquivo (.spec.js, Page.js, Api.js, .json):**

1. **EXECUTAR validação de runtime** imediatamente após criar/modificar
2. **CORRIGIR 100% dos erros** antes de marcar implementação como completa
3. **NUNCA finalizar** com erros de import/module not found

**VALIDAÇÃO OBRIGATÓRIA:**

Para arquivos `.spec.js` (detecta erros de runtime):

```bash
npx playwright test {caminho/arquivo.spec.js} --list
```

Para outros arquivos (Page.js, Api.js):

```bash
get_errors(filePaths=["{caminho/arquivo}"])
```

**ERROS COMUNS A CORRIGIR:**

❌ **Import sem extensão `.js`:**

```javascript
import { test } from '../../../helpers'; // ❌ ERRO: Cannot find module
```

✅ **Import com extensão explícita:**

```javascript
import { test } from '../../../helpers/index.js'; // ✅ CORRETO
```

❌ **Caminho relativo com níveis incorretos:**

```javascript
// Arquivo: tests/jornadas/crmx/negocio.spec.js
import { test } from '../../helpers/index.js'; // ❌ ERRO: 2 níveis (deveria ser 3)
```

✅ **Caminho relativo correto (calcular níveis):**

```javascript
// Arquivo: tests/jornadas/crmx/negocio.spec.js
import { test } from '../../../helpers/index.js'; // ✅ CORRETO: 3 níveis até raiz
```

**COMO CALCULAR CAMINHO RELATIVO:**

1. Contar níveis do arquivo até raiz do projeto
   - `tests/jornadas/crmx/negocio.spec.js` = 3 níveis (`../../../`)
   - `tests/jornadas/suprimentos/gestaoEstoques/consulta/arquivo.spec.js` = 5 níveis (`../../../../../`)
2. Adicionar caminho do destino a partir da raiz
   - `helpers/index.js` → `../../../helpers/index.js`
   - `data/crmx/negocioJson.js` → `../../../data/crmx/negocioJson.js`

**PROCESSO OBRIGATÓRIO:**

1. Criar/modificar arquivo
2. Executar validação (comando acima conforme tipo de arquivo)
3. **SE houver erros:** Corrigir TODOS antes de prosseguir
4. **SE não houver erros:** Validar próximo arquivo
5. **NUNCA pular esta validação**

**Motivo:** Arquivos com erros de import impedem execução dos testes. `get_errors` não detecta erros de runtime do Playwright - validação explícita com `npx playwright test --list` é obrigatória para `.spec.js`.

---

## **✅ Checklist de Conformidade**

**ANTES de implementar, confirme:**

- [ ] **Validei presença de iframe no HTML** (Regra #5)
- [ ] **Constructor configurado corretamente** (this.frame OU this.page conforme iframe)
- [ ] Executei `grep_search` para CADA elemento
- [ ] Li o contexto completo no HTML (mínimo 15+ linhas antes/depois)
- [ ] Identifiquei tipo REAL no HTML
- [ ] Apliquei **ordem de prioridade de locators** (Regra #2)
- [ ] Vou usar localizadores **CORRETOS (✅)**
- [ ] Executei fluxo no Playwright CLI com snapshots (Regra #3)
- [ ] **NÃO usei `{ timeout: X }` em nenhum lugar** (Regra #4)
- [ ] Criei **plano técnico detalhado**
- [ ] **SOLICITEI APROVAÇÃO** antes de implementar

**APÓS implementar, confirme:**

- [ ] **Validei imports com `npx playwright test --list`** para `.spec.js` (Regra #6)
- [ ] **Validei imports com `get_errors`** para Page.js/Api.js (Regra #6)
- [ ] **Corrigi TODOS os erros** encontrados
- [ ] **Imports usam extensão `.js` explícita**
- [ ] **Caminhos relativos calculados corretamente** (contei níveis)
- [ ] **Em Page Objects: JSDoc de classe sem `Exemplo:` e sem `@param` (parametrização apenas no `constructor`)**

> **🚫 SE QUALQUER ITEM FOR "NÃO": PARE E EXECUTE O PASSO FALTANTE**

---

## **📋 PROCESSO OBRIGATÓRIO: 2 FASES**

> **⚠️ Este processo está SINCRONIZADO com o Arquivo Principal (copilot-instructions.md)**
>
> **Arquivo Principal define:** 7 etapas detalhadas (1.1 a 1.7)
> **Este módulo define:** Visão resumida das fases

### **🔍 FASE 1: Análise e Planejamento**

**O Arquivo Principal detalha 6 etapas operacionais (1.2 a 1.7):**

1. **Analisar HTMLs e Detectar iframe**
   - `grep_search("<iframe")` PRIMEIRO
   - `grep_search` + `read_file` para cada elemento (mínimo 15 linhas contexto)
   - Documentar: linha, tipo HTML real, contexto

2. **Executar Fluxo no Playwright CLI** (EXECUTAR ANTES DO MAPEAMENTO)
   - `playwright-cli open` + interações do cenário
   - Capturar snapshots das etapas críticas
   - Documentar ambiguidades e estratégia aplicada

3. **Mapear Locators Finais** (APÓS validação)
   - Mapear CADA elemento usando ordem de prioridade do Playwright
   - Aplicar estratégia de desambiguação se necessário
   - Documentar: estratégia + localizador final ✅

4. **Consultar Templates** (se aplicável)
   - Page Objects → Módulo 05
   - Testes → Módulo 06
   - APIs → Módulo 08

5. **Criar Plano Técnico**
   - Tabela: elemento | linha | tipo | estratégia | locator
   - Lista: todos métodos e arquivos envolvidos
   - Arquivos a criar/modificar
   - Pontos de atenção

6. **Solicitar Aprovação do Usuário**
   - **BLOQUEIO:** NÃO implementar sem aprovação explícita

---

### **✅ FASE 2: Implementação**

**Após aprovação explícita:**

1. Implementar conforme plano aprovado
2. Validar conformidade:
   - Locators no constructor
   - Classes em `helpers/index.js`
   - Coverage em `coverageFeatureMap.yml`
3. Executar `get_errors` e corrigir
4. Validar `checklistMergeRequest.md` completo

---

## **📚 Referências dos Módulos**

| # | Módulo | Arquivo | Quando Ler |
|---|--------|---------|-----------|
| **05** | Page Objects | `.github/copilot-modules/05-page-objects.md` | Ao criar/atualizar Pages |
| **06** | Testes Spec | `.github/copilot-modules/06-testes-spec.md` | Ao criar arquivos `.spec.js` |
| **03** | Locators Semânticos | `.github/copilot-modules/03-locators-semanticos.md` | Ao escolher estratégia de locator |
| **08** | API Classes | `.github/copilot-modules/08-api-classes.md` | Ao criar/atualizar APIs |

---

> **💡 Este módulo é o ponto de entrada. Sempre leia completamente antes de iniciar.**
>
> **🎯 As 7 Regras Fundamentais garantem análise correta e qualidade do código.**
>
> **🎯 Regras específicas de implementação estão nos módulos especializados (03, 05, 06, 08).**
