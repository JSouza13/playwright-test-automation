# 📄 **Estrutura de Page Objects (`*Page.js`)**

> **Módulo 05:** Templates e regras para classes Page Object
>
> **Objetivo:** Clareza, simplicidade, hierarquia lógica

---

## 🎯 **Propósito**

Page Objects encapsulam a interação com elementos de UI e ações de usuário em uma tela/funcionalidade específica do sistema.

**Quando criar:** Uma classe por tela/componente em `pages/`
**Quando NOT criar:** Para operações de backend/APIs externas (use `API Classes` - Módulo 08)

---

## 🚨 **BLOQUEIO CRÍTICO - 3 Violações Mais Frequentes**

> **LEIA AGORA:** Estas 3 regras são as mais violadas. Existem exemplos de ERRADO vs CORRETO em cada seção.

### **❌ ERRO #1: `acessarTela()` Recebe Parâmetros**

**NUNCA, em nenhuma circunstância, este método deve receber parâmetros.**

✅ **CORRETO:**
```javascript
// 1. Importar constante no topo
import { NOME_FUNCIONALIDADE } from '../../helpers/navegacao.js';

// 2. Método SEM parâmetros
async acessarTela() {
  await this.page.goto(NOME_FUNCIONALIDADE.URL);
  await expect(this.locatorTituloHeading).toBeVisible();
}

// 3. Usar no teste SEM argumentos
await page.funcionalidadePage.acessarTela();
```

❌ **ERRADO:** `async acessarTela(url) { }` — Parâmetro é PROIBIDO

---

### **❌ ERRO #2: Locators Criados Inline (Fora do Constructor)**

**TODOS os locators estáticos DEVEM estar no constructor.**

✅ **CORRETO:**
```javascript
constructor(page) {
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
  this.locatorNomeInput = this.page.getByLabel('Nome');
}

async cadastrarRegistro(dados) {
  await this.locatorNomeInput.fill(dados.nome);
  await this.locatorSalvarButton.click();
}
```

❌ **ERRADO:**
```javascript
async cadastrarRegistro(dados) {
  const locatorNome = this.page.getByLabel('Nome'); // ❌ Inline
  await locatorNome.fill(dados.nome);
}
```

---

### **❌ ERRO #3: Ações Diretas no Teste (Sem Encapsulamento)**

**Testes NUNCA devem ter `.click()`, `.fill()`, `expect()` diretos.**

✅ **CORRETO:**
```javascript
// Teste - só método
await page.funcionalidadePage.cadastrarRegistro(dados);

// Page Object - encapsula tudo
async cadastrarRegistro(dados) {
  await this.locatorNomeInput.fill(dados.nome);
  await this.locatorSalvarButton.click();
  await expect(this.locatorSucessoAlert).toBeVisible();
}
```

❌ **ERRADO:**
```javascript
// Teste com ações diretas
await page.funcionalidadePage.locatorNomeInput.fill(dados.nome);     // ❌
await page.funcionalidadePage.locatorSalvarButton.click();           // ❌
await expect(page.funcionalidadePage.locatorSucessoAlert).toBeVisible(); // ❌
```

---

## 🏗️ **Arquitetura de Page Objects**

### **Estrutura Base:**

```javascript
// 1. Imports de dependências
import { expect } from '@playwright/test';
import { NOME_FUNCIONALIDADE } from '../../helpers/navegacao.js';

// 2. Classe com métodos bem organizados
export class {NomeFuncionalidade}Page {
  constructor(page) {
    // Apenas inicialização e locators estáticos
  }

  // Apenas métodos de negócio

  // Apenas métodos auxiliares (se necessário)
}
```

### **Princípio Fundamental:**

- ✅ **Uma classe por tela/funcionalidade**
- ✅ **Métodos representam fluxos completos de negócio**
- ✅ **TODOS os locators estáticos no constructor**
- ✅ **NUNCA parâmetros em `acessarTela()`**
- ✅ **IDIOMA: Português SEMPRE** (nunca misturar inglês)

---

## 📋 **5 Princípios Fundamentais**

### **1. 🧹 Clean Code - Código Legível e Autoexplicativo**

**Aplicar a Page Objects:**

