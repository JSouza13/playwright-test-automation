# 📄 Estrutura de Arquivos de Teste (*.spec.js)

> **Módulo 06:** Templates e padrões específicos do projeto para testes

---

## 🚨 **REGRA CRÍTICA: NUNCA ALTERAR TESTES PRÉ-EXISTENTES**

> **⚠️ ATENÇÃO MÁXIMA: Ao implementar em arquivo de teste já existente**

**REGRA ABSOLUTA - SEM EXCEÇÕES:**

- ❌ **NUNCA modificar** blocos `test()` já existentes
- ❌ **NUNCA alterar** `test.beforeEach()` ou `test.afterAll()` existentes
- ❌ **NUNCA remover** imports, variáveis ou constantes já existentes
- ❌ **NUNCA mudar** tags ou annotations de testes existentes
- ❌ **NUNCA alterar** ordem de testes existentes
- ✅ **APENAS ADICIONAR** novos blocos `test()` ao final do `describe()`
- ✅ **APENAS ADICIONAR** novos imports se necessário
- ✅ **APENAS ADICIONAR** novas variáveis ao topo (sem remover existentes)

**Motivo:** Alterar testes existentes pode causar regressão ou quebrar validações já funcionando. Toda implementação deve ser ADITIVA.

**Exemplo Correto:**

```javascript
test.describe('CRUD - Funcionalidade', { tag: ['@MODULO'] }, () => {
  test.beforeEach(async ({ page }) => {
    // ✅ beforeEach existente preservado
    await page.funcionalidadePage.login(USUARIO);
  });

  test('001 - Teste existente', { tag: '@TESTE_001' }, async ({ page }) => {
    // ✅ Teste existente preservado
  });

  test('002 - Teste existente', { tag: '@TESTE_002' }, async ({ page }) => {
    // ✅ Teste existente preservado
  });

  // ✅ CORRETO - Novo teste adicionado AO FINAL
  test('003 - Novo teste', {
    tag: '@TESTE_003',
    annotation: { type: 'Jira', description: 'https://jira.com/TASK-123' }
  }, async ({ page }) => {
    // Arrange: Nova implementação
    // Act: Nova ação
    // Assert: Nova validação
  });
});
```

**Exemplo Incorreto:**

```javascript
// ❌ ERRADO - Modificar teste existente
test('001 - Teste existente', { tag: '@TESTE_001' }, async ({ page }) => {
  // ❌ Alterou lógica do teste - PROIBIDO
  await page.novaPage.novoMetodo(); // QUEBRA VALIDAÇÃO EXISTENTE
});

// ❌ ERRADO - Alterar beforeEach existente
test.beforeEach(async ({ page }) => {
  // ❌ Adicionou lógica ao beforeEach existente - PROIBIDO
  await page.funcionalidadePage.login(USUARIO);
  await page.novoPage.novaPreparacao(); // AFETA TODOS OS TESTES
});
```

---

## 🚨 **REGRA CRÍTICA: SEPARAÇÃO DE RESPONSABILIDADES**

> **⚠️ Testes NUNCA devem conter lógica de interação direta com elementos**

**REGRA ABSOLUTA:**

- ❌ **PROIBIDO no .spec.js:** `page.locator()`, `page.getByRole()`, `page.click()`, `page.fill()`, `expect(page.locator())`
- ❌ **PROIBIDO no .spec.js:** Qualquer interação direta com elementos do DOM
- ✅ **OBRIGATÓRIO no .spec.js:** Chamar APENAS métodos dos Page Objects
- ✅ **OBRIGATÓRIO no .spec.js:** Usar APENAS expects de métodos Page que retornam locators

**Motivo:** Testes devem orquestrar fluxos usando abstração de Page Objects. Lógica de localização e interação pertence aos Page Objects.

**✅ CORRETO:**

```javascript
test('01 - Cadastrar usuário',
  {
    tag: '@USUARIOS_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Acessar tela de usuários
    await page.usuariosPage.acessarTela();

    // Act: Chamar método da Page
    await page.usuariosPage.cadastrar(dados);

    // Assert: Validar usando método da Page
    await page.usuariosPage.validarMensagemSucesso();
  }
);
```

**❌ ERRADO:**

```javascript
test('Cadastrar usuário', async ({ page }) => {
  // ❌ PROIBIDO - Interação direta no teste
  await page.locator('#nome').fill('João');
  await page.getByRole('button', { name: 'Salvar' }).click();

  // ❌ PROIBIDO - Expect de locator criado no teste
  await expect(page.locator('.success-message')).toBeVisible();
});
```

**Onde implementar:**

| Responsabilidade | Arquivo | Exemplo |
|------------------|---------|---------|
| Locators e interações | `*Page.js` | `async cadastrar(dados) { await this.locator.fill(); }` |
| Orquestração de fluxo | `*.spec.js` | `await page.usuariosPage.cadastrar(dados);` |
| Validações | `*.spec.js` | `expect(page.usuariosPage.locatorMensagem).toBeVisible()` |

---

## 🎭 **CONSULTAR PLAYWRIGHT DOCS PRIMEIRO**

> **⚠️ Para estrutura de testes, assertions e hooks:**
>
> - **Writing Tests:** https://playwright.dev/docs/writing-tests
> - **Test Assertions:** https://playwright.dev/docs/test-assertions
> - **Test Hooks:** https://playwright.dev/docs/api/class-test#test-before-each

**Princípio:** Siga as melhores práticas do Playwright para estrutura de testes. As regras abaixo são **específicas do projeto** (nomenclatura, padrão AAA com comentários, tags customizadas).

---

## 🎯 **REGRA CRÍTICA: INJEÇÃO CONDICIONAL DE FIXTURES**

> **⚠️ SEMPRE injete APENAS as fixtures necessárias em cada contexto**

### **Regras de Injeção:**

- **Somente UI (Page):** `async ({ page }) => { ... }`
- **Injete APENAS o que usar:** para este módulo, priorize `async ({ page }) => { ... }`

### **✅ PADRÃO CORRETO:**

```javascript
// ✅ CORRETO - beforeEach usa apenas page
test.beforeEach(async ({ page }) => {
  await page.funcionalidadePage.login(TOKEN);
});

// ✅ CORRETO - Teste usa SOMENTE page
test('01 - Cadastrar via UI',
  {
    tag: '@FUNCIONALIDADE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Preparar dados para cadastro

    // Act: Cadastrar registro via UI
    await page.funcionalidadePage.cadastrar(JSON_DADOS);

    // Assert: Validar cadastro realizado com sucesso
    await expect(page.funcionalidadePage.locatorSucessoAlert).toBeVisible();
  }
);
test('02 - Editar e validar na UI',
  {
    tag: '@FUNCIONALIDADE_UPDATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-002' }
  },
  async ({ page }) => {
    // Arrange: Abrir registro existente para edição
    await page.funcionalidadePage.acessarEdicaoPorDescricao(JSON_DADOS.nome);

    // Act: Navegar para edição do registro
    await page.funcionalidadePage.editarRegistro(JSON_DADOS);

    // Assert: Validar dados carregados corretamente na UI
    await expect(page.funcionalidadePage.locatorNomeInput).toHaveValue(JSON_DADOS.nome);
  }
);
```

