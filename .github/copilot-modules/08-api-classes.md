# 🌐 **Estrutura de Classes de API (`*Api.js`)**

> **Módulo 08:** Templates e regras para classes de API

---

## 🚨 **REGRA CRÍTICA: NUNCA ALTERAR MÉTODOS PRÉ-EXISTENTES**

> **⚠️ ATENÇÃO MÁXIMA: Ao implementar em classe de API já existente**

**REGRA ABSOLUTA - SEM EXCEÇÕES:**

- ❌ **NUNCA modificar** métodos de API já existentes
- ❌ **NUNCA alterar** endpoints de métodos existentes
- ❌ **NUNCA remover** imports, constantes ou configurações já existentes
- ❌ **NUNCA mudar** assinaturas de métodos existentes (parâmetros, retorno)
- ❌ **NUNCA alterar** headers ou configurações de requisições existentes
- ✅ **APENAS ADICIONAR** novos métodos ao final da classe
- ✅ **APENAS ADICIONAR** novas constantes de erro se necessário
- ✅ **APENAS ADICIONAR** novos imports necessários

**Motivo:** Alterar métodos de API existentes quebra preparação de dados (beforeEach) e limpeza (afterAll) em testes já funcionando.

**Exemplo Correto:**

```javascript
export class FuncionalidadeApi {
  constructor(request) {
    this.request = request;
  }

  // ✅ Métodos existentes preservados
  async postMetodoExistente1(dados) { /* preservado */ }
  async getMetodoExistente2(id) { /* preservado */ }

  // ✅ CORRETO - Novo método adicionado AO FINAL
  async postNovoMetodo(dados) {
    try {
      const endpoint = new URL(`${BASE_API}modulo/recurso/actions/novoEndpoint`);
      const response = await axios.post(endpoint.toString(), dados, { /* config */ });
      await this.request.api.validateApiResponse(response);
      return response?.data?.data;
    } catch (error) {
      logger.error(`Erro ao executar novo método: ${error.message}`);
      throw new Error(`Erro ao executar novo método: ${error.message}`);
    }
  }
```

**Exemplo Incorreto:**

```javascript
// ❌ ERRADO - Modificar método existente
async postMetodoExistente1(dados) {
  // ❌ Alterou endpoint - PROIBIDO
  const endpoint = new URL(`${BASE_API}modulo/recurso/actions/novoEndpoint`); // era outro endpoint
  // QUEBRA TESTES QUE USAM ESTE MÉTODO
}

// ❌ ERRADO - Alterar assinatura de método existente
async getMetodoExistente2(id, novoParametro) { // adicionou parâmetro - PROIBIDO
  // QUEBRA TODAS AS CHAMADAS EXISTENTES
}
```

---

## 🎯 **Propósito**

Classes de API encapsulam requisições HTTP para interagir com endpoints REST do backend.

**Quando criar:**
- Preparar dados via API (beforeEach dos testes)
- Limpeza de dados após testes (afterAll)
- Validações que requerem dados do backend

**Quando NÃO criar:**
- Para testar UI/frontend (use Page Objects)
- Para operações SQL diretas

---

## 📄 **Template Completo de Arquivo de API**