- ✅ Nomes reveladores de intenção (`cadastrarNegocioCompleto` vs genérico `salvar`)
- ✅ Sem comentários óbvios (código se explica sozinho)
- ✅ Métodos com responsabilidade única
- ✅ Sem código duplicado (DRY)

**❌ ERRADO:**
```javascript
async salvar(dados) {              // ❌ Nome genérico
  // Preenche o campo nome       // ❌ Comentário óbvio
  await this.locatorNomeInput.fill(dados.nome);
}
```

**✅ CORRETO:**
```javascript
async cadastrarNegocioCompleto(dados) {  // ✅ Nome descreve ação
  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldSLookup(this.ID_RESPONSAVEL_LOOKUP, dados.responsavel);
  // ... resto que faz sentido
}
```

---

### **2. 🎯 Task-Based Architecture - Fluxos de Negócio Completos**

**Métodos devem representar ações completas do usuário, não fragmentos.**

**❌ FRAGMENTAÇÃO (ERRADO):**
```javascript
await page.negocioPage.clicarAdicionar();
await page.negocioPage.preencherNome('Empresa X');
await page.negocioPage.clicarSalvar();
// Teste precisa saber 3 passos técnicos
```

**✅ MÉTODO COMPLETO (CORRETO):**
```javascript
await page.negocioPage.cadastrarNegocio({ nome: 'Empresa X' });
// Teste expressa intenção de negócio, não detalhes técnicos
```

---

### **3. 🔄 DRY (Don't Repeat Yourself) - Reutilização**

**Elimine duplicações: cada lógica deve existir em 1 único lugar.**

- ✅ **Criar auxiliar** se lógica é usada 3+ vezes
- ❌ **NÃO criar** para 1 comando trivial

**Exemplo VÁLIDO:**
```javascript
// Usado em cadastro, edição, filtro → DEVE ser auxiliar
async aguardarCarregamentoCompleto() {
  await expect(this.locatorSpinner).toBeHidden();
  await expect(this.locatorConteudo).toBeVisible();
}
```

---

### **4. 🎨 YAGNI (You Aren't Gonna Need It) - Implementar Sob Demanda**

**Somente implemente o necessário AGORA, não para "possíveis cenários futuros".**

- ❌ **ERRADO:** 4 variações de `cadastrar` (nunca usadas)
- ✅ **CORRETO:** 1 método `cadastrar` que atende o teste (se futuramente variar, criar naquela hora)

---

### **5. 🚫 Anti-Over-Engineering - Simplicidade**

**Classes simples, métodos diretos. Abstrair só quando dor real surgir 3+ vezes.**

- ❌ **ERRADO:** Hierarquias complexas (`BaseModal extends Modal extends DialogBase`)
- ✅ **CORRETO:** Classes diretas e pragmáticas

---

## ✅ **Métodos Bem Estruturados**

### **Regra #1: Fluxo Completo com Blocos Lógicos Internos**

**Um método = uma ação de negócio completa, organizada em blocos claros.**

**Estrutura Ideal:**

```javascript
async cadastrarPortaria(dados) {
  // Bloco 1: Abertura e carregamento
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalDialog).toBeVisible();

  // Bloco 2: Preenchimento de campos obrigatórios
  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldSLookup(this.ID_LOCAL_FISICO, dados.localFisico);

  // Bloco 3: Preenchimento condicional (opcionais)
  if (dados.validadeAgendamento) {
    await this.locatorValidadeAgendInput.fill(dados.validadeAgendamento);
  }

  // Bloco 4: Submissão e validação de sucesso
  await this.locatorSalvarButton.click();
  await expect(this.locatorSucessoAlert).toBeVisible();
  await expect(this.locatorModalDialog).toBeHidden();
}
```

**Vantagens:**

- ✅ Fluxo completo encapsulado
- ✅ Blocos claros facilitam debug
- ✅ Mudanças localizadas por bloco
- ✅ Sem fragmentação excessiva

---

### **❌ O Que NÃO Criar:**