### **🔍 Checklist de Validação:**

- [ ] Cada `test()` injeta APENAS fixtures utilizadas?
- [ ] `beforeEach` injeta apenas fixtures que USA?
- [ ] `afterAll` injeta apenas fixtures que USA?
- [ ] NENHUMA fixture está injetada "por precaução" sem uso?

**Motivo:** Injetar fixtures não utilizadas causa warnings do Playwright e polui o código desnecessariamente.

---

## 🚨 **PADRÃO DO PROJETO: AAA com Comentários**

Todos os blocos `test()` DEVEM ter comentários curtos e úteis que indiquem a intenção de cada bloco na estrutura AAA (Arrange, Act, Assert), evitando explicar o óbvio e mantendo o padrão de Clean Code.

### **Estrutura AAA:**

- **Arrange (Preparação):** Prepara o contexto (dados, navegação, pré-condições)
- **Act (Execução):** Executa UMA ação principal (submeter, clicar, preencher fluxo)
- **Assert (Validação):** Valida UM resultado principal (mensagem, estado, navegação)

### **Regras AAA:**

- ✅ Comentários obrigatórios: `// Arrange:`, `// Act:`, `// Assert:`
- ✅ **Comentários DEVEM agregar valor** - descrever O QUE está sendo feito, não o óbvio
- ✅ Adicione descrição ESPECÍFICA após os dois-pontos para documentar contexto e intenção
- ✅ Uma responsabilidade por fase (evitar múltiplas ações ou validações misturadas)
- ✅ Arrange pode ter múltiplas linhas de preparação
- ✅ Act deve ter poucas linhas e focar em UMA ação de negócio principal
- ✅ Assert deve validar O resultado esperado dessa ação
- ✅ Use termos em inglês: **Arrange, Act, Assert** (padrão internacional)
- ❌ **NUNCA** comentários genéricos como "Preparação", "Execução", "Validação"
- ❌ **NUNCA** use `console.log()` diretamente — viola SonarQube S106. Use comentários AAA descritivos
- ❌ Não misturar preparação com ação ou validação

### **Formato dos Comentários:**

```javascript
// Arrange: {descrição ESPECÍFICA e OBJETIVA do contexto sendo preparado}
// Act: {descrição ESPECÍFICA da ação de negócio executada}
// Assert: {descrição ESPECÍFICA do resultado sendo validado}
```

### **❌ Comentários NÃO Aceitáveis:**

```javascript
// ❌ Genéricos (não agregam valor)
// Arrange: Preparação
// Arrange: Preparar dados
// Act: Execução
// Act: Executar ação
// Assert: Validação
// Assert: Validar resultado

// ❌ Usar console.log para documentar (viola SonarQube S106)
console.log('Passo 1: Criar registro');
console.log('Passo 2: Validar grid');

// ❌ Usar termos em português
// Preparação: Criar registro de férias
// Execução: Submeter formulário
// Validação: Validar mensagem de sucesso
```

### **✅ Comentários Aceitáveis (Específicos):**

```javascript
// Arrange: Acessar tela de edição com registro existente
// Arrange: Preparar dados de portaria com horários válidos e acessar formulário
// Act: Submeter formulário de cadastro de portaria com dados completos
// Act: Aplicar filtros de data e status na listagem de registros
// Assert: Validar mensagem de sucesso e garantir que novo registro aparece na listagem
// Assert: Validar que registro foi excluído da listagem
```

---

## ✅ **Exemplos de Testes Corretos**

### **Exemplo 1: Teste de Cadastro (CRUD)**

```javascript
test('001 - Deve cadastrar registro com sucesso',
  {
    tag: '@CRUD_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Preparar dados e navegar para tela de cadastro
    await page.funcionalidadePage.prepararDados(JSON_DADOS);
    await page.funcionalidadePage.acessarFormulario();

    // Act: Cadastrar novo registro no sistema
    await page.funcionalidadePage.cadastrarRegistro(JSON_DADOS);

    // Assert: Validar que cadastro foi realizado com sucesso
    await page.funcionalidadePage.validarMensagemSucesso();
    await page.funcionalidadePage.validarRegistroNaListagem(JSON_DADOS.campo);
  }
);
```

### **Exemplo 2: Teste de Edição (CRUD)**

```javascript
test('002 - Deve editar registro existente',
  {
    tag: '@CRUD_UPDATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-002' }
  },
  async ({ page }) => {
    // Arrange: Acessar tela de edição para registro existente
    await page.funcionalidadePage.acessarEdicaoPorDescricao(JSON_DADOS.descricao);

    // Act: Atualizar campos do formulário e salvar
    await page.funcionalidadePage.editarRegistro(JSON_DADOS_ATUALIZADOS);

    // Assert: Validar que alterações foram persistidas
    await page.funcionalidadePage.validarMensagemSucesso();
    await page.funcionalidadePage.validarDadosAtualizadosNaTela(JSON_DADOS_ATUALIZADOS);
  }
);
```

### **Exemplo 3: Teste de Validação**

```javascript
test('003 - Deve exibir erro ao tentar salvar com campos obrigatórios vazios',
  {
    tag: '@VALIDACAO',
    annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-003' }
  },
  async ({ page }) => {
    // Arrange: Navegar para formulário sem preencher dados
    await page.funcionalidadePage.acessarFormulario();

    // Act: Submeter formulário vazio
    await page.funcionalidadePage.clicarSalvar();

    // Assert: Validar mensagens de erro nos campos obrigatórios
    await page.funcionalidadePage.validarMensagemErro('Campo obrigatório não preenchido');
    await page.funcionalidadePage.validarCamposComErro(['campo1', 'campo2']);
  }
);
```

---

## ❌ **Exemplo Incorreto (Anti-Padrão)**

