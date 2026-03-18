# 📄 Estrutura de Arquivos de Teste (`*.spec.js`)

> **Módulo 06:** Templates e padrões específicos do projeto para testes
>
> **Objetivo:** Clareza, consistência e separação correta de responsabilidades

---

## 🎯 **Propósito**

Arquivos `*.spec.js` devem orquestrar cenários de teste de forma legível, previsível e aderente ao padrão do projeto.

**Quando usar:** Implementar testes E2E baseados em fluxos reais de negócio
**Quando NÃO usar:** Colocar locator, interação direta com DOM, massa inline ou lógica de Page Object

---

## 🚨 **BLOQUEIO CRÍTICO - 4 Violações Mais Frequentes**

> **LEIA ANTES DE CRIAR OU ALTERAR QUALQUER `*.spec.js`**

### **❌ ERRO #1: Alterar testes pré-existentes**

**Ao trabalhar em arquivo já existente, a regra é ADITIVA.**

- ❌ NUNCA modificar `test()` já existente
- ❌ NUNCA alterar `beforeEach`, `afterAll`, imports ou tags já existentes
- ❌ NUNCA reordenar testes existentes
- ✅ APENAS adicionar novos `test()` ao final do `describe()`
- ✅ APENAS adicionar novos imports quando realmente necessários

**✅ CORRETO:**
```javascript
test.describe('CRUD - Funcionalidade', { tag: ['@MODULO'] }, () => {
  test.beforeEach(async ({ page }) => {
    await page.funcionalidadePage.login(USUARIO);
  });

  test('001 - Teste existente', { tag: '@TESTE_001' }, async ({ page }) => {
    // preservado
  });

  test('002 - Novo teste', {
    tag: '@TESTE_002',
    annotation: { type: 'Issue', description: 'https://jira.com/TASK-123' },
  }, async ({ page }) => {
    // novo teste adicionado ao final
  });
});
```

---

### **❌ ERRO #2: Interação direta com elementos no teste**

**O arquivo `.spec.js` não deve conhecer detalhes de DOM.**

- ❌ PROIBIDO: `page.locator()`, `page.getByRole()`, `page.click()`, `page.fill()`
- ❌ PROIBIDO: `expect(page.locator(...))`
- ✅ OBRIGATÓRIO: chamar métodos dos Page Objects
- ✅ OBRIGATÓRIO: usar abstrações de Page para executar e validar fluxos

**✅ CORRETO:**

```javascript
test('001 - Cadastrar usuário', {
  tag: '@USUARIOS_CREATE',
  annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' },
}, async ({ page }) => {
  await page.usuariosPage.acessarTela();
  await page.usuariosPage.cadastrar(JSON_USUARIO);
  await page.usuariosPage.validarMensagemSucesso();
});
```

**❌ ERRADO:**

```javascript
test('Cadastrar usuário', async ({ page }) => {
  await page.locator('#nome').fill('Joao');
  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.locator('.success-message')).toBeVisible();
});
```

---

### **❌ ERRO #3: Criar ou expandir JSON inline no teste**

**Toda massa deve vir de `data/`, nunca ser montada dentro do `.spec.js`.**

- ❌ NUNCA criar objetos `const dados = { ... }` no teste
- ❌ NUNCA expandir JSON manualmente: `{ campo: JSON_BASE.campo }`
- ✅ SEMPRE importar constantes JSON de `data/...Json.js`
- ✅ SEMPRE passar o JSON completo para o método da Page

**✅ CORRETO:**

```javascript
await page.funcionalidadePage.cadastrar(JSON_CADASTRAR_REGISTRO);
await page.funcionalidadePage.preencherFiltros(JSON_FILTRO_VALIDACAO);
await page.funcionalidadePage.validarNaGrid(JSON_FILTRO_VALIDACAO);
```

**❌ ERRADO:**