```javascript
import axios from 'axios';

import { BASE_API } from '../../../helpers/ambiente';

const MENSAGENS_ERRO = {
  FAZER_SOLICITACAO: 'Erro ao fazer a solicitação: ',
  PROCESSAR_RESPOSTA: 'Erro ao processar resposta: ',
};

/**
 * Classe para interações com API de {Funcionalidade}
 * Esta classe encapsula chamadas aos endpoints de {descrição}
 */
export class {Funcionalidade}Api {
  /**
   * Inicializa a classe de API
   * @param {object} request - Contexto de requisição do Playwright
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * {Descrição da ação} - {Verbo} {Recurso}
   * Endpoint: POST {modulo}/{recurso}/actions/{nomeEndpoint}
   * @param {object} dados - Dados para a requisição
   * Exemplo: JSON_{CONSTANTE}
   * @returns {Promise<{tipoRetorno}>} {Descrição do retorno}
   */
  async post{NomeEndpoint}(dados) {
    try {
      const endpoint = new URL(`${BASE_API}{modulo}/{recurso}/actions/{nomeEndpoint}`);

      const response = await axios.post(endpoint.toString(), dados, {
        ignoreHTTPSErrors: true,
        timeout: 0,
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      await this.request.api.validateApiResponse(response);

      // Processamento específico do retorno
      const resultado = response?.data?.data?.find((item) => item.{campo} === dados.{campo});
      return resultado ? resultado.{campoRetorno} : null;
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.FAZER_SOLICITACAO}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.FAZER_SOLICITACAO}${error.message}`);
    }
  }

  /**
   * {Descrição da consulta} - Lista {Recursos}
   * Endpoint: GET {modulo}/{recurso}/queries/{nomeEndpoint}
   * @param {string} parametro1 - Descrição do parâmetro
   * @param {string} parametro2 - Descrição do parâmetro
   * @returns {Promise<{tipoRetorno}[]>} Lista de resultados
   */
  async get{NomeEndpoint}(parametro1, parametro2) {
    try {
      const endpoint = new URL(
        `${BASE_API}{modulo}/{recurso}/queries/{nomeEndpoint}?param1=${parametro1}&param2=${parametro2}`
      );

      const response = await axios.get(endpoint.toString(), {
        ignoreHTTPSErrors: true,
        timeout: 0,
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      await this.request.api.validateApiResponse(response);
      return response?.data?.data || [];
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.PROCESSAR_RESPOSTA}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.PROCESSAR_RESPOSTA}${error.message}`);
    }
  }

  /**
   * {Descrição da atualização} - Atualiza {Recurso}
   * Endpoint: PUT {modulo}/{recurso}/actions/{nomeEndpoint}
   * @param {object} dados - Dados para atualização
   * @returns {Promise<boolean>} Retorna true se sucesso
   */
  async put{NomeEndpoint}(dados) {
    try {
      const endpoint = new URL(`${BASE_API}{modulo}/{recurso}/actions/{nomeEndpoint}`);

      const response = await axios.put(endpoint.toString(), dados, {
        ignoreHTTPSErrors: true,
        timeout: 0,
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      await this.request.api.validateApiResponse(response);
      return response.status === 200;
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.FAZER_SOLICITACAO}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.FAZER_SOLICITACAO}${error.message}`);
    }
  }

  /**
   * {Descrição da exclusão} - Remove {Recurso}
   * Endpoint: DELETE {modulo}/{recurso}/actions/{nomeEndpoint}
   * @param {string} id - ID do recurso a ser excluído
   * @returns {Promise<boolean>} Retorna true se sucesso
   */
  async delete{NomeEndpoint}(id) {
    try {
      const endpoint = new URL(`${BASE_API}{modulo}/{recurso}/actions/{nomeEndpoint}/${id}`);

      const response = await axios.delete(endpoint.toString(), {
        ignoreHTTPSErrors: true,
        timeout: 0,
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      await this.request.api.validateApiResponse(response);
      return response.status === 200 || response.status === 204;
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.FAZER_SOLICITACAO}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.FAZER_SOLICITACAO}${error.message}`);
    }
  }
}
```

---

## 📋 **Padrão de Nomenclatura de Métodos**

| Verbo HTTP | Endpoint Pattern | Nomenclatura Método | Exemplo |
|-----------|------------------|---------------------|---------|
| **POST** | `actions/incluir{Recurso}` | `post{NomeEndpoint}()` | `postIncluirPortaria()` |
| **GET** | `queries/listar{Recursos}` | `get{NomeEndpoint}()` | `getListarPortarias()` |
| **PUT** | `actions/atualizar{Recurso}` | `put{NomeEndpoint}()` | `putAtualizarPortaria()` |
| **DELETE** | `actions/remover{Recurso}` | `delete{NomeEndpoint}()` | `deleteRemoverPortaria()` |

**Regra:** Nome do método = Verbo HTTP (minúsculo) + Nome do Endpoint (PascalCase)

---

## 🔧 **Estrutura de Headers**

### **Headers Padrão (Obrigatórios)**

```javascript
headers: {
  Authorization: `Bearer ${process.env.API_TOKEN}`,
  'Content-Type': 'application/json',
}
```

### **Quando Adicionar Headers Customizados**

```javascript
headers: {
  Authorization: `Bearer ${process.env.API_TOKEN}`,
  'Content-Type': 'application/json',
  'X-Tenant-Id': tenantId,
  'X-Custom-Header': customValue,
}
```

---

## ✅ **Validação de Response**

**SEMPRE usar:**

```javascript
await this.request.api.validateApiResponse(response);
```

**Esse método valida:**
- Status HTTP (200-299)
- Estrutura de response
- Erros de API conhecidos

---

## 🚨 **Tratamento de Erros**

### **Padrão Obrigatório**

```javascript
try {
  // Chamada à API
  const response = await axios.{verbo}(endpoint.toString(), dados, config);
  await this.request.api.validateApiResponse(response);
  return response?.data?.data;
} catch (error) {
  logger.error(`${MENSAGENS_ERRO.FAZER_SOLICITACAO}${error.message}`);
  throw new Error(`${MENSAGENS_ERRO.FAZER_SOLICITACAO}${error.message}`);
}
```

### **Regras de Erro**

- ✅ Sempre use try/catch
- ✅ Log de erro com `logger.error` (usando `utils/logger.js`) — NUNCA `console.error` direto (viola SonarQube S106)
- ✅ Re-throw do erro para propagação
- ✅ Mensagens descritivas
- ❌ NUNCA silenciar erros

---

## 📦 **Processamento de Retorno**

### **Padrão 1: Buscar Item Específico**

```javascript
const resultado = response?.data?.data?.find((item) => item.id === dados.id);
return resultado ? resultado.idCampo : null;
```

### **Padrão 2: Retornar Lista**

```javascript
return response?.data?.data || [];
```

### **Padrão 3: Retornar Booleano**

```javascript
return response.status === 200;
```

### **Padrão 4: Retornar Objeto Completo**

```javascript
return response?.data?.data;
```

---

## 📊 **Instanciação em helpers/index.js**

### **1. Importar**

```javascript
// AO FINAL da seção de imports
import { {Funcionalidade}Api } from '../api/{caminho}/{funcionalidade}Api';
```

### **2. Instanciar**

```javascript
// AO FINAL do bloco request
context['{funcionalidade}Api'] = new {Funcionalidade}Api(request);
```

### **3. Usar nos Testes**

```javascript
test.beforeEach(async ({ page, request }) => {
  logger.test(test.info().title);
  await request.api.setToken({TOKEN_USUARIO});
  await page.dataUtils.login({TOKEN_USUARIO});

  // Preparar dados via API
  const resultado = await request.{funcionalidade}Api.post{Endpoint}(dados);
});

test.afterAll(async ({ request }) => {
  // Limpar dados via API
  await request.{funcionalidade}Api.delete{Endpoint}(id);
});
```

---

## 📚 **REGRA DE IMPORTS PÚBLICOS**

> **⚠️ REGRA CRÍTICA: SEMPRE usar imports públicos de dependências, NUNCA caminho interno `.../src/...`**

### **❌ ANTI-PADRÃO (NÃO FAZER):**

```javascript
// ❌ ERRADO - Caminho interno de dependência
import { AlgumRecurso } from 'pacote/src/modulo/interno';
```

### **✅ PADRÃO CORRETO:**

```javascript
// ✅ CORRETO - Import público da dependência
import axios from 'axios';
import { BASE_API } from '../../../helpers/ambiente.js';
```

### **📝 Template de Imports Completo para APIs**

```javascript
// ✅ Imports de bibliotecas
import axios from 'axios';

// ✅ Imports de helpers (com .js)
import { BASE_API } from '../../../helpers/ambiente.js';

// Constantes
const MENSAGENS_ERRO = {
  FAZER_SOLICITACAO: 'Erro ao fazer a solicitação: ',
  PROCESSAR_RESPOSTA: 'Erro ao processar resposta: ',
};

/**
 * Classe para interações com API de {Funcionalidade}
 */
export class {Funcionalidade}Api {
  // ...
}
```

**Motivo:**

- Barrel exports garantem compatibilidade com estrutura interna do pacote
- Extensão `.js` é obrigatória para helpers locais (módulos ES6)
- Facilita manutenção e evita erros de resolução de imports

---

## ✅ **Checklist de Validação**

### **Estrutura**

- [ ] Classe exportada corretamente
- [ ] Constructor recebe `request`
- [ ] JSDoc completo em todos os métodos
- [ ] Mensagens de erro em constantes

### **Métodos**

- [ ] Nomenclatura correta (verbo + endpoint)
- [ ] Headers obrigatórios presentes
- [ ] Validação de response com `validateApiResponse`
- [ ] Try/catch em todos os métodos
- [ ] Logs de erro apropriados

### **Conformidade**

- [ ] TODOS os métodos são usados em testes
- [ ] Nenhum método duplicado
- [ ] Endpoints corretos (verificar com backend)
- [ ] Instanciado em `helpers/index.js`
- [ ] ESLint sem erros

---

## 🚫 **Anti-Padrões**

### **❌ NUNCA:**

- Hardcode de tokens ou URLs fora de `ambiente.js`
- Criar métodos não utilizados
- Alterar/remover endpoints existentes
- Silenciar erros (try/catch vazio)
- Duplicar lógica de validação

### **✅ SEMPRE:**

- Usar `BASE_API` de `helpers/ambiente`
- Usar `process.env.API_TOKEN` para autenticação
- Validar response com método padrão
- Documentar com JSDoc completo
- Re-throw de erros após log

---

## 🔍 **Exemplo Completo Real**

```javascript
import axios from 'axios';

import { BASE_API } from '../../../helpers/ambiente.js';
import { logger } from '../../../utils/logger.js';

const MENSAGENS_ERRO = {
  INCLUIR_PORTARIA: 'Erro ao incluir portaria: ',
  LISTAR_PORTARIAS: 'Erro ao listar portarias: ',
};

/**
 * Classe para interações com API de Portarias
 * Esta classe encapsula chamadas aos endpoints de gestão de portarias
 */
export class PortariasApi {
  /**
   * Inicializa a classe de API
   * @param {object} request - Contexto de requisição do Playwright
   */
  constructor(request) {
    this.request = request;
  }

  /**
   * Inclui nova portaria via API
   * Endpoint: POST gestaoDePortarias/portarias/actions/incluirPortaria
   * @param {object} dados - Dados da portaria
   * Exemplo: JSON_PORTARIA
   * @returns {Promise<string>} ID da portaria criada
   */
  async postIncluirPortaria(dados) {
    try {
      const endpoint = new URL(`${BASE_API}gestaoDePortarias/portarias/actions/incluirPortaria`);

      const response = await axios.post(endpoint.toString(), dados, {
        ignoreHTTPSErrors: true,
        timeout: 0,
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      await this.request.api.validateApiResponse(response);

      const resultado = response?.data?.data?.find((item) => item.nome === dados.nome);
      return resultado ? resultado.id : null;
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.INCLUIR_PORTARIA}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.INCLUIR_PORTARIA}${error.message}`);
    }
  }

  /**
   * Lista portarias cadastradas
   * Endpoint: GET gestaoDePortarias/portarias/queries/listarPortarias
   * @param {string} status - Status das portarias (ativa, inativa)
   * @returns {Promise<Array>} Lista de portarias
   */
  async getListarPortarias(status) {
    try {
      const endpoint = new URL(
        `${BASE_API}gestaoDePortarias/portarias/queries/listarPortarias?status=${status}`
      );

      const response = await axios.get(endpoint.toString(), {
        ignoreHTTPSErrors: true,
        timeout: 0,
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      await this.request.api.validateApiResponse(response);
      return response?.data?.data || [];
    } catch (error) {
      logger.error(`${MENSAGENS_ERRO.LISTAR_PORTARIAS}${error.message}`);
      throw new Error(`${MENSAGENS_ERRO.LISTAR_PORTARIAS}${error.message}`);
    }
  }
}
```

---

> **💡 Classes de API devem ser simples e focadas apenas em chamadas HTTP.**
>
> **🎯 Toda lógica de negócio deve estar em Page Objects ou nos testes.**