| ❌ Anti-Padrão | ✅ Correto |
|----------------|-----------|
| Método trivial de 1 comando | Método de negócio completo |
| `clicarBotao()`, `clickButton()` | `confirmarExclusao()`, `salvarFormulario()` |
| Inglês + Português misturados | APENAS português |
| Ações diretas no teste | Encapsuladas em métodos Page Object |
| Nome genérico `salvar()` | Nome específico `salvarFormularioComValidacao()` |

---

### **Equilíbrio Entre Completude e Tamanho:**

- ✅ **Método 25-45 linhas bem organizados:** Bom
- ✅ **Método 10-15 linhas focado:** Bom
- ❌ **Método 1-2 linhas trivial:** Ruim
- ❌ **Método 100+ linhas confuso:** Ruim

**Se método ficar grande:** Dividir internamente com comentários (NÃO criar micro-métodos)

---

### **Exemplos de Métodos Completos:**

#### **Exemplo 1: Cadastro Simples**

```javascript
/**
 * Cadastra novo registro com dados completos
 * @param {object} dados - Dados do registro
 * Exemplo: JSON_PORTARIA
 */
async cadastrarPortaria(dados) {
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalCadastro).toBeVisible();

  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldSLookup(this.ID_LOCAL_FISICO, dados.localFisico);
  await this.locatorValidadeInput.fill(dados.validade);

  if (dados.controleVisitas) {
    await this.locatorControleCheckbox.check();
  }

  await this.locatorSalvarButton.click();
  await expect(this.locatorSucessoAlert).toBeVisible();
}
```

#### **Exemplo 2: Filtros Complexos**

```javascript
/**
 * Aplica filtros na listagem e aguarda resultados
 * @param {object} criterios - Critérios de filtro
 * Exemplo: JSON_FILTROS_PORTARIA ou JSON_FILTROS_PORTARIA_AVANCADOS
 */
async aplicarFiltros(criterios) {
  await this.locatorAbrirFiltrosButton.click();
  await expect(this.locatorPainelFiltros).toBeVisible();

  if (criterios.status) {
    await this.locatorStatusSelect.selectOption(criterios.status);
  }

  if (criterios.periodo) {
    await this.locatorPeriodoRadio.check();
    await this.locatorPeriodoSelect.selectOption(criterios.periodo);
  }

  if (criterios.nome) {
    await this.locatorNomeFiltroInput.fill(criterios.nome);
  }

  await this.locatorFiltrarButton.click();
  await expect(this.locatorSpinner).toBeHidden();
  await expect(this.locatorResultados).toBeVisible();
}
```

#### **Exemplo 3: Validação com Retorno**

```javascript
/**
 * Valida se registro foi cadastrado na tabela e retorna dados
 * @param {string} textoIdentificador - Texto único do registro
 * @returns {Promise<object>} Dados extraídos do registro
 */
async validarRegistroCadastrado(textoIdentificador) {
  const locatorLinha = this.locatorRegistrosTable
    .locator('tbody tr')
    .filter({ hasText: textoIdentificador });

  await expect(locatorLinha).toBeVisible();

  const nome = await locatorLinha.locator('td').nth(1).textContent();
  const status = await locatorLinha.locator('td').nth(2).textContent();

  return {
    nome: nome.trim(),
    status: status.trim(),
  };
}
```

---

## 🔒 **Regras Obrigatórias**

### **Regra #1: TODOS os Locators Estáticos no Constructor**

**Definição:** Locators que usam valores fixos, sem parâmetros dinâmicos.

```javascript
constructor(page) {
  this.page = page;

  // ✅ CORRETO - Locators estáticos no constructor
  this.locatorTituloHeading = this.page.getByRole('heading', { name: 'Portarias' });
  this.locatorAdicionarButton = this.page.getByRole('button', { name: 'Adicionar' });
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
  this.locatorNomeInput = this.page.getByLabel('Nome');
}

// ✅ CORRETO - Locator dinâmico no método (depende de parâmetro)
async buscarRegistroPorNome(nomeRegistro) {
  const locatorLinha = this.locatorRegistrosTable
    .locator('tbody tr')
    .filter({ hasText: nomeRegistro }); // Dinâmico: usa parâmetro

  await expect(locatorLinha).toBeVisible();
}
```

---

### **Regra #2: Nomenclatura Obrigatória de Locators**