```javascript
const dadosCadastro = {
  nome: 'Registro Novo',
  descricao: 'Descricao',
};

await page.funcionalidadePage.cadastrar({
  nome: JSON_CADASTRAR_REGISTRO.nome,
  descricao: JSON_CADASTRAR_REGISTRO.descricao,
});
```

---

### **❌ ERRO #4: Ignorar a estrutura AAA**

**Todo teste deve ser organizado em Arrange, Act, Assert com comentários úteis.**

- ✅ Usar `// Arrange: ...`, `// Act: ...`, `// Assert: ...`
- ✅ Escrever comentários específicos, não genéricos
- ❌ NUNCA usar `console.log()` para documentar passos
- ❌ NUNCA substituir AAA por `test.step()` quando o objetivo for apenas organização textual

**✅ CORRETO:**

```javascript
// Arrange: Acessar tela com contexto pronto para cadastro
await page.funcionalidadePage.acessarTela();

// Act: Cadastrar registro com dados completos
await page.funcionalidadePage.cadastrar(JSON_CADASTRAR_REGISTRO);

// Assert: Validar mensagem de sucesso e presenca do registro
await page.funcionalidadePage.validarCadastro(JSON_CADASTRAR_REGISTRO);
```

**❌ ERRADO:**

```javascript
console.log('Passo 1: Criar registro');
await page.funcionalidadePage.criarRegistro();

await test.step('Validar resultado', async () => {
  await page.funcionalidadePage.validarGrid();
});
```

---

## 🏗️ **Arquitetura do Arquivo de Teste**

### **Estrutura Base**

```javascript
import { expect } from '@playwright/test';
import { JSON_EXEMPLO } from '../../data/modulo/funcionalidadeJson.js';
import { test } from '../helpers';
import { USUARIO_TESTE } from '../helpers/ambiente.js';
import { logger } from '../../utils/logger.js';

test.describe('Nome do describe', { tag: ['@MODULO', '@FUNCIONALIDADE'] }, () => {
  test.beforeEach(async ({ page }) => {
    logger.test(test.info().title);
    await page.funcionalidadePage.login(USUARIO_TESTE);
    await page.funcionalidadePage.acessarTela();
  });

  test('001 - Deve executar acao de negocio', {
    tag: '@FUNCIONALIDADE_ACAO',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' },
  }, async ({ page }) => {
    // Arrange: Preparar contexto para o cenario

    // Act: Executar acao principal do teste

    // Assert: Validar resultado esperado
  });
});
```

### **Princípio Fundamental**

- ✅ O teste orquestra o fluxo
- ✅ O Page Object executa interações e validações de UI
- ✅ A massa vem de `data/`
- ✅ O `beforeEach` prepara o contexto comum
- ✅ O cenário segue a ordem funcional da especificação

---

## 📋 **6 Princípios Fundamentais**

### **1. 🧭 Teste Orquestra, Page Object Executa**

O teste deve descrever a intenção do cenário, não os cliques e preenchimentos internos.

- ✅ `await page.portariasPage.cadastrar(JSON_PORTARIA)`
- ❌ `await page.locator('#nome').fill(...)`

---

### **2. 🧱 AAA Sempre Visível**

Todo `test()` deve ter blocos claros de preparo, ação e validação.

- ✅ Arrange prepara contexto, dados e pré-condições
- ✅ Act executa a ação principal de negócio
- ✅ Assert valida o resultado esperado
- ❌ Não misturar preparo, execução e validação na mesma fase sem necessidade

---

### **3. 🗂️ Massa Centralizada em `data/`**

O teste deve reutilizar constantes JSON já estruturadas para o cenário.

- ✅ JSON importado com extensão `.js`
- ✅ JSON completo passado diretamente ao método
- ❌ Massa criada inline
- ❌ Campos do JSON expandidos manualmente no `.spec.js`

---

### **4. 🏷️ Tags e Annotation São Obrigatórias**

