# 🌐 **Estrutura de Classes de API (`*Api.js`)**

> **Módulo 08:** Templates e regras para classes de API
>
> **Objetivo:** Clareza, consistência e foco em chamadas HTTP reutilizáveis

---

## 🎯 **Propósito**

Classes `*Api.js` encapsulam requisições HTTP para preparar dados, limpar cenários e consultar informações do backend de forma reutilizável.

**Quando usar:**

- Preparação de massa via API em `beforeEach`
- Limpeza de dados em `afterAll` ou etapas de teardown
- Consulta de dados ou estado do backend para validação de cenários
- Consultas de backend necessárias para suportar cenários automatizados

**Quando NÃO usar:**

- Interações de UI ou comportamento visual
- Fluxos de tela que pertencem a Page Objects
- Operações SQL diretas
- Lógica de negócio complexa que deveria estar em camada superior

---

## 🚨 **BLOQUEIO CRÍTICO - 4 Violações Mais Frequentes**

> **LEIA ANTES DE CRIAR OU ALTERAR QUALQUER `*Api.js`**

### **❌ ERRO #1: Alterar métodos pré-existentes**

**Em classe de API existente, a regra é ADITIVA.**

- ❌ NUNCA modificar métodos já existentes
- ❌ NUNCA alterar endpoints de métodos já usados
- ❌ NUNCA mudar assinaturas, headers ou comportamento de retorno existentes
- ✅ APENAS adicionar novos métodos ao final da classe
- ✅ APENAS adicionar novos imports ou constantes quando necessário

**✅ CORRETO:**

```javascript
export class FuncionalidadeApi {
  constructor(request) {
    this.request = request;
  }

  async postMetodoExistente(dados) {
    // preservado
  }

  async getOutroMetodoExistente(id) {
    // preservado
  }

  async postNovoMetodo(dados) {
    // novo método adicionado ao final
  }
}
```

**❌ ERRADO:**

```javascript
async postMetodoExistente(dados) {
  const endpoint = new URL(`${BASE_API}novo/endpoint`); // alterou endpoint existente
}

async getOutroMetodoExistente(id, tenant) {
  // alterou assinatura existente
}
```

---

### **❌ ERRO #2: Misturar API com lógica de UI ou negócio**

**A classe de API deve fazer chamada HTTP, validar resposta e devolver dado útil.**

- ❌ NUNCA colocar fluxo de tela ou lógica visual em classe de API
- ❌ NUNCA transformar a API em orquestradora de cenário completo
- ✅ SEMPRE manter foco em request, response e retorno útil ao teste

**✅ CORRETO:**

```javascript
const idPortaria = await request.portariasApi.postIncluirPortaria(JSON_PORTARIA);
```

**❌ ERRADO:**

```javascript
async cadastrarPortariaEValidarGrid(dados) {
  await this.request.post('/modulo/recurso/actions/incluirRecurso', { data: dados });
  await page.portariasPage.acessarTela();
  await page.portariasPage.validarGrid(dados.grid);
}
```

---

### **❌ ERRO #3: Não validar a resposta da API**

**Toda chamada deve passar por validação padronizada.**

- ✅ SEMPRE validar com `response.ok()` e/ou `response.status()`
- ❌ NUNCA confiar apenas em `response.status()`
- ❌ NUNCA retornar resposta sem validação prévia

**✅ CORRETO:**

```javascript
const response = await this.request.get(endpoint.toString(), config);
if (!response.ok()) {
  throw new Error(`Falha na API: ${response.status()}`);
}
const body = await response.json();
return body?.data || [];
```

---

### **❌ ERRO #4: Repetir autenticação/configuração em cada método**

**No Playwright, autenticação e headers comuns devem ficar centralizados no contexto de request sempre que possível.**

- ❌ Evitar repetir `Authorization` em todos os métodos
- ❌ Evitar duplicar `Accept` em cada chamada quando já existe contexto autenticado
- ✅ Preferir `playwright.config` para headers padrão
- ✅ Usar `request.newContext()` apenas quando o cenário exigir headers ou contexto específico
- ✅ Deixar o método focado em endpoint, payload, validação e retorno

**✅ CORRETO:**

```javascript
const response = await this.request.post(endpoint.toString(), { data: dados });
```

**❌ ERRADO:**

```javascript
const response = await this.request.post(endpoint.toString(), {
  data: dados,
  headers: {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
    Accept: 'application/json',
  },
});
```

---

## 🏗️ **Arquitetura da Classe de API**

### **Estrutura Base**

