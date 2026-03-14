# 📄 **Estrutura de Page Objects (`*Page.js`)**

> **Módulo 05:** Templates e regras para classes Page Object

---

## 🚨 **BLOQUEIO CRÍTICO - LER ANTES DE CRIAR/MODIFICAR PAGE OBJECT**

> **⛔ SE VOCÊ ESTÁ CRIANDO OU MODIFICANDO UM ARQUIVO `*Page.js`:**
>
> **PARE AGORA E LEIA ESTAS 3 REGRAS CRÍTICAS (SÃO AS MAIS VIOLADAS):**

### **🔴 REGRA CRÍTICA #1: `acessarTela()` NUNCA RECEBE PARÂMETROS**

**❌ ERRADO (NÃO FAZER):**
```javascript
async acessarTela(url) { // ❌ PARÂMETRO = ERRO CRÍTICO
  await this.page.goto(url);
}
```

**✅ CORRETO (FAZER SEMPRE):**
```javascript
// 1. IMPORTAR constante no topo do arquivo
import { NOME_FUNCIONALIDADE_REAL } from '../../helpers/navegacao.js';

// 2. Método SEM parâmetros - Usar page.goto() se variável tem .URL
async acessarTela() {
  await this.page.goto(NOME_FUNCIONALIDADE_REAL.URL);
  await expect(this.locatorTituloHeading).toBeVisible();
}

// OU - Usar navegarParaPagina() se variável tem .DIRETORIO
async acessarTela() {
  await this.funcionalidadePage.navegarParaPagina(...NOME_FUNCIONALIDADE_REAL.DIRETORIO);
  await expect(this.locatorTituloHeading).toBeVisible();
}
```

**Por quê:** URL/DIRETORIO é responsabilidade de `navegacao.js`. `acessarTela()` deve ser chamado **sem parâmetros** nos testes.

---

### **🔴 REGRA CRÍTICA #2: TODOS OS LOCATORS NO CONSTRUCTOR**

**❌ ERRADO:**
```javascript
async clicarSalvar() {
  await this.page.getByRole('button', { name: 'Salvar' }).click(); // ❌ Inline
}
```

**✅ CORRETO:**
```javascript
constructor(page) {
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
}

async clicarSalvar() {
  await this.locatorSalvarButton.click();
}
```

---

### **🔴 REGRA CRÍTICA #3: IMPORTAR APENAS O QUE SERÁ USADO**

**❌ ERRADO:**
```javascript
import { FUNCIONALIDADE_A, FUNCIONALIDADE_B, FUNCIONALIDADE_C } from '../../helpers/navegacao.js'; // ❌ Importa 3, usa 1

async acessarTela() {
  await this.page.goto(FUNCIONALIDADE_A.URL); // Usa apenas 1
}
```

**✅ CORRETO:**
```javascript
import { NOME_FUNCIONALIDADE_REAL } from '../../helpers/navegacao.js'; // ✅ Importa apenas o necessário

async acessarTela() {
  await this.page.goto(NOME_FUNCIONALIDADE_REAL.URL);
}
```

---

### **🔴 REGRA CRÍTICA #4: NOMENCLATURA OBRIGATÓRIA DE LOCATORS**

> **⚠️ PADRÃO OBRIGATÓRIO: `locator{Descrição}{Tipo}`**

**Estrutura:**
- Sempre começar com `locator`
- Seguido da descrição breve do elemento (ex: `DocumentoVisitante`, `Salvar`, `NomeCompleto`)
- Terminar com o tipo do elemento: `Button`, `Input`, `Link`, `Heading`, `Checkbox`, `Table`, etc.

**❌ ERRADO:**
```javascript
constructor(page) {
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });  // ❌ Ordem errada
  this.locatorInputNome = this.page.getByLabel('Nome');                        // ❌ Input no meio
  this.botaoAdicionar = this.page.getByRole('button', { name: 'Adicionar' }); // ❌ Sem "locator"
  this.salvar = this.page.getByRole('button', { name: 'Salvar' });            // ❌ Sem padrão
}
```

**✅ CORRETO:**
```javascript
constructor(page) {
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });        // ✅ Tipo no final
  this.locatorNomeInput = this.page.getByLabel('Nome');                                // ✅ Tipo no final
  this.locatorAdicionarButton = this.page.getByRole('button', { name: 'Adicionar' }); // ✅ Padrão correto
  this.locatorTituloHeading = this.page.getByRole('heading', { name: 'Cadastro' });   // ✅ Padrão correto
}
```

**Tipos Comuns:**
- **Button** - Botões (`getByRole('button')`)
- **Input** - Campos de entrada (`getByLabel`, `getByPlaceholder`)
- **Link** - Links (`getByRole('link')`)
- **Heading** - Títulos (`getByRole('heading')`)
- **Checkbox** - Checkboxes (`getByRole('checkbox')`)
- **Table** - Tabelas (`getByRole('table')`)
- **Dialog** - Modais (`getByRole('dialog')`)
- **Alert** - Alertas/Toasts (`getByRole('alert')`)

---

## 🚨 **REGRA CRÍTICA: NUNCA ALTERAR CÓDIGO PRÉ-EXISTENTE**

> **⚠️ ATENÇÃO MÁXIMA: Ao implementar em arquivo já existente**

**REGRA ABSOLUTA - SEM EXCEÇÕES:**

- ❌ **NUNCA modificar** métodos já existentes
- ❌ **NUNCA alterar** locators no constructor já criados
- ❌ **NUNCA remover** constantes ou imports já existentes
- ❌ **NUNCA mudar** assinaturas de métodos existentes
- ✅ **APENAS ADICIONAR** novos métodos ao final da classe
- ✅ **APENAS ADICIONAR** novos locators/IDs ao final do constructor
- ✅ **APENAS ADICIONAR** novos imports necessários

**Motivo:** Alterar código existente quebra testes já funcionando. Toda implementação deve ser ADITIVA, nunca modificativa.

**Exemplo Correto:**

```javascript
// ✅ CORRETO - Adicionar ao final do constructor
constructor(page) {
  this.page = page;
  // ... código existente preservado ...

  // ✅ Novos locators adicionados AO FINAL
  this.locatorNovoElementoButton = this.page.getByRole('button', { name: 'Novo' });
}

// ✅ CORRETO - Adicionar novos métodos AO FINAL da classe
async metodoPreeexistente1() { /* preservado */ }
async metodoPreeexistente2() { /* preservado */ }

// ✅ Novo método adicionado AO FINAL
async novoMetodo(dados) {
  // nova implementação
}
```

**Exemplo Incorreto:**

```javascript
// ❌ ERRADO - Modificar método existente
async metodoPreeexistente1() {
  // ❌ Alterou implementação existente - PROIBIDO
  await this.novaLogica(); // QUEBRA TESTES EXISTENTES
}

// ❌ ERRADO - Alterar locator no constructor
constructor(page) {
  this.page = page;
  // ❌ Alterou locator existente - PROIBIDO
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Save' });
}
```

---

## 🎭 **MELHORES PRÁTICAS OBRIGATÓRIAS - PLAYWRIGHT PAGE OBJECTS**

> **🚨 LEIA ESTAS PRÁTICAS ANTES DE CRIAR QUALQUER PAGE OBJECT**
>
> **Estas não são sugestões - são REGRAS OBRIGATÓRIAS do projeto**
>
> **🏆 FUNDAMENTO:** Todos os princípios abaixo derivam dos pilares **Clean Code** (Robert C. Martin)

### **📋 6 Princípios Fundamentais (Baseados em Clean Code):**

#### **1. 🧹 Clean Code (Princípio FUNDAMENTAL)**

> **REGRA:** Código limpo é **legível, simples, direto e autoexplicativo**. Priorize clareza sobre "inteligência".

**Princípios Clean Code Aplicados a Page Objects:**

**✅ Nomes Reveladores de Intenção:**
```javascript
// ✅ CORRETO - Nome revela exatamente o que faz
async cadastrarNegocioCompleto(dados) {
  // Nome deixa claro: cadastra negócio com TODOS os dados
}
```

```javascript
// ❌ ERRADO - Nome genérico, não revela intenção
async salvar(dados) {
  // Salvar o quê? Como? Com quais validações?
}

async processo1(dados) {
  // O que é "processo1"? Não expressa intenção de negócio
}
```

**✅ Sem Comentários Óbvios (Código Autoexplicativo):**
```javascript
// ✅ CORRETO - Código é autoexplicativo
async preencherFormularioCadastro(dados) {
  await this.locatorNomeInput.fill(dados.nome);
  await this.locatorDescricaoInput.fill(dados.descricao);
  await this.formUtils.fillFieldSLookup(this.ID_RESPONSAVEL_LOOKUP, dados.responsavel);
}
```

```javascript
// ❌ ERRADO - Comentários óbvios (redundantes)
async preencherFormularioCadastro(dados) {
  // Preenche o campo nome
  await this.locatorNomeInput.fill(dados.nome);
  // Preenche o campo descrição
  await this.locatorDescricaoInput.fill(dados.descricao);
  // Preenche o lookup de responsável
  await this.formUtils.fillFieldSLookup(this.ID_RESPONSAVEL_LOOKUP, dados.responsavel);
}
```

**✅ Formatação Consistente:**
```javascript
// ✅ CORRETO - Formatação clara e consistente
async cadastrarNegocio(dados) {
  // Abrir formulário
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalDialog).toBeVisible();

  // Preencher dados
  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldSLookup(this.ID_CONTA_LOOKUP, dados.conta);

  // Salvar e validar
  await this.locatorSalvarButton.click();
  await expect(this.locatorToast).toBeVisible();
}
```

```javascript
// ❌ ERRADO - Sem organização, difícil de ler
async cadastrarNegocio(dados) {
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalDialog).toBeVisible();
  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldSLookup(this.ID_CONTA_LOOKUP, dados.conta);
  await this.locatorSalvarButton.click();
  await expect(this.locatorToast).toBeVisible();
}
```

**🎯 Checklist Clean Code para Page Objects:**

- [ ] **Nomes:** Métodos e variáveis revelam intenção sem necessidade de comentários?
- [ ] **Responsabilidade:** Cada método faz UMA coisa e faz bem?
- [ ] **Tamanho:** Métodos têm no máximo 30-45 linhas (se maior, organizar em blocos)?
- [ ] **Comentários:** Código é autoexplicativo (comentários apenas quando inevitável)?
- [ ] **Formatação:** Blocos lógicos separados por linhas em branco?
- [ ] **Duplicação:** Nenhum código repetido (DRY)?

**⛔ SE QUALQUER RESPOSTA = NÃO: Refatorar antes de finalizar**

---

#### **2. 🎯 Modelagem Baseada em Tarefas (Task-Based Architecture)**

> **REGRA:** Page Objects devem expor **fluxos de negócio completos**, não ações isoladas da UI.

**❌ ANTI-PADRÃO: Action-Based (Granular Demais)**

```javascript
// ❌ ERRADO - Métodos fragmentados sem contexto de negócio
await page.negocioPage.clicarAdicionar();
await page.negocioPage.preencherNome('Empresa X');
await page.negocioPage.preencherResponsavel('João Silva');
await page.negocioPage.clicarSalvar();
await page.negocioPage.validarMensagemSucesso();

// PROBLEMA: Teste precisa conhecer 5 passos técnicos da UI
// IMPACTO: Dificulta manutenção, expõe detalhes técnicos, quebra encapsulamento
```

**✅ PADRÃO CORRETO: Task-Based (Focado no Negócio)**

```javascript
// ✅ CORRETO - Método encapsula fluxo completo de negócio
await page.{funcionalidade}Page.cadastrar{Funcionalidade}(JSON_{CONSTANTE});

// BOM porque:
// - Teste expressa INTENÇÃO de negócio (cadastrar negócio)
// - Método encapsula TODOS os passos técnicos (adicionar, preencher, salvar, validar)
// - Mudança na UI = alterar 1 método, não 5 testes
// - Reutilizável em múltiplos cenários
```

**🎯 Regra Prática:**

- ✅ **CRIAR:** Métodos que representam tarefas do usuário (`cadastrarNegocio`, `editarPortaria`, `aplicarFiltros`)
- ❌ **NUNCA CRIAR:** Métodos triviais de 1 ação (`clicarSalvar`, `preencherNome`, `digitarValor`)
- ✅ **EXCEÇÃO:** Métodos auxiliares reutilizados 3+ vezes com lógica complexa

---

#### **3. 🔍 Seletores Resilientes (User-Facing Locators)**

> **REGRA:** Priorize locators que **simulam o comportamento do usuário**, não a estrutura do DOM.

**Ordem de Prioridade (ABSOLUTA):**

1. **`getByRole()`** - Elemento pelo papel semântico (button, heading, textbox)
2. **`getByLabel()`** - Input associado a um label
3. **`getByText()`** - Elemento pelo texto visível
4. **`getByPlaceholder()`** - Input pelo placeholder visível
5. **`locator()` com CSS selector** - APENAS quando nenhuma opção acima funciona

**✅ Seletores Resilientes (Resistem a Refatorações de Front-End):**

```javascript
// ✅ CORRETO - Seletores user-facing com padrão locator{Descrição}{Tipo}
this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
this.locatorNomeInput = this.page.getByLabel('Nome');
this.locatorDescricaoInput = this.page.getByPlaceholder('Digite a descrição');
this.locatorTituloHeading = this.page.getByRole('heading', { name: 'Cadastro de Negócio' });
this.locatorProcedimentosNenhumRegistroText = this.page.getByLabel('Procedimentos').getByText('Nenhum registro encontrado');

// BOM porque:
// - Não depende da estrutura HTML (classes, hierarquia)
// - Refatoração de CSS não quebra o teste
// - Simula como usuário localiza elementos
```

**❌ Seletores Frágeis (Quebram com Mudanças de CSS):**

```javascript
// ❌ ERRADO - Seletores dependentes de estrutura DOM
this.locatorSalvarButton = this.page.locator('div.form-actions > button.btn-primary:nth-child(2)');
this.locatorNomeInput = this.page.locator('#root > div > form > div:nth-child(1) > input');

// PROBLEMA: Quebra se CSS mudar, hierarquia mudar, ordem mudar
// IMPACTO: Manutenção alta, testes instáveis
```

**🎯 Exceções Permitidas para `locator()` com ID:**

```javascript
// ✅ CORRETO - ID mantido quando há justificativa técnica clara
this.ID_RESPONSAVEL_LOOKUP = '#responsible-autocomplete';
await this.formUtils.fillFieldSLookup(this.ID_RESPONSAVEL_LOOKUP, dados.responsavel);

// JUSTIFICATIVA: o fluxo depende de um método utilitário que recebe ID como parâmetro
```

**📘 Referência Completa:** Consulte `.github/copilot-modules/03-locators-semanticos.md`

---

#### **4. 🔄 DRY (Don't Repeat Yourself)**

> **REGRA:** Elimine duplicações - cada lógica deve existir em **1 único lugar**.

**❌ VIOLAÇÃO: Código Duplicado em Múltiplos Métodos**

```javascript
// ❌ ERRADO - Lógica duplicada em 3 métodos
async cadastrarNegocio(dados) {
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalDialog).toBeVisible();
  // ... preenchimento ...
}

async editarNegocio(dados) {
  await this.locatorEditarButton.click();
  await expect(this.locatorModalDialog).toBeVisible(); // ❌ Duplicado
  // ... preenchimento ...
}

async duplicarNegocio(dados) {
  await this.locatorDuplicarButton.click();
  await expect(this.locatorModalDialog).toBeVisible(); // ❌ Duplicado
  // ... preenchimento ...
}
```

**✅ CORRETO: Lógica Centralizada**

```javascript
// ✅ Método auxiliar reutilizável (usado 3+ vezes)
async aguardarModalAberto() {
  await expect(this.locatorModalDialog).toBeVisible();
  await expect(this.locatorCarregandoSpinner).toBeHidden();
}

// ✅ Métodos reutilizam auxiliar
async cadastrarNegocio(dados) {
  await this.locatorAdicionarButton.click();
  await this.aguardarModalAberto(); // Reutilização
  // ... preenchimento ...
}

async editarNegocio(dados) {
  await this.locatorEditarButton.click();
  await this.aguardarModalAberto(); // Reutilização
  // ... preenchimento ...
}
```

**🎯 Quando Criar Método Auxiliar:**

- ✅ Lógica repetida em **3+ lugares**
- ✅ Sequência complexa de comandos (5+ linhas)
- ❌ **NÃO criar** para 1 comando trivial (`async clicar() { await this.botao.click(); }`)

---

#### **5. 🎨 YAGNI (You Aren't Gonna Need It)**

> **REGRA:** Implemente **apenas o necessário**. Não crie código para "possíveis" cenários futuros.

**❌ VIOLAÇÃO: Over-Engineering**