Cada nível do teste tem uma responsabilidade distinta de classificação.

- ✅ `test.describe()` usa `tag` como array
- ✅ `test()` usa `tag` como string única
- ✅ Todo `test()` tem `annotation` com URL do Jira
- ❌ Não repetir no `test()` uma tag já usada no `describe()`

---

### **5. 📐 Especificação Manda na Ordem do Fluxo**

Quando houver documento de especificação, os passos devem ser implementados exatamente na ordem informada.

- ✅ Ler a seção de passos antes de implementar
- ✅ Seguir a ordem funcional descrita
- ❌ Não pular passos
- ❌ Não reordenar ações
- ❌ Não assumir comportamento não especificado

---

### **6. 🧹 Clareza Acima de Verbosidade**

O teste deve ser direto, legível e sem poluição desnecessária.

- ✅ Comentários AAA específicos
- ✅ Nomenclatura objetiva
- ✅ Fluxo enxuto
- ❌ `console.log()` para narrar passos
- ❌ Comentários genéricos como `Preparação`, `Execução`, `Validação`

---

## ✅ **Regras Obrigatórias do `.spec.js`**

### **Regra #1: Estrutura AAA com Comentários Úteis**

**Formato obrigatório:**

```javascript
// Arrange: {contexto especifico sendo preparado}
// Act: {acao principal de negocio executada}
// Assert: {resultado principal validado}
```

**✅ Comentários aceitáveis:**

```javascript
// Arrange: Acessar tela de edicao com registro existente filtrado
// Act: Submeter alteracao de status do registro
// Assert: Validar mensagem de sucesso e novo status na listagem
```

**❌ Comentários não aceitáveis:**

```javascript
// Arrange: Preparacao
// Act: Execucao
// Assert: Validacao
```

---

### **Regra #2: Nomenclatura dos Testes**

**Formato obrigatório:**

```text
{numero} - Deve {acao clara e objetiva}
```

**✅ Exemplos corretos:**

```javascript
test('001 - Deve cadastrar registro com sucesso', ...)
test('002 - Deve editar registro existente', ...)
test('003 - Deve exibir erro ao salvar com campos vazios', ...)
```

**❌ Exemplos incorretos:**

```javascript
test('Deve cadastrar registro', ...)
test('001 - Cadastrou registro', ...)
test('001 - Teste de cadastro', ...)
```

---

### **Regra #3: Tags e Annotation**

**Estrutura correta:**

```javascript
test.describe('Cadastro de Registros', { tag: ['@MODULO_EXEMPLO', '@FUNCIONALIDADE'] }, () => {
  test('001 - Deve cadastrar novo registro', {
    tag: '@FUNCIONALIDADE_CREATE',
    annotation: {
      type: 'Issue',
      description: 'https://jira.example.com/browse/PROJ-101',
    },
  }, async ({ page }) => {
    // ...
  });
});
```

**Checklist:**

- [ ] `describe` tem `tag` como array
- [ ] `test` tem `tag` como string única
- [ ] Não há repetição entre tag do `describe` e do `test`
- [ ] Todo `test` tem `annotation` com URL do Jira

---

### **Regra #4: Imports Corretos**

**Padrão obrigatório:**

```javascript
import { expect } from '@playwright/test';

import {
  JSON_CADASTRAR,
  JSON_FILTRO,
} from '../../data/modulo/funcionalidadeJson.js';
import { test } from '../helpers';
import { USUARIO_TESTE } from '../helpers/ambiente.js';
import { logger } from '../../utils/logger.js';
```

**Regras:**

- ✅ Data e helpers com extensão `.js`
- ✅ `test` vem de `helpers`, não de `@playwright/test`
- ✅ Caminhos relativos devem ser calculados corretamente
- ✅ Validar imports após editar
- ❌ Não usar import interno de pacote externo

---

### **Regra #5: `beforeEach` Padrão**