**Padrão:** `locator{Descrição}{Tipo}`

Sempre:
- Começar com `locator`
- Seguir com descrição clara
- Terminar com tipo do elemento

**Exemplos:**
- ✅ `locatorSalvarButton` (tipo no final)
- ✅ `locatorNomeInput` (tipo no final)
- ✅ `locatorAdicionarButton` (tipo no final)
- ❌ `botaoSalvar` (sem "locator")
- ❌ `salvarButton` (sem "locator", ordem errada)

**Tipos Comuns:**
- `Button`, `Input`, `Link`, `Heading`, `Checkbox`, `Table`, `Dialog`, `Alert`, `Dropdown`, `Span`, `Div`

---

### **Regra #3: IDs/Classes/CSS no Constructor com Padrão**

**Padrão:** `{TIPO}_{DESCRICAO}_{TipoElemento}`

```javascript
constructor(page) {
  this.page = page;

  // ✅ CORRETO - Constantes com padrão TIPO_{DESCRICAO}_{TipoElemento}
  this.ID_CONTA_LOOKUP = '#account-autocomplete';              // ID (começa com #)
  this.CLASS_MODAL_DIV = '.modal-content';                     // Class (começa com .)
  this.CSS_ENVIAR_BUTTON = 'button[type="submit"]';            // CSS composto
  this.XPATH_SALVAR_BUTTON = '//button[contains(text(),"Salvar")]';  // XPath

  // Usar essas constantes nos métodos
}

async salvarFormulario() {
  await this.formUtils.fillFieldPDropdown(this.ID_CONTA_LOOKUP, dados.conta);
  await this.page.locator(this.CLASS_MODAL_DIV).click();
}
```

**Prefixos:**
- `ID_` — começa com `#` (seletor ID CSS)
- `CLASS_` — começa com `.` (seletor Class CSS)
- `CSS_` — qualquer outro seletor composto
- `XPATH_` — XPath (começa com `//` ou `/`)

**Sufixo:** O tipo do elemento (LOOKUP, DROPDOWN, INPUT, BUTTON, DIV, etc.)

---

### **Regra #4: NUNCA Omitir `acessarTela()`**

**Cada Page Object DEVE ter este método.**

```javascript
/**
 * Acessa a tela de {Funcionalidade}
 */
async acessarTela() {
  await this.page.goto(NOME_FUNCIONALIDADE.URL);
  await expect(this.locatorTituloHeading).toBeVisible();
}
```

**Checklist:**
- [ ] Método SEM parâmetros
- [ ] Constante de navegação importada no topo
- [ ] Usa `CONSTANTE.URL` ou `...CONSTANTE.DIRETORIO`
- [ ] Valida elemento principal após navegação
- [ ] Chamado NO TESTE SEM argumentos: `await page.xxxPage.acessarTela()`

---

### **Regra #5: Sem Locators Órfãos**

**Locator órfão:** Declarado no constructor mas NUNCA usado em nenhum método.

✅ **Validar com grep antes de finalizar:**
```bash
# 1. Listar TODOS os locators
grep "this\.locator" arquivo.js | grep "="

# 2. Para cada locator, verificar se é usado
grep "this\.locatorNome" arquivo.js | wc -l

# Se apenas 1 ocorrência = órfão = REMOVER
```

---

### **Regra #6: Imports Corretos**

```javascript
// ✅ Imports públicos
import { expect } from '@playwright/test';

// ✅ Constante de navegação (SEMPRE daqui)
import { NOME_FUNCIONALIDADE } from '../../helpers/navegacao.js';

// ✅ Dados (se necessário)
import { JSON_PORTARIA } from '../../data/{modulo}/{arquivo}.js';

// ❌ NUNCA
import { internals } from '@playwright/test/internal';  // Caminho interno
```

---

## 📝 **JSDoc - Padrão Completo**

### **Estrutura para Classe:**

> **🚨 NUNCA adicionar linha `Exemplo:` no JSDoc da CLASSE**
> **🚨 NUNCA adicionar `@param` no JSDoc da CLASSE (exceto `page` no constructor)**

