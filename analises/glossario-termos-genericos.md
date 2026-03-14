# 📖 Glossário de Escrita para Solicitações ao Playwright CLI

> **Objetivo:** manter o mesmo estilo de escrita do arquivo de passo a passo e orientar, em português, como redigir solicitações claras para automação com exemplos reais de elementos comuns.

---

## 📋 Informações Gerais

- **Público-alvo:** Usuários juniores
- **Uso:** Escrita de roteiros, instruções de análise e pedidos de implementação
- **Foco:** Descrever intenção funcional (o que fazer), sem detalhar implementação técnica (como fazer)

---

## 🤖 Instruções de Escrita para IA

> **Regra principal:** escreva no formato **Ação + Elemento + Contexto + Validação**.

- Use termos funcionais: `clicar`, `preencher`, `selecionar`, `validar`.
- Use o texto visível em tela como referência do elemento.
- Quando houver repetição de elemento, adicione contexto: `no modal`, `na primeira linha`, `no filtro`.
- Evite termos técnicos como CSS, XPath, id, classe, componente PrimeNG.

---

## 🏗️ Estrutura Recomendada de Escrita (mesmo padrão do template)

### 1. Contexto do passo

- **Referência da tela:** Nome da tela/fluxo
- **Objetivo do passo:** O resultado esperado

### 2. Ações

- Sempre em bullets curtos, iniciando com `Ação:`
- Uma ação por linha
- Ordem cronológica real da tela

### 3. Validações

- Sempre em bullets curtos, iniciando com `Validação:`
- Validação objetiva e mensurável (texto, visibilidade, quantidade)

Modelo pronto:

```markdown
### **X. 🖥️ Nome do passo**

- **Ações:**
  - **Ação:** Acessar [nome da tela].
  - **Ação:** Clicar em `[nome do botão/link]`.
  - **Ação:** Preencher `[nome do campo]` com `[valor]`.
  - **Validação:** Validar `[texto/elemento esperado]` está visível.
```

---

## 🧩 Glossário Prático por Tipo de Elemento (com exemplos reais)

### 1. Botões e links

- **Como escrever:** `Clicar em [texto do elemento]`
- **Exemplos reais:**
  - **Ação:** Clicar em `Adicionar`.
  - **Ação:** Clicar em `Salvar`.
  - **Ação:** Clicar em `Filtrar`.
  - **Ação:** Clicar em `Ações`.
  - **Ação:** Clicar em `Editar`.

### 2. Campos de texto

- **Como escrever:** `Preencher [campo] com [valor]`
- **Exemplos reais:**
  - **Ação:** Preencher `Descrição` com `Compra mensal de insumos`.
  - **Ação:** Preencher `Documento origem` com `12345`.
  - **Ação:** Preencher `Código` com `ABC001`.

### 3. Dropdown, autocomplete e lookup

- **Como escrever:** `Selecionar [campo] com [valor]` ou `Expandir [campo] e selecionar [valor]`
- **Exemplos reais:**
  - **Ação:** Selecionar `Fornecedor` com `Fornecedor Teste`.
  - **Ação:** Expandir `Tipo de negócio` e selecionar `Novo`.
  - **Ação:** Selecionar `Empresa / Filial` com `50 - 10`.

### 4. Checkbox e radio

- **Como escrever:** `Marcar [elemento]` / `Selecionar [opção]`
- **Exemplos reais:**
  - **Ação:** Marcar a primeira linha da tabela.
  - **Ação:** Selecionar opção `Sim` no modal de confirmação.

### 5. Tabela e grid

- **Como escrever:** incluir contexto de linha
- **Exemplos reais:**
  - **Ação:** Na primeira linha da tabela, clicar em `Ações`.
  - **Ação:** Na linha com `Descrição Compra mensal de insumos`, clicar em `Editar`.
  - **Validação:** Validar a grid contém 1 registro.

### 6. Modal

- **Como escrever:** sempre indicar que está no modal
- **Exemplos reais:**
  - **Validação:** Validar modal `Confirmação` está visível.
  - **Ação:** Clicar em `Sim` no modal.

### 7. Abas (tabs)

- **Como escrever:** `Abrir aba [nome]`
- **Exemplos reais:**
  - **Ação:** Abrir aba `Anexos`.
  - **Ação:** Abrir aba `Resumo`.

### 8. Mensagens e toasts

- **Como escrever:** `Validar mensagem contém [texto]`
- **Exemplos reais:**
  - **Validação:** Validar mensagem contém `Registro(s) salvo(s) com sucesso`.
  - **Validação:** Validar mensagem contém `Parâmetros de atendimento salvos com sucesso`.

---

## ✅ Exemplos de Escrita (Bom x Ruim)

### Exemplo 1: Botão

- **Ruim:** Clique no botão primário da direita.
- **Bom:** **Ação:** Clicar em `Salvar`.

### Exemplo 2: Elemento repetido

- **Ruim:** **Ação:** Clicar em `Editar`.
- **Bom:** **Ação:** Na primeira linha da tabela, clicar em `Editar`.

### Exemplo 3: Campo com tecnologia interna

- **Ruim:** Preencher no p-autocomplete usando lookup.
- **Bom:** **Ação:** Selecionar `Fornecedor` com `Fornecedor Teste`.

### Exemplo 4: Validação genérica

- **Ruim:** Validar sucesso.
- **Bom:** **Validação:** Validar mensagem contém `Geração de pedido de compra criado com sucesso`.

---

## 🚫 O que Evitar ao Escrever

- Não citar HTML/CSS/XPath/id/classe.
- Não escrever múltiplas ações na mesma linha.
- Não usar textos genéricos sem alvo (`clicar no botão`).
- Não omitir contexto quando há elementos duplicados.

---

## 🧪 Mini Checklist para Usuário Júnior

- [ ] Cada passo tem `Ação` e/ou `Validação` claramente separadas.
- [ ] O nome do elemento está igual ao texto visível na tela.
- [ ] Há contexto quando necessário (`modal`, `primeira linha`, `filtro`, `aba`).
- [ ] As validações são objetivas (visível, contém texto, quantidade).
- [ ] Não há detalhes técnicos de implementação.

---

## 🚀 Exemplo Completo no Formato do Template

### **1. 🖥️ Filtrar registros e validar retorno**

- **Ações:**
  - **Ação:** Acessar `Processo de Atendimento`.
  - **Ação:** Expandir filtro.
  - **Ação:** Clicar em `Limpar`.
  - **Ação:** Preencher `Documento origem` com `12345`.
  - **Ação:** Clicar em `Filtrar`.
  - **Validação:** Validar grid com 1 registro.

### **2. 🖥️ Gerar pedido e confirmar**

- **Ações:**
  - **Ação:** Marcar primeira linha da tabela.
  - **Ação:** Clicar em `Avançar`.
  - **Ação:** Selecionar `Fornecedor` com `Fornecedor Teste`.
  - **Ação:** Clicar em `Confirmar`.
  - **Ação:** Clicar em `Gerar pedido de compra`.
  - **Ação:** Clicar em `Sim` no modal de confirmação.
  - **Validação:** Validar mensagem contém `Parâmetros de atendimento salvos com sucesso`.
  - **Validação:** Validar mensagem contém `Geração de pedido de compra criado com sucesso`.

---

**Resumo:** mantenha o estilo do passo a passo (Ações/Validações), escrevendo com clareza funcional para que a IA escolha automaticamente a melhor implementação no Playwright CLI.