```javascript
// ❌ ERRADO - Fases misturadas, sem comentários AAA
test('001 - Teste sem estrutura', async ({ page }) => {
  await page.funcionalidadePage.acessarTela();
  await page.funcionalidadePage.preencherCampo1('valor');
  await page.funcionalidadePage.validarCampo1();
  await page.funcionalidadePage.preencherCampo2('valor');
  await page.funcionalidadePage.clicarSalvar();
  await page.funcionalidadePage.validarMensagem();
});

// ❌ ERRADO - Comentários genéricos que NÃO agregam valor
test('002 - Teste com comentários ruins', async ({ page }) => {
  // Arrange: Preparação
  await page.funcionalidadePage.prepararDados();

  // Act: Execução
  await page.funcionalidadePage.executarAcao();

  // Assert: Validação
  await page.funcionalidadePage.validarResultado();
});

// ❌ ERRADO - Usando console.log() para documentar passos (viola SonarQube S106)
test('003 - Teste com console.log()', async ({ page }) => {
  console.log('Passo 1: Criar registro');
  await page.funcionalidadePage.criarRegistro();

  console.log('Passo 2: Validar grid');
  await page.funcionalidadePage.validarGrid();

  console.log('Passo 3: Excluir registro');
  await page.funcionalidadePage.excluir();
});

// ❌ ERRADO - Usando test.step() ao invés de comentários AAA
test('004 - Teste com test.step()', async ({ page }) => {
  await test.step('Preparar dados', async () => {
    await page.funcionalidadePage.prepararDados();
  });

  await test.step('Executar ação', async () => {
    await page.funcionalidadePage.executarAcao();
  });

  await test.step('Validar resultado', async () => {
    await page.funcionalidadePage.validarResultado();
  });
});
```

**Problemas:**

- Sem comentários AAA (exemplo 1)
- Preparação/Execução/Validação misturados (exemplo 1)
- Não fica claro qual é a ação principal (exemplo 1)
- Validações intermediárias poluem o fluxo (exemplo 1)
- **Comentários genéricos que não agregam valor** (exemplo 2)
- Comentários não explicam O QUE está sendo feito especificamente (exemplo 2)
- **Uso de console.log() para documentar passos** (exemplo 3 - polui logs e viola SonarQube S106)
- **Uso de test.step() ao invés de comentários simples** (exemplo 4)
- test.step() adiciona complexidade desnecessária (exemplo 4)

---

## 🚨 **REGRAS CRÍTICAS ANTES DE IMPLEMENTAR**

### **REGRA #0: Validar Imports Obrigatórios**

> **⚠️ TODOS os imports devem ser validados e corretos ANTES de criar o teste**

**✅ IMPORTS CORRETOS:**

```javascript
// ✅ JSONs de data/ (SEMPRE com .js ou validar se sem .js funciona)
import { JSON_CONSTANTE } from '../../data/{caminho}/{arquivo}Json';
// ou
import { JSON_CONSTANTE } from '../../data/{caminho}/{arquivo}Json.js';

// ✅ Helpers do projeto
import { test } from '../helpers';

// ✅ Usuários para login (SEMPRE de helpers/ambiente)
import { USUARIO_TESTE } from '../helpers/ambiente';
```

**❌ IMPORTS INCORRETOS:**

```javascript
// ❌ ERRADO - Caminho inexistente ou incorreto
import { JSON_CONSTANTE } from '../../data/crmx/negocioJson'; // Erro: Cannot find module

// ❌ ERRADO - Usuário de login importado de local incorreto
import { CRMX_ERPXUI } from '../../../utils/config'; // NUNCA usar utils/config
import { ADMIN_ERPXUI } from '../../../config'; // NUNCA usar config
```

> **🚨 REGRA CRÍTICA: Usuários de Login**
>
> **TODOS os usuários utilizados em `dataUtils.login()` devem ser importados de `helpers/ambiente.js`**
>
> **✅ CORRETO:** `import { CRMX_ERPXUI } from '../helpers/ambiente';`
>
> **❌ ERRADO:** `import { CRMX_ERPXUI } from '../utils/config';`

**🔍 VALIDAÇÃO OBRIGATÓRIA:**

Antes de criar qualquer import:

1. **Executar `grep_search`** para encontrar o arquivo correto:
   ```bash
   grep_search(query="{nomeArquivo}", includePattern="**/*.js", isRegexp=false)
   ```

2. **Validar caminho relativo** do `.spec.js` até o arquivo encontrado

3. **Testar import** com `get_errors` após criar

4. **NUNCA assumir** que o caminho está correto sem validar

---

### **REGRA #1: Seguir "Informações Gerais do Teste" (OBRIGATÓRIO)**

> **⚠️ SEMPRE que houver "Informações Gerais do Teste", seguir PASSO A PASSO obrigatoriamente**

**📋 O que são "Informações Gerais do Teste":**

- Instruções específicas do usuário sobre como implementar o teste
- Passos detalhados de preparação, execução e validação
- Requisitos específicos de dados, fluxos ou validações
- Contexto adicional que NÃO está nos módulos

**🚨 REGRA OBRIGATÓRIA:**

```
  SE usuário fornecer "Informações Gerais do Teste":
  ENTÃO seguir CADA PASSO exatamente como descrito
  E NÃO assumir ou pular etapas
  E questionar SE houver dúvidas
  E NUNCA usar apenas os templates padrão
```

---

### **🚨 REGRA #1.1: Validar TODOS os HTMLs de TODAS as Etapas (OBRIGATÓRIO)**

> **⚠️ ERRO CRÍTICO COMUM:** Analisar apenas o primeiro HTML mencionado e ignorar HTMLs de etapas subsequentes

**📋 Estrutura Padrão em "Informações Gerais do Teste":**

Cada etapa contém **3 referências obrigatórias**:

```markdown
- **Referência HTML:** `{arquivo}.html`
- **Referência Page:** `pages\{caminho}\{arquivo}Page.js`
- **Referência Visual:** ![Texto]({caminho}/{imagem}.png)
  - **Ação:** {descrição da ação}
```

**🚨 PROCESSO OBRIGATÓRIO:**

1. **Listar TODAS as etapas** das "Informações Gerais do Teste"
2. **Para CADA etapa:** Identificar os 3 campos de referência
3. **Para CADA "Referência HTML":** Executar análise completa do arquivo
4. **NUNCA assumir** que elementos são iguais entre HTMLs diferentes

**✅ CHECKLIST DE VALIDAÇÃO (executar para CADA etapa):**

```bash
# ETAPA 1: Identificar TODAS as referências HTML
grep "Referência HTML:" {arquivo_instrucoes.md}
# Resultado esperado: Lista de TODOS os HTMLs mencionados

# ETAPA 2: Para CADA HTML identificado, executar análise completa
# Exemplo: Se encontrou 5 HTMLs, executar 5 análises independentes

# HTML 1: acessaTela.html
grep_search(query="<iframe", includePattern="acessaTela.html")
grep_search(query="{elemento1}", includePattern="acessaTela.html")
# ... validar TODOS os elementos desta etapa

# HTML 2: crudPrincipalNegocio.html
grep_search(query="<iframe", includePattern="crudPrincipalNegocio.html")
grep_search(query="{elemento2}", includePattern="crudPrincipalNegocio.html")
# ... validar TODOS os elementos desta etapa

# HTML 3: filtroNegocio.html (NÃO PULAR!)
grep_search(query="<iframe", includePattern="filtroNegocio.html")
grep_search(query="{elemento3}", includePattern="filtroNegocio.html")
# ... validar TODOS os elementos desta etapa

# ETAPA 3: Documentar elementos únicos de CADA HTML
# ETAPA 4: Criar locators específicos para CADA contexto
```