```javascript
// ❌ ERRADO - Métodos criados "por precaução"
async cadastrarNegocioCompleto(dados) { /* nunca usado */ }
async cadastrarNegocioSimplificado(dados) { /* nunca usado */ }
async cadastrarNegocioRapido(dados) { /* nunca usado */ }
async cadastrarNegocioComValidacao(dados) { /* usado 1x */ }

// PROBLEMA: 4 métodos criados, apenas 1 realmente necessário
// IMPACTO: Código morto, manutenção desnecessária, confusão
```

**✅ CORRETO: Implementar Sob Demanda**

```javascript
// ✅ Criar APENAS quando cenário de teste requer
async cadastrarNegocio(dados) {
  // Método criado porque teste precisa cadastrar negócio
  // Se futuramente precisar de variação, criar naquele momento
}

// ✅ Parâmetros opcionais se cenário variar
async cadastrarNegocio(dados, opcoes = { validar: true }) {
  // ... preenchimento ...
  if (opcoes.validar) {
    await expect(this.locatorToast).toBeVisible();
  }
}
```

**🎯 Checklist Anti-Over-Engineering:**

- [ ] Este método é usado por algum teste **existente**?
- [ ] Este locator é referenciado em algum método **existente**?
- [ ] Este parâmetro é usado em algum cenário **real**?
- [ ] Esta validação é necessária **agora** (não "talvez no futuro")?

**⛔ SE QUALQUER RESPOSTA = NÃO: Não implemente. Aguarde necessidade real.**

---

#### **6. 🚫 Evite Over-Engineering**

> **REGRA:** Page Objects devem servir aos **fluxos reais**, não a cenários hipotéticos futuros.

**❌ Exemplos de Over-Engineering:**

```javascript
// ❌ ERRADO - Abstração excessiva sem necessidade
class BaseModal {
  async abrir() { }
  async fechar() { }
  async validar() { }
}
class CadastroModal extends BaseModal { }
class EdicaoModal extends BaseModal { }

// PROBLEMA: Hierarquia complexa para funcionalidade simples
// IMPACTO: Dificulta entendimento, debug, manutenção

// ❌ ERRADO - Métodos genéricos "configuráveis"
async preencherFormulario(campos, opcoes = { validar: true, limpar: false, aguardar: true }) {
  // ... 50 linhas de lógica condicional ...
}

// PROBLEMA: Método "faz tudo" com muitas condicionais
// IMPACTO: Difícil testar, debug, entender comportamento
```

**✅ Abordagem Pragmática:**

```javascript
// ✅ CORRETO - Classes simples, métodos diretos
export class NegocioPage {
  async cadastrarNegocio(dados) {
    // Implementação direta, sem abstrações desnecessárias
    await this.locatorAdicionarButton.click();
    await this.locatorNomeInput.fill(dados.nome);
    // ...
  }

  async editarNegocio(dados) {
    // Outro método simples, direto
    await this.locatorEditarButton.click();
    await this.locatorNomeInput.fill(dados.nome);
    // ...
  }
}

// BOM porque:
// - Código legível e autoexplicativo
// - Fácil debug (sem camadas de abstração)
// - Manutenção direta (sem herança complexa)
// - Atende necessidade real sem complexidade artificial
```

**🎯 Regra de Ouro:**

**"Simplicidade primeiro. Abstrair apenas quando dor real de manutenção surgir 3+ vezes."**

---

### **📊 RESUMO EXECUTIVO - 6 PRÁTICAS OBRIGATÓRIAS**

| # | Prática | O Que Fazer | O Que NÃO Fazer |
|---|---------|-------------|-----------------|
| **1** | **Clean Code** | Código legível, autoexplicativo, SRP, nomes reveladores | Comentários óbvios, métodos gigantes, nomes genéricos |
| **2** | **Task-Based** | Métodos = fluxos completos (`cadastrarNegocio`) | Métodos triviais (`clicarSalvar`) |
| **3** | **User-Facing Locators** | getByRole, getByLabel (ordem de prioridade) | CSS/XPath complexos dependentes de DOM |
| **4** | **DRY** | Centralizar lógica repetida (3+ vezes) | Duplicar código em múltiplos métodos |
| **5** | **YAGNI** | Implementar apenas o necessário **agora** | Criar código "por precaução" |
| **6** | **Anti-Over-Engineering** | Classes simples, métodos diretos | Hierarquias complexas, abstrações prematuras |

---

### **🔗 COMPLEMENTO OBRIGATÓRIO: Documentação Playwright Oficial**

> **⚠️ ANTES de implementar qualquer Page Object, consulte:**
>
> - **Locators:** https://playwright.dev/docs/locators
> - **Best Practices:** https://playwright.dev/docs/best-practices
> - **Assertions:** https://playwright.dev/docs/test-assertions
> - **Auto-waiting:** https://playwright.dev/docs/actionability

**Princípio Fundamental:** As 6 práticas acima **complementam** a documentação oficial do Playwright. Para estratégias de wait, assertions e escolha técnica de locators, **siga a documentação oficial**.

---

## ⚠️ **BOA PRÁTICA: Try/Catch APENAS Quando Necessário**

> **🚨 REGRA DE OURO:** Playwright tem auto-waiting robusto. Try/catch é necessário APENAS em casos técnicos específicos.

**✅ QUANDO USAR Try/Catch:**

- s-button tipo "Ações" ou "Opções" (com `<p-tieredmenu appendto="body">`) - **SEMPRE com `{ force: true }`**
- Elementos com comportamento instável conhecido
- Justificativa técnica documentada no código

**❌ QUANDO NÃO USAR Try/Catch:**

- Cliques normais (getByRole('button').click())
- Preenchimento de campos (fill, fillFieldSLookup)
- Validações (expect, toBeVisible, toHaveText)
- Ações que Playwright auto-wait já trata

**Padrão Retry para Botões "Ações"/"Opções":**

```javascript
// ✅ CORRETO - Loop retry com { force: true } (evita SonarQube S1871 - branches duplicados)
for (let tentativa = 1; tentativa <= 2; tentativa++) {
  try {
    await this.locatorAcoesButton.click({ force: true });
    await this.locatorMenuEditarLink.click({ force: true });
    break;
  } catch (error) {
    if (tentativa === 2) throw error;
  }
}
```

```javascript
// ❌ ERRADO - Branches duplicados (viola SonarQube S1871 / ESLint sonarjs/no-duplicated-branches)
try {
  await this.locatorAcoesButton.click({ force: true });
  await this.locatorMenuEditarLink.click({ force: true });
} catch {
  await this.locatorAcoesButton.click({ force: true });
  await this.locatorMenuEditarLink.click({ force: true });
}
```

```javascript
// ❌ ERRADO - Sem { force: true }
for (let tentativa = 1; tentativa <= 2; tentativa++) {
  try {
    await this.locatorAcoesButton.click();
    await this.locatorMenuEditarLink.click();
    break;
  } catch (error) {
    if (tentativa === 2) throw error;
  }
}
```

**Motivo:** Playwright auto-waiting é suficiente para 95% dos casos. Try/catch desnecessário polui código e viola YAGNI (You Aren't Gonna Need It). Para botões "Ações"/"Opções", usamos loop retry com `{ force: true }` que ignora checagens de visibilidade garantindo retry eficaz, sem violar SonarQube S1871.

---

## 🚨 **REGRAS ESPECÍFICAS DO PROJETO (NÃO do Playwright)**

### **A. Organização de Locators (Padrão do Projeto)**

> **⚠️ Decisão arquitetural:** TODOS os locators com strings literais, IDs, classes e seletores CSS NO CONSTRUCTOR

**🚨 REGRAS ABSOLUTAS - SEMPRE OBRIGATÓRIAS:**

1. **TODOS os `expect()` com getByText/getByRole + string literal NO CONSTRUCTOR**
   - ❌ PROIBIDO: `await expect(this.page.getByText('Data de Fechamento -')).toBeVisible();` dentro de método
   - ✅ OBRIGATÓRIO: `this.locatorDataFechamentoText = this.page.getByText('Data de Fechamento -');` no constructor

2. **TODOS os IDs/Classes/CSS inline NO CONSTRUCTOR como constantes**
   - ❌ PROIBIDO: `await this.formUtils.fillFieldPDropdown('#businessOrigin', dados.origem);`
   - ✅ OBRIGATÓRIO: `this.ID_ORIGEM_NEGOCIO_DROPDOWN = '#businessOrigin';` no constructor + `await this.formUtils.fillFieldPDropdown(this.ID_ORIGEM_NEGOCIO_DROPDOWN, dados.origem);`

3. **Locators-base para aninhamento (.filter, .locator) NO CONSTRUCTOR**
   - ❌ PROIBIDO: `const locator = this.page.locator('.kanban-card-title').filter({ hasText: dados.descricao });`
   - ✅ OBRIGATÓRIO: `this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title');` no constructor + `const locator = this.locatorKanbanCardTitleDiv.filter({ hasText: dados.descricao });` no método

---

### **A.1 Elementos com Múltiplos Contextos (OBRIGATÓRIO)**

> **⚠️ ERRO CRÍTICO COMUM:** Assumir que elementos com MESMO NOME têm IDs/seletores iguais em contextos diferentes

**📋 Contextos Comuns em Page Objects:**

- **Cadastro/Edição:** Formulário principal de criação/modificação
- **Filtro:** Campos de busca/filtro na listagem
- **Visualização:** Campos read-only em modal/tela de detalhes
- **Duplicação:** Formulário de cópia de registro

**🚨 PROCESSO OBRIGATÓRIO:**

1. **Identificar TODOS os contextos** onde o Page Object será usado
2. **Para CADA contexto:** Validar HTMLs específicos com `grep_search`
3. **NUNCA assumir** que campo "Descrição" no cadastro = campo "Descrição" no filtro
4. **Criar constantes ESPECÍFICAS** para cada contexto quando IDs/seletores forem diferentes

**❌ ANTI-PADRÃO CRÍTICO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Assumiu que ID é igual em todos os contextos
constructor(page) {
  this.page = page;
  // Analisou apenas crudPrincipal.html
  this.ID_DESCRICAO_INPUT = '#description'; // Usado em múltiplos métodos
}

async cadastrar(dados) {
  // HTML: crudPrincipal.html
  await this.page.locator(this.ID_DESCRICAO_INPUT).fill(dados.descricao); // Funciona neste HTML
}

async filtrar(dados) {
  // HTML: filtro.html
  await this.page.locator(this.ID_DESCRICAO_INPUT).fill(dados.descricao); // ERRO: ID diferente!
}
```

**✅ PADRÃO CORRETO:**

```javascript
// ✅ CORRETO - Validou HTMLs de CADA contexto independentemente
constructor(page) {
  this.page = page;

  this.ID_DESCRICAO_CADASTRO_INPUT = '#description';
  this.ID_EMPRESA_CADASTRO_LOOKUP = '#company-autocomplete';
  this.ID_DESCRICAO_FILTRO_INPUT = '#filter-description';
  this.ID_EMPRESA_FILTRO_INPUT = '#filter-company';

  this.locatorDescricaoView = this.page.getByText(/Descrição:/);
}

async cadastrar(dados) {
  // Usa IDs específicos do contexto de CADASTRO
  await this.page.locator(this.ID_DESCRICAO_CADASTRO_INPUT).fill(dados.descricao);
  await this.formUtils.fillFieldSLookup(this.ID_EMPRESA_CADASTRO_LOOKUP, dados.empresa);
}

async filtrar(dados) {
  // Usa IDs específicos do contexto de FILTRO
  await this.page.locator(this.ID_DESCRICAO_FILTRO_INPUT).fill(dados.descricao);
  await this.page.locator(this.ID_EMPRESA_FILTRO_INPUT).fill(dados.empresa);
}

async validarVisualizacao(dados) {
  // Usa locators específicos do contexto de VISUALIZAÇÃO
  await expect(this.locatorDescricaoView).toBeVisible();
}
```

**📊 DOCUMENTAÇÃO NO PLANO TÉCNICO (NÃO no código):**

> **🚨 ATENÇÃO:** Comentários de contexto/HTML são APENAS para documentação no PLANO TÉCNICO durante análise. **NUNCA adicionar no código do Page Object.**

**Documentar no plano técnico (Markdown):**

```markdown
## Mapeamento de Constantes por Contexto

| Constante | Contexto | HTML Origem | Linha | ID/Seletor Real |
|-----------|----------|-------------|-------|-----------------|
| `ID_DESCRICAO_CADASTRO` | Cadastro/Edição | crudPrincipal.html | 150 | `#description` |
| `ID_EMPRESA_CADASTRO` | Cadastro/Edição | crudPrincipal.html | 160 | `#company-autocomplete` |
| `ID_DESCRICAO_FILTRO` | Filtro | filtro.html | 89 | `#filter-description` |
| `ID_EMPRESA_FILTRO` | Filtro | filtro.html | 95 | `#filter-company` |
| `locatorDescricaoView` | Visualização | visualizacao.html | 45 | `getByText(/Descrição:/)` |

**⚠️ Atenção:** Campos "Descrição" e "Empresa" têm IDs DIFERENTES entre cadastro e filtro!
```

**❌ NUNCA FAZER (comentários verbose no código):**

```javascript
constructor(page) {
  this.page = page;

  // ============================================ ❌ ERRADO
  // CONTEXTO: CADASTRO/EDIÇÃO                  ❌ ERRADO
  // HTML: crudPrincipal.html                   ❌ ERRADO
  // Validado: grep_search em crudPrincipal.html ❌ ERRADO
  // ============================================ ❌ ERRADO
  this.ID_DESCRICAO_CADASTRO_INPUT = '#description';
}
```

**✅ QUEBRAS DE LINHAS SEM COMENTÁRIOS:**

```javascript
constructor(page) {
  this.page = page;

  this.ID_DESCRICAO_CADASTRO_INPUT = '#description';
  this.ID_EMPRESA_CADASTRO_LOOKUP = '#company-autocomplete';

  this.ID_DESCRICAO_FILTRO_INPUT = '#filter-description';
  this.ID_EMPRESA_FILTRO_INPUT = '#filter-company';
}
```

**💡 Checklist Anti-Erro:**

- [ ] Identifiquei TODOS os contextos onde o Page Object será usado?
- [ ] Executei `grep_search` em CADA HTML de CADA contexto?
- [ ] Validei que elementos com MESMO NOME podem ter IDs/seletores DIFERENTES?
- [ ] Criei constantes ESPECÍFICAS para cada contexto (ex: `_CADASTRO`, `_FILTRO`)?
- [ ] Documentei no constructor qual HTML cada constante referencia?
- [ ] Usei constante CORRETA em cada método (método `filtrar()` usa `ID_DESCRICAO_FILTRO`)?

**⛔ SE QUALQUER RESPOSTA FOR "NÃO":** Voltar e analisar TODOS os contextos antes de implementar

**Padrão do Projeto:**

```javascript
constructor(page) {
  this.page = page;

  // ✅ IDs de campos com símbolo CSS (#) — Padrão: ID_{DESCRICAO}_{TipoElemento}
  this.ID_CAMPO_LOOKUP = '#campo-autocomplete';
  this.ID_ORIGEM_NEGOCIO_DROPDOWN = '#businessOrigin';
  this.ID_TIPO_NEGOCIO_DROPDOWN = '#businessType';
  this.ID_CONTA_LOOKUP = '#account-autocomplete';
  this.ID_FUNIL_DROPDOWN = '#funnel';
  this.ID_ETAPA_FUNIL_DROPDOWN = '#funnelStep';

  // ✅ Classes CSS — Padrão: CLASS_{DESCRICAO}_{TipoElemento}
  this.CSS_SELECTOR_SUBMIT_BUTTON = 'button[type="submit"]';
  this.CSS_SELECTOR_REQUIRED_INPUT = 'input[required]';
  this.CSS_SELECTOR_KANBAN_DONE = '.kanban-card[data-status="done"]';

  // ✅ Locators DIRETOS (não aninhados em objeto) - Padrão: locator{Descrição}{Tipo}
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
  this.locatorTituloHeading = this.page.getByRole('heading', { name: 'Gerenciar' });

  // ✅ Locators com strings literais (para expect estáticos)
  this.locatorDataFechamentoText = this.page.getByText('Data de Fechamento -');
  this.locatorValorEstimadoText = this.page.getByText('Valor Estimado R$0,00');
  this.locatorValorRealizadoText = this.page.getByText('Valor Realizado R$0,00');

  // ✅ Locators-base para aninhamento posterior
  this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title');
  this.locatorKanbanCardDescriptionDiv = this.page.locator('.kanban-card-description');
  this.locatorKanbanCardFooterDiv = this.page.locator('.kanban-card-footer');
}

async validarDados() {
  // ✅ CORRETO - Usar locator do constructor
  await expect(this.locatorDataFechamentoText).toBeVisible();
  await expect(this.locatorValorEstimadoText).toBeVisible();
}

async preencherFormulario(dados) {
  // ✅ CORRETO - Usar constante ID do constructor
  await this.formUtils.fillFieldPDropdown(this.ID_ORIGEM_NEGOCIO_DROPDOWN, dados.origem);
  await this.formUtils.fillFieldSLookup(this.ID_CONTA_LOOKUP, dados.conta);
}

async validarCardKanban(dados) {
  // ✅ CORRETO - Usar locator-base do constructor + filtro dinâmico
  const locatorCardDescricao = this.locatorKanbanCardTitleDiv.filter({ hasText: dados.descricao });
  await expect(locatorCardDescricao).toBeVisible();
}
```

**❌ Anti-Padrões do Projeto:**

```javascript
// ❌ NÃO criar expect com string literal no método
async validarDados() {
  await expect(this.page.getByText('Data de Fechamento -')).toBeVisible(); // PROIBIDO
  await expect(this.page.getByText('Valor Estimado R$0,00')).toBeVisible(); // PROIBIDO
}

// ❌ NÃO usar IDs/Classes inline nos métodos
async preencherFormulario(dados) {
  await this.formUtils.fillFieldPDropdown('#businessOrigin', dados.origem); // PROIBIDO
  await this.formUtils.fillFieldSLookup('#account-autocomplete', dados.conta); // PROIBIDO
}

// ❌ NÃO criar locator-base inline sem constructor
async validarCard(dados) {
  const locator = this.page.locator('.kanban-card-title').filter({ hasText: dados.descricao }); // PROIBIDO
  await expect(locator).toBeVisible();
}

// ❌ NÃO usar objeto aninhado
this.locators = {
  botaoSalvar: this.page.getByRole('button', { name: 'Salvar' })
};

// ❌ NÃO criar método factory
static async create(page) { return new MinhaPage(page); }

// ❌ IDs/Classes sem símbolo CSS e sem sufixo de tipo
this.ID_CAMPO = 'campo-autocomplete'; // Falta '#' e sufixo _LOOKUP
this.CLASS_MODAL = 'modal-content';   // Falta '.' e sufixo _DIV
this.ID_ENVIAR = 'button[type="submit"]'; // Não é ID, é CSS → deveria ser CSS_ENVIAR_BUTTON
```

### **B. IDs de Campos no Constructor**

> **⚠️ TODOS os IDs de campos (s-lookup, p-dropdown, etc.) DEVEM ser constantes no constructor**
>
> **🚨 FORMATO OBRIGATÓRIO: IDs e Classes DEVEM incluir o símbolo do seletor CSS**

**NOMENCLATURA OBRIGATÓRIA DE CONSTANTES: `TIPO_{DESCRICAO}_{TipoElemento}`**

- **ID** (começa com `#`): `this.ID_CONTA_LOOKUP = '#account-autocomplete';`
- **Class** (começa com `.`): `this.CLASS_CONTEUDO_DIV = '.modal-content';`
- **CSS** (seletor genérico — tag, atributo, combinação, etc.): `this.CSS_ENVIAR_BUTTON = 'button[type="submit"]';`
- **XPath** (path — `//`, `/`, `[@attr]`, etc.): `this.XPATH_SALVAR_BUTTON = '//button[contains(text(),"Salvar")]';`

**Sufixos `{TipoElemento}` comuns:**

| Sufixo | Uso |
|--------|-----|
| `INPUT` | Campos de texto (`<input>`, `<textarea>`) |
| `LOOKUP` | Componentes s-lookup (`<s-lookup>`) |
| `DROPDOWN` | Componentes p-dropdown (`<p-dropdown>`) |
| `BUTTON` | Botões (`<button>`) |
| `TABLE` | Tabelas (`<table>`) |
| `DIV` | Containers/divs genéricos |
| `SPAN` | Elementos span |
| `CALENDAR` | Componentes p-calendar (`<p-calendar>`) |
| `DIALOG` | Modais/diálogos |
| `LABEL` | Labels |

> **Regra de decisão — Prefixo:** Se o valor começa com `#` → `ID_`. Se começa com `.` → `CLASS_`. Se é XPath (`//`, `/`) → `XPATH_`. Qualquer outro caso → `CSS_`.
>
> **Regra de decisão — Sufixo:** O último segmento SEMPRE indica o tipo de elemento HTML/componente alvo do seletor.

**❌ ANTI-PADRÃO CRÍTICO (NÃO FAZER):**

```javascript
constructor(page) {
  this.page = page;

  // ❌ ERRADO - IDs/Classes sem símbolo seletor CSS e sem sufixo de tipo
  this.ID_CAMPO = 'id-campo';           // Falta '#' e sufixo _LOOKUP
  this.CLASS_MODAL = 'modal-content';   // Falta '.' e sufixo _DIV
  this.ID_INPUT = 'container input';    // Seletor CSS, não é ID → deveria ser CSS_CONTAINER_INPUT
}
```

```javascript
async validarDadosEdicao(dados) {
  // ❌ ERRADO - Locators FIXOS fora do constructor (strings literais e seletores CSS fixos)
  await expect(this.page.getByText('Data de Fechamento -')).toBeVisible();
  await expect(this.page.getByText('Valor Estimado R$0,00')).toBeVisible();
  await expect(this.page.locator('table tbody tr')).toBeVisible();
  await this.formUtils.fillFieldSLookup('#id-campo', dados.valor);

  // ❌ ERRADO - Usar ID inline sem estar no constructor
  await this.page.locator('.class-campo').click();
}
```

```javascript
async validarDadosEdicao(dados) {
  // ✅ CORRETO - Locators DINÂMICOS no método (usa variável)
  await expect(this.page.getByText(dados.descricao)).toBeVisible();
  await expect(this.page.getByText(`Data ${dataAtual}`)).toBeVisible();
  await expect(this.page.locator(`tr[id="${dados.id}"]`)).toBeVisible();
  await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, dados.valor);
}
```

**✅ PADRÃO CORRETO COMPLETO:**

```javascript
constructor(page) {
  this.page = page;

  // ✅ CORRETO - Nomenclatura TIPO_{DESCRICAO}_{TipoElemento}
  this.ID_CAMPO_LOOKUP = '#campo-autocomplete';                       // ID + descricao + tipo componente
  this.CLASS_CONTEUDO_DIV = '.modal-content';                         // CLASS + descricao + tipo elemento
  this.CSS_CONTAINER_INPUT = 'div#container input#campo';             // CSS + descricao + tipo elemento
  this.CSS_ENVIAR_BUTTON = 'button[type="submit"]';                   // CSS + descricao + tipo elemento
  this.XPATH_SALVAR_BUTTON = '//button[contains(text(),"Salvar")]';   // XPATH + descricao + tipo elemento

  // ✅ CORRETO - Locators FIXOS no constructor (strings literais e seletores CSS fixos)
  this.locatorDataFechamentoText = this.page.getByText('Data de Fechamento -');
  this.locatorValorEstimadoText = this.page.getByText('Valor Estimado R$0,00');
  this.locatorTabelaBody = this.page.locator('table tbody tr');
}

async validarDadosEdicao(dados) {
  // ✅ CORRETO - Usar locators FIXOS do constructor
  await expect(this.locatorDataFechamentoText).toBeVisible();
  await expect(this.locatorValorEstimadoText).toBeVisible();
  await expect(this.locatorTabelaBody).toBeVisible();

  // ✅ CORRETO - Usar constantes do constructor (IDs/Classes)
  await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, dados.valor);
  await this.page.locator(this.CLASS_CONTEUDO_DIV).click();
  await this.page.locator(this.CSS_CONTAINER_INPUT).fill(dados.valor);

  // ✅ CORRETO - Locators DINÂMICOS no método (depende de variável)
  await expect(this.page.getByText(dados.descricao)).toBeVisible();
  await expect(this.page.getByText(`Data ${dataAtual}`)).toBeVisible();
  await expect(this.page.locator(`tr[id="${dados.id}"]`)).toBeVisible();
}
```

**VALIDAÇÃO OBRIGATÓRIA:**

Antes de finalizar, verificar se TODAS as constantes:

- **IDs** começam com `#` e têm sufixo de tipo (ex: `_LOOKUP`, `_DROPDOWN`, `_INPUT`)
- **Classes** começam com `.` e têm sufixo de tipo (ex: `_DIV`, `_SPAN`)
- **Seletores compostos** incluem símbolos completos e prefixo `CSS_`
- **XPaths** têm prefixo `XPATH_` e sufixo de tipo
- **TODAS** as constantes seguem o padrão `TIPO_{DESCRICAO}_{TipoElemento}`

**Motivo:** Constantes sem símbolo seletor CSS causam erro ao tentar localizar elementos. O Playwright requer seletor CSS completo em `page.locator()`.

---

### **C. Não Repetir Valor em fillFieldSLookup**

> **⚠️ Se valor e valorClique são iguais, passar apenas valor**

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Repetir valor desnecessariamente
await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, valor, valor);
```

**✅ PADRÃO CORRETO:**

```javascript
// ✅ CORRETO - Passar apenas valor (valorClique é opcional)
await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, valor);