```javascript
/**
 * Page Object para {Nome da Funcionalidade}
 * {Breve descrição do que a classe encapsula}
 */
export class {NomeFuncionalidade}Page {
  /**
   * Constructor da classe
   * @param {object} page - Contexto da página do Playwright
   */
  constructor(page) {
    // ...
  }
}
```

---

### **Estrutura para Métodos:**

```javascript
/**
 * {Descrição clara do QUE o método faz (não COMO)}
 * @param {object} dados - Descrição do parâmetro
 * Exemplo: JSON_{CONSTANTE}
 * @returns {Promise<void>}
 */
async nomeDoMetodo(dados) {
  // ...
}
```

**Regra de VÍNCULO OBRIGATÓRIO:**

- ✅ Existe `@param {object}` → DEVE existir `Exemplo: JSON_{CONSTANTE}` na linha seguinte
- ✅ Existe `Exemplo: JSON_{CONSTANTE}` → DEVE existir `@param {object}` na linha anterior
- ❌ **NUNCA** detalhar campos: `@param {string} dados.campo1`
- ❌ **NUNCA** omitir linha `Exemplo:` quando JSON for conhecido

---

### **Exemplos JSDoc Completos:**

#### **✅ Método com Parâmetro JSON**

```javascript
/**
 * Cadastra novo registro com dados completos
 * @param {object} dados - Dados do registro para cadastro
 * Exemplo: JSON_PORTARIA
 * @returns {Promise<void>}
 */
async cadastrarPortaria(dados) {
  // ...
}
```

#### **✅ Método sem Parâmetro JSON**

```javascript
/**
 * Acessa a tela de portarias
 * @returns {Promise<void>}
 */
async acessarTela() {
  // ...
}
```

#### **✅ Método com Múltiplos JSONs**

```javascript
/**
 * Cadastra ou edita registro conforme ação especificada
 * @param {object} dados - Dados do registro
 * Exemplo: JSON_PORTARIA_INCLUIR ou JSON_PORTARIA_EDITAR
 * @returns {Promise<void>}
 */
async cadastrarOuEditarPortaria(dados) {
  // ...
}
```

#### **✅ Método com Retorno**

```javascript
/**
 * Valida se registro foi cadastrado e retorna dados extraídos
 * @param {string} textoIdentificador - Texto único do registro
 * @returns {Promise<object>} Objeto com dados {nome, status}
 */
async validarRegistroCadastrado(textoIdentificador) {
  // ...
  return { nome: nome.trim(), status: status.trim() };
}
```

---

### **❌ Anti-Padrões JSDoc:**

```javascript
// ❌ NUNCA - Detalhar campos individuais
/**
 * @param {object} dados
 * @param {string} dados.nome - Nome do registro
 * @param {string} dados.status - Status
 * @param {string} dados.responsavel - Responsável
 */

// ❌ NUNCA - Omitir linha Exemplo quando JSON é conhecido
/**
 * @param {object} dados - Dados do registro
 */
// Deveria ter: Exemplo: JSON_CONSTANTE

// ❌ NUNCA - Linha Exemplo sem @param {object}
/**
 * Valida formulário
 * Exemplo: JSON_VALIDACAO  ← Sem @param antes!
 */

// ❌ NUNCA - Linha Exemplo em JSDoc da classe
/**
 * Page Object para portarias
 * Exemplo: JSON_PORTARIA  ← PROIBIDO em classe!
 */
export class PortariasPage { }
```

---

## 📦 **Template Completo - Copiar e Adaptar**