**❌ ANTI-PADRÃO CRÍTICO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Assumir que campo "Descrição" é igual em todos os HTMLs
// Analisou apenas crudPrincipalNegocio.html
this.ID_DESCRICAO = '#description'; // Criado no constructor

async cadastrarNegocio(dados) {
  // Usa ID_DESCRICAO do cadastro ✅
  await this.page.locator(this.ID_DESCRICAO).fill(dados.descricao);
}

async filtrarNegocio(dados) {
  // ❌ ERRO: Reutiliza ID_DESCRICAO sem validar filtroNegocio.html
  // O campo "Descrição" no filtro pode ter ID diferente!
  await this.page.locator(this.ID_DESCRICAO).fill(dados.descricao);
}
```

**✅ PADRÃO CORRETO:**

```javascript
// ✅ CORRETO - Validou AMBOS os HTMLs independentemente
constructor(page) {
  this.page = page;

  // IDs do HTML crudPrincipalNegocio.html (validado com grep_search)
  this.ID_DESCRICAO_CADASTRO = '#description'; // Linha 150 em crudPrincipalNegocio.html

  // IDs do HTML filtroNegocio.html (validado com grep_search SEPARADAMENTE)
  this.ID_DESCRICAO_FILTRO = '#filter-description'; // Linha 89 em filtroNegocio.html
}

async cadastrarNegocio(dados) {
  // Usa ID específico do cadastro ✅
  await this.page.locator(this.ID_DESCRICAO_CADASTRO).fill(dados.descricao);
}

async filtrarNegocio(dados) {
  // Usa ID específico do filtro ✅
  await this.page.locator(this.ID_DESCRICAO_FILTRO).fill(dados.descricao);
}
```

**📊 DOCUMENTAÇÃO OBRIGATÓRIA NO PLANO TÉCNICO:**

```markdown
## HTMLs Analisados (TODOS)