```javascript
import { BASE_API } from '../../../helpers/ambiente.js';
import { logger } from '../../../utils/logger.js';

const MENSAGENS_ERRO = {
  ACAO_EXEMPLO: 'Erro ao executar acao de exemplo: ',
};

export class FuncionalidadeApi {
  constructor(request) {
    this.request = request;
  }

  async postAcaoExemplo(dados) {
    try {
      const endpoint = new URL(`${BASE_API}modulo/recurso/actions/acaoExemplo`);

      const response = await this.request.post(endpoint.toString(), {
        data: dados,
      });

      if (!response.ok()) {
        throw new Error(`Falha na API: ${response.status()}`);
      }
      const body = await response.json();
      return body?.data;
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.ACAO_EXEMPLO}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.ACAO_EXEMPLO}${error.message}`);
    }
  }
}
```

### **Princípio Fundamental**

- ✅ A classe de API encapsula chamadas HTTP reutilizáveis
- ✅ O método monta endpoint, chama API, valida resposta e retorna dado útil
- ✅ O teste decide quando usar a API
- ✅ O Page Object continua responsável por UI
- ✅ A validação usa recursos nativos do `APIResponse` do Playwright

---

## 📋 **6 Princípios Fundamentais**

### **1. 🧱 API Faz Uma Coisa Bem**

Cada método deve representar uma operação HTTP objetiva.

- ✅ `postIncluirPortaria(dados)`
- ✅ `getListarPortarias(status)`
- ❌ `criarPortariaEFazerFluxoDeTela(dados)`

---

### **2. 🔁 Reutilização Sem Duplicação**

Toda lógica repetida deve ser reduzida, mas sem abstrações artificiais.

- ✅ Padronizar config de request quando fizer sentido
- ✅ Centralizar mensagens de erro em constante
- ❌ Duplicar bloco de tratamento de resposta com pequenas variações sem necessidade
- ❌ Criar camada genérica complexa para todos os verbos se o projeto não usa isso

---

### **3. 🧹 Clareza Acima de Esperteza**

Métodos de API devem ser fáceis de ler e rastrear.

- ✅ Endpoint explícito
- ✅ Nome do método alinhado ao endpoint real
- ✅ Retorno objetivo
- ❌ Helpers excessivamente genéricos que escondem o comportamento

---

### **4. 🛡️ Erro Sempre Visível**

Falha de API precisa gerar diagnóstico útil.

- ✅ `logger.error` com mensagem contextual
- ✅ `throw new Error(...)` com texto claro
- ❌ Silenciar exceção
- ❌ Perder o contexto da operação que falhou

---

### **5. 🧾 Dados de Entrada Vêm de Fora**

A classe de API consome dados recebidos; ela não deve construir massa de cenário internamente.

- ✅ Receber `dados` do teste ou fixture
- ✅ Receber parâmetros simples para query string
- ❌ Montar objetos grandes hardcoded dentro do método

---

### **6. 🔌 API Apoia o Teste, Não Substitui o Teste**

API é apoio de cenário, não o centro da validação quando o objetivo é UI.

- ✅ Usar API para preparar ou limpar dados
- ✅ Usar API para consultar backend quando necessário
- ❌ Transferir toda a validação funcional da UI para a API sem justificativa

---

## ✅ **Regras Obrigatórias do `*Api.js`**

### **Regra #1: Constructor Sempre Recebe `request`**

```javascript
constructor(request) {
  this.request = request;
}
```

Sem isso, a classe perde acesso ao contexto de request usado para chamadas HTTP.

---

### **Regra #2: Imports Públicos e com `.js`**

**Padrão obrigatório:**

```javascript
import { BASE_API } from '../../../helpers/ambiente.js';
import { logger } from '../../../utils/logger.js';
```

**Regras:**

- ✅ Usar import público de dependências
- ✅ Usar `.js` em helpers locais
- ❌ Não importar de caminhos internos como `pacote/src/...`

---

### **Regra #3: Nomenclatura de Métodos**

**Padrão:** verbo HTTP em minúsculo + nome do endpoint em PascalCase.

| Verbo HTTP | Endpoint Pattern | Método |
| --- | --- | --- |
| `POST` | `actions/incluirRecurso` | `postIncluirRecurso()` |
| `GET` | `queries/listarRecursos` | `getListarRecursos()` |
| `PUT` | `actions/atualizarRecurso` | `putAtualizarRecurso()` |
| `DELETE` | `actions/removerRecurso` | `deleteRemoverRecurso()` |

**Regra prática:** o nome do método deve denunciar claramente qual endpoint ele chama.

---

### **Regra #4: Preferir Contexto de Request Compartilhado**

Para ficar aderente ao Playwright, prefira configurar autenticacao, headers padrao no `playwright.config`. Use `request.newContext()` apenas quando o cenario precisar de headers adicionais, outro usuario, outro token ou isolamento especifico.

**Preferivel:**

```javascript
// playwright.config.js
use: {
  extraHTTPHeaders: {
    Authorization: `Bearer ${process.env.API_TOKEN}`,
    Accept: 'application/json',
  },
}
```

```javascript
// Exemplo para cenario especifico
const apiContext = await playwright.request.newContext({
  extraHTTPHeaders: {
    Authorization: `Bearer ${tokenTemporario}`,
    'X-Tenant-Id': tenantId,
  },
});
```

**Evitar:**

```javascript
// Repetir Authorization e Accept em todos os metodos da classe
```

---

### **Regra #5: Tratar `APIResponse` no Padrão Playwright**

- ✅ Usar `response.status()` para status code
- ✅ Usar `response.ok()` para validar sucesso da requisição
- ✅ Usar `await response.json()` para obter o body
- ✅ Validar resposta antes de consumir dados
- ❌ Misturar padroes de cliente HTTP externo (ex.: `response.data`)

---

### **Regra #6: Tratamento de Erros Padronizado**

```javascript
try {
  // request
} catch (error) {
  logger.error(`${MENSAGENS_ERRO.NOME_DA_OPERACAO}${error.message}`);
  throw new Error(`${MENSAGENS_ERRO.NOME_DA_OPERACAO}${error.message}`);
}
```

**Checklist:**

- [ ] Há `try/catch` no método?
- [ ] Há `logger.error`?
- [ ] O erro é relançado?
- [ ] A mensagem ajuda a identificar qual operação falhou?

---

### **Regra #7: JSDoc Completo**

**Estrutura esperada:**

```javascript
/**
 * Descricao objetiva do que o metodo faz
 * Endpoint: POST modulo/recurso/actions/incluirRecurso
 * @param {object} dados - Dados da requisicao
 * Exemplo: JSON_{CONSTANTE}
 * @returns {Promise<string>} ID do recurso criado
 */