```javascript
import { expect } from '@playwright/test';

import { NOME_FUNCIONALIDADE } from '../../helpers/navegacao.js';

/**
 * Page Object para {Nome da Tela/Funcionalidade}
 * Encapsula ações de {descrição breve das ações}
 */
export class {NomeFuncionalidade}Page {
  /**
   * Constructor da classe
   * @param {object} page - Contexto da página do Playwright
   */
  constructor(page) {
    this.page = page;

    // Auxiliares (se necessário)
    this.dataUtils = new DataUtils(this.page);
    this.formUtils = new FormUtils(this.page);

    // ===== IDs/Classes/CSS (padrão TIPO_{DESCRICAO}_{TipoElemento}) =====
    this.ID_CAMPO_LOOKUP = '#campo-autocomplete';
    this.CLASS_MODAL_DIV = '.modal-content';
    this.CSS_ENVIAR_BUTTON = 'button[type="submit"]';

    // ===== Locators Estáticos (padrão locator{Descricao}{Tipo}) =====
    this.locatorTituloHeading = this.page.getByRole('heading', { name: 'Título' });
    this.locatorAdicionarButton = this.page.getByRole('button', { name: 'Adicionar' });
    this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
    this.locatorCancelarButton = this.page.getByRole('button', { name: 'Cancelar' });
    this.locatorNomeInput = this.page.getByLabel('Nome');
    this.locatorDescricaoInput = this.page.getByLabel('Descrição');
    this.locatorRegistrosTable = this.page.getByRole('table');
    this.locatorSucessoAlert = this.page.getByRole('alert');
    this.locatorCarregandoSpinner = this.page.getByRole('status'); // ou getByText('...')
    this.locatorModalDialog = this.page.getByRole('dialog');
  }

  /**
   * Acessa a tela de {Funcionalidade}
   */
  async acessarTela() {
    await this.page.goto(NOME_FUNCIONALIDADE.URL);
    await expect(this.locatorTituloHeading).toBeVisible();
  }

  /**
   * Cadastra novo registro com dados completos
   * @param {object} dados - Dados do registro para cadastro
   * Exemplo: JSON_{CONSTANTE_CADASTRO}
   */
  async cadastrarRegistro(dados) {
    // Abrir modal de cadastro
    await this.locatorAdicionarButton.click();
    await expect(this.locatorModalDialog).toBeVisible();

    // Preencher campos obrigatórios
    await this.locatorNomeInput.fill(dados.nome);
    await this.locatorDescricaoInput.fill(dados.descricao);
    await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, dados.campo);

    // Preencher campos opcionais (se presentes no JSON)
    if (dados.outrosCampos) {
      // ... preenchimento condicional
    }

    // Salvar e validar sucesso
    await this.locatorSalvarButton.click();
    await expect(this.locatorSucessoAlert).toBeVisible();
    await expect(this.locatorModalDialog).toBeHidden();
  }

  /**
   * Edita registro existente
   * @param {string} textoIdentificador - Texto único do registro
   * @param {object} novosDados - Dados a serem atualizados
   * Exemplo: JSON_{CONSTANTE_EDICAO}
   */
  async editarRegistro(textoIdentificador, novosDados) {
    // Localizar registro na tabela
    const locatorLinha = this.locatorRegistrosTable
      .locator('tbody tr')
      .filter({ hasText: textoIdentificador });

    // Abrir edição
    await locatorLinha.locator('button[name="editar"]').click();
    await expect(this.locatorModalDialog).toBeVisible();

    // Atualizar campos
    if (novosDados.nome) {
      await this.locatorNomeInput.fill(novosDados.nome);
    }

    // Salvar e validar
    await this.locatorSalvarButton.click();
    await expect(this.locatorSucessoAlert).toBeVisible();
  }

  /**
   * Valida se registro foi cadastrado corretamente
   * @param {string} textoEsperado - Texto esperado no registro
   * @returns {Promise<object>} Dados extraídos do registro
   */
  async validarRegistroCadastrado(textoEsperado) {
    const locatorRegistro = this.locatorRegistrosTable
      .locator('tbody tr')
      .filter({ hasText: textoEsperado });

    await expect(locatorRegistro).toBeVisible();

    const nome = await locatorRegistro.locator('td').nth(1).textContent();
    const status = await locatorRegistro.locator('td').nth(2).textContent();

    return {
      nome: nome.trim(),
      status: status.trim(),
    };
  }

  /**
   * Auxiliar reutilizável (usado em múltiplos métodos)
   * @returns {Promise<void>}
   */
  async aguardarCarregamentoCompleto() {
    await expect(this.locatorCarregandoSpinner).toBeHidden();
    await expect(this.locatorRegistrosTable).toBeVisible();
  }
}
```

---

## ✅ **Checklist de Validação Final**

**Antes de finalizar, validar:**