| Etapa | HTML Referenciado | Elementos Identificados | Status |
|-------|-------------------|------------------------|--------|
| Etapa 2 | acessaTela.html | Título "Gerenciar Negócio" | ✅ Analisado |
| Etapa 3 | crudPrincipalNegocio.html | Campo Descrição (#description), 9 s-lookups | ✅ Analisado |
| Etapa 5 | filtroNegocio.html | Campo Descrição (#filter-description), botão Filtrar | ✅ Analisado |
| Etapa 6 | kanban.html | Cards, títulos, status | ✅ Analisado |

**⚠️ ATENÇÃO:** Campo "Descrição" existe em 2 HTMLs com IDs DIFERENTES:
- crudPrincipalNegocio.html: `#description` (linha 150)
- filtroNegocio.html: `#filter-description` (linha 89)

**Decisão:** Criar constantes separadas no constructor para cada contexto.
```

**💡 Checklist Anti-Erro:**

- [ ] Listei TODAS as etapas das "Informações Gerais do Teste"?
- [ ] Identifiquei TODOS os HTMLs referenciados (não apenas o primeiro)?
- [ ] Executei `grep_search` em CADA HTML independentemente?
- [ ] Validei que elementos com MESMO NOME podem ter IDs/seletores DIFERENTES em HTMLs diferentes?
- [ ] Criei constantes/locators ESPECÍFICOS para cada contexto (cadastro, filtro, etc)?
- [ ] Documentei no plano técnico TODOS os HTMLs analisados?

**⛔ SE QUALQUER RESPOSTA FOR "NÃO":** Voltar e analisar TODOS os HTMLs antes de implementar

---

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
  // ❌ ERRADO - Ignorar informações gerais e usar template genérico
  test('001 - Teste genérico', async ({ page }) => {
  // Código genérico que NÃO segue as informações específicas fornecidas
  });
```

**✅ PADRÃO CORRETO:**

```javascript
  // ✅ CORRETO - Seguir informações gerais fornecidas passo a passo
  test('001 - Teste específico conforme informações fornecidas',
  {
    tag: '@TAG_ESPECIFICA',
    annotation: { type: 'Issue', description: 'URL_JIRA' }
  },
  async ({ page }) => {
    // Arrange: Exatamente conforme passo 1 das informações gerais
    // ...

    // Act: Exatamente conforme passo 2 das informações gerais
    // ...

    // Assert: Exatamente conforme passo 3 das informações gerais
    // ...
  }
);
```

**💡 Checklist de Conformidade:**

- [ ] Li TODAS as "Informações Gerais do Teste" fornecidas?
- [ ] Identifiquei TODOS os passos específicos?
- [ ] Implementei CADA passo conforme descrito?
- [ ] Questionei o usuário SE houve dúvida em algum passo?
- [ ] NÃO assumi ou pulei nenhuma etapa?

---

## 📋 **Template Completo de Arquivo de Teste**

> **🎯 Template com Placeholders Genéricos e Injeção Condicional de Fixtures**

### **Regras de Injeção de Fixtures (OBRIGATÓRIO):**

- **Somente Page (UI):** `async ({ page }) => { ... }`
- **Injetar apenas o necessário:** neste módulo, manter `async ({ page }) => { ... }`

**⚠️ NUNCA injete fixture não utilizada** (causa warning e poluição de código)

---

### **Template Base Completo:**

> **📝 INSTRUÇÕES DE USO DO TEMPLATE:**
>
> - Substitua TODOS os placeholders por valores reais
> - **Remova fixtures não utilizadas**
> - **Comentários de instrução** (como este bloco) NÃO devem ser copiados para o arquivo real

```javascript
import { expect } from '@playwright/test';
import {
  {JSON_CONSTANTE_01},
  {JSON_CONSTANTE_02},
} from '../../data/{caminho}/{funcionalidade}Json.js';
import { test } from '../helpers';
import { {USUARIO_TESTE} } from '../helpers/ambiente.js';
import { logger } from '../../utils/logger.js';

test.describe('{nome do Describe}', { tag: ['@{MODULO}', '@{FUNCIONALIDADE}'] }, () => {

  test.beforeEach(async ({ page }) => {
    logger.test(test.info().title);

    await page.funcionalidadePage.login({USUARIO_TESTE});
    await page.{funcionalidade}Page.acessarTela();
  });

  test(
    '01 - {Descrição da ação 01} (UI)',
    {
      tag: '@{TAG_ACAO_01}',
      annotation: {
        type: 'Issue',
        description: '{URL_JIRA}',
      },
    },
    async ({ page }) => {
      // Arrange: Preparar dados e contexto necessários para ação 01
      await page.{funcionalidade}Page.prepararContexto({JSON_CONSTANTE_01});

      // Act: Executar ação principal de negócio 01
      await page.{funcionalidade}Page.executarAcao01({JSON_CONSTANTE_01});

      // Assert: Validar resultado esperado da ação 01
      await page.{funcionalidade}Page.validarResultadoAcao01({JSON_CONSTANTE_01});
      await expect(page.{funcionalidade}Page.locatorMensagemSucessoAlert).toBeVisible();
    }
  );

  test(
    '02 - {Descrição da ação 02} (UI)',
    {
      tag: '@{TAG_ACAO_02}',
      annotation: {
        type: 'Issue',
        description: '{URL_JIRA}',
      },
    },
    async ({ page }) => {
      // Arrange: Navegar para edição e preparar dados para ação 02
      await page.{funcionalidade}Page.navegarParaEdicaoPorFiltro({JSON_CONSTANTE_02});

      // Act: Executar ação principal de negócio 02 via UI
      await page.{funcionalidade}Page.executarAcao02({JSON_CONSTANTE_02});

      // Assert: Validar resultado da ação na UI
      await page.{funcionalidade}Page.validarResultadoAcao02();
      await expect(page.{funcionalidade}Page.locatorCampoEsperado).toHaveText({JSON_CONSTANTE_02}.campoEsperado);
    }
  );

  test(
    '03 - {Descrição da ação 03} - VALIDAÇÃO DE ERRO (UI)',
    {
      tag: '@{TAG_ACAO_03}',
      annotation: {
        type: 'Issue',
        description: '{URL_JIRA}',
      },
    },
    async ({ page }) => {
      // Arrange: Navegar para formulário sem preencher campos obrigatórios

      // Act: Submeter formulário vazio ou com dados inválidos
      await page.{funcionalidade}Page.submeterFormularioVazio();

      // Assert: Validar mensagens de erro nos campos obrigatórios
      await page.{funcionalidade}Page.validarMensagensErro(['campo1', 'campo2']);
      await expect(page.{funcionalidade}Page.locatorMensagemErroAlert).toBeVisible();
    }
  );
});
```

---

### **Checklist de Uso do Template:**

- [ ] Substituí TODOS os placeholders por valores reais?
- [ ] **Removi `database` e `tenant` se não usar DB?**
- [ ] Importei JSONs COM extensão `.js`?
- [ ] Usei injeção de fixtures apenas com `page`?
- [ ] Comentários AAA são específicos (não genéricos)?
- [ ] Tags do describe são ARRAY, tags do test são STRING?
- [ ] Cada test() tem annotation com link do Jira?
- [ ] NUNCA construí objetos inline (sempre importei JSON de data/)?
- [ ] Executei `get_errors` após criar imports?

---

## 🏷️ **Tags de Teste (OBRIGATÓRIAS)**

### **Regras de Tags:**

1. **test.describe() DEVE ter tag ARRAY** com tags gerais do módulo/funcionalidade
2. **test() DEVE ter tag STRING ÚNICA** específica daquele teste
3. **Tags NÃO DEVEM se repetir** entre describe e test
4. Formato: `@NOME_TAG` em maiúsculas
5. Annotation OBRIGATÓRIO com URL do Jira em cada test()

### **Estrutura Correta:**

```javascript
// ✅ CORRETO - describe com ARRAY, test com STRING ÚNICA
test.describe('Cadastro de Registros', { tag: ['@MODULO_EXEMPLO', '@FUNCIONALIDADE'] }, () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('001 - Deve cadastrar novo registro',
    {
      tag: '@FUNCIONALIDADE_CREATE',  // ✅ STRING, não array
      annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-101' }
    },
    async ({ page }) => {
      // Teste aqui
    }
  );

  test('002 - Deve editar registro existente',
    {
      tag: '@FUNCIONALIDADE_UPDATE',  // ✅ STRING, não array
      annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-102' }
    },
    async ({ page }) => {
      // Teste aqui
    }
  );
});
```

### **❌ INCORRETO - Não Fazer:**

```javascript
// ❌ ERRADO - describe SEM tags
test.describe('crud - Funcionalidade', () => {

// ❌ ERRADO - test com ARRAY ao invés de STRING
test('001 - Teste', {
  tag: ['@TAG1', '@TAG2'],  // ❌ Array no test()
  annotation: { ... }
}, async () => {});

// ❌ ERRADO - tags repetidas entre describe e test
test.describe('crud', { tag: ['@MODULO_EXEMPLO'] }, () => {
  test('001', {
    tag: '@MODULO_EXEMPLO',  // ❌ Repetida do describe
    annotation: { ... }
  }, async () => {});
});

// ❌ ERRADO - test SEM annotation
test('001 - Teste', {
  tag: '@TAG'
  // ❌ Faltando annotation
}, async () => {});
```

### **Checklist de Tags:**

- [ ] test.describe() tem tag como **ARRAY** `{ tag: ['@TAG1', '@TAG2'] }`
- [ ] test() tem tag como **STRING** `{ tag: '@TAG_UNICA' }`
- [ ] Tags do describe são gerais (módulo/funcionalidade)
- [ ] Tags do test() são específicas (ação/cenário)
- [ ] Não há repetição de tags entre describe e test
- [ ] Annotation com URL Jira presente em TODOS os test()

---

## 🚫 **PROIBIÇÕES**

### **❌ NUNCA construa JSON inline no arquivo .spec.js**

> **⚠️ REGRA CRÍTICA: TODOS os JSONs devem estar em `data/`, NUNCA criar objetos dentro do `.spec.js`**

**🚨 PROBLEMA CRÍTICO:** Construir objetos como `dadosFiltro`, `dadosCadastro` diretamente no teste

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Criar objeto inline no teste
test('Deve filtrar registros', async ({ page }) => {
  const dadosFiltro = {
    nome: 'Teste',
    categoria: 'Categoria A',
    status: 'Ativo',
  };

  await page.funcionalidadePage.preencherFiltros(dadosFiltro);
});

// ❌ ERRADO - Criar objeto de cadastro no teste
test('Deve cadastrar registro', async ({ page }) => {
  const dadosCadastro = {
    nome: 'Registro Novo',
    descricao: 'Descrição',
  };

  await page.funcionalidadePage.cadastrar(dadosCadastro);
});
```

**✅ SOLUÇÃO CORRETA:**

```javascript
// ✅ CORRETO - JSON importado de data/
import { JSON_FILTRO_VALIDACAO, JSON_CADASTRAR_REGISTRO } from '../../data/{caminho}/{arquivo}Json';

test('01 - Deve filtrar registros',
  {
    tag: '@FUNCIONALIDADE_FILTRO',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Preparar dados para filtro
    await page.funcionalidadePage.acessarTela();

    // Act: Aplicar filtros e executar busca
    await page.funcionalidadePage.preencherFiltros(JSON_FILTRO_VALIDACAO);
    await page.funcionalidadePage.executarBusca();

    // Assert: Validar resultados filtrados
    await page.funcionalidadePage.validarResultados(JSON_FILTRO_VALIDACAO);
  }
);

test('02 - Deve cadastrar registro',
  {
    tag: '@FUNCIONALIDADE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-002' }
  },
  async ({ page }) => {
    // Arrange: Acessar formulário de cadastro
    await page.funcionalidadePage.abrirFormulario();

    // Act: Cadastrar registro com JSON pré-definido
    await page.funcionalidadePage.cadastrar(JSON_CADASTRAR_REGISTRO);

    // Assert: Validar cadastro realizado
    await page.funcionalidadePage.validarCadastro();
  }
);
```

**💡 Por que isso é obrigatório:**

- ✅ Mantém dados centralizados em `data/`
- ✅ Facilita reutilização de JSONs em múltiplos testes
- ✅ Manutenção simplificada (alterar JSON altera todos os testes)
- ✅ Código de teste mais limpo e legível
- ❌ Criar inline = duplicação de dados e dificulta manutenção

---

### **❌ NUNCA expanda campos de JSON inline**

> **⚠️ REGRA CRÍTICA: SEMPRE passar JSON completo de `data/`, NUNCA criar objetos inline no `.spec.js`**

**🚨 PROBLEMA CRÍTICO:** Código poluído com expansão manual de campos

**❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Expandir campos do JSON inline
await page.funcionalidadePage.cadastrar({
  nome: JSON_CADASTRAR_REGISTRO.nome,
  descricao: JSON_CADASTRAR_REGISTRO.descricao,
  categoria: JSON_CADASTRAR_REGISTRO.categoria,
  dataInicio: JSON_CADASTRAR_REGISTRO.dataInicio,
});

// ❌ ERRADO - Desestruturar campos individualmente
await page.funcionalidadePage.validarNaGrid({
  nome: JSON_FILTRO_VALIDACAO.nome,
  categoria: JSON_FILTRO_VALIDACAO.categoria,
  status: JSON_FILTRO_VALIDACAO.status,
  dataInicio: JSON_FILTRO_VALIDACAO.dataInicio,
});
```

**✅ SOLUÇÃO CORRETA:**

```javascript
// ✅ CORRETO - Passar JSON completo diretamente
await page.funcionalidadePage.cadastrar(JSON_CADASTRAR_REGISTRO);

// ✅ CORRETO - Passar JSON completo
await page.funcionalidadePage.validarNaGrid(JSON_FILTRO_VALIDACAO);

// ✅ CORRETO - Passar JSON completo
await page.funcionalidadePage.preencherFiltros(JSON_FILTRO_VALIDACAO);
```

**🎯 Regra de Ouro:**

| Situação | Como Fazer |
|----------|-----------|
| **Método recebe objeto JSON** | ✅ Passar constante JSON completa |
| **JSON tem todos os campos** | ✅ Passar diretamente sem expandir |
| **Necessita customização** | ✅ Criar novo JSON ou usar spread: `{ ...JSON_BASE, campo: 'novo valor' }` |
| **Expansão inline** | ❌ **NUNCA FAZER** - Polui o código |

**💡 Benefícios:**

- ✅ Código limpo e legível
- ✅ Menos linhas no arquivo de teste
- ✅ Manutenção centralizada no JSON
- ✅ Reutilização fácil em múltiplos testes
- ✅ Facilita identificar qual JSON está sendo usado

**🔧 Implementação:**

1. **JSON deve conter TODOS os campos necessários** para o cenário
2. **Page Object aceita JSON completo** e extrai campos necessários
3. **Teste passa JSON diretamente** sem expansão
4. **Se precisar customizar:** Criar novo JSON ou usar spread operator

**Exemplo Completo:**

```javascript
// ✅ data/registrosJson.js
export const JSON_CADASTRAR_REGISTRO = {
  nome: 'Registro Exemplo',
  categoria: 'Categoria A',
  status: 'Ativo',
  dataInicio: '2024-01-01',
  descricao: 'Descrição do registro',
};

export const JSON_FILTRO_VALIDACAO = {
  // Campos de filtro
  nome: 'Registro Exemplo',
  categoria: 'Categoria A',
  status: 'Ativo',
  // Campos de validação
  quantidadeItens: 5,
};

// ✅ pages/funcionalidadePage.js
async cadastrar(dados) {
  await this.locatorNomeInput.fill(dados.nome);
  await this.formUtils.fillFieldPDropdown('#categoria', dados.categoria);
  // ... extrai campos que precisa do JSON
}

async preencherFiltros(filtros) {
  if (filtros.nome) await this.locatorFiltroNomeInput.fill(filtros.nome);
  if (filtros.categoria) {
    await this.formUtils.fillFieldPDropdown('#filtroCategoria', filtros.categoria);
  }
  // ... extrai campos condicionalmente
}

// ✅ tests/funcionalidade.spec.js
test('001 - Cadastrar Registro',
  {
    tag: '@FUNCIONALIDADE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Garantir tela pronta para cadastro
    await page.funcionalidadePage.prepararTelaCadastro();

    // Act: Cadastrar registro passando JSON completo
    await page.funcionalidadePage.cadastrar(JSON_CADASTRAR_REGISTRO);

    // Act: Aplicar filtros passando JSON completo
    await page.funcionalidadePage.preencherFiltros(JSON_FILTRO_VALIDACAO);
    await page.funcionalidadePage.aplicarFiltros();

    // Assert: Validar grid passando JSON completo
    await page.funcionalidadePage.validarNaGrid(JSON_FILTRO_VALIDACAO);
  }
);
```

**🚨 CHECKLIST DE VALIDAÇÃO:**

Antes de finalizar um teste, verifique:

- [ ] ❌ Há expansão de campos inline tipo `{ campo1: JSON.campo1, campo2: JSON.campo2 }`?
- [ ] ❌ Há múltiplas linhas com `JSON_CONSTANTE.campo` dentro de método?
- [ ] ✅ Todas as chamadas passam JSON completo diretamente?
- [ ] ✅ JSONs contêm TODOS os campos necessários para o cenário?
- [ ] ✅ Page Objects extraem campos internamente do JSON recebido?

---

## 📊 **Regras de Criação vs. Atualização**

| Cenário | Ação | Regras |
|---------|------|--------|
| **Arquivo novo** | Criar | Estrutura completa: `describe`, `beforeEach`, `test()` |
| **Arquivo existente** | Atualizar | APENAS adicionar `test()`, NUNCA remover/alterar existentes |

### **Ao Atualizar Arquivo Existente:**

1. **Adicionar `test()` ao final** do bloco `describe`
2. **NUNCA remover** testes existentes
3. **NUNCA modificar** `beforeEach` ou `afterAll` existentes
4. **MANTER** padrão de nomenclatura de testes (numeração sequencial)

---

## 📂 **Importações Obrigatórias**

```javascript
import { {JSON_CONSTANTE} } from '../data/{caminho}/{arquivo}Json';
import { test } from '../helpers';
import { {USUARIO_TESTE} } from '../helpers/ambiente';
```

### **Checklist de Imports:**

- [ ] JSON de dados importado (se necessário)
- [ ] `test` importado de `helpers` (não `@playwright/test`)
- [ ] Usuário de teste importado de `helpers/ambiente`
- [ ] Caminhos relativos corretos (contar `../`)
- [ ] Executar `get_errors` após criar imports

---

## 🎯 **Estrutura beforeEach Padrão**

```javascript
test.beforeEach(async ({ page }) => {
  logger.test(test.info().title);

  // Realizar login e navegar para tela
  await page.funcionalidadePage.login({USUARIO_TESTE});
  await page.{funcionalidade}Page.acessarTela();
});
```

### **Elementos Obrigatórios:**

1. **Log do teste:** `logger.test(test.info().title)` (usando `utils/logger.js`)
2. **Login:** `await page.funcionalidadePage.login({USUARIO_TESTE})`
3. **Navegação:** `await page.{funcionalidade}Page.acessarTela()`

**⚠️ NUNCA use `console.log()` diretamente** — viola SonarQube S106. Use `logger` de `utils/logger.js`

---

## 🔄 **Estrutura de Limpeza de Cenário**

Utilize métodos da própria Page quando houver necessidade de limpar estado da tela entre cenários.

**Quando usar:**
- Restauração de estado inicial da interface
- Limpeza de filtros e campos em tela
- Fechamento de modais e retorno para listagem

---

### **Checklist de Validação Final**

Antes de finalizar arquivo de teste:

- [ ] Padrão AAA implementado em TODOS os testes
- [ ] Comentários AAA específicos (não genéricos: "Preparação", "Execução", "Validação")
- [ ] NUNCA expandiu campos de JSON inline
- [ ] Tags obrigatórias em `describe` (array) e `test()` (string única)
- [ ] Annotations com URL do Jira
- [ ] Numeração sequencial dos testes (001, 002, 003...)
- [ ] `beforeEach` com estrutura padrão
- [ ] Imports corretos e validados com `get_errors`
- [ ] Se arquivo existente: APENAS adicionou, não removeu/alterou

---

## 🎨 **Nomenclatura de Testes**

### **Formato Obrigatório:**

```
{numero} - {Verbo no infinitivo} {descrição clara e objetiva}
```

### **Exemplos Corretos:**

```javascript
test('001 - Deve cadastrar registro com sucesso', ...)
test('002 - Deve editar registro existente', ...)
test('003 - Deve excluir registro quando confirmado', ...)
test('004 - Deve exibir erro ao tentar salvar com campos vazios', ...)
test('005 - Deve filtrar registros por data de criação', ...)
```

### **Exemplos Incorretos:**

```javascript
// ❌ Sem número
test('Deve cadastrar registro', ...)

// ❌ Verbo no passado
test('001 - Cadastrou registro', ...)

// ❌ Descrição vaga
test('001 - Teste de cadastro', ...)

// ❌ Sem ação clara
test('001 - Portarias', ...)
```

---

## 🔍 **Validação de Imports**

**REGRA ABSOLUTA:** Calcule corretamente os caminhos relativos.

### **Checklist:**

- [ ] Contar níveis de diretórios (`../`)
- [ ] Validar caminho do arquivo destino existe
- [ ] Compilar código mentalmente
- [ ] Executar `get_errors` após criar imports

### **Exemplo de Cálculo:**

```
Arquivo atual: tests/gestaoDePortarias/crud/portarias.spec.js
Import de:     data/gestaoDePortarias/portariasJson.js

Cálculo:
tests/gestaoDePortarias/crud/ → ../ (sobe 1) → tests/gestaoDePortarias/
                               → ../ (sobe 2) → tests/
                               → ../ (sobe 3) → raiz/

Resultado: '../../../data/gestaoDePortarias/portariasJson'
```

> **🚨 REGRA:** SEMPRE use `get_errors` após criar/modificar imports.

---

## 📊 **Mapeamento de Cobertura**

### **Atualização do coverageFeatureMap.yml**

**OBRIGATÓRIO:** Atualizar após criar/modificar testes

**Estrutura:**

```yml
- page: "{Caminho/Do/Menu}"
  features:
    nome da funcionalidade 1: true
    nome da funcionalidade 2: true
```

### **Regras:**

- ✅ Usar caminho exato do menu (campo **Produto** do cabeçalho)
- ✅ APENAS ADICIONAR novas features
- ❌ NUNCA alterar/remover features existentes
- ❌ NUNCA modificar estrutura do YAML

---

## 🎯 **Hierarquia de Fontes de Informação**

Ao criar testes baseados em especificação:

| Fonte | Uso | Validação Obrigatória |
|-------|-----|----------------------|
| **1. HTML** | Texto exato, tipo real, atributos | `grep_search` para componentes |
| **2. PNG** | Posicionamento, ordem (1º, 2º, último) | Correlacionar elementos com HTML |
| **3. Docs** | Fluxo de navegação, contexto | Usar apenas se não conflitar com HTML/PNG |

---

## 📝 **REGRA: Seguir Passos das Especificações**

> **⚠️ REGRA CRÍTICA: Passos determinados na seção "Informações Gerais do Teste" da especificação são OBRIGATÓRIOS e devem ser seguidos NA ORDEM EXATA**

### **✅ Processo Correto**

**QUANDO RECEBER ESPECIFICAÇÃO:**

1. **Ler seção "Informações Gerais do Teste"** completamente
2. **Identificar TODOS os passos listados**
3. **Implementar cada passo NA ORDEM EXATA**
4. **NUNCA pular ou reordenar passos**
5. **SE houver dúvida:** Questionar o usuário explicitamente

### **❌ PROIBIDO:**

```javascript
// ❌ ERRADO - Assumir passos não especificados
test('Cadastrar registro', async ({ page }) => {
  // Especificação disse: "Preencher campos obrigatórios"
  // AI assumiu: "Devo preencher TODOS os campos"
  await page.funcionalidadePage.preencherFormulario(JSON_COMPLETO); // ERRADO
});

// ❌ ERRADO - Reordenar passos
test('Validar filtro', async ({ page }) => {
  // Especificação - ordem CORRETA:
  // 1. Preencher filtros
  // 2. Clicar em buscar
  // 3. Validar resultado

  // AI fez (ERRADO):
  await page.funcionalidadePage.validarResultado(); // Passo 3 PRIMEIRO
  await page.funcionalidadePage.preencherFiltros(); // Passo 1 DEPOIS
});

// ❌ ERRADO - Pular passos
test('Excluir registro', async ({ page }) => {
  // Especificação - passos COMPLETOS:
  // 1. Buscar registro
  // 2. Clicar em excluir
  // 3. Confirmar exclusão

  // AI fez (ERRADO - pulou Passo 1):
  await page.funcionalidadePage.excluir(); // Passo 2
  await page.funcionalidadePage.confirmarExclusao(); // Passo 3
});

// ❌ ERRADO - Adicionar separadores de passos desnecessários
test('Jornada completa', async ({ page }) => {
  // ==================== PASSO 1: INCLUIR REGISTRO ==================== ❌ ERRADO
  // Arrange: Acessar tela
  await page.funcionalidadePage.acessarTela();

  // ==================== PASSO 2: VALIDAR REGISTRO ==================== ❌ ERRADO
  // Assert: Validar criação
  await page.funcionalidadePage.validarCriacao();
});
```

### **✅ Implementação Correta:**

```javascript
// ✅ CORRETO - Seguir EXATAMENTE os passos da especificação
test('01 - Validar filtro conforme especificação',
  {
    tag: '@FUNCIONALIDADE_FILTRO',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Especificação descreveu:
    // 1. Acessar tela
    // 2. Preencher filtros
    // 3. Clicar em buscar
    // 4. Validar resultado na grid

    // Arrange: Acessar tela conforme especificação
    await page.funcionalidadePage.acessarTela();

    // Act: Preencher filtros e buscar conforme especificação
    await page.funcionalidadePage.preencherFiltros(JSON_FILTRO);
    await page.funcionalidadePage.clicarBuscar();

    // Assert: Validar resultado conforme especificação
    await page.funcionalidadePage.validarResultadoNaGrid(JSON_FILTRO);
  }
);

// ✅ CORRETO - Comentários AAA descritivos sem separadores de passos
test('01 - Jornada completa de CRUD',
  {
    tag: '@FUNCIONALIDADE_CRUD_JORNADA',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Acessar tela de cadastro
    await page.funcionalidadePage.acessarTela();

    // Act: Incluir novo registro no sistema
    await page.funcionalidadePage.incluirRegistro(JSON_DADOS);

    // Assert: Validar que registro foi criado com sucesso
    await page.funcionalidadePage.validarMensagemSucesso();

    // Arrange: Recarregar tela para validação
    await page.funcionalidadePage.acessarTela();

    // Act: Aplicar filtros para localizar registro criado
    await page.funcionalidadePage.filtrarRegistro(JSON_DADOS);

    // Assert: Validar que registro aparece na grid
    await page.validationUtils.validarGrid(JSON_DADOS.grid);
  }
);
```

### **🔍 SE HOUVER DÚVIDA:**

**✅ SEMPRE questionar o usuário:**

```markdown
**Dúvida sobre especificação:**

A especificação menciona "Preencher filtros" mas não especifica QUAIS campos.

Você deseja:
1. Preencher TODOS os campos disponíveis no filtro?
2. Preencher APENAS campos obrigatórios?
3. Preencher campos específicos? (quais?)

Por favor, esclareça para garantir implementação correta.
```

**❌ NUNCA assumir ou deduzir:**

```javascript
// ❌ ERRADO - Assumir sem questionar
// "A especificação não disse, mas vou preencher tudo"
await page.funcionalidadePage.preencherFormulario(JSON_COMPLETO);
```

### **⚠️ Motivo da Regra**

- Especificações definem **requisitos funcionais**
- Pular ou reordenar passos **invalida o teste**
- Assumir passos não especificados **não atende os requisitos**
- Testes devem refletir **exatamente** o comportamento esperado

---

## 📚 **REGRA DE IMPORTS E Extensão .js**

> **⚠️ REGRA CRÍTICA: usar apenas imports públicos e extensão `.js` para data/helpers quando aplicável**

### **❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Sem extensão .js em data
import { JSON_INCLUIR } from '../../data/modulo/funcionalidadeJson';
// Error: Cannot find module

// ❌ ERRADO - importação direta de Playwright
import { test } from '@playwright/test';
```

### **✅ PADRÃO CORRETO DE IMPORTS:**

```javascript
import { expect } from '@playwright/test';

// ✅ CORRETO - Com extensão .js em data/helpers
import { JSON_INCLUIR } from '../../data/modulo/funcionalidadeJson.js';
import { CONSTANTE_NAVEGACAO } from '../../helpers/navegacao.js';
```

### **📝 Template de Imports Completo para Testes**

```javascript
// ✅ Imports de bibliotecas (barrel exports)
import { expect } from '@playwright/test';

// ✅ Imports de data (COM .js obrigatório)
import {
  JSON_CADASTRAR,
  JSON_FILTRO,
  JSON_VALIDACAO,
} from '../../data/modulo/funcionalidadeJson.js';

// ... resto do teste
```

**Motivo:**

- Barrel exports garantem compatibilidade com estrutura interna do pacote
- Extensão `.js` é obrigatória para módulos ES6
- Facilita manutenção e evita erros de resolução de imports

---

## ✅ **Resumo das Regras Críticas**

1. **Padrão AAA OBRIGATÓRIO** em todos os testes com comentários específicos (não genéricos)
2. **NUNCA use `console.log()` diretamente** — viola SonarQube S106. Use comentários AAA descritivos ou `logger` de `utils/logger.js`
3. **NUNCA expanda campos de JSON inline** - passar JSON completo diretamente
4. **Tags obrigatórias** em `describe` (array) e `test()` (string única)
5. **Annotations** com URL do Jira em cada test()
6. **Imports corretos** com caminhos relativos validados
7. **beforeEach padrão** (token, login, navegação)
8. **Nomenclatura clara** (número + verbo infinitivo + descrição)
9. **Ao atualizar:** APENAS adicionar, nunca remover
10. **Validar com get_errors** sempre após modificações
11. **JSONs completos** contendo TODOS os campos necessários do cenário