// ✅ CORRETO - Passar valorClique somente se diferente
await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, valor, valorDiferente);
```

**Motivo:** O método `fillFieldSLookup` usa o valor como clique se valorClique não for fornecido.

---

## **REGRAS CRÍTICAS DE JSDOC**

> **📘 Regras completas, exemplos corretos/incorretos e checklist de validação: consulte a seção `📝 JSDoc - OBRIGATÓRIO` mais abaixo neste módulo.**

### **JSDoc Obrigatório para Parâmetros Object (RESUMO)**

> **🚨 REGRA ABSOLUTA: NUNCA DETALHAR CAMPOS INDIVIDUAIS DO JSON**
>
> **Motivo:** Evita duplicação de informação (dados estão no JSON) e desatualização quando JSON mudar.

> **⛔ VÍNCULO OBRIGATÓRIO: `@param {object}` ↔ `Exemplo: JSON_{CONSTANTE}`**
>
> A linha `Exemplo: JSON_{CONSTANTE}` é **OBRIGATÓRIA** e **EXCLUSIVAMENTE VINCULADA** a um `@param {object}`.
>
> - ✅ Existe `@param {object}` → **DEVE** existir `Exemplo: JSON_{CONSTANTE}` na linha seguinte
> - ✅ Existe `Exemplo: JSON_{CONSTANTE}` → **DEVE** existir `@param {object}` na linha anterior
> - ❌ **NUNCA** adicionar `Exemplo: JSON` sem `@param {object}` correspondente
> - ❌ **NUNCA** adicionar `@param {object}` sem `Exemplo: JSON` correspondente (quando JSON é conhecido)
> - ❌ **NUNCA** adicionar `Exemplo: JSON` no JSDoc da **classe** (exclusivo de métodos)
>
> **Onde NÃO se aplica:** `@param {object} page` (parâmetro do Playwright, não é JSON de dados)
>
> **🛡️ CHECKLIST ANTES DE ESCREVER `Exemplo:` (VALIDAR MENTALMENTE PARA CADA JSDoc):**
>
> 1. Estou escrevendo JSDoc de **classe** (`export class`)? → **PROIBIDO `Exemplo:`** — descreve apenas propósito geral
> 2. O método tem `@param {object}` que represente JSON de dados? → **OBRIGATÓRIO `Exemplo: JSON_{CONSTANTE}`**
> 3. O método **NÃO** tem `@param {object}`? (ex: `acessaTela()`, `limpar()`, `salvar()`) → **PROIBIDO `Exemplo:`**
> 4. O `@param {object}` é `page` do Playwright? → **NÃO se aplica** (não é JSON de dados)
>
> **⛔ SE resposta 1 ou 3 = SIM: REMOVA `Exemplo:` IMEDIATAMENTE**

**Exemplo completo de classe — onde `Exemplo:` é PROIBIDO vs CORRETO:**

```javascript
// ❌ ERRADO - Exemplo: aparece na classe e em método sem @param {object}
/**
 * Page Object para {NomeFuncionalidade}
 * Encapsula ações de {descrição}
 * Exemplo: JSON_{CONSTANTE}              ← ❌ PROIBIDO: JSDoc de classe
 */
export class {NomeFuncionalidade}Page {
  constructor(page) { /* ... */ }

  /**
   * Acessa a tela de {funcionalidade}
   * Exemplo: JSON_{CONSTANTE}            ← ❌ PROIBIDO: método sem @param {object}
   */
  async acessaTela() { }

  /**
   * Adiciona registro com dados
   * @param {object} dados - Dados do registro
   * Exemplo: JSON_{CONSTANTE}            ← ✅ CORRETO: método com @param {object}
   */
  async adicionarRegistro(dados) { }
}
```

```javascript
// ✅ CORRETO - Exemplo: aparece APENAS no método com @param {object}
/**
 * Page Object para {NomeFuncionalidade}
 * Encapsula ações de {descrição}
 */
export class {NomeFuncionalidade}Page {
  constructor(page) { /* ... */ }

  /**
   * Acessa a tela de {funcionalidade}
   */
  async acessaTela() { }

  /**
   * Adiciona registro com dados
   * @param {object} dados - Dados do registro
   * Exemplo: JSON_{CONSTANTE}
   */
  async adicionarRegistro(dados) { }
}
```

**Estrutura Obrigatória (APENAS em métodos, NUNCA em classes):**

```javascript
/**
 * Descrição do que o método faz
 * @param {object} dados - Descrição do parâmetro
 * Exemplo: JSON_{CONSTANTE}
 */
async nomeDoMetodo(dados) {
  // implementação
}
```

> **⚠️ ATENÇÃO:** A linha `Exemplo: JSON_{CONSTANTE}` é EXCLUSIVA de JSDoc de **métodos**.
> O JSDoc da **classe** NUNCA deve conter `Exemplo:` — descreve apenas a funcionalidade.

**Regras Rápidas:**

- ✅ **1 JSON:** `Exemplo: JSON_{CONSTANTE}`
- ✅ **Múltiplos JSONs:** `Exemplo: JSON_{CONSTANTE_1} ou JSON_{CONSTANTE_2}`
- ✅ Usar placeholder `JSON_{CONSTANTE}` nos templates, substituir pelo nome REAL do JSON na implementação
- ❌ **NUNCA detalhar campos:** `dados.campo1`, `dados.campo2`
- ❌ **NUNCA omitir** linha `Exemplo:` quando `@param {object}` existir e JSON for conhecido
- ❌ **NUNCA adicionar** linha `Exemplo:` sem `@param {object}` correspondente na linha anterior

**❌ ANTI-PADRÃO:**

```javascript
// ❌ ERRADO - Detalhando campos (PROIBIDO)
/**
 * @param {object} dados - Dados do registro
 * @param {string} dados.acao - 'incluir' ou 'editar'
 * @param {string} dados.descricao - Descrição
 */
async adicionarOuEditarRegistro(dados) { }
```

**✅ PADRÃO CORRETO:**

```javascript
// ✅ CORRETO - Simples e referenciado
/**
 * Adiciona ou edita registro conforme ação especificada
 * @param {object} dados - Dados do registro
 * Exemplo: JSON_{CONSTANTE}
 */
async adicionarOuEditarRegistro(dados) { }
```

---

### **Locators Sem Parâmetros SEMPRE no Constructor**

> **⚠️ REGRA UNIVERSAL: Qualquer locator que não depende de parâmetros DEVE ser declarado no constructor**

**Definição de "Locator Sem Parâmetros":**

- Locator com valor fixo/hardcoded
- Locator que não depende de dados do método
- Locator que não usa valores de parâmetros

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
async salvarFormulario() {
  // ❌ ERRADO - Todos estes locators usam STRINGS FIXAS e devem estar no constructor
  const locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' }); // ❌ String 'Salvar' é FIXA
  await locatorSalvarButton.click();
  await expect(this.page.getByText('Sucesso')).toBeVisible(); // ❌ String 'Sucesso' é FIXA
}

async preencherNome(nome) {
  // ❌ ERRADO - Locator com string FIXA fora do constructor
  const locatorNomeInput = this.page.getByLabel('Nome'); // ❌ String 'Nome' é FIXA
  await locatorNomeInput.fill(nome);
  await expect(this.page.getByRole('button', { name: 'Balão' })).toBeVisible(); // ❌ String 'Balão' é FIXA
}
```

**✅ PADRÃO CORRETO:**

```javascript
constructor(page) {
  this.page = page;

  // ✅ CORRETO - TODOS locators sem parâmetros no constructor
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
  this.locatorNomeInput = this.page.getByLabel('Nome');
  this.locatorTabelaRegistros = this.page.getByRole('table');
  this.locatorLinhaFaturamentoDevolucao = this.page.getByRole('row').filter({ hasText: 'Faturamento devolução' });
}

async salvarFormulario() {
  // ✅ CORRETO - Usar locator do constructor
  await this.locatorSalvarButton.click();
}

async preencherNome(nome) {
  // ✅ CORRETO - Usar locator do constructor
  await this.locatorNomeInput.fill(nome);
  await expect(this.locatorLinhaFaturamentoDevolucao).toBeVisible();
}
```