### **Locators:**
- [ ] Todos os locators **estáticos** estão no constructor?
- [ ] Nomenclatura segue padrão `locator{Descrição}{Tipo}`?
- [ ] Nenhum locator é criado inline nos métodos (exceto dinâmicos)?
- [ ] Nenhum locator órfão (não utilizado)?
- [ ] Todos os IDs/Classes/CSS estão como constantes (`TIPO_{DESC}_{TipoElemento}`)?

### **Métodos:**
- [ ] Cada método representa fluxo completo (sem fragmentação)?
- [ ] Métodos têm nomes descritivos em **português**?
- [ ] Sem métodos triviais (1 comando)?
- [ ] Sem mistura inglês + português?
- [ ] Todos os métodos encapsulam ações (sem `.click()`, `.fill()`, `expect()` diretos)?

### **JSDoc:**
- [ ] Classe tem JSDoc sem `Exemplo:`?
- [ ] Each método com `@param {object}` tem linha `Exemplo: JSON_...` logo após?
- [ ] NENHUM `@param {string} dados.campo` (proibido detalhamento)?
- [ ] Todos os métodos têm `@returns`?

### **Qualidade:**
- [ ] `acessarTela()` SEM parâmetros?
- [ ] Constante de navegação importada?
- [ ] Imports usam caminhos públicos (não internos)?
- [ ] ESLint sem erros: `npx eslint {arquivo}.js`?

### **Conformidade:**
- [ ] Validado contra `checklistMergeRequest.md`?
- [ ] Instanciado em `helpers/index.js`?
- [ ] Testado e funcionando?

---

## 📊 **Quick Reference - O Que Fazer vs O Que NÃO Fazer**

| ✅ Fazer | ❌ NÃO Fazer |
|---------|------------|
| Locators estáticos no constructor | Locators inline nos métodos |
| Métodos de negócio completos | Métodos triviais de 1 comando |
| Nomes descritivos em português | Nomes genéricos em inglês |
| Encapsular TUDO em métodos | Ações diretas no teste |
| `acessarTela()` sem parâmetros | `acessarTela(url)` com parâmetro |
| Uma classe por tela | Múltiplas telas em 1 classe |
| Validações com `expect()` em pontos-chave | Sem validações |
| JSDoc com `Exemplo: JSON_CONSTANTE` | JSDoc detalhando campos |
| Auxiliares reutilizados 3+ vezes | Métodos triviais reutilizados |
| Clean Code + SOLID | Over-engineering |

---

## 🔗 **Leitura Complementar Obrigatória**

Antes de implementar, consulte:

- **playwright-best-practices:** Documentação oficial do Playwright
- **playwright-cli:** Quando precisar executar navegação/interação
- **Módulo 06 (Testes Spec):** Como usar Page Objects nos testes
- **Módulo 08 (API Classes):** Quando usar APIs vs UI

---

## 📌 **Resumo Executivo (13 Regras de Ouro)**

1. **Fluxos completos:** Métodos encapsulam ações inteiras do usuário
2. **Locators no constructor:** Todos são estáticos, NUNCA inline
3. **Nomenclatura:** `locator{Descrição}{Tipo}` e `TIPO_{DESC}_{TipoElemento}`
4. **`acessarTela()` sem parâmetros:** NUNCA recebe URL/constante
5. **Clean Code:** Nomes descritivos, sem comentários óbvios, português SEMPRE
6. **Sem fragmentação:** Não criar 5 micro-métodos para 1 ação
7. **JSDoc com `Exemplo:`:** Quando `@param {object}` + JSON conhecido
8. **Sem locators órfãos:** Todos são usados em algum método
9. **Encapsulamento total:** Testes chamam métodos, NUNCA têm ações diretas
10. **Task-based architecture:** Métodos representam negócio, não detalhes técnicos
11. **Sem timeout customizado:** NUNCA usar `{ timeout: X }` em expect
12. **DRY:** Auxiliares SOMENTE se usados 3+ vezes
13. **Anti-over-engineering:** Simplicidade, pragmatismo, YAGNI

---

**Pronto para implementar? 🚀**

Copie o [Template Completo](#-template-completo---copiar-e-adaptar) acima e adapte para sua funcionalidade!