```

**Regras:**

- ✅ Informar o endpoint chamado
- ✅ Usar `@param {object}` quando houver payload JSON
- ✅ Incluir linha `Exemplo: JSON_{CONSTANTE}` quando o JSON for conhecido
- ✅ Declarar `@returns`
- ❌ Não detalhar todos os campos internos do JSON

---

## 📦 **Padrões de Retorno**

### **1. Retornar item específico**

```javascript
const body = await response.json();
const resultado = body?.data?.find((item) => item.nome === dados.nome);
return resultado ? resultado.id : null;
```

### **2. Retornar lista**

```javascript
const body = await response.json();
return body?.data || [];
```

### **3. Retornar booleano**

```javascript
return response.status() === 200 || response.status() === 204;
```

### **4. Retornar objeto completo**

```javascript
const body = await response.json();
return body?.data;
```

**Regra:** escolha o retorno mais útil para o cenário, sem expor estrutura desnecessária se o teste precisa apenas de um ID, lista ou confirmação.

---

## 🚫 **Anti-Padrões Críticos**

### **❌ NUNCA Fazer no `*Api.js`**

- Hardcode de URL fora de `BASE_API`
- Hardcode de token ou credencial no código
- Duplicar `Authorization`/headers em todo método quando já existe contexto compartilhado
- Alterar método existente ao invés de adicionar um novo
- Retornar `response` bruto sem necessidade
- Usar `logger.warn()` no lugar de `logger.error` em falha de request
- Criar método que ninguém usa
- Colocar lógica de UI na classe de API
- Duplicar endpoint em métodos com nomes diferentes sem justificativa

---

## 📦 **Template Completo de Arquivo**

> **Substitua os placeholders por valores reais e remova o que não for utilizado.**

```javascript
import { BASE_API } from '../../../helpers/ambiente.js';
import { logger } from '../../../utils/logger.js';

const MENSAGENS_ERRO = {
  INCLUIR_RECURSO: 'Erro ao incluir recurso: ',
  LISTAR_RECURSOS: 'Erro ao listar recursos: ',
};

/**
 * Classe para interacoes com API de {Funcionalidade}
 * Encapsula chamadas HTTP relacionadas a {descricao da funcionalidade}
 */