**Exceção ÚNICA Permitida (Locators Dinâmicos):**

```javascript
async buscarRegistroPorNome(nomeRegistro) {
  // ✅ PERMITIDO - Locator dinâmico (usa parâmetro/variável)
  const locatorLinhaRegistro = this.page.getByRole('row').filter({ hasText: nomeRegistro });
  await locatorLinhaRegistro.click();
}

async validarDados(dados) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  // ✅ PERMITIDO - Locators dinâmicos (usam variáveis)
  await expect(this.page.getByText(dados.descricao)).toBeVisible();
  await expect(this.page.getByText(`Data de Abertura ${dataAtual}`)).toBeVisible();
}
```

**🔍 VALIDAÇÃO OBRIGATÓRIA (ANTES DE FINALIZAR):**

```bash
# Executar grep para encontrar TODOS os locators no arquivo
grep_search(query="this\\.(page|frame)\\.(getBy|locator|frameLocator)",
            includePattern="{arquivo}Page.js",
            isRegexp=true)

# Para CADA resultado verificar:
# 1. Está no constructor? → ✅ OK
# 2. Está no método E usa STRING FIXA ou SELETOR CSS FIXO? → ❌ MOVER PARA CONSTRUCTOR
# 3. Está no método E usa VARIÁVEL/PARÂMETRO? → ✅ OK

# Exemplos de STRING/SELETOR FIXO (DEVEM estar no constructor):
# - this.page.getByRole('button', { name: 'Salvar' })  ← String 'Salvar' é FIXA
# - this.page.getByText('Sucesso')                     ← String 'Sucesso' é FIXA
# - this.page.locator('table tbody tr')                ← Seletor CSS é FIXO
# - this.frame.locator('.modal-content')               ← Classe CSS é FIXA

# Exemplos de VARIÁVEL (PODEM ficar no método):
# - this.page.getByText(dados.nome)                    ← Usa variável
# - this.page.locator(`tr:has-text("${id}")`)          ← Usa template literal com variável
# - this.locatorRegistrosTable.locator('tr').filter({ hasText: nome }) ← Encadeia com variável
```

**Checklist de Decisão:**

| Pergunta | Resposta | Ação |
|----------|----------|------|
| Locator usa valor fixo? | SIM | ✅ Constructor |
| Locator usa valor de parâmetro? | NÃO | ✅ Constructor |
| Locator usa `.filter()` com variável? | NÃO | ✅ Constructor |
| Locator depende de dados do método? | NÃO | ✅ Constructor |
| Locator usa parâmetro do método? | SIM | ✅ Pode ficar no método |

**Motivo:** Centralizar todos locators estáticos facilita manutenção e evita duplicação.

---

### **D. Try/Catch Obrigatório para Botões "Ações" e "Opções"**

> **⚠️ REGRA CRÍTICA E OBRIGATÓRIA: Botões "Ações" e "Opções" que abrem menu dropdown DEVEM SEMPRE usar try/catch com `{ force: true }` para garantir execução confiável**

**🔍 DETECÇÃO AUTOMÁTICA - QUANDO APLICAR:**

Aplicar esta regra quando identificar botão com:
- Estrutura HTML: `<s-button><p-tieredmenu appendto="body"></p-tieredmenu><button>Ações</button></s-button>`
- Texto comum: "Ações" ou "Opções" (mas pode ser qualquer texto)
- Localizado em grids/tabelas
- Menu items renderizados no `body` (FORA da estrutura do botão)

**🚨 PADRÃO OBRIGATÓRIO:**

```javascript
constructor(page) {
  this.page = page;

  // ✅ Locator do botão (dentro do grid)
  this.locatorAcoesButton = this.page.getByRole('button', { name: 'Ações' });

  // ✅ Locators das opções do menu (renderizadas no body)
  this.locatorMenuEditarLink = this.page.getByRole('menuitem', { name: 'Editar' });
  this.locatorMenuDuplicarLink = this.page.getByRole('menuitem', { name: 'Duplicar' });
  this.locatorMenuExcluirLink = this.page.getByRole('menuitem', { name: 'Excluir' });
}

/**
 * Abre modal de edição do registro via menu Ações
 */
async abrirEdicao() {
  // Retry obrigatório: appendto="body" em s-button causa problema visual intermitente
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      await this.locatorAcoesButton.click({ force: true });
      await this.locatorMenuEditarLink.click({ force: true });
      break;
    } catch (error) {
      if (tentativa === 2) throw error;
    }
  }
}

/**
 * Duplica o registro selecionado via menu Ações
 */
async duplicarRegistro() {
  // Retry obrigatório: appendto="body" em s-button causa problema visual intermitente
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      await this.locatorAcoesButton.click({ force: true });
      await this.locatorMenuDuplicarLink.click({ force: true });
      break;
    } catch (error) {
      if (tentativa === 2) throw error;
    }
  }
}
```

**📋 CHECKLIST OBRIGATÓRIO:**

- [ ] Loop `for` com `tentativa <= 2` cerca TODA a sequência (botão + opção do menu)
- [ ] AMBOS os cliques usam `{ force: true }`
- [ ] Bloco catch faz re-throw na última tentativa (`if (tentativa === 2) throw error`)
- [ ] Bloco try termina com `break` para sair do loop em caso de sucesso
- [ ] Comentário documentando motivo: `// Retry obrigatório: appendto="body" em s-button causa problema visual intermitente`

**❌ ANTI-PADRÕES (NÃO FAZER):**

```javascript
// ❌ ERRADO - Sem retry
async abrirEdicao() {
  await this.locatorAcoesButton.click();
  await this.locatorMenuEditarLink.click();
}

// ❌ ERRADO - Branches duplicados (viola SonarQube S1871)
async abrirEdicao() {
  try {
    await this.locatorAcoesButton.click({ force: true });
    await this.locatorMenuEditarLink.click({ force: true });
  } catch {
    await this.locatorAcoesButton.click({ force: true });
    await this.locatorMenuEditarLink.click({ force: true });
  }
}

// ❌ ERRADO - Sem { force: true }
async abrirEdicao() {
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      await this.locatorAcoesButton.click();
      await this.locatorMenuEditarLink.click();
      break;
    } catch (error) {
      if (tentativa === 2) throw error;
    }
  }
}

// ❌ ERRADO - Usando timeout/wait
async abrirEdicao() {
  await this.locatorAcoesButton.click();
  await this.page.waitForTimeout(1000);
  await this.locatorMenuEditarLink.click();
}
```

**⚙️ MOTIVO TÉCNICO:**

- Menu com `appendto="body"` causa problema visual de carregamento
- Primeiro clique pode não abrir as opções corretamente
- `{ force: true }` ignora checagens de visibilidade/interatividade
- Try/catch garante retry automático sem adicionar waits desnecessários

**🎯 APLICAÇÃO:**

- **SEMPRE:** Botões "Ações"/"Opções" em grids com `p-tieredmenu appendto="body"`
- **NUNCA:** Cliques normais (getByRole('button').click() sem menu dropdown)

---

### **E. Proibido Múltiplos Seletores CSS em Um Locator**

> **⚠️ REGRA CRÍTICA: NUNCA usar múltiplos seletores CSS separados por vírgula ou seletores complexos desnecessários em um único locator**

**DEFINIÇÃO DE ANTI-PADRÃO:**

- Locator com múltiplos seletores CSS separados por vírgula (`,`)
- Seletores com wildcards complexos (`[class*="..."][class*="..."]`)
- Tentar "cobrir todas as possibilidades" em um único locator

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
constructor(page) {
  this.page = page;

  // ❌ ERRADO - Múltiplos seletores CSS com vírgula
  this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title, .kanban-item__header, [class*="kanban"][class*="title"]');

  // ❌ ERRADO - Seletor complexo desnecessário
  this.locatorModalDialog = this.page.locator('[class*="modal"][class*="content"], .modal-dialog, #modal');

  // ❌ ERRADO - Tentando cobrir múltiplas variações
  this.locatorBotao = this.page.locator('button.primary, button.main, button[type="submit"]');
}
```

**✅ PADRÃO CORRETO:**

```javascript
constructor(page) {
  this.page = page;

  // ✅ CORRETO - Validar HTML e usar APENAS o seletor REAL que existe
  // Após grep_search no HTML, identificar que a classe real é .kanban-card-title
  this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title');

  // ✅ CORRETO - Se elemento tem role, usar getByRole
  this.locatorModalDialog = this.page.getByRole('dialog');

  // ✅ CORRETO - Usar locator semântico do Playwright
  this.locatorBotaoSubmit = this.page.getByRole('button', { name: 'Enviar' });
}
```

**PROCESSO OBRIGATÓRIO:**

1. **Executar grep_search no HTML específico** para identificar o seletor REAL
2. **Usar APENAS o seletor que existe no HTML** (não tentar "prever" variações)
3. **Priorizar locators semânticos** (getByRole, getByText) ao invés de CSS
4. **Se precisar de CSS:** Usar APENAS uma classe/ID, não múltiplas opções

**Por quê locators com múltiplos seletores são ruins:**

- ❌ **Frágeis:** Se qualquer um dos seletores mudar, locator pode quebrar
- ❌ **Ambíguos:** Não fica claro qual elemento será encontrado
- ❌ **Difíceis de debugar:** Quando falha, não se sabe qual seletor causou o problema
- ❌ **Performance:** Playwright precisa testar múltiplos seletores
- ❌ **Manutenção:** Impossível saber qual seletor está em uso sem testar

**VALIDAÇÃO OBRIGATÓRIA (grep_search no HTML):**

```bash
# PASSO 1: Identificar elemento no HTML
grep_search(query="{texto_elemento}", includePattern="{arquivo}.html", isRegexp=false)

# PASSO 2: Ler contexto HTML para ver estrutura REAL
read_file(startLine={linha-10}, endLine={linha+10})

# PASSO 3: Usar APENAS o seletor/role que existe no HTML
# NUNCA tentar "cobrir possibilidades" com múltiplos seletores
```

**Motivo:** Locators devem ser precisos e baseados no HTML REAL, não em suposições ou tentativas de "cobrir variações".

---

### **F. Proibido Criar Locators Não Utilizados**

> **⚠️ REGRA CRÍTICA: NUNCA criar locators no constructor que não são usados em nenhum método**

**DEFINIÇÃO DE LOCATOR ÓRFÃO:**

Locator declarado no constructor mas que NÃO aparece em NENHUM método da classe.

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
constructor(page) {
  this.page = page;

  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
  this.locatorBotaoCancelar = this.page.getByRole('button', { name: 'Cancelar' });
  this.locatorKanbanCardBody = this.page.locator('.kanban-card-body'); // ❌ NUNCA usado
  this.locatorModalConfirmacao = this.page.getByRole('dialog'); // ❌ NUNCA usado
}

async salvarRegistro() {
  await this.locatorSalvarButton.click();
  // locatorBotaoCancelar, locatorKanbanCardBody e locatorModalConfirmacao NUNCA são usados
}
```

**✅ PADRÃO CORRETO:**

```javascript
constructor(page) {
  this.page = page;

  // ✅ CORRETO - Criar APENAS locators que serão usados
  this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
  this.locatorBotaoCancelar = this.page.getByRole('button', { name: 'Cancelar' });
}

async salvarRegistro() {
  await this.locatorSalvarButton.click();
}

async cancelarEdicao() {
  await this.locatorBotaoCancelar.click();
}
```

**PROCESSO DE VALIDAÇÃO OBRIGATÓRIO (ANTES DE FINALIZAR):**

```bash
# PASSO 1: Listar TODOS os locators do constructor
grep_search(query="this\\.locator", includePattern="{arquivo}Page.js", isRegexp=true)

# PASSO 2: Para CADA locator encontrado, verificar se é usado:
grep_search(query="{nomeLocator}", includePattern="{arquivo}Page.js", isRegexp=false)

# PASSO 3: Contar ocorrências:
# - 1 ocorrência = APENAS no constructor (ÓRFÃO - REMOVER)
# - 2+ ocorrências = constructor + método(s) (OK)

# PASSO 4: Remover TODOS os locators com apenas 1 ocorrência
```

**Checklist de Validação:**

| Locator | Ocorrências | Status | Ação |
|---------|-------------|--------|------|
| `this.locatorSalvarButton` | 3 (constructor + 2 métodos) | ✅ USADO | Manter |
| `this.locatorKanbanCardBody` | 1 (apenas constructor) | ❌ ÓRFÃO | Remover |
| `this.locatorModalConfirmacao` | 1 (apenas constructor) | ❌ ÓRFÃO | Remover |

**Por quê locators órfãos são ruins:**

- ❌ **Poluição de código:** Dificulta leitura do constructor
- ❌ **Manutenção:** Alguém pode achar que é usado e ter medo de remover
- ❌ **Confusão:** Pode indicar funcionalidade incompleta
- ❌ **Performance mínima:** Consome memória desnecessariamente

**EXCEÇÃO ÚNICA PERMITIDA:**

Locators para **funcionalidades futuras** DEVEM ter comentário explícito:

```javascript
// TODO: Implementar validação de modal (JIRA-123)
// this.locatorModalConfirmacao = this.page.getByRole('dialog');
```

**Motivo:** Constructor deve conter APENAS locators que são efetivamente utilizados nos métodos implementados.

---

### **G. Proibido eslint-disable Sem Justificativa Válida**

> **⚠️ REGRA CRÍTICA: NUNCA usar `// eslint-disable-next-line` ou `// eslint-disable` sem justificativa técnica válida**

**QUANDO eslint-disable É PROIBIDO:**

- ❌ Para silenciar warning que indica código incorreto
- ❌ Para "facilitar" implementação ignorando boas práticas
- ❌ Para contornar regra do Playwright sem entender o motivo
- ❌ Sem comentário explicando POR QUE é necessário

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Silenciando warning de má prática sem justificativa
async buscarPrimeiroRegistro() {
  // eslint-disable-next-line playwright/no-nth-methods
  return this.page.locator('tr').first();
}

// ❌ ERRADO - Desabilitando regra que deveria ser seguida
async acessarTela() {
  // eslint-disable-next-line playwright/missing-playwright-await
  this.page.goto('/tela'); // ❌ Falta await
}

// ❌ ERRADO - Desabilitando para arquivo inteiro sem razão
/* eslint-disable playwright/no-wait-for-timeout */
```

**✅ QUANDO eslint-disable É PERMITIDO (RARO):**

```javascript
// ✅ PERMITIDO - Caso específico com justificativa técnica válida
async buscarRegistroPorPosicao(posicao) {
  // eslint-disable-next-line playwright/no-nth-methods
  // Justificativa: Posição é parâmetro do método, não pode usar constructor
  // Alternativas esgotadas: filtros por texto/role não aplicáveis
  return this.page.locator('tr').nth(posicao);
}

// ✅ PERMITIDO - Biblioteca externa sem tipos
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lib = require('biblioteca-legada');
```

**PROCESSO OBRIGATÓRIO ANTES DE USAR eslint-disable:**

1. **Entender o warning:** Ler documentação da regra no ESLint/Playwright
2. **Tentar corrigir o código:** Aplicar a correção sugerida pela regra
3. **Buscar alternativas:** Consultar Playwright docs para solução adequada
4. **Validar necessidade:** Confirmar que NÃO há forma de seguir a regra
5. **Documentar justificativa:** Comentário COMPLETO explicando:
   - Por que a regra não pode ser seguida
   - Quais alternativas foram tentadas
   - Por que esta é a única solução

**REGRAS DE eslint-disable MAIS VIOLADAS (E COMO CORRIGIR):**

| Regra Violada | ❌ Código Errado com disable | ✅ Código Correto SEM disable |
|---------------|------------------------------|--------------------------------|
| `playwright/no-nth-methods` | `// eslint-disable`<br>`locator.first()` | `this.locatorPrimeiraLinha = this.locator.first();` no constructor |
| `playwright/missing-playwright-await` | `// eslint-disable`<br>`page.goto(url)` | `await page.goto(url)` |
| `playwright/no-wait-for-timeout` | `// eslint-disable`<br>`page.waitForTimeout(1000)` | Usar `expect(locator).toBeVisible()` (auto-wait) |
| `playwright/no-page-pause` | `// eslint-disable`<br>`await page.pause()` | Remover pause (usar apenas em debug local) |

**VALIDAÇÃO OBRIGATÓRIA (ANTES DE FINALIZAR):**

```bash
# Buscar TODOS os eslint-disable no arquivo
grep_search(query="eslint-disable", includePattern="{arquivo}Page.js", isRegexp=false)

# Para CADA ocorrência:
# 1. Ler contexto (5 linhas antes/depois)
# 2. Identificar qual regra está sendo desabilitada
# 3. Verificar se há justificativa técnica em comentário
# 4. Validar se código pode ser corrigido ao invés de desabilitar
# 5. Se NÃO houver justificativa válida: REMOVER eslint-disable e CORRIGIR código
```