```javascript
test.beforeEach(async ({ page }) => {
  logger.test(test.info().title);

  await page.funcionalidadePage.login(USUARIO_TESTE);
  await page.funcionalidadePage.acessarTela();
});
```

**Elementos obrigatórios:**

1. `logger.test(test.info().title)`
2. Login com usuário de teste
3. Navegação para a tela da funcionalidade

---

### **Regra #6: Seguir Passos da Especificação**

Quando houver especificação funcional:

1. Ler a seção de passos completamente
2. Identificar cada ação exigida
3. Implementar na ordem exata
4. Questionar o usuário se algo estiver ambíguo

**❌ Não fazer:**

- Assumir campos não especificados
- Reordenar fluxo
- Pular preparação necessária

**✅ Exemplo correto:**

```javascript
test('001 - Deve validar filtro conforme especificacao', {
  tag: '@FUNCIONALIDADE_FILTRO',
  annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' },
}, async ({ page }) => {
  // Arrange: Acessar tela e preparar filtro conforme especificacao
  await page.funcionalidadePage.acessarTela();

  // Act: Preencher filtros e executar busca na ordem especificada
  await page.funcionalidadePage.preencherFiltros(JSON_FILTRO);
  await page.funcionalidadePage.clicarBuscar();

  // Assert: Validar resultado na grid conforme comportamento esperado
  await page.funcionalidadePage.validarResultadoNaGrid(JSON_FILTRO);
});
```

---

## 🚫 **Anti-Padrões Críticos**

### **❌ NUNCA Fazer no `.spec.js`**

- Criar locator no teste
- Interagir diretamente com DOM
- Criar JSON inline
- Expandir campos de JSON manualmente
- Usar comentários AAA genéricos
- Usar `console.log()` para descrever passos
- Deixar teste sem annotation Jira
- Colocar array de tags no `test()`
- Colocar string de tag única no `describe` quando deveriam ser várias tags gerais
- Alterar testes existentes ao invés de adicionar novo cenário ao final

---

## 📦 **Template Completo de Arquivo**

> **Substitua todos os placeholders por valores reais e remova o que não for usado.**

```javascript
import { expect } from '@playwright/test';
import {
  JSON_CONSTANTE_01,
  JSON_CONSTANTE_02,
} from '../../data/{caminho}/{funcionalidade}Json.js';
import { test } from '../helpers';
import { USUARIO_TESTE } from '../helpers/ambiente.js';
import { logger } from '../../utils/logger.js';

test.describe('{nome do describe}', { tag: ['@{MODULO}', '@{FUNCIONALIDADE}'] }, () => {
  test.beforeEach(async ({ page }) => {
    logger.test(test.info().title);

    await page.funcionalidadePage.login(USUARIO_TESTE);
    await page.funcionalidadePage.acessarTela();
  });

  test('001 - Deve {descricao da acao 01}', {
    tag: '@{TAG_ACAO_01}',
    annotation: {
      type: 'Issue',
      description: '{URL_JIRA}',
    },
  }, async ({ page }) => {
    // Arrange: Preparar contexto necessario para a acao 01
    await page.funcionalidadePage.prepararContexto(JSON_CONSTANTE_01);

    // Act: Executar a acao principal de negocio 01
    await page.funcionalidadePage.executarAcao01(JSON_CONSTANTE_01);

    // Assert: Validar o resultado esperado da acao 01
    await page.funcionalidadePage.validarResultadoAcao01(JSON_CONSTANTE_01);
  });

  test('002 - Deve {descricao da acao 02}', {
    tag: '@{TAG_ACAO_02}',
    annotation: {
      type: 'Issue',
      description: '{URL_JIRA}',
    },
  }, async ({ page }) => {
    // Arrange: Posicionar o sistema no contexto necessario para a edicao
    await page.funcionalidadePage.navegarParaEdicaoPorFiltro(JSON_CONSTANTE_02);

    // Act: Executar a alteracao principal do cenario
    await page.funcionalidadePage.executarAcao02(JSON_CONSTANTE_02);

    // Assert: Validar o resultado esperado apos a alteracao
    await page.funcionalidadePage.validarResultadoAcao02(JSON_CONSTANTE_02);
  });

  test('003 - Deve exibir erro ao {descricao da validacao de erro}', {
    tag: '@{TAG_ACAO_03}',
    annotation: {
      type: 'Issue',
      description: '{URL_JIRA}',
    },
  }, async ({ page }) => {
    // Arrange: Deixar o formulario no estado necessario para validar erro

    // Act: Submeter formulario vazio ou com dados invalidos
    await page.funcionalidadePage.submeterFormularioVazio();

    // Assert: Validar mensagens de erro esperadas
    await page.funcionalidadePage.validarMensagensErro(JSON_CONSTANTE_02);
  });
});
```

