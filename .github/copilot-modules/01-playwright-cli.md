# 🧭 **Playwright CLI - Geração de Snapshots e Arquivos de Teste**

> **Módulo 01:** Processo para executar passos do usuário com `playwright-cli` (sem headed), capturar snapshots e preparar geração de arquivos de teste conforme as instruções do projeto.

---

## 🎯 **Objetivo**

Este módulo define como:

- Receber um passo a passo do usuário (o que acessar, clicar, preencher e validar)
- Executar o fluxo no navegador com `playwright-cli` **sem modo headed**
- Capturar snapshots durante e ao final do fluxo
- Gerar arquivos de teste alinhados com `.github/copilot-instructions.md` e módulos 05/06/08/09

---

## 📥 **Entrada Obrigatória do Usuário**

### **📄 Fonte Padrão do Passo a Passo (OBRIGATÓRIO)**

Quando não houver outro documento explícito enviado no chat, usar como padrão:

- A estrutura do documento de exemplo do projeto

**Processo obrigatório de leitura:**

1. Ler o documento completo de referência
2. Extrair os passos da seção `## 🚀 Implementação do Cenário`
3. Executar os passos em ordem com `playwright-cli` (headless)

O usuário deve informar, no mínimo:

1. URL inicial
2. Sequência de ações (acessar, clicar, preencher, selecionar, validar)
3. Resultado esperado por etapa (quando aplicável)

### **Formato recomendado**

```markdown
# 📋 Informações Gerais do Teste

- **Nº Roteiro:** 01
- **Nr issue Jira:** ERPONU-0000
- **Tipo:** Teste de Jornada
- **Produto:** Nome do produto
- **Nome:** Nome do cenário
- **Descrição:** Descrição resumida do cenário

---

## 🚀 Implementação do Cenário

### **1. 🖥️ Acessar tela inicial**

- **Ações:**
  - **Ação:** Acessar https://site.com/login.
  - **Validação:** Validar Login está visível.

### **2. 🖥️ Executar login**

- **Ações:**
  - **Ação:** Preencher Email com teste@dominio.com.
  - **Ação:** Preencher Senha com 123456.
  - **Ação:** Clicar em Entrar.
  - **Validação:** Validar texto Bem-vindo está visível.

### **3. 🖥️ Executar fluxo principal**

- **Ações:**
  - **Ação:** Clicar em Novo Cadastro.
  - **Ação:** Preencher Nome com João Teste.
  - **Ação:** Clicar em Salvar.
  - **Validação:** Validar mensagem Registro salvo com sucesso.
```

**Regras do formato:**

- Manter passos numerados e em ordem de execução real.
- Cada passo deve conter bloco Ações.
- Usar bullets com Ação e Validação de forma explícita.
- Texto do elemento deve ser igual ao texto visível em tela.

---

## 🧪 **Execução Obrigatória com Playwright CLI (Headless)**

> **REGRA ABSOLUTA:** NÃO usar `--headed` neste fluxo.

### **Passo 1: Abrir sessão headless**

```bash
playwright-cli open {url_inicial}
```

### **Passo 2: Executar cada ação em ordem**

Comandos permitidos (exemplos):

```bash
playwright-cli goto {url}
playwright-cli click {ref}
playwright-cli fill {ref} "{texto}"
playwright-cli press Enter
playwright-cli select {ref} "{valor}"
playwright-cli check {ref}
playwright-cli uncheck {ref}
playwright-cli snapshot
```

### **Passo 3: Validar etapas com snapshot**

- Capturar snapshot após etapas críticas
- Capturar snapshot final do fluxo
- Usar referências do snapshot para cliques/preenchimentos seguintes

---

## ⚠️ **Tratamento de Impedimentos (Obrigatório)**

Se ocorrer qualquer bloqueio, **parar e perguntar ao usuário** antes de continuar.

### **Exemplos de bloqueio**

- Elemento não encontrado no tempo padrão
- Múltiplos elementos com mesmo texto e sem contexto claro
- CAPTCHA, MFA, pop-up de permissão, modal inesperado
- Dados ausentes (credenciais, valores de formulário, URL correta)
- Documento de referência ausente ou sem a seção `## 🚀 Implementação do Cenário`

### **Regra de decisão**

- ❌ Não inventar dado faltante
- ❌ Não assumir clique em elemento ambíguo
- ✅ Fazer pergunta objetiva e curta para desbloqueio

---

## 📸 **Saída de Snapshots**

Ao final da execução, garantir:

1. Snapshot final da tela alvo
2. Snapshots intermediários relevantes (quando houver transição de estado)
3. Registro dos arquivos gerados em `.playwright-cli/`

---

## 🏗️ **Geração de Arquivos de Teste (Com Copilot Instructions)**

Após concluir os snapshots:

1. Aplicar `.github/copilot-instructions.md` para fluxo de análise/planejamento
2. Usar módulo 05 para Page Objects
3. Usar módulo 06 para arquivos `*.spec.js`
4. Gerar os arquivos necessários do cenário solicitado (Page, Spec e JSON quando aplicável)

### **Integração com Playwright Best Practices**

Após a etapa de snapshots e antes de gerar os arquivos, usar o skill `playwright-best-practices` como guia de decisão técnica para:

- Estratégia e prioridade de locators (`getByRole > getByText > getByLabel > locator`)
- Assertions e comportamento de espera
- Estrutura de Page Object Model
- Prevenção de flakiness e decisões de depuração

`playwright-cli` é responsável por executar o fluxo no navegador e produzir snapshots.
`playwright-best-practices` é responsável por orientar como locators, waits, assertions e a estrutura do teste devem ser definidos a partir das evidências capturadas nesses snapshots.

### **Diretriz de consistência**

- Locators do Page Object devem refletir os elementos identificados nos snapshots
- Estrutura AAA deve ser aplicada no teste
- Nomenclatura e organização devem seguir os módulos do projeto

---

## ✅ **Checklist Rápido**

- [ ] Recebi passo a passo completo do usuário
- [ ] Executei `playwright-cli` sem `--headed`
- [ ] Capturei snapshots intermediários e final
- [ ] Em bloqueios, perguntei ao usuário antes de prosseguir
- [ ] Gerei arquivos de teste conforme `copilot-instructions` + módulos 05/06