**Por quê eslint-disable sem justificativa é ruim:**

- ❌ **Silencia problemas reais:** Warnings existem para melhorar qualidade
- ❌ **Técnica ruim aceita:** Perpetua má prática ao invés de corrigir
- ❌ **Dificulta code review:** Reviewer não sabe se foi intencional ou esquecimento
- ❌ **Degrada codebase:** Acúmulo de exceções torna código menos confiável

**Motivo:** ESLint e regras do Playwright existem para garantir qualidade e confiabilidade. Desabilitar sem justificativa técnica válida compromete estes objetivos.

---

## **REGRAS CRÍTICAS DE IMPORTS**

### **A. Imports de Dependências Externas**

> **⚠️ NUNCA usar caminhos internos de pacotes externos quando houver exportação pública disponível**

---

### **B. Imports de Navegação Obrigatório**

> **⚠️ SEMPRE importar constante de navegação de `helpers/navegacao.js`**

**✅ PADRÃO CORRETO:**

```javascript
import { NOME_FUNCIONALIDADE } from '../../helpers/navegacao.js';
```

**Uso no método `acessarTela()`:**

```javascript
async acessarTela() {
  // Navega para a URL especificada
  await this.page.goto(NOME_FUNCIONALIDADE.URL);
  // OU
  await this.funcionalidadePage.navegarParaPagina(...NOME_FUNCIONALIDADE.DIRETORIO);

  await expect(this.locatorHeadingPrincipal).toBeVisible();
}
```

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Método recebendo parâmetro de URL
async acessarTela(url) {
  await this.page.goto(url);
}

// ❌ ERRADO - URL hardcoded
async acessarTela() {
  await this.page.goto('https://sistema.com/modulo/tela');
}
```

---

## 📊 **RESUMO EXECUTIVO: 13 Regras de Ouro**

| # | Regra | O que fazer | O que NÃO fazer |
|---|-------|-------------|-----------------|
| **1** | **Métodos Completos** | Fluxo inteiro com blocos lógicos internos (comentários estratégicos) | ❌ Fragmentar em micro-métodos OU criar métodos gigantes confusos |
| **2** | **Locators no Constructor** | TODOS locators estáticos no constructor | ❌ Criar locators inline nos métodos |
| **3** | **Sem Ações nos Testes** | Encapsular TUDO em métodos do Page Object | ❌ `.click()`, `.fill()`, `expect()` diretos nos testes |
| **4** | **Auxiliares Úteis** | Criar auxiliar SOMENTE se usado 3+ vezes | ❌ Métodos triviais (1 comando) |
| **5** | **Clean Code** | Nomes descritivos em português, DRY, validações | ❌ Nomes genéricos, inglês, duplicação |
| **6** | **Try/Catch "Ações"** | SEMPRE try/catch para botões "Ações"/"Opções" em grids | ❌ Clique direto sem retry (falha intermitente) |
| **7** | **JSDoc com JSON** | `@param {object} dados` + linha `Exemplo: JSON_CONSTANTE` | ❌ Omitir ou detalhar campos |
| **8** | **Locators Sem Parâmetro** | SEMPRE no constructor (regra universal) | ❌ Criar locator sem parâmetro no método |
| **9** | **Timeout Padrão** | Usar timeout global do Playwright (30s) | ❌ NUNCA usar `{ timeout: X }` em expect/ações |
| **10** | **Imports Públicos** | Usar exportações públicas do pacote | ❌ caminhos internos de dependência |
| **11** | **Seletor CSS Único** | Usar APENAS seletor real do HTML validado com grep | ❌ Múltiplos seletores com vírgula (`.a, .b, .c`) |
| **12** | **Sem Locators Órfãos** | Criar APENAS locators usados (validar com grep) | ❌ Locators no constructor não usados em métodos |
| **13** | **eslint-disable Justificado** | Usar APENAS com comentário explicando motivo técnico | ❌ eslint-disable sem justificativa ou para contornar má prática |

---

## 🎯 **Propósito**

Page Objects encapsulam a interação com elementos da interface e ações de usuário em uma página/tela.

**Quando criar:**

- Representar uma tela/funcionalidade específica do sistema
- Encapsular locators e métodos de interação com a UI
- Reutilizar ações comuns em múltiplos testes

**Quando NÃO criar:**

- Para operações de backend/serviços externos

---

## 📁 **Page Object Model (POM)**

### **Diretrizes Fundamentais:**

- ✅ Uma classe por página/componente em `pages/`
- ✅ **Métodos representam ações de negócio ou ações de usuário específicas**
- ✅ **Cada método deve ter propósito único, nome claro e ser reutilizável quando aplicável**
- ✅ **Métodos estruturados de forma semântica:** comandos agrupados com responsabilidade clara
- ✅ **IDIOMA OBRIGATÓRIO: Português** - Todos os métodos, variáveis e comentários DEVEM ser em português (nunca misturar inglês com português)
- ❌ **NUNCA** seletores hardcoded nos métodos
- ❌ **NUNCA** criar métodos triviais como `clicarBotao()`, `clickButton()`, `click()` - prefira ações de negócio como `salvarFormulario()`, `confirmarExclusao()`, `aplicarFiltros()`
- ❌ **NUNCA** misturar inglês com português na nomenclatura de métodos ou variáveis

---

## 🎯 **REGRA #1: Métodos Completos e Funcionais**

> **⚠️ ESTA É A REGRA MAIS IMPORTANTE DO PAGE OBJECT**
>
> **Métodos devem realizar FLUXOS COMPLETOS de negócio, organizados internamente em blocos lógicos claros**

### **🏗️ Estrutura de Métodos Ideal:**

**Cada método deve:**

1. **Realizar um fluxo completo de negócio** (não fragmentar demais)
2. **Organizar internamente em blocos lógicos** (com comentários estratégicos)
3. **Manter boa legibilidade** (código limpo e autoexplicativo)
4. **Validar estados importantes** com `expect()`
5. **Usar apenas locators do construtor** (nada de criar locators inline, exceto dinâmicos)

> **📘 Para ordem de prioridade ao criar locators:** Consulte `.github/copilot-modules/03-locators-semanticos.md`

---

---

## 📦 **Template de Imports (OBRIGATÓRIO)**

```javascript
// ✅ Imports de navegação (SEMPRE de helpers/navegacao.js)
import { NOME_FUNCIONALIDADE } from '../../helpers/navegacao.js';

// ✅ Imports de constantes (se necessário)
import { ID_CONTA_LOOKUP, ID_TIPO_DROPDOWN } from '../../data/{caminho}/{arquivo}Json.js';
```

**Checklist de Imports:**

- [ ] Navegação importada de `helpers/navegacao.js`
- [ ] Extensão `.js` presente em imports relativos
- [ ] Sem erros de resolução de módulos

---

### **✅ CRIAR Métodos Para:**

#### **1. Ações de Negócio Completas (Fluxo Inteiro)**

**Princípio Fundamental:** Um método = uma ação completa do usuário, organizada internamente em blocos lógicos claros.

**🎯 Equilíbrio Ideal:**

- ✅ **Método completo:** Representa fluxo de negócio inteiro (não fragmentar)
- ✅ **Organização interna:** Dividir em blocos lógicos com comentários estratégicos
- ❌ **Evitar:** Métodos gigantes e confusos (sem organização)
- ❌ **Evitar:** Fragmentação exagerada em micro-métodos triviais

**Exemplos de fluxos completos:**

- **Cadastrar registro completo:** Abrir formulário + preencher todos campos + salvar + validar sucesso
- **Editar registro:** Localizar na tabela + abrir edição + modificar campos + salvar + validar
- **Excluir com confirmação:** Selecionar item + abrir modal + confirmar + validar remoção
- **Aplicar filtros:** Expandir painel + preencher critérios + executar busca + validar resultados

**🎯 Exemplo de Organização Interna Ideal:**

```javascript
async cadastrarPortaria(dados) {
  // Abre modal de cadastro e aguarda carregamento completo
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalCadastro).toBeVisible();

  // Preenche campos obrigatórios
  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldSLookup(ID_LOCAL_FISICO, dados.localFisico);
  await this.locatorValidadeProvInput.fill(dados.validadeProvisoria);

  // Preenche campos opcionais
  if (dados.validadeAgendamento) {
    await this.locatorValidadeAgendInput.fill(dados.validadeAgendamento);
  }

  if (dados.controleVisitas) {
    await this.locatorControleVisitasCheckbox.check();
  }

  // Submete o formulário e valida sucesso
  await this.locatorSalvarButton.click();
  await expect(this.locatorSucessoAlert).toBeVisible();
  await expect(this.locatorModalCadastro).toBeHidden();
}
```

**✅ BOM porque:**

- **Fluxo completo:** Um método contém toda a jornada de cadastro
- **Blocos claros:** Cada seção tem propósito bem definido (Abertura, Preenchimento, Submissão)
- **Comentários estratégicos:** Demarcam início de cada bloco lógico
- **Legibilidade:** Fácil entender o que cada parte faz
- **Manutenibilidade:** Mudanças localizadas em blocos específicos
- **Sem fragmentação:** Não precisa chamar 5 métodos diferentes para cadastrar

**❌ CONTRA-EXEMPLO: Fragmentação Excessiva (NÃO FAZER):**

```javascript
// ❌ ERRADO: 4 métodos pequenos para uma ação só
async abrirModalCadastro() {
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalCadastro).toBeVisible();
}

async preencherCamposObrigatorios(dados) {
  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldSLookup(ID_LOCAL_FISICO, dados.localFisico);
}

async preencherCamposOpcionais(dados) {
  if (dados.validadeAgendamento) {
    await this.locatorValidadeAgendInput.fill(dados.validadeAgendamento);
  }
}

async submeterFormulario() {
  await this.locatorSalvarButton.click();
  await expect(this.locatorSucessoAlert).toBeVisible();
}

// PROBLEMA: Agora o teste precisa chamar 4 métodos para 1 ação:
// await page.abrirModalCadastro();
// await page.preencherCamposObrigatorios(dados);
// await page.preencherCamposOpcionais(dados);
// await page.submeterFormulario();
// IMPACTO: Código verboso, dificulta manutenção, viola Clean Code
```

**❌ CONTRA-EXEMPLO: Método Gigante Sem Organização (NÃO FAZER):**

```javascript
// ❌ ERRADO: Método gigante sem blocos lógicos
async cadastrarPortaria(dados) {
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalCadastro).toBeVisible();
  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldSLookup(ID_LOCAL_FISICO, dados.localFisico);
  await this.locatorValidadeProvInput.fill(dados.validadeProvisoria);
  if (dados.validadeAgendamento) {
    await this.locatorValidadeAgendInput.fill(dados.validadeAgendamento);
  }
  if (dados.controleVisitas) {
    await this.locatorControleVisitasCheckbox.check();
  }
  await this.locatorSalvarButton.click();
  await expect(this.locatorSucessoAlert).toBeVisible();
  await expect(this.locatorModalCadastro).toBeHidden();
}
// PROBLEMA: Difícil identificar onde começa/termina cada etapa
// IMPACTO: Manutenção confusa, dificulta debug
```

**🎯 Regra Prática:**

| Situação | Solução |
|----------|---------|
| **Fluxo de negócio completo** (cadastrar, editar, excluir, filtrar) | ✅ **1 método completo** com blocos lógicos internos |
| **Método ficando muito grande** (>25 linhas) | ✅ **Dividir em blocos** com comentários claros (NÃO criar micro-métodos) |
| **Lógica se repete 3+ vezes** | ✅ **Criar método auxiliar** reutilizável (ex: `aguardarCarregamento()`) |
| **Método trivial** (1-2 comandos) | ❌ **NÃO criar** - incorporar no método principal |

---

#### **2. Validações de Negócio (Estado/Resultado)**

- **Validar carregamento completo da tela:** Título + elementos principais + ausência de loading
- **Validar resultado de ação:** Toast + atualização de dados + estado final correto
- **Validar presença de registro:** Buscar na tabela + extrair dados + retornar objeto

**Exemplo:**

```javascript
async validarPortariaCadastrada(nomePortaria) {
  // Aguardar desaparecimento do loading
  await expect(this.locatorCarregandoSpinner).toBeHidden();

  // Localizar registro na tabela
  const locatorLinha = this.locatorRegistrosTable.locator('tbody tr').filter({ hasText: nomePortaria });
  await expect(locatorLinha).toBeVisible();

  // Extrair e retornar dados (para validações adicionais no teste)
  const nome = await locatorLinha.locator('td').nth(1).textContent();
  const status = await locatorLinha.locator('td').nth(2).textContent();

  return { nome: nome.trim(), status: status.trim() };
}
```

---

#### **3. Método `acessarTela()` (OBRIGATÓRIO)**

> **🚨 REGRA CRÍTICA ABSOLUTA - VIOLAÇÃO FREQUENTE:**
>
> **⛔ Método `acessarTela()` NUNCA, EM NENHUMA CIRCUNSTÂNCIA, RECEBE PARÂMETROS**

**🔴 PROCESSO OBRIGATÓRIO (3 PASSOS):**

**PASSO 1:** Importar constante de navegação no topo do arquivo

```javascript
import { NOME_FUNCIONALIDADE_REAL } from '../../helpers/navegacao.js'; // Substitua pelo nome REAL de navegacao.js
```

**PASSO 2:** Criar método SEM parâmetros

```javascript
/**
 * Acessa a tela de [Nome da Funcionalidade]
 */
async acessarTela() {
  // Opção 1: Navega diretamente pela URL
  await this.page.goto(NOME_FUNCIONALIDADE_REAL.URL);

  // Opção 2: Navega pelo menu usando spread operator
  await this.funcionalidadePage.navegarParaPagina(...NOME_FUNCIONALIDADE_REAL.DIRETORIO);

  // Aguarda elemento principal da tela
  await expect(this.locatorTituloPrincipal).toBeVisible();
}
```

**PASSO 3:** Usar no teste SEM passar parâmetros

```javascript
// ✅ CORRETO - Chamada sem parâmetros
test.beforeEach(async ({ page }) => {
  logger.test(test.info().title);
  await page.funcionalidadePage.login(TOKEN_USUARIO);
  await page.funcionalidadePage.acessarTela(); // Sem argumentos
});
```

---

**❌ IMPLEMENTAÇÕES INCORRETAS (NÃO FAZER):**

```javascript
// ❌ ERRO CRÍTICO #1 - Parâmetro na assinatura
async acessarTela(url) { // ❌ NUNCA adicionar parâmetros aqui
  await this.page.goto(url);
}

// ❌ ERRO CRÍTICO #2 - Parâmetro de constante
async acessarTela(CONSTANTE_NAVEGACAO) { // ❌ NUNCA adicionar parâmetros aqui
  await this.page.goto(CONSTANTE_NAVEGACAO.URL);
}

// ❌ ERRO #3 - URL hardcoded (sem importar constante)
async acessarTela() {
  await this.page.goto('https://sistema.com/tela'); // ❌ URL hardcoded
}

// ❌ ERRO #4 - Variável indefinida (não importou constante)
async acessarTela() {
  await this.page.goto(NOME_FUNCIONALIDADE_REAL.URL); // ❌ Constante não foi importada
}
```

---

**❌ CHAMADAS INCORRETAS NO TESTE:**

```javascript
// ❌ ERRO - Passando constante como parâmetro
await page.funcionalidadePage.acessarTela(NOME_FUNCIONALIDADE_REAL);

// ❌ ERRO - Passando URL como parâmetro
await page.funcionalidadePage.acessarTela(NOME_FUNCIONALIDADE_REAL.URL);