---

## 📊 **Criação vs Atualização de Arquivo**

| Cenário | O que fazer | Regra principal |
|---|---|---|
| Arquivo novo | Criar estrutura completa | `describe`, `beforeEach` e `test()` completos |
| Arquivo existente | Adicionar cenário novo | Apenas adicionar ao final, sem alterar o restante |

### **Ao atualizar arquivo existente**

1. Adicionar o novo `test()` ao final do `describe()`
2. Manter a numeração sequencial
3. Não alterar hooks existentes
4. Não mexer em tags, annotations e imports já usados sem necessidade direta

---

## 🗺️ **Cobertura e Governança**

### **Atualização do `coverageFeatureMap.yml`**

Após criar ou expandir cobertura de testes, atualizar o mapeamento correspondente.

**Estrutura:**

```yml
- page: "{Caminho/Do/Menu}"
  features:
    nome da funcionalidade 1: true
    nome da funcionalidade 2: true
```

**Regras:**

- ✅ Usar caminho exato do menu
- ✅ Apenas adicionar novas features
- ❌ Não remover ou alterar features existentes sem necessidade explícita

---

## ✅ **Checklist Final**

### **Estrutura do teste**

- [ ] O arquivo segue a separação correta entre teste e Page Object?
- [ ] Todos os `test()` têm AAA com comentários específicos?
- [ ] A nomenclatura dos testes está no formato `001 - Deve ...`?
- [ ] O `beforeEach` segue o padrão do projeto?

### **Dados e imports**

- [ ] Todos os JSONs vêm de `data/`?
- [ ] Não há objeto inline criado no `.spec.js`?
- [ ] Não há expansão manual de campos JSON?
- [ ] Os imports usam caminhos corretos e extensão `.js`?

### **Tags e governança**

- [ ] `describe` com tag array?
- [ ] `test` com tag string única?
- [ ] Todos os testes têm annotation com Jira?
- [ ] A numeração dos testes está sequencial?

### **Atualização segura**

- [ ] Se o arquivo já existia, apenas novos testes foram adicionados?
- [ ] Nenhum teste preexistente foi alterado?
- [ ] Nenhum hook existente foi modificado?

### **Conformidade final**

- [ ] O fluxo segue a especificação funcional quando ela existir?
- [ ] O `coverageFeatureMap.yml` foi atualizado quando aplicável?
- [ ] Os imports foram validados após a edição?

---

## 📌 **Resumo Executivo**

1. O `.spec.js` orquestra; o `Page Object` interage com a UI.
2. Toda massa deve vir de `data/`, nunca ser criada inline.
3. Todo teste segue AAA com comentários específicos.
4. `describe` usa tag array; `test` usa tag string única com Jira obrigatório.
5. Em arquivo existente, a regra é adicionar sem modificar o que já funciona.
6. A especificação funcional define a ordem do fluxo.
7. Clareza, consistência e baixo acoplamento são mais importantes que verbosidade.