export class {Funcionalidade}Api {
  /**
   * Inicializa a classe de API
   * @param {object} request - Contexto de requisicao do Playwright
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Inclui novo recurso via API
   * Endpoint: POST {modulo}/{recurso}/actions/incluir{Recurso}
   * @param {object} dados - Dados para inclusao do recurso
   * Exemplo: JSON_{CONSTANTE}
   * @returns {Promise<string>} ID do recurso criado
   */
  async postIncluir{Recurso}(dados) {
    try {
      const endpoint = new URL(`${BASE_API}{modulo}/{recurso}/actions/incluir{Recurso}`);

      const response = await this.request.post(endpoint.toString(), {
        data: dados,
      });

      if (!response.ok()) {
        throw new Error(`Falha na API: ${response.status()}`);
      }

      const body = await response.json();
      const resultado = body?.data?.find((item) => item.nome === dados.nome);
      return resultado ? resultado.id : null;
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.INCLUIR_RECURSO}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.INCLUIR_RECURSO}${error.message}`);
    }
  }

  /**
   * Lista recursos cadastrados
   * Endpoint: GET {modulo}/{recurso}/queries/listar{Recursos}
   * @param {string} status - Filtro de status da consulta
   * @returns {Promise<Array>} Lista de recursos encontrados
   */
  async getListar{Recursos}(status) {
    try {
      const endpoint = new URL(`${BASE_API}{modulo}/{recurso}/queries/listar{Recursos}`);

      const response = await this.request.get(endpoint.toString(), {
        params: { status },
      });

      if (!response.ok()) {
        throw new Error(`Falha na API: ${response.status()}`);
      }
      const body = await response.json();
      return body?.data || [];
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.LISTAR_RECURSOS}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.LISTAR_RECURSOS}${error.message}`);
    }
  }
}
```

---

## 🔌 **Instanciação em `helpers/index.js`**

### **1. Importar ao final da seção de imports**

```javascript
import { {Funcionalidade}Api } from '../api/{caminho}/{funcionalidade}Api.js';
```

### **2. Instanciar no contexto de `request`**

```javascript
context['{funcionalidade}Api'] = new {Funcionalidade}Api(request);
```

### **3. Usar em testes**

```javascript
test.beforeEach(async ({ request }) => {
  const idCriado = await request.{funcionalidade}Api.postIncluir{Recurso}(JSON_{CONSTANTE});
});

test.afterAll(async ({ request }) => {
  await request.{funcionalidade}Api.deleteRemover{Recurso}(idCriado);
});
```

**Regra:** a API deve ser instanciada uma vez no contexto, nunca manualmente dentro de cada teste.

---

## 📊 **Criação vs Atualização de Classe**

| Cenário | O que fazer | Regra principal |
| --- | --- | --- |
| Arquivo novo | Criar estrutura completa | imports, constantes, classe, constructor e métodos |
| Arquivo existente | Adicionar método novo | somente ao final, sem tocar no que já funciona |

### **Ao atualizar classe existente**

1. Adicionar método ao final da classe
2. Adicionar novas mensagens de erro apenas se necessário
3. Preservar assinaturas, endpoints e retornos existentes
4. Validar se o novo método realmente será usado por testes ou fixtures

---

## ✅ **Checklist Final**

### **Estrutura da classe**

- [ ] A classe está exportada corretamente?
- [ ] O constructor recebe `request`?
- [ ] Os imports usam caminhos públicos e `.js`?
- [ ] Existe `logger` para tratamento de erro?

### **Métodos**

- [ ] A nomenclatura segue verbo HTTP + endpoint?
- [ ] O endpoint está explícito e correto?
- [ ] Há `try/catch` em todos os métodos?
- [ ] Há validação nativa com `response.ok()` e/ou `response.status()` antes do retorno?
- [ ] O retorno é útil e enxuto para o cenário?

### **Documentação**

- [ ] Todo método tem JSDoc completo?
- [ ] Métodos com JSON têm `Exemplo: JSON_{CONSTANTE}`?
- [ ] O endpoint está documentado no JSDoc?
- [ ] Há `@returns` em todos os métodos?

### **Conformidade**

- [ ] Nenhum método existente foi alterado?
- [ ] O novo método foi adicionado ao final da classe?
- [ ] A classe foi instanciada em `helpers/index.js` quando aplicável?
- [ ] O arquivo foi validado após a edição?

---

## 📌 **Resumo Executivo**

1. Classe de API existe para chamada HTTP reutilizável, não para UI.
2. Em arquivo existente, a regra é adicionar sem alterar comportamento já usado.
3. Toda chamada deve validar resposta com `response.ok()` e/ou `response.status()` antes do retorno.
4. Autenticacao e headers comuns devem ser centralizados no `playwright.config`.
5. `request.newContext()` deve ser reservado para cenarios com contexto ou headers especificos.
6. Todo erro é logado com `logger.error` e relançado com contexto.
7. O retorno deve ser o menor dado útil para o cenário.