// ❌ ERRO - Passando string
await page.funcionalidadePage.acessarTela('url');
```

---

**✅ CHECKLIST DE VALIDAÇÃO:**

- [ ] **1.** Importei a constante de navegação no topo do arquivo Page?
- [ ] **2.** Constante importada tem nome REAL da funcionalidade (ex: `PORTARIAS`, `CONTAS`, não placeholder)?
- [ ] **3.** Assinatura do método está EXATAMENTE `async acessarTela() {` (SEM parâmetros)?
- [ ] **4.** Dentro do método uso `CONSTANTE_IMPORTADA.URL` ou `...CONSTANTE_IMPORTADA.DIRETORIO`?
- [ ] **5.** Importei APENAS constante que será usada (não importei 5 e usei 1)?
- [ ] **6.** No teste, chamo método SEM argumentos: `await page.xxxPage.acessarTela()`?

**⛔ SE QUALQUER RESPOSTA = NÃO: IMPLEMENTAÇÃO INCORRETA - Ajustar antes de prosseguir**

---

**📋 REGRAS ABSOLUTAS:**

1. ✅ SEMPRE importar constante de `helpers/navegacao.js` no topo do arquivo
2. ✅ Usar `CONSTANTE_REAL.URL` ou `...CONSTANTE_REAL.DIRETORIO` dentro do método
3. ✅ Validar elemento principal após navegação
4. ✅ Importar APENAS o que será usado
5. ❌ NUNCA adicionar parâmetro `url` na assinatura do método
6. ❌ NUNCA adicionar parâmetro `constante` na assinatura do método
7. ❌ NUNCA adicionar QUALQUER parâmetro na assinatura do método
8. ❌ NUNCA hardcoded de URLs
9. ❌ NUNCA usar variável não importada

---

#### **🚨 CHECKLIST ANTI-ERRO (VALIDAR ANTES DE IMPLEMENTAR)**

> **⚠️ ESTES SÃO OS 2 ERROS MAIS FREQUENTES - VALIDAR SEMPRE:**

**ERRO #1: Parâmetro em `acessarTela()`**

- [ ] ✅ Método `acessarTela()` está SEM parâmetros na assinatura?
- [ ] ✅ Constante de navegação está importada no topo do arquivo?
- [ ] ❌ Método NÃO recebe `url`, `constante`, ou qualquer parâmetro?

**Exemplo CORRETO:**
```javascript
import { NOME_FUNCIONALIDADE } from '../../helpers/navegacao.js';
async acessarTela() {
  await this.page.goto(NOME_FUNCIONALIDADE.URL);
  await expect(this.locatorTituloHeading).toBeVisible();
}
```

**ERRO #2: JSDoc com placeholder genérico ou sem linha Exemplo**

- [ ] ✅ JSDoc tem linha `Exemplo:` VINCULADA ao `@param {object}` (nunca isolada)?
- [ ] ✅ Nome do JSON usa placeholder `JSON_{CONSTANTE}` no template?
- [ ] ✅ Na implementação, placeholder foi substituído pelo nome REAL do JSON correspondente ao arquivo em `data/`?
- [ ] ❌ JSDoc NÃO detalha campos (`dados.campo1`, `dados.campo2`)?
- [ ] ❌ NÃO existe `Exemplo: JSON` sem `@param {object}` na linha anterior?

**Exemplo CORRETO:**
```javascript
/**
 * Cadastra novo registro no sistema
 * @param {object} dados - Dados do registro
 * Exemplo: JSON_{CONSTANTE}
 */
async cadastrarRegistro(dados) { }
```

---

#### **4. Métodos Auxiliares ÚTEIS (Não Fragmentar Demais)**

**⚠️ IMPORTANTE: Criar métodos auxiliares SOMENTE quando:**

- A ação se repete em 3+ lugares
- Envolve lógica complexa reutilizável
- Melhora significativamente a legibilidade

**✅ Exemplos VÁLIDOS de auxiliares:**

```javascript
// ✅ BOM: Reutilizado em cadastrar, editar, pesquisar
async aguardarCarregamentoCompleto() {
  await expect(this.locatorCarregandoSpinner).toBeHidden();
  await expect(this.locatorConteudoPrincipal).toBeVisible();
}

// ✅ BOM: Lógica complexa usada em múltiplos fluxos
async abrirModalEdicao(identificador) {
  const locatorLinha = this.locatorRegistrosTable.locator('tbody tr').filter({ hasText: identificador });
  await locatorLinha.locator(this.locatorBotaoAcoes).click();
  await this.locatorOpcaoEditar.click();
  await expect(this.locatorModalEdicao).toBeVisible();
}
```

**❌ Exemplos INVÁLIDOS (fragmentação excessiva):**

```javascript
// ❌ RUIM: Método trivial (só 1 comando)
async clicarBotaoSalvar() {
  await this.locatorSalvarButton.click();
}

// ❌ RUIM: Método trivial (só 1 validação)
async validarBotaoVisivel() {
  await expect(this.locatorBotao).toBeVisible();
}

// ❌ RUIM: Método usado uma vez só
async preencherCampoNome(nome) {
  await this.locatorNomeInput.fill(nome);
}
```

**🎯 Regra Prática:**

- **Método auxiliar:** Somente se usar 3+ vezes OU envolver lógica complexa
- **Método de fluxo:** Sempre criar completo (não fragmentar em micro-métodos)

---

#### **5. Métodos NÃO Devem Ser Criados Para:**

**❌ PROIBIDO: Ações triviais (1 comando apenas):**

```javascript
// ❌ NUNCA FAZER
async clicarBotaoSalvar() {
  await this.locatorSalvarButton.click();
}

async preencherNome(nome) {
  await this.locatorNomeInput.fill(nome);
}

async validarTituloVisivel() {
  await expect(this.locatorTituloHeading).toBeVisible();
}
```

**❌ PROIBIDO: Fragmentação excessiva:**

```javascript
// ❌ ERRADO: 5 métodos pequenos
async abrirModal() { await this.locatorBotao.click(); }
async aguardarModal() { await expect(this.locatorModalDialog).toBeVisible(); }
async preencherCampo1() { await this.locator1.fill('...'); }
async preencherCampo2() { await this.locator2.fill('...'); }
async salvar() { await this.locatorSalvar.click(); }
```

```javascript
// ✅ CORRETO: 1 método completo
async cadastrarRegistro(dados) {
  // Abrir modal
  await this.locatorBotao.click();
  await expect(this.locatorModalDialog).toBeVisible();

  // Preencher campos
  await this.locator1.fill(dados.campo1);
  await this.locator2.fill(dados.campo2);

  // Salvar e validar
  await this.locatorSalvar.click();
  await expect(this.locatorToast).toBeVisible();
}
```

**❌ PROIBIDO: Nomes genéricos ou em inglês:**

```javascript
// ❌ NUNCA FAZER
async validar() { }
async salvar() { }
async clickButton() { }
async fillField() { }
async validarButton() { } // mistura inglês/português
```

---

## 🔒 **REGRA #2: TODOS os Locators no Construtor**

> **⚠️ REGRA CRÍTICA: Locators DEVEM estar no constructor, NUNCA inline nos métodos (exceto dinâmicos)**

### **📋 Checklist de Locators:**

**✅ OBRIGATÓRIO no Constructor:**

1. **Todos locators estáticos** (valores fixos, sem dependência de parâmetros)
2. **Todos locators reutilizados** em múltiplos métodos
3. **Todos elementos base** da página/modal/formulário
4. **Qualquer locator que NÃO dependa de parâmetro do método**

**✅ PERMITIDO nos Métodos (APENAS se dinâmicos):**

- Locators que dependem de parâmetro do método
- Locators que usam `.filter()` com valor variável
- Locators construídos a partir de dados do método

### **Exemplo CORRETO:**

```javascript
constructor(page) {
  this.page = page;
  this.frame = this.page.frameLocator('iframe[name="ci"]');

  this.ID_{DESCRICAO}_{TIPO_ELEMENTO} = '#{idCampo}';

  // ✅ TODOS os locators estáticos aqui
  this.locatorTituloHeading = this.frame.getByRole('heading', { name: 'Baloes' });
  this.locatorAdicionarButton = this.frame.getByRole('button', { name: 'Adicionar' });
  this.locatorSalvarButton = this.frame.getByRole('button', { name: 'Salvar' });
  this.locatorCancelarButton = this.frame.getByRole('button', { name: 'Cancelar' });
  this.locatorNomeInput = this.frame.getByLabel('Nome');
  this.locatorDescricaoInput = this.frame.getByLabel('Descrição');
}

// ✅ Locator dinâmico no método (depende de parâmetro)
async buscarRegistroPorNome(nomeRegistro) {
  const locatorLinha = this.locatorRegistrosTable
    .locator('tbody tr')
    .filter({ hasText: nomeRegistro }); // ✅ Dinâmico: usa parâmetro do método

  await expect(locatorLinha).toBeVisible();
}
```

### **Exemplo ERRADO:**

```javascript
// ❌ NUNCA FAZER: Locators estáticos dentro de métodos
async clicarSalvar() {
  const locatorSalvar = this.frame.getByRole('button', { name: 'Salvar' }); // ❌ ERRADO
  await locatorSalvar.click();
}

async preencherNome(nome) {
  const locatorNome = this.frame.getByLabel('Nome'); // ❌ ERRADO
  await locatorNome.fill(nome);
}
```

```javascript
// ✅ CORRETO: Usar locators do constructor
async salvarFormulario() {
  await this.locatorSalvarButton.click(); // ✅ Do constructor
}

async preencherCampoNome(nome) {
  await this.locatorNomeInput.fill(nome); // ✅ Do constructor
}
```

### **🎯 Regra Prática de Decisão:**

**Antes de criar um locator em um método, pergunte:**

1. ❓ **Esse locator depende de um parâmetro do método?**
   - ✅ SIM → Pode ficar no método
   - ❌ NÃO → DEVE estar no constructor

2. ❓ **Esse locator usa um valor fixo/hardcoded?**
   - ✅ SIM → DEVE estar no constructor
   - ❌ NÃO → Verificar item 1

3. ❓ **Esse locator usa `.filter()` com valor variável?**
   - ✅ SIM → Pode ficar no método
   - ❌ NÃO → DEVE estar no constructor

---

## 🧪 **REGRA #3: Testes NÃO Devem Ter Ações Diretas**

**🚨 REGRA CRÍTICA: Testes NÃO devem ter `.click()`, `.fill()`, `expect()` diretos**

**Tudo deve estar encapsulado em métodos do Page Object:**

```javascript
// ❌ COMPLETAMENTE ERRADO - Ações diretas no teste
test(
  '001 - Deve cadastrar registro',
  {
    tag: '@FUNCIONALIDADE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/TASK-001' }
  },
  async ({ page }) => {
    // Arrange:
    const dados = JSON_{CONSTANTE}; // ❌ PROIBIDO

    // Act: ❌ AÇÕES DIRETAS NO TESTE
    await page.funcionalidadePage.locatorNomeInput.fill(dados.nome);           // ❌ PROIBIDO
    await page.funcionalidadePage.locatorDescricaoInput.fill(dados.descricao); // ❌ PROIBIDO
    await page.funcionalidadePage.locatorSalvarButton.click();                 // ❌ PROIBIDO

    // Assert: ❌ VALIDAÇÃO DIRETA NO TESTE
    await expect(page.funcionalidadePage.locatorSucessoAlert).toBeVisible(); // ❌ PROIBIDO
  }
);
```

```javascript
// ✅ COMPLETAMENTE CORRETO - Tudo encapsulado em métodos
test(
  '001 - Deve cadastrar registro',
  {
    tag: '@FUNCIONALIDADE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/TASK-001' }
  },
  async ({ page }) => {
    // Arrange: Preparar contexto para cadastro
    await page.funcionalidadePage.acessarTela();

    // Act: Método encapsula TODAS as ações
    await page.funcionalidadePage.cadastrarRegistro(dados);

    // Assert: Método encapsula TODAS as validações
    await page.funcionalidadePage.validarRegistroCadastrado(dados.nome);
  }
);
```

**Por que encapsular TODO?**

- ✅ **Reutilização:** Mesmo método usado em múltiplos testes
- ✅ **Manutenção:** Mudança no locator = alterar em 1 lugar só
- ✅ **Clareza:** Teste expressa INTENÇÃO de negócio, não implementação técnica
- ✅ **Clean Code:** Abstração de detalhes técnicos
- ✅ **Legibilidade:** Teste lê como linguagem natural

## 🎯 **Princípios de Métodos Bem Estruturados**

**Cada método deve seguir estes 5 princípios:**

### **1. Fluxo Completo de Negócio (Sem Fragmentação)**

- Um método = uma ação completa do usuário
- **Equilíbrio:** Método completo ≠ método gigante confuso
- Exemplo: `cadastrarBaloes()` faz abertura + preenchimento + salvamento + validação (TUDO em 1 método)

### **2. Organização em Blocos Lógicos (Clareza Interna)**

- Usar **comentários simples** para separar etapas quando o método for mais complexo
- Comentários descrevem a intenção de cada seção (abertura, preenchimento, submissão, validação)
- **Não é obrigatório** para métodos simples e diretos
- Facilita leitura e manutenção **sem criar micro-métodos**

```javascript
// Exemplo com comentários (método mais complexo):
async cadastrarRegistro(dados) {
  // Abrir modal de cadastro e aguardar carregamento completo
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalDialog).toBeVisible();

  // Preencher campos obrigatórios
  await this.locatorNomeInput.fill(dados.nome);
  await this.locatorDescricaoInput.fill(dados.descricao);

  // Salvar e validar sucesso da operação
  await this.locatorSalvarButton.click();
  await expect(this.locatorToast).toBeVisible();
}

// Exemplo sem comentários (método simples):
async fecharModal() {
  await this.locatorFecharButton.click();
  await expect(this.locatorModalDialog).toBeHidden();
}
```

### **3. Métodos Auxiliares Apenas se Úteis (Evitar Fragmentação)**

- Criar auxiliar SOMENTE se usado 3+ vezes OU lógica complexa
- **NÃO criar** métodos triviais (1 comando)
- **NÃO fragmentar** fluxos em micro-métodos
- Exemplos válidos: `aguardarCarregamento()`, `abrirModalEdicao(identificador)`

### **4. Todos Locators no Construtor (Sem Exceções)**

- Locators estáticos = constructor (SEMPRE)
- Locators dinâmicos = métodos (APENAS se dependem de parâmetro)
- Seletores estáveis e semânticos

### **5. Clean Code (Padrões de Qualidade)**

- Nomes descritivos em português
- Sem duplicação (DRY)
- Validações com `expect()` em pontos-chave
- JSDoc completo

---

## 🏆 **EXEMPLOS DE MÉTODOS BEM ESTRUTURADOS**

> **📌 USE ESTES EXEMPLOS COMO REFERÊNCIA PARA TODOS OS MÉTODOS**
>
> **🚨 LEMBRE-SE: Testes NUNCA devem ter ações diretas, apenas chamadas de métodos**

### **Exemplo 1: Ação de Negócio Completa**

```javascript
/**
 * Cadastra novo registro com todos os dados obrigatórios
 * @param {object} dados - Objeto com dados para cadastro
 * Exemplo: JSON_{CONSTANTE} (importado de data/{modulo}/{funcionalidade}Json.js)
 */
async cadastrarRegistro(dados) {
  // Preencher campos básicos
  await this.locatorNomeInput.fill(dados.nome);
  await this.locatorDescricaoInput.fill(dados.descricao);

  // Interagir com componentes complexos
  if (dados.categoria) {
    await this.formUtils.fillFieldPDropdown(this.ID_CATEGORIA_DROPDOWN, dados.categoria);
  }

  if (dados.responsavel) {
    await this.formUtils.fillFieldSLookup(this.ID_RESPONSAVEL_LOOKUP, dados.responsavel);
  }

  if (dados.dataInicio) {
    await this.formUtils.fillFieldPCalendar(this.ID_DATA_INICIO_CALENDAR, dados.dataInicio);
  }

  // Submeter formulário
  await this.locatorSalvarButton.click();

  // Validar sucesso
  await expect(this.locatorSucessoAlert).toBeVisible();
}
```

**✅ BOM porque:**

- Representa ação completa de negócio
- Agrupa múltiplos comandos relacionados
- Aceita objeto de dados parametrizável
- Valida resultado da ação

---

### **Exemplo 2: Fluxo Reutilizável com Lógica**

```javascript
/**
 * Aplica filtros na listagem e aguarda resultados
 * @param {object} criterios - Critérios de filtro
 * Exemplo: JSON_{CONSTANTE_FILTRO}
 */
async aplicarFiltros(criterios) {
  // Abrir painel de filtros
  await this.locatorAbrirFiltrosButton.click();
  await expect(this.locatorPainelFiltros).toBeVisible();

  // Aplicar filtros com lógica condicional
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

  // Executar filtro
  await this.locatorFiltrarButton.click();

  // Aguardar atualização de resultados
  await expect(this.locatorCarregandoSpinner).toBeHidden();
  await expect(this.locatorResultados).toBeVisible();
}
```

**✅ BOM porque:**
- Fluxo completo de uso reutilizável
- Lógica condicional baseada em parâmetros
- Aguarda estados intermediários
- Valida estado final

---

### **Exemplo 3: Validação de Negócio Complexa**

```javascript
/**
 * Valida se registro foi cadastrado corretamente na tabela
 * @param {string} textoIdentificador - Texto único do registro
 * @returns {Promise<object>} Dados do registro encontrado
 */
async validarRegistroCadastrado(textoIdentificador) {
  // Criar locator dinâmico para buscar registro
  const locatorLinha = this.locatorRegistrosTable
    .locator('tbody tr')
    .filter({ hasText: textoIdentificador });

  // Validar visibilidade
  await expect(locatorLinha).toBeVisible();

  // Extrair dados da linha
  const nome = await locatorLinha.locator('td').nth(1).textContent();
  const status = await locatorLinha.locator('td').nth(2).textContent();
  const data = await locatorLinha.locator('td').nth(3).textContent();

  // Retornar objeto estruturado
  return {
    nome: nome.trim(),
    status: status.trim(),
    data: data.trim(),
  };
}
```

**✅ BOM porque:**
- Validação estruturada com retorno útil
- Locator dinâmico baseado em parâmetro
- Extração organizada de dados
- Retorno tipado para uso nos testes

---

### **Exemplo 4: Interação Complexa com Componentes**

```javascript
/**
 * Abre modal de edição e preenche dados alterados
 * @param {string} nomeRegistro - Nome do registro a editar
 * @param {object} novosDados - Dados para atualização
 * Exemplo: JSON_{CONSTANTE_EDITAR}
 */
async editarRegistro(nomeRegistro, novosDados) {
  // Localizar linha do registro
  const locatorLinha = this.locatorRegistrosTable
    .locator('tbody tr')
    .filter({ hasText: nomeRegistro });

  // Abrir menu de ações
  await locatorLinha.locator(this.locatorAcoesButton).click();
  await this.locatorEditarOption.click();

  // Aguardar modal
  await expect(this.locatorModalEdicao).toBeVisible();

  // Atualizar apenas campos alterados
  if (novosDados.nome) {
    await this.locatorNomeInput.fill(novosDados.nome);
  }

  if (novosDados.status) {
    await this.locatorStatusSelect.selectOption(novosDados.status);
  }

  // Salvar alterações
  await this.locatorSalvarButton.click();

  // Validar fechamento do modal e sucesso
  await expect(this.locatorModalEdicao).toBeHidden();
  await expect(this.locatorSucessoAlert).toBeVisible();
}
```

**✅ BOM porque:**
- Fluxo completo de edição
- Lógica condicional para campos opcionais
- Validações intermediárias e finais
- Representa ação real do usuário

---

### **Exemplo 5: Método com Try/Catch para Botões "Ações"/"Opções"**

```javascript
/**
 * Exclui registro selecionado via menu Ações
 * @param {string} nomeRegistro - Nome do registro a excluir
 */
async excluirRegistro(nomeRegistro) {
  // Localizar e selecionar registro
  const locatorLinha = this.locatorRegistrosTable
    .locator('tbody tr')
    .filter({ hasText: nomeRegistro });

  await locatorLinha.locator('input[type="checkbox"]').check();

  // Retry obrigatório: appendto="body" em s-button causa problema visual intermitente
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      await this.locatorAcoesButton.click({ force: true });
      await this.locatorMenuExcluirLink.click({ force: true });
      break;
    } catch (error) {
      if (tentativa === 2) throw error;
    }
  }

  // Confirmar exclusão
  await this.locatorConfirmarExclusaoButton.click();

  // Validar sucesso
  await expect(this.locatorSucessoAlert).toBeVisible();

  // Validar que registro não existe mais
  await expect(locatorLinha).toBeHidden();
}
```

**✅ BOM porque:**

- Tratamento robusto com try/catch + `{ force: true }`
- Recovery automático sem falhar o teste
- Validações múltiplas de sucesso
- Representa fluxo completo de exclusão

---

### **❌ CONTRA-EXEMPLOS (NÃO FAZER)**

```javascript
// ❌ EXEMPLO 1: Ações diretas no teste (ABSOLUTAMENTE PROIBIDO)
test(
  '001 - Teste incorreto',
  {
    tag: '@EXEMPLO_ERRADO',
    annotation: { type: 'Issue', description: 'https://jira.example.com/TASK-001' }
  },
  async ({ page }) => {
    // Arrange: (omitido para brevidade)

    // Act: ❌ AÇÕES DIRETAS NO TESTE
    await page.funcionalidadePage.locatorNomeInput.fill('João');              // ❌ NUNCA FAZER
    await page.funcionalidadePage.locatorSalvarButton.click();                // ❌ NUNCA FAZER

    // Assert: ❌ VALIDAÇÃO DIRETA NO TESTE
    await expect(page.funcionalidadePage.locatorMensagem).toBeVisible();      // ❌ NUNCA FAZER
  }
);
// PROBLEMA: Teste conhece detalhes técnicos da UI (locators, comandos Playwright)
// IMPACTO: Dificulta manutenção, não reutilizável, viola Clean Code
// SOLUÇÃO: Criar método cadastrarRegistro() que encapsula TODAS as ações

// ❌ EXEMPLO 2: Método trivial de um comando (ABSOLUTAMENTE PROIBIDO)
async clicarBotaoSalvar() {
  await this.locatorSalvarButton.click();
}
// PROBLEMA: Apenas encapsula 1 comando, sem valor agregado ou contexto de negócio
// IMPACTO: Viola princípio de métodos de negócio, cria poluição de código
// SOLUÇÃO: Criar método completo (ex: salvarFormularioComValidacao()) que inclui click + validações

// ❌ EXEMPLO 3: Método trivial de um comando em inglês (DUPLAMENTE PROIBIDO)
async clickButton() {
  await this.locatorButton.click();
}
// PROBLEMA 1: Método trivial de um comando (proibido)
// PROBLEMA 2: Nome em inglês (proibido - deve ser português)
// SOLUÇÃO: Criar método de negócio em português (ex: confirmarAcao())

// ❌ EXEMPLO 4: Método que apenas preenche um campo
async preencherNome(nome) {
  await this.locatorNomeInput.fill(nome);
}
// PROBLEMA: Apenas 1 comando, sem contexto de negócio
// SOLUÇÃO: Criar método cadastrarRegistro() que preenche TODOS os campos

// ❌ EXEMPLO 5: Método com nome genérico
async validarCampos() {
  await expect(this.locatorCampo1).toBeVisible();
  await expect(this.locatorCampo2).toBeVisible();
}
// PROBLEMA: Nome não descreve O QUE está sendo validado
// SOLUÇÃO: Renomear para validarCamposObrigatoriosFormulario()

// ❌ EXEMPLO 6: Método misturando inglês com português (PROIBIDO)
async validarButton() { }
async clickSalvar() { }
async fillNome() { }
// PROBLEMA: Mistura idiomas na nomenclatura
// SOLUÇÃO: Usar APENAS português: validarBotao(), salvarFormulario(), preencherNome()

// ❌ EXEMPLO 7: Método com múltiplas responsabilidades
async cadastrarEValidar(dados) {
  await this.cadastrarRegistro(dados);
  await this.validarMensagemSucesso();
  await this.validarNaTabela(dados.nome);
  await this.validarNoBanco(dados.id);
}
// PROBLEMA: Mistura ação + validações UI + validações banco
// SOLUÇÃO: Separar em métodos distintos (cadastrar, validarUI, validarDB) e orquestrar no teste
```

**🚨 RESUMO: O QUE NUNCA FAZER**

| ❌ PROIBIDO | ✅ CORRETO |
|------------|-----------|
| **Ações diretas no teste** (`.click()`, `.fill()`, `expect()`) | **Encapsular TUDO em métodos** do Page Object |
| **Métodos triviais** (`clicarBotao()`, `clickButton()`) | **Métodos de negócio completos** (`salvarFormulario()`, `confirmarExclusao()`) |
| **Misturar inglês com português** (`validarButton()`, `clickSalvar()`) | **APENAS português** (`validarBotao()`, `salvarFormulario()`) |
| Método com 1 comando só | Método de negócio completo (múltiplas ações relacionadas) |
| Nome genérico (`validar()`, `salvar()`) | Nome específico (`validarCarregamentoCompletoDaTela()`) |
| Método com múltiplas responsabilidades | Métodos separados, responsabilidade única |

---

## 📝 **Diretrizes de Design de Métodos**

### **1. Nomenclatura Clara e Descritiva (SEMPRE EM PORTUGUÊS)**

```javascript
// ❌ RUIM - Inglês ou genérico
async validar() { }
async salvar() { }
async buscar(id) { }
async clickButton() { }
async fillField() { }
```

```javascript
// ❌ RUIM - Mistura inglês com português
async validarButton() { }
async clickSalvar() { }
async fillCampo() { }
```

```javascript
// ✅ BOM - Português, específico e descritivo
async validarCarregamentoCompletoDaTela() { }
async salvarFormularioComValidacao() { }
async buscarRegistroPorIdNaTabela(id) { }
async confirmarExclusao() { }
async preencherCamposObrigatorios() { }
```

### **2. Responsabilidade Única**

```javascript
// ❌ RUIM - Faz muitas coisas diferentes
async processarCadastro(dados) {
  await this.validarPermissao();
  await this.cadastrarRegistro(dados);
  await this.enviarEmail();
  await this.atualizarDashboard();
}
```

```javascript
// ✅ BOM - Métodos separados, compostos no teste
async cadastrarRegistro(dados) { /* apenas cadastro */ }
async validarCadastroNaTabela(nome) { /* apenas validação */ }
// No teste: await cadastrar(); await validar();
```

### **3. Parâmetros Significativos**

```javascript
// ❌ RUIM
async editar(a, b, c) { }
```

```javascript
// ✅ BOM
async editarRegistro(identificador, novosDados) { }
```

### **4. Timeout Personalizado - PROIBIDO**

```javascript
// ❌ ERRADO - NUNCA usar timeout customizado
await expect(this.locatorSucessoAlert).toBeVisible({ timeout: 10000 });
await expect(this.locatorModalDialog).toBeVisible({ timeout: 5000 });
await this.locatorBotao.click({ timeout: 3000 });
```

```javascript
// ✅ CORRETO - Usar timeout padrão do Playwright
await expect(this.locatorSucessoAlert).toBeVisible();
await expect(this.locatorModalDialog).toBeVisible();
await this.locatorBotao.click();
```

**🚨 REGRA CRÍTICA: NUNCA usar `{ timeout: X }` em expect ou ações**

- ❌ **PROIBIDO:** `toBeVisible({ timeout: 10000 })`
- ❌ **PROIBIDO:** `toBeHidden({ timeout: 5000 })`
- ❌ **PROIBIDO:** `click({ timeout: 3000 })`
- ✅ **CORRETO:** Usar timeout padrão configurado em `playwright.config.js`

**Motivo:** O timeout padrão do projeto (30s) é configurado globalmente e atende todos os casos. Timeouts customizados indicam problemas estruturais (seletores lentos, waits incorretos) que devem ser corrigidos na origem.

### **5. Validações Condicionais Simplificadas**

```javascript
// ❌ ERRADO - Validação redundante
if (dados.provisoryCredentialsMonthlyLimit !== undefined) {
  await this.formUtils.fillField(ID_CAMPO_INPUT, dados.provisoryCredentialsMonthlyLimit.toString());
}

if (dados.schedulingCredentialValidityInHours !== undefined) {
  await expect(celulas.nth(2)).toContainText(dados.schedulingCredentialValidityInHours.toString());
}
```

```javascript
// ✅ CORRETO - Validação simplificada
if (dados.provisoryCredentialsMonthlyLimit) {
  await this.formUtils.fillField(ID_CAMPO_INPUT, dados.provisoryCredentialsMonthlyLimit.toString());
}

if (dados.schedulingCredentialValidityInHours) {
  await expect(celulas.nth(2)).toContainText(dados.schedulingCredentialValidityInHours.toString());
}
```

**🚨 REGRA: Usar validação truthy/falsy, não comparação explícita com `undefined`**

- ❌ **REDUNDANTE:** `if (dados.campo !== undefined)`
- ❌ **REDUNDANTE:** `if (dados.campo !== null)`
- ✅ **CORRETO:** `if (dados.campo)`

**Motivo:** JavaScript avalia automaticamente valores truthy/falsy. Comparação explícita com `undefined` é verbosa e desnecessária.

---

## 📝 **JSDoc - OBRIGATÓRIO**

### **Estrutura para Classes:**

> **🚨 REGRA ABSOLUTA: JSDoc de CLASSE jamais deve conter linha `Exemplo: JSON_...`**
> **🚨 REGRA ABSOLUTA: JSDoc de CLASSE jamais deve conter `@param`**
>
> A linha `Exemplo:` é EXCLUSIVA de JSDoc de **métodos** que recebem parâmetro `{object}`.
> O JSDoc da classe descreve apenas O QUE a classe faz — NUNCA referencia JSONs.
> `@param` de `page` deve existir APENAS no JSDoc do `constructor`, nunca no bloco da classe.

```javascript
// ✅ CORRETO - JSDoc de classe SEM Exemplo:
/**
 * Page Object para a tela de {NomeFuncionalidade}
 * Encapsula ações de {descrição das ações}
 */
export class {NomeFuncionalidade}Page {
  /**
   * Constructor da classe
   * @param {object} page - Contexto da página do Playwright
   */
  constructor(page) {
    // ...implementation...
  }
}
```

> **🚨 REGRA RESUMIDA: `Exemplo:` SÓ EXISTE quando há `@param {object}` de JSON na linha anterior.**
> **Qualquer outro uso (classe, método sem parâmetro, método com @param {string}) = VIOLAÇÃO.**
>
> **Para exemplos completos de ERRADO vs CORRETO:** Consulte a seção **VÍNCULO OBRIGATÓRIO: `@param {object}` ↔ `Exemplo: JSON_{CONSTANTE}`** acima neste módulo.

```javascript
// ❌ ERRADO - Misturar descrição da classe com assinatura do constructor no mesmo bloco
/**
 * Page Object da tela de cadastro de usuário.
 * @param {import('@playwright/test').Page} page - Contexto da página.
 */
export class NomeDaFuncionalidadePage {
  constructor(page) {
    this.page = page;
  }
}

// ✅ CORRETO - Bloco da classe separado do bloco do constructor
/**
 * Page Object da tela de cadastro de usuário.
 */
export class NomeDaFuncionalidadePage {
  /**
   * Cria a instância da página de cadastro de usuário.
   * @param {import('@playwright/test').Page} page - Contexto da página do Playwright.
   */
  constructor(page) {
    this.page = page;
  }
}
```

### **Estrutura para Métodos:**

```javascript
/**
 * {Descrição clara do que o método faz}
 * @param {string} parametro - Descrição do parâmetro
 * @returns {Promise<string>} Descrição do retorno
 */
async meuMetodo(parametro) {
  // ...implementation...
}
```

### **Padrão JSDoc para Parâmetros JSON:**

> **🚨 REGRA ABSOLUTA: NUNCA DETALHAR CAMPOS INDIVIDUAIS DO JSON**
>
> **✅ CORRETO:** `@param {Object} dados - Objeto com dados` + linha `Exemplo: JSON_CONSTANTE`
>
> **❌ PROIBIDO:** `@param {string} dados.campo1` ou `@param {Object} dados.campo2`

```javascript
/**
 * {Descrição da funcionalidade}
 * @param {Object} dados - Objeto com dados do negócio
 * Exemplo: JSON_{CONSTANTE}
 * @returns {Promise<void>}
 */
async metodoComJSON(dados) {
  // ...implementation...
}

/**
 * {Descrição da funcionalidade com múltiplos JSONs}
 * @param {Object} dados - Objeto com dados
 * Exemplo: JSON_{CONSTANTE_INCLUIR} ou JSON_{CONSTANTE_EDITAR}
 * @returns {Promise<void>}
 */
async metodoComMultiplosJSONs(dados) {
  // ...implementation...
}
```

---

### **✅ EXEMPLOS CORRETOS vs ❌ EXEMPLOS INCORRETOS**

#### **✅ CORRETO - JSDoc Simples com Referência:**

```javascript
/**
 * Adiciona ou edita um negócio conforme ação do JSON
 * @param {Object} dados - Objeto com dados do negócio
 * Exemplo: JSON_{CONSTANTE_INCLUIR} ou JSON_{CONSTANTE_EDITAR}
 * @returns {Promise<void>}
 */
async adicionarOuEditarNegocio(dados) {
  if (dados.acao === 'incluir') {
    await this.botaoAdicionar.click();
  }
  await this.page.getByLabel('Descrição').fill(dados.descricao);
  // ... resto da implementação
}
```

**Por que está correto:**

- ✅ Usa `@param {Object} dados` genérico
- ✅ Inclui linha `Exemplo: JSON_{CONSTANTE_INCLUIR} ou JSON_{CONSTANTE_EDITAR}`
- ✅ Desenvolvedor consulta o JSON referenciado para ver estrutura completa
- ✅ Não duplica informação que está no arquivo JSON
- ✅ Evita desatualização (se JSON mudar, JSDoc não precisa ser atualizado)

---

#### **❌ INCORRETO - Detalhando Campos (NUNCA FAZER):**

```javascript
/**
 * Adiciona ou edita um negócio conforme ação do JSON
 * @param {Object} dados - Objeto com dados do negócio
 * @param {string} dados.acao - Ação a ser executada ('incluir' ou 'editar')
 * @param {string} dados.descricao - Descrição do negócio
 * @param {Object} dados.empresaFilial - Dados da empresa/filial
 * @param {string} dados.empresaFilial.valor - Valor para filtrar
 * @param {string} dados.empresaFilial.valorClique - Valor a clicar
 * @param {Object} dados.responsavel - Dados do responsável
 * @param {Object} dados.conta - Dados da conta
 * @param {Object} dados.tipoNegocio - Tipo de negócio
 * @param {Object} dados.origemNegocio - Origem do negócio
 * @param {Object} dados.modalidadeNegocio - Modalidade do negócio
 * @param {Object} dados.funil - Funil
 * @param {Object} dados.etapaFunil - Etapa do funil
 * @param {Array} dados.grid - Array de valores para validar
 * @returns {Promise<void>}
 */
async adicionarOuEditarNegocio(dados) {
  // ...implementation...
}
```

**Por que está ERRADO:**

- ❌ Detalha TODOS os campos individuais (`dados.acao`, `dados.descricao`, etc.)
- ❌ Detalha campos aninhados (`dados.empresaFilial.valor`, `dados.empresaFilial.valorClique`)
- ❌ JSDoc gigante e difícil de manter
- ❌ Duplica informação já presente no arquivo JSON
- ❌ Se estrutura do JSON mudar, JSDoc fica desatualizado
- ❌ Dificulta leitura do código

---

#### **✅ CORRETO - Método com Array Simples:**

```javascript
/**
 * Valida dados na grid após operação
 * @param {Array<string>} valores - Array de valores esperados na grid
 * Exemplo: JSON_{CONSTANTE}.grid
 * @returns {Promise<void>}
 */
async validarGrid(valores) {
  const validationUtils = new ValidationUtils(this.page);
  await validationUtils.validarGrid(valores);
}
```

**Por que está correto:**

- ✅ Usa tipo simples `Array<string>`
- ✅ Referencia de onde vem o array (`JSON_{CONSTANTE}.grid`)
- ✅ Conciso e claro

---

#### **❌ INCORRETO - Detalhando Conteúdo do Array:**

```javascript
/**
 * Valida dados na grid após operação
 * @param {Array<string>} valores - Array de valores esperados
 * @param {string} valores[0] - Empresa/Filial completa
 * @param {string} valores[1] - Descrição do negócio
 * @param {string} valores[2] - Responsável
 * @param {string} valores[3] - Conta
 * @param {string} valores[4] - Funil/Etapa
 * @returns {Promise<void>}
 */
async validarGrid(valores) {
  // ...implementation...
}
```

**Por que está ERRADO:**

- ❌ Detalha cada índice do array
- ❌ Informação desnecessária (array é dinâmico)
- ❌ Dificulta manutenção

---

### **🚨 REGRAS CRÍTICAS DE JSDoc (RESUMO):**

| # | Regra | O que fazer | O que NÃO fazer |
|---|-------|-------------|-----------------|
| **1** | **Parâmetros JSON** | `@param {Object} dados` + `Exemplo: JSON_CONSTANTE` | ❌ `@param {string} dados.campo1` |
| **2** | **Arrays** | `@param {Array<string>} valores` + `Exemplo: JSON.grid` | ❌ `@param {string} valores[0]` |
| **3** | **Múltiplos JSONs** | `Exemplo: JSON_{CONSTANTE_1} ou JSON_{CONSTANTE_2} ou JSON_{CONSTANTE_3}` | ❌ Detalhar campos de cada JSON |
| **4** | **Retorno** | `@returns {Promise<void>}` ou `@returns {Promise<Object>}` | ❌ Omitir `@returns` |
| **5** | **Descrição** | Descrever O QUE o método faz (negócio) | ❌ Descrever COMO (implementação técnica) |

---

### **✅ CHECKLIST DE VALIDAÇÃO DE JSDoc:**

Antes de finalizar qualquer método, valide:

- [ ] JSDoc possui `/**` abertura e `*/` fechamento
- [ ] Linha 1: Descrição clara do QUE o método faz (não COMO)
- [ ] `@param {object}` para JSONs (NUNCA detalhar campos)
- [ ] **Linha `Exemplo: JSON_{CONSTANTE}` presente SEMPRE que `@param {object}` existir e JSON for conhecido (APENAS em métodos)**
- [ ] **Linha `Exemplo:` VINCULADA ao `@param {object}` (nunca isolada, nunca sem @param {object})**
- [ ] Se método aceita múltiplos JSONs: `Exemplo: JSON_{CONSTANTE_1} ou JSON_{CONSTANTE_2} ou JSON_{CONSTANTE_3}`
- [ ] `@returns` presente (mesmo que seja `Promise<void>`)
- [ ] NENHUMA linha com `@param {tipo} dados.campo` ou `json.campo` (PROIBIDO)
- [ ] NENHUMA linha com `@param {tipo} valores[0]` ou similar (PROIBIDO)
- [ ] **NENHUMA linha `Exemplo:` no JSDoc da CLASSE** (PROIBIDO — exclusivo de métodos)
- [ ] Todos locators sem parâmetros estão no constructor (NUNCA inline no método)

---

**🎯 MOTIVAÇÃO DESTA REGRA:**

1. **Evitar duplicação:** JSON já documenta estrutura completa
2. **Facilitar manutenção:** Se JSON mudar, JSDoc não precisa ser atualizado
3. **Legibilidade:** JSDoc conciso é mais fácil de ler
4. **Padrão consistente:** Todos os métodos seguem mesmo formato
5. **Responsabilidade clara:** JSON define estrutura, JSDoc define uso

---

## 📦 **Import Correto**

Use apenas imports públicos e caminhos relativos válidos do projeto.

---

## 📄 **Template Completo: Page Object**

```javascript
import { expect } from '@playwright/test';

import { NOME_FUNCIONALIDADE } from '../../helpers/navegacao.js';

/**
 * Page Object para {Nome da Tela}
 * {Breve descrição da funcionalidade}
 * ⚠️ NUNCA adicionar linha "Exemplo: JSON_..." aqui (exclusivo de métodos)
 */
export class {NomeTela}Page {
  /**
   * Constructor da classe {NomeTela}Page
   * @param {object} page - Contexto da página do Playwright
   */
  constructor(page) {
    this.page = page;
    this.dataUtils = new DataUtils(this.page);
    this.formUtils = new FormUtils(this.page);

    // 🚨 Se HTML contém <iframe>: descomentar linha abaixo e usar this.frame nos locators
    // this.frame = this.page.frameLocator('iframe[name="ci"]');
    // this.formUtils = new FormUtils(this.frame);

    // IDs seguem padrão TIPO_{DESCRICAO}_{TipoElemento}
    this.ID_CAMPO_LOOKUP = '#{idCampoLookup}';
    this.ID_CAMPO_DROPDOWN = '#{idCampoDropdown}';

    this.locatorTituloHeading = this.page.getByRole('heading', { name: '{Título}' });
    this.locatorSalvarButton = this.page.getByRole('button', { name: 'Salvar' });
    this.locatorCancelarButton = this.page.getByRole('button', { name: 'Cancelar' });
    this.locatorCampo1Input = this.page.getByLabel('{Label1}');
    this.locatorCampo2Input = this.page.getByLabel('{Label2}');
    this.locatorRegistrosTable = this.page.getByRole('table');
    this.locatorSucessoAlert = this.page.getByRole('alert');
  }

  /**
   * Acessa a tela da funcionalidade
   * ⚠️ NUNCA adicionar parâmetros neste método
   */
  async acessarTela() {
    await this.page.goto(NOME_FUNCIONALIDADE.URL);
    await expect(this.locatorTituloHeading).toBeVisible();
  }

  /**
   * Cadastra novo registro com dados completos
   * @param {object} dados - Dados do registro para cadastro
   * Exemplo: JSON_{CONSTANTE}
   */
  async cadastrarRegistro(dados) {
    await this.locatorCampo1Input.fill(dados.campo1);
    await this.locatorCampo2Input.fill(dados.campo2);

    if (dados.campoLookup) {
      await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, dados.campoLookup);
    }
    if (dados.campoDropdown) {
      await this.formUtils.fillFieldPDropdown(this.ID_CAMPO_DROPDOWN, dados.campoDropdown);
    }

    await this.locatorSalvarButton.click();
    await expect(this.locatorSucessoAlert).toBeVisible();
  }

  /**
   * Aplica filtros na listagem
   * @param {string} valorFiltro - Valor para filtrar
   */
  async aplicarFiltros(valorFiltro) {
    await this.locatorAbrirFiltrosButton.click();
    await this.locatorCampoFiltroInput.fill(valorFiltro);
    await this.locatorFiltrarButton.click();
    await expect(this.locatorResultados).toBeVisible();
  }

  /**
   * Valida se registro foi cadastrado corretamente
   * @param {string} textoEsperado - Texto esperado no registro
   * @returns {Promise<string>} Texto do registro encontrado
   */
  async validarRegistroCadastrado(textoEsperado) {
    const locatorRegistro = this.locatorRegistrosTable
      .locator('tbody tr')
      .filter({ hasText: textoEsperado });

    await expect(locatorRegistro).toBeVisible();
    return await locatorRegistro.textContent();
  }

  /**
   * Exclui registro selecionado
   * @param {string} textoRegistro - Texto identificador do registro
   */
  async excluirRegistro(textoRegistro) {
    const locatorLinha = this.locatorRegistrosTable
      .locator('tbody tr')
      .filter({ hasText: textoRegistro });

    await locatorLinha.locator('input[type="checkbox"]').check();
    await this.locatorExcluirButton.click();
    await this.locatorConfirmarButton.click();
    await expect(this.locatorSucessoAlert).toBeVisible();
  }
}
```

---

## ✅ **Regras para Atualização de Page Objects**

**Ao atualizar arquivo existente:**

1. **Posicionamento de Novos Locators:** Adicionar SEMPRE ao final da seção de locators no constructor
2. **Posicionamento de Novos Métodos:** Adicionar SEMPRE ao final da classe, após métodos existentes
3. **Preservação Total:** NUNCA alterar, mover ou remover locators ou métodos existentes
4. **Imports Novos:** Adicionar somente ao final da seção de imports, se necessário

---

## 🔍 **Auditoria de Page Objects**

**ANTES de finalizar Page Object:**

| Item | Validação | Comando/Ação |
|------|-----------|--------------|
| **Locators** | Apenas usados em métodos | `grep "this.locator.*=" {arquivo}.js` vs `grep "this.locator.*\." {arquivo}.js` |
| **Métodos** | Todos chamados em testes | Verificar referências nos arquivos `.spec.js` |
| **HTML** | Componentes identificados | `grep_search(query="<p-\|<s-\|ui-", isRegexp=true)` |
| **IDs** | Sem IDs dinâmicos | Evitar `ui-panel-{n}`, `s-button-{n}` |
| **Órfãos** | Remover não utilizados | Deletar locators/métodos sem referência |

**Sinais para remover:**

- ❌ Comentários "para uso futuro" ou "caso precise"
- ❌ Métodos com 1 comando trivial
- ❌ Locators duplicados com nomes diferentes

---

## 📋 **Checklist Final de Page Objects**

### **Locators:**

- [ ] Todos no constructor são usados em métodos
- [ ] **Nomenclatura OBRIGATÓRIA:** `locator{Descrição}{Tipo}` (ex: `locatorSalvarButton`, `locatorNomeInput`)
- [ ] Tipo no FINAL do nome (Button, Input, Link, Heading, etc.)
- [ ] Seletores semânticos priorizados
- [ ] Baseados em HTML (não PNG)
- [ ] Únicos (encontram 1 elemento)

### **Métodos:**

- [ ] JSDoc completo
- [ ] TODOS chamados em testes
- [ ] Assinaturas corretas
- [ ] Validações apropriadas

### **Qualidade:**

- [ ] Sem IDs dinâmicos
- [ ] Componentes especiais tratados
- [ ] Sem strict mode violations

### **Conformidade:**

- [ ] Validado contra `checklistMergeRequest.md` completo
- [ ] ESLint sem erros

---

## 🔧 **Validação de `iframe`**

### **Regras:**

- **Verificar** se HTML contém `<iframe>`
- **SOMENTE** usar `this.frame` se iframe presente
- **NUNCA** usar `this.frame` sem iframe

### **Como Verificar:**

```bash
grep_search(query="<iframe", includePattern="{arquivo}.html", isRegexp=false)
```

---

## 🔍 **REGRA ESPECÍFICA: Componente S-Lookup**

> **⚠️ REGRA CRÍTICA: S-Lookup SEMPRE usa ID do `<input>` interno, NUNCA do componente externo**

### **🎯 Como Identificar o ID Correto**

**PROCESSO OBRIGATÓRIO:**

1. **Encontrar o componente `<s-lookup>` no HTML:**

   ```html
   <s-lookup id="e070filCrmx" label="Filial" ...>
     <!-- conteúdo interno -->
     <input id="e070filCrmx-autocomplete" type="text" ...>
   </s-lookup>
   ```

2. **Buscar o `<input>` DENTRO do componente**
3. **O input terá ID com sufixo `-autocomplete`**
4. **Usar ESTE ID no locator**

### **⚠️ Motivo da Regra**

- O componente `<s-lookup>` é um wrapper customizado
- O elemento INTERATIVO é o `<input>` interno
- O ID do `<input>` sempre tem sufixo `-autocomplete`
- Usar ID do componente externo resulta em locator não clicavel/preenchível

---

## 🚫 **Anti-Padrões Críticos**

### **❌ NUNCA:**

- **Criar locators estáticos fora do constructor**
- **Usar locators inline sem parâmetro**
- **Criar métodos triviais** (`clicarBotao()`, `clickButton()`, `click()`)
- **Misturar inglês com português** na nomenclatura de métodos e variáveis
- **Esquecer de executar `grep_search(query="<iframe")` no HTML antes de criar Page Object**
- **Usar `this.page` quando HTML contém `<iframe>`** (usar `this.frame`)
- **Criar `this.frame` quando HTML NÃO contém `<iframe>`** (usar apenas `this.page`)
- Instanciar Page Objects diretamente nos testes
- Criar localizadores não utilizados
- Ignorar `frameLocator` para iframes
- Hardcode de URLs
- Métodos triviais (um comando só)

### **✅ SEMPRE:**

- **Criar TODOS os locators estáticos no constructor**
- **Validar se locators criados nos métodos são dinâmicos**
- **Usar APENAS português** para métodos, variáveis e comentários
- **Criar métodos de negócio completos** (nunca métodos triviais)
- Usar objetos via contexto (`page.{funcionalidade}Page`)
- Criar localizadores dinâmicos APENAS quando dependem de parâmetros
- Usar padrão de captura: `return await this.locator.textContent()`
- Seguir convenções de nomenclatura em português

---

## 📊 **Instanciação em helpers/index.js**

### **Processo em 5 Passos:**

#### **1️⃣ IMPORTAR:**

```javascript
// AO FINAL da seção de imports
import { {NomeFuncionalidade}Page } from '../pages/{caminho}/{nomeFuncionalidade}Page';
```

#### **2️⃣ INSTANCIAR PAGES:**

```javascript
// AO FINAL do bloco page
context['{nomeFuncionalidade}Page'] = new {NomeFuncionalidade}Page(page);
```

#### **3️⃣ USAR NOS TESTES:**

```javascript
await page.{nomeFuncionalidade}Page.meuMetodo();
```

#### **4️⃣ VALIDAR:**

```javascript
// SEMPRE execute get_errors após modificar helpers/index.js
```

### **⚠️ REGRA DE OURO:**

> **NUNCA REMOVA OU MODIFIQUE LINHAS EXISTENTES - APENAS ADICIONE**

---

## ✅ **Resumo das Regras Críticas**

1. **Idioma obrigatório: Português** - Todos métodos, variáveis e comentários em português
2. **TODOS IDs no constructor** com sufixo de tipo (ex: `this.ID_CAMPO_LOOKUP = '#campo-autocomplete'`)
3. **TODOS locators estáticos no constructor** (OBRIGATÓRIO)
4. **Não repetir valor em fillFieldSLookup** se valor e valorClique são iguais
5. **Locators dinâmicos nos métodos** (somente se dependem de parâmetros)
6. **JSDoc sem detalhar campos** - usar "Exemplo: JSON_CONSTANTE"
7. **Métodos de negócio completos** (NUNCA métodos triviais)
8. **NUNCA misturar inglês com português** na nomenclatura
9. **Validar iframe** antes de usar `this.frame`
10. **Instanciar em helpers/index.js** (nunca diretamente nos testes)
11. **Auditoria antes de finalizar** (remover órfãos)
12. **ESLint sem erros** (sempre validar)
13. **Nomenclatura OBRIGATÓRIA de locators** (`locator{Descrição}{Tipo}` - ex: `locatorSalvarButton`, `locatorNomeInput`)
14. **Nomenclatura OBRIGATÓRIA de constantes** (`TIPO_{DESCRICAO}_{TipoElemento}` - ex: `ID_CONTA_LOOKUP`, `CSS_ENVIAR_BUTTON`)
15. **Imports corretos** (validar com `get_errors`)
