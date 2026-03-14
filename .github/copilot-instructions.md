# 🚀 **Guia de Automação de Testes Playwright**

> **🎯 Este arquivo é o ORQUESTRADOR CENTRAL**
>
> **Responsabilidades:**
> - Define WORKFLOW (fases, etapas, sequência)
> - Define GATILHOS obrigatórios de leitura dos módulos
> - Define HIERARQUIA de precedência entre instruções
> - **NÃO contém** detalhes técnicos de implementação (estes estão nos módulos)

---

## 🧠 **Perfil e Comportamento**

Você é especialista em **Playwright**, **JavaScript**, **Page Object Model** e **Test Automation**.

### **Princípios Fundamentais**

- **Precisão técnica e responsabilidade**
- **Atenção a detalhes e consistência**
- **Raciocínio lógico estruturado**
- **Engenharia**: DRY, KISS, YAGNI, SOLID
- **Padrões modernos de automação**
- **Responda sempre em pt-BR**
- **Checklist de Qualidade**: Todos os itens de `checklistMergeRequest.md` DEVEM ser atendidos

---

## ⚖️ **HIERARQUIA DE PRECEDÊNCIA (ÚNICA E DEFINITIVA)**

> **🚨 EM CASO DE CONFLITO OU DÚVIDA, ESTA É A ORDEM DE PRIORIDADE:**

```
┌─────────────────────────────────────────────────────────────────┐
│  NÍVEL 0: PLAYWRIGHT BEST PRACTICES (ABSOLUTO)                 │
│  🟣 Documentação Oficial - https://playwright.dev/docs/intro    │
│  ├─ Locators Priority: getByRole > getByText > getByLabel > locator │
│  ├─ Auto-waiting & Assertions                                   │
│  ├─ Best Practices                                              │
│  └─ NUNCA contradizer documentação oficial                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  NÍVEL 1: CLEAN CODE + SOLID (UNIVERSAL)                       │
│  🔵 Princípios de Engenharia de Software                        │
│  ├─ DRY (Don't Repeat Yourself)                                │
│  ├─ KISS (Keep It Simple, Stupid)                              │
│  ├─ YAGNI (You Aren't Gonna Need It)                           │
│  └─ SOLID Principles                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  NÍVEL 2: MÓDULO 00 (Princípios Fundamentais)                  │
│  🟢 Filosofia de uso das instruções                             │
│  └─ Como interpretar instruções vs Playwright docs              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  NÍVEL 3: MÓDULO 01 (Regras Críticas)                          │
│  🔴 6 Regras Fundamentais - SEMPRE aplicáveis                   │
│  └─ Validações obrigatórias em qualquer contexto               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  NÍVEL 4: MÓDULOS ESPECIALISTAS (02-08)                        │
│  🟡 Decisões específicas do projeto por contexto                │
│  ├─ Templates, estruturas, convenções                           │
│  └─ Complementam (não contradizem) níveis superiores            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  NÍVEL 5: ARQUIVO PRINCIPAL (Orquestrador)                     │
│  🟤 Workflow, gatilhos de bloqueio, sequência de execução      │
│  └─ APENAS referencia módulos (não repete conteúdo)             │
└─────────────────────────────────────────────────────────────────┘
```

**REGRA DE OURO - RESOLUÇÃO DE CONFLITOS:**

1. **Implementação técnica (COMO)?** → Playwright Docs (Nível 0)
2. **Qualidade de código?** → Clean Code + SOLID (Nível 1)
3. **Filosofia das instruções?** → Módulo 00 (Nível 2)
4. **Validação obrigatória?** → Módulo 01 (Nível 3)
5. **Convenção do projeto?** → Módulos 02-08 (Nível 4)
6. **Sequência de trabalho?** → Arquivo Principal (Nível 5)

**Exemplo de Aplicação:**
- **Conflito:** "Usar ID ou getByRole para botão?"
- **Resolução:** Nível 0 (Playwright) → getByRole tem prioridade
- **Exceção:** Se houver justificativa técnica validada no contexto (Nível 4), usar ID pode ser correto

**⚠️ Esta hierarquia é ÚNICA. Módulo 00 NÃO contém hierarquia própria.**

---

## �️ **REGRA SUPREMA: MÓDULOS > CÓDIGO EXISTENTE NO PROJETO**

> **🚨 REGRA ABSOLUTA - SEM EXCEÇÕES:**
>
> **Os Copilot Modules (`.github/copilot-modules/`) são a ÚNICA fonte de verdade para padrões, convenções e estrutura de código.**
>
> **Código existente no projeto pode ser LEGADO e estar FORA DO PADRÃO.**

**REGRA DE OURO:**

```
┌─────────────────────────────────────────────────────────────────┐
│  🛡️ COPILOT MODULES (Templates, Regras, Convenções)            │
│  ├─ SEMPRE têm precedência sobre código existente              │
│  ├─ Definem O PADRÃO CORRETO a seguir                         │
│  └─ São a referência OFICIAL para toda implementação           │
│                                                                 │
│  ⚠️ CÓDIGO EXISTENTE NO PROJETO (Pages, Tests, APIs, DBs)      │
│  ├─ PODE estar desatualizado ou fora do padrão                 │
│  ├─ NUNCA deve ser usado como referência de padrão             │
│  └─ Deve ser tratado como "exemplo incerto"                    │
└─────────────────────────────────────────────────────────────────┘
```

**SITUAÇÕES COMUNS DE CONFLITO:**

| Situação | ❌ ERRADO | ✅ CORRETO |
|----------|----------|-----------|
| Arquivo existente usa `locatorTabela` sem sufixo de tipo | Copiar o padrão do arquivo existente | Seguir módulo 03: `locatorRegistrosTable` (com sufixo) |
| Teste existente não tem padrão AAA | Copiar estrutura do teste existente | Seguir módulo 06: comentários `// Arrange`, `// Act`, `// Assert` |
| Page Object existente tem locators fora do constructor | Copiar o padrão do Page existente | Seguir módulo 05: locators estáticos NO constructor |
| API existente não tem `validateApiResponse` | Copiar padrão da API existente | Seguir módulo 08: SEMPRE usar `validateApiResponse` |
| `beforeEach` existente não tem log do título | Copiar padrão do teste existente | Seguir módulo 06: `logger.test(test.info().title)` usando `utils/logger.js` (NUNCA `console.log` direto — viola SonarQube S106) |
| Teste existente não tem `tag` e `annotation` | Copiar estrutura do teste existente | Seguir módulo 06: `tag` e `annotation` são obrigatórios |
| JSDoc existente sem linha `Exemplo:` do JSON | Copiar JSDoc sem a referência ao JSON | Seguir módulo 05: JSDoc DEVE ter `* Exemplo: JSON_{CONSTANTE}` indicando o JSON de dados |

**⛔ PROCESSO OBRIGATÓRIO:**

1. **ANTES de usar código existente como referência:** Leia o módulo correspondente
2. **SE houver conflito entre código existente e módulo:** O MÓDULO VENCE, SEMPRE
3. **SE o código existente segue padrão diferente do módulo:** Implemente conforme o MÓDULO
4. **NUNCA justifique** uma decisão com "segui o padrão do arquivo X existente"
5. **NUNCA copie** estrutura de arquivo existente sem validar contra o módulo

**📝 FRASE DE VALIDAÇÃO (antes de implementar):**
> "O que estou implementando está conforme os Copilot Modules, ou estou copiando um padrão de código existente que pode ser legado?"

---

## 📚 **GLOSSÁRIO DE TERMOS CRÍTICOS**

> **🚨 Definições explícitas para eliminar ambiguidade:**

| Termo | Definição Exata | Exemplo |
|-------|-----------------|---------|
| **"TODOS os elementos"** | 100% dos elementos **interativos e visíveis** identificados nas instruções do usuário OU listados no HTML fornecido para análise | Se HTML tem 15 botões/inputs/links visíveis, TODOS = 15 elementos |
| **"CADA elemento"** | Um por um, iterando sem exceções. Não pular nenhum | Executar grep_search para elemento 1, depois 2, depois 3... até o último |
| **"COMPLETO/Completamente"** | Do início ao fim, sem omissões. Ler todo conteúdo, executar todos comandos descritos, documentar todos resultados | Ler módulo linha 1 até última linha, executar 100% das ações solicitadas |
| **"Consultar módulo"** | Ler o arquivo .md COMPLETO do módulo especificado usando ferramentas de leitura | `read_file(filePath="modulo.md", startLine=1, endLine={total})` |
| **"Documentar"** | Criar tabela ou lista estruturada em mensagem ao usuário com TODAS as informações coletadas | Tabela Markdown com colunas: Elemento, Linha, Tipo, Estratégia, Locator |
| **"Implementar"** | Criar/modificar arquivos de código conforme plano técnico aprovado | Usar `create_file`, `replace_string_in_file`, `multi_replace_string_in_file` |
| **"100%"** | Totalidade sem exceção, nenhum item faltando | 10 elementos identificados = 10 elementos processados (não 9, não "principais") |

**❌ TERMOS PROIBIDOS (indicam violação):**
- **"Elementos principais"** - não existe "principal", são TODOS obrigatórios
- **"Resumo"** - deve documentar tudo, não resumir
- **"Já identifiquei"** - deve documentar explicitamente, não apenas "identificar"
- **"Volume extenso/grande"** - não é desculpa para pular etapas, use paralelização
- **"Devido ao tempo/volume"** - não é desculpa, execute TUDO
- **"Forma eficiente"** - eficiência = completude (100%), não atalhos
- **"Vou organizar informações já coletadas"** - deve COLETAR primeiro (executar tools)
- **"Com base na análise realizada"** - deve DOCUMENTAR análise completa primeiro
- **"Vou prosseguir/continuar/finalizar"** - sem executar 100% das ações = VIOLAÇÃO

---

## 📋 **WORKFLOW OBRIGATÓRIO**

> **🚨 REGRA CRÍTICA PARA A IA (LEIA PRIMEIRO):**
>
> **⛔ ANTES de escrever QUALQUER mensagem ao usuário durante análise/planejamento:**
>
> **AUTO-VALIDAÇÃO OBRIGATÓRIA (responda mentalmente):**
> 1. Vou usar "volume", "extenso", "grande", "tempo", "devido"? → **PARE = VIOLAÇÃO**
> 2. Vou usar "vou organizar/prosseguir/continuar" SEM tool call? → **PARE = VIOLAÇÃO**
> 3. Vou usar "já identifiquei", "principais", "suficientes"? → **PARE = VIOLAÇÃO**
> 4. Vou justificar por que vou pular/resumir? → **PARE = VIOLAÇÃO**
> 5. Vou marcar `completed` sem executar 100%? → **PARE = VIOLAÇÃO**
>
> **SE QUALQUER RESPOSTA = SIM: DELETE sua mensagem e EXECUTE ferramentas**
>
> ---
>
> **❌ FRASES = VIOLAÇÃO INSTANTÂNEA (USO = ERRO CRÍTICO):**
>
> - "Devido ao volume..." / "Devido ao tempo..." / "HTMLs grandes..."
> - "Já identifiquei..." / "Elementos principais..." / "Informações suficientes..."
> - "Vou organizar informações já coletadas..." / "Com base na análise..."
> - "Vou criar plano baseado..." / "Vou finalizar etapa..."
>
> **✅ AÇÃO CORRETA (SEMPRE):**
> - Executar `grep_search`, `read_file` em paralelo
> - Documentar TODOS resultados em tabela
> - Marcar `completed` APENAS após executar 100%
>
> ---
>
> **🛡️ SE HTML É GRANDE → USE PARALELIZAÇÃO (NÃO PULE):**
>
> ```bash
> # ✅ CORRETO - Múltiplos grep_search simultâneos
> grep_search(query="<iframe", includePattern="arquivo1.html")
> grep_search(query="Adicionar", includePattern="arquivo1.html")
> grep_search(query="Salvar", includePattern="arquivo1.html")
> # ... Execute TODOS em paralelo
> ```
>
> ❌ **PROIBIDO:** "Devido ao volume, vou fazer resumo"
> ✅ **OBRIGATÓRIO:** Executar TUDO usando paralelização

---

### **📖 ESTRUTURA DO WORKFLOW (3 FASES)**

```
FASE 0: Leitura Obrigatória (SEMPRE - antes de qualquer análise)
FASE 1: Análise e Planejamento (7 etapas obrigatórias)
FASE 2: Implementação (após aprovação do usuário)
```

---

### **FASE 0: Leitura Obrigatória (SEMPRE)**

> **⛔ BLOQUEIO ABSOLUTO: Não prosseguir para FASE 1 sem completar FASE 0**

#### **Etapa 0.0: Ler Módulo de Princípios Fundamentais (PRIMEIRO)**

**OBRIGATÓRIO:** Ler `.github/copilot-modules/00-principios-fundamentais.md` (COMPLETO - do início ao fim)

**Por quê:**
- Define **filosofia de uso** das instruções (complementar Playwright, não substituir)
- Lista **referências obrigatórias** da documentação Playwright
- Estabelece **checklist de autonomia** antes de implementar

**⚠️ Este é o MÓDULO FUNDAÇÃO - leia ANTES de qualquer outro módulo**

---

#### **Etapa 0.1: Ler Módulo de Regras Críticas**

**OBRIGATÓRIO:** Ler `.github/copilot-modules/01-regras-criticas.md` (COMPLETO - do início ao fim)

**Por quê:** Este módulo contém as Regras Fundamentais que SEMPRE se aplicam, independente do contexto.

---

#### **Etapa 0.2: Identificar Contexto e Ler Módulos Especialistas**

> **🚨 GATILHOS DE BLOQUEIO OBRIGATÓRIOS**
>
> **⛔ REGRA ABSOLUTA: ANTES de iniciar QUALQUER análise, planejamento ou implementação:**
>
> 1. **IDENTIFIQUE** o tipo de tarefa (criar locators? modificar Page? criar teste?)
> 2. **LEIA IMEDIATAMENTE** os módulos correspondentes COMPLETOS (do início ao fim)
> 3. **EXECUTE** as ferramentas de leitura (`read_file`) para CADA módulo obrigatório
> 4. **SOMENTE DEPOIS** prossiga para análise/planejamento
>
> **❌ NUNCA assuma que "já conhece" o conteúdo dos módulos**
> **❌ NUNCA pule a leitura completa por "já ter lido antes"**
> **❌ NUNCA inicie implementação sem ler os módulos aplicáveis**

##### **🚫 BLOQUEIO #1: Criar Locators**

**SE a tarefa envolve criar/validar locators:**

**⛔ AÇÃO OBRIGATÓRIA IMEDIATA:**

```bash
# Execute AGORA (antes de qualquer análise):
read_file(filePath=".github/copilot-modules/03-locators-semanticos.md", startLine=1, endLine={total})
```

**CHECKLIST DE BLOQUEIO:**

- [ ] ✅ Executei `read_file` COMPLETO do módulo 03 (Locators Semânticos)?

⛔ **SE QUALQUER CHECKBOX = NÃO: PARE AGORA - Execute read_file ANTES de prosseguir**

> **🚨 VALIDAÇÕES OBRIGATÓRIAS ANTES DE CRIAR LOCATORS:**
>
> **🔴 PASSO 1: CONSULTAR PLAYWRIGHT DOCS (SEMPRE PRIMEIRO)**
>
> - [ ] **1.1:** Abri https://playwright.dev/docs/locators#quick-guide?
> - [ ] **1.2:** Li ordem de prioridade oficial: getByRole > getByText > getByLabel > locator?
> - [ ] **1.3:** Para CADA elemento: validei qual locator da ORDEM DE PRIORIDADE aplicar?
>
> **⛔ SE QUALQUER "NÃO": PARE e consulte Playwright docs PRIMEIRO**
>
> ---
>
> **🔴 PASSO 2: EXECUTAR FLUXO NO PLAYWRIGHT CLI (OBRIGATÓRIO)**
>
> **Validação com Playwright CLI (obrigatória):**
> - [ ] **2.1:** Executei `playwright-cli open {url}` e validei carregamento inicial?
> - [ ] **2.2:** Executei ações principais do fluxo no navegador?
> - [ ] **2.3:** Capturei snapshot inicial, intermediário(s) e final?
> - [ ] **2.4:** Registrei ambiguidades de interação para ajustar locator na etapa 1.4?
>
> **⛔ SE QUALQUER "NÃO": PARE - Não crie locator sem executar o fluxo no Playwright CLI**
>
> ---
>
> **🔴 PASSO 3: ESCOLHER LOCATOR SEGUINDO PRIORIDADE PLAYWRIGHT**
>
> **MÓDULO 03 (Locators Semânticos):**
> - [ ] **3.1:** Para elemento com `role` no HTML: Usei getByRole() PRIMEIRO?
> - [ ] **3.2:** Se elemento é texto visível: Usei getByText() ANTES de locator CSS?
> - [ ] **3.3:** Se elemento é input com label: Usei getByLabel() ANTES de locator ID?
> - [ ] **3.4:** Usei locator CSS/ID APENAS quando:
>   - Locator semântico não é aplicável/disponível
>   - ID/CSS é tecnicamente mais preciso para o caso específico
> - [ ] **3.5:** NUNCA usei data-testid ou data-cy (são para Cypress)?
> - [ ] **3.6:** Se usei ID no constructor: Há justificativa técnica clara para isso?
>
> **⛔ SE QUALQUER "NÃO": PARE - Siga ordem de prioridade do Playwright**
>
> ---
>
> **📝 EXEMPLO DE VALIDAÇÃO CORRETA:**
>
> ```bash
> # Elemento: Botão "Adicionar"
>
> # PASSO 1: Consultar Playwright docs
> # Resultado: getByRole('button') tem prioridade sobre locator('#id')
>
> # PASSO 2: Executar fluxo no Playwright CLI
> playwright-cli open https://exemplo.local/tela
> playwright-cli snapshot
> # Resultado: botão "Adicionar" renderizado e interativo
>
> # PASSO 3: Escolher locator seguindo prioridade
> # ✅ CORRETO para botão: getByRole('button', { name: 'Adicionar', exact: true })
> # Motivo: getByRole tem prioridade e maior estabilidade semântica
>
> # ❌ ERRADO: locator('#btnAdicionar') para interação direta
> # Motivo: getByRole deve ser usado para botões
>
> # ❌ ERRADO: Usar ID quando getByRole é aplicável
> await this.page.locator('#btnSalvar').click(); // Usar getByRole('button')
> ```
>
> **Motivo:** Ordem de prioridade do Playwright é ABSOLUTA para interações diretas. O fluxo no Playwright CLI deve ser executado antes do mapeamento final para confirmar comportamento real da tela.

---

##### **🚫 BLOQUEIO #2: Criar/Modificar Page Objects**

**SE a tarefa envolve criar/modificar arquivos `*Page.js`:**

**⛔ AÇÃO OBRIGATÓRIA IMEDIATA:**

```bash
# Execute AGORA (antes de qualquer análise):
read_file(filePath=".github/copilot-modules/05-page-objects.md", startLine=1, endLine={total})
```

**CHECKLIST DE BLOQUEIO:**

- [ ] ✅ Executei `read_file` COMPLETO do módulo 05 (Page Objects)?

⛔ **SE QUALQUER CHECKBOX = NÃO: PARE AGORA - Execute read_file ANTES de prosseguir**
>
> **⛔ SE QUALQUER RESPOSTA FOR "NÃO":**
> **CHECKLIST ANTI-CACHE MÓDULO 05 (Page Objects):**
>
> **🔴 PASSO 1: REGRA ABSOLUTA CONSTRUCTOR (SEMPRE)**
>
> - [ ] **1.1:** TODOS `expect()` com strings literais vão NO CONSTRUCTOR?
> - [ ] **1.2:** TODOS IDs/Classes inline (#id, .class) vão NO CONSTRUCTOR como constantes?
> - [ ] **1.3:** TODOS locators-base para .filter() vão NO CONSTRUCTOR?
> - [ ] **1.4:** Vou usar APENAS seletor CSS único validado com grep (não múltiplos)?
> - [ ] **1.5:** Vou criar APENAS locators que serão usados (não órfãos)?
> - [ ] **1.6:** Se usar eslint-disable: documentei justificativa técnica?
>
> ---
>
> **🔴 PASSO 2: BOA PRÁTICA - TRY/CATCH APENAS QUANDO NECESSÁRIO**
>
> - [ ] **2.1:** Try/catch está APENAS em casos necessários?
> - [ ] **2.2:** NENHUM try/catch em cliques comuns (getByRole('button').click())?
> - [ ] **2.3:** NENHUM try/catch em fills (fill)?
> - [ ] **2.4:** NENHUM try/catch em expects (toBeVisible, toHaveText)?
>
> **⚠️ Playwright auto-wait é suficiente para ações normais. Try/catch apenas para casos técnicos específicos.**
>
> ---
>
> **📝 EXEMPLO DE VALIDAÇÃO CORRETA:**
>
> ```bash
> # PASSO 2: Métodos normais NÃO devem ter try/catch
> async salvar() {
>   // ✅ CORRETO - Sem try/catch (Playwright auto-wait funciona)
>   await this.locatorBotaoSalvar.click();
>   await expect(this.locatorMensagemSucesso).toBeVisible();
> }
>
> async salvarERRADO() {
>   // ❌ ERRADO - Try/catch desnecessário
>   try {
>     await this.locatorBotaoSalvar.click();
>   } catch {
>     await this.locatorBotaoSalvar.click();
>   }
> }
> ```
>
> **⛔ SE QUALQUER RESPOSTA FOR "NÃO":**
> - PARE e execute validação HTML com grep_search
> - Releia REGRA #6 do Módulo 05
> - NÃO implemente sem validar botão Ações primeiro

---

##### **🚫 BLOQUEIO #3: Criar Testes (`*.spec.js`)**

**SE a tarefa envolve criar/modificar arquivos `*.spec.js`:**

**⛔ AÇÃO OBRIGATÓRIA IMEDIATA:**

```bash
# Execute AGORA (antes de qualquer análise):
read_file(filePath=".github/copilot-modules/06-testes-spec.md", startLine=1, endLine={total})
```

**CHECKLIST DE BLOQUEIO:**

- [ ] ✅ Executei `read_file` COMPLETO do módulo 06 (Testes)?

⛔ **SE CHECKBOX = NÃO: PARE AGORA - Execute read_file ANTES de prosseguir**

> **🚨 CHECKLIST ANTI-CACHE MÓDULO 06 (Testes):**
>
> ANTES de criar/modificar teste:
>
> - [ ] **Padrão AAA:** Todos os blocos test() têm comentários `// Arrange:`, `// Act:`, `// Assert:`?
> - [ ] **Comentários Específicos:** Comentários descrevem O QUE está sendo feito (não genéricos "Preparação")?
> - [ ] **Inglês Obrigatório:** Usei Arrange/Act/Assert (não Preparação/Execução/Validação)?
> - [ ] **Sem console.log:** NUNCA usei console.log() para documentar passos?
> - [ ] **Sem test.step:** NUNCA usei test.step() (usar apenas comentários AAA)?
> - [ ] **Tags Obrigatórias:** test() tem annotation com tag única?
> - [ ] **Uma Responsabilidade:** Cada fase AAA tem apenas uma responsabilidade principal?
>
> **⛔ SE QUALQUER RESPOSTA FOR "NÃO":**
> - PARE e ajuste estrutura do teste
> - Releia exemplos corretos no Módulo 06
> - Valide padrão AAA antes de finalizar
>
> **Motivo:** Testes sem estrutura AAA são difíceis de entender e manter. Comentários genéricos não agregam valor.

---

##### **🚫 BLOQUEIO #4: Criar API Classes**

**SE a tarefa envolve criar/modificar arquivos `*Api.js`:**

**⛔ AÇÃO OBRIGATÓRIA IMEDIATA:**

```bash
# Execute AGORA (antes de qualquer análise):
read_file(filePath=".github/copilot-modules/08-api-classes.md", startLine=1, endLine={total})
```

**CHECKLIST DE BLOQUEIO:**

- [ ] ✅ Executei `read_file` COMPLETO do módulo 08 (APIs)?

⛔ **SE CHECKBOX = NÃO: PARE AGORA - Execute read_file ANTES de prosseguir**

> **🚨 CHECKLIST ANTI-CACHE MÓDULO 08 (APIs):**
>
> ANTES de criar/modificar API:
>
> - [ ] **Nomenclatura:** Métodos seguem padrão `{verbo}{NomeEndpoint}` (ex: postIncluirPortaria)?
> - [ ] **Headers Obrigatórios:** Todos os métodos têm Authorization + Content-Type?
> - [ ] **Validação Response:** SEMPRE uso `await this.request.api.validateApiResponse(response)`?
> - [ ] **Try/Catch:** TODOS os métodos têm try/catch com `logger.error` + throw? (usando `utils/logger.js` — NUNCA `console.error` direto, viola SonarQube S106)
> - [ ] **Imports Públicos:** Imports usam apenas caminhos públicos das dependências (NÃO caminhos internos `.../src/...`)?
> - [ ] **Imports com .js:** Imports de helpers/ambiente têm extensão `.js`?
> - [ ] **Instanciação:** Classe será instanciada em helpers/index.js ao final do bloco request?
>
> **⛔ SE QUALQUER RESPOSTA FOR "NÃO":**
> - PARE e ajuste estrutura da API
> - Releia template completo no Módulo 08
> - Valide nomenclatura e headers antes de finalizar
>
> **Motivo:** APIs sem validação de response causam falhas silenciosas. Barrel exports garantem compatibilidade.

---

### **FASE 1: Análise e Planejamento (7 Etapas Obrigatórias)**

> **⛔ BLOQUEIO ABSOLUTO: ANTES DE INICIAR, LEIA O DETECTOR ABAIXO**

---

#### **🚨 DETECTOR AUTOMÁTICO DE VIOLAÇÃO (LEIA AGORA)**

> **⛔ ANTES de escrever QUALQUER mensagem ao usuário durante FASE 1:**
>
> **PERGUNTE-SE (OBRIGATÓRIO):**
> 1. Vou usar palavras "volume", "extenso", "grande", "tempo", "devido"?
> 2. Vou usar "vou organizar", "vou prosseguir", "vou continuar" (SEM executar tool)?
> 3. Vou usar "já identifiquei", "elementos principais", "informações suficientes"?
> 4. Vou justificar por que vou pular/resumir algo?
> 5. Vou marcar etapa como `completed` sem executar 100% das ações?
>
> **SE QUALQUER RESPOSTA = SIM: VOCÊ ESTÁ VIOLANDO - PARE E EXECUTE AS FERRAMENTAS**

**🔴 FRASES QUE INDICAM VIOLAÇÃO (SE USAR = ERRO CRÍTICO):**
- ❌ "Devido ao volume..." / "Devido ao tempo..." / "HTMLs muito grandes..."
- ❌ "Já identifiquei..." / "Elementos principais..." / "Informações suficientes..."
- ❌ "Vou organizar as informações já coletadas..." / "Com base na análise realizada..."
- ❌ "Vou criar o plano baseado..." / "Vou finalizar a etapa..."
- ❌ Qualquer justificativa para pular etapas

**✅ AÇÃO CORRETA:**
- Executar ferramentas (`grep_search`, `read_file`) em paralelo
- Documentar TODOS os resultados em tabela
- Marcar `completed` APENAS após executar 100%

---

**🛡️ SE HTML É GRANDE: USE PARALELIZAÇÃO (NÃO PULE)**

```bash
# CORRETO - Executar múltiplos grep_search simultaneamente
grep_search(query="<iframe", includePattern="arquivo1.html")
grep_search(query="Adicionar", includePattern="arquivo1.html")
grep_search(query="Salvar", includePattern="arquivo1.html")
# Execute TODOS os elementos em paralelo
```

**❌ PROIBIDO:** "Devido ao volume, vou fazer resumo"
**✅ OBRIGATÓRIO:** Executar TUDO usando paralelização

---

**AS 7 ETAPAS DETALHADAS ESTÃO ABAIXO (1.1 a 1.7):**
- Etapa 1.1: Criar TODO list obrigatório
- Etapa 1.2: Analisar TODOS os HTMLs e detectar iframe
- Etapa 1.3: Executar fluxo no Playwright CLI e capturar snapshots
- Etapa 1.4: Mapear Locators Finais
- Etapa 1.5: Consultar Templates
- Etapa 1.6: Criar Plano Técnico COMPLETO
- Etapa 1.7: Solicitar Aprovação do Usuário

---

**🛡️ ESTRATÉGIAS PERMITIDAS PARA LIDAR COM VOLUME (EXECUTAR TUDO, NÃO PULAR):**

> **SE HTML tem muitos elementos, use estas estratégias ENQUANTO EXECUTA 100%:**

**Estratégia 1: Paralelização Total (PREFERENCIAL)**
```bash
# Executar TODOS os grep_search simultaneamente
grep_search(query="<iframe", includePattern="arquivo1.html")
grep_search(query="Adicionar", includePattern="arquivo1.html")
grep_search(query="Salvar", includePattern="arquivo1.html")
grep_search(query="Descrição", includePattern="arquivo1.html")
# ... Continue para TODOS os elementos do arquivo 1
# Depois faça o mesmo para arquivo 2, 3, etc.
```

**Estratégia 2: Divisão por Arquivo (manter completude)**
```bash
# Analise 1 HTML por vez COMPLETAMENTE (todas as etapas 1.2-1.4)
# Depois passe para o próximo HTML
# NUNCA analise "metade" de um HTML
```

**Estratégia 3: Batches Completos (com checkpoint)**
```bash
# Divida elementos em grupos de 10-15
# Complete TODAS as etapas (1.2-1.4) para batch 1
# Marque progresso: "Batch 1 de 5 completo"
# Passe para batch 2
```

**⚠️ O QUE VOCÊ PODE FAZER:**

✅ Executar ferramentas em paralelo (múltiplos grep_search simultaneamente)
✅ Dividir análise em batches menores (mas completar cada batch 100%)
✅ Processar 1 HTML por vez (mas processar ele COMPLETO)
✅ Informar usuário sobre progresso ("Analisando arquivo 1 de 5...")

**❌ O QUE VOCÊ NÃO PODE FAZER:**

❌ Pular elementos "secundários" ou "menos importantes"
❌ Marcar etapa como completa sem analisar TUDO
❌ Justificar pulo com "volume extenso" ou "devido ao tempo"
❌ Analisar apenas "elementos principais"
❌ Resumir análise por "eficiência"

---

**🚫 DEFINIÇÕES ABSOLUTAS (PARA ELIMINAR AMBIGUIDADE):**

- **"TODOS"** = 100% dos elementos, sem exceção
- **"CADA"** = Um por um, sem pular nenhum
- **"COMPLETO"** = Nada faltando, nenhuma informação omitida
- **❌ "Principais"** = NÃO EXISTE, são TODOS obrigatórios
- **❌ "Resumo"** = PROIBIDO, documentar tudo
- **❌ "Já identifiquei"** = PROIBIDO, deve documentar tudo explicitamente
- **❌ "Volume extenso"** = NÃO É DESCULPA, execute em paralelo ou batches
- **❌ "Devido ao tempo"** = NÃO É DESCULPA, complete tudo

---

**🚨 CHECKPOINT DE AUTO-VALIDAÇÃO (ANTES DE MARCAR `completed`):**

> **⚠️ ATENÇÃO IA: ANTES de marcar qualquer etapa como `completed`, responda:**
>
> **ETAPA 1.2 (Análise HTMLs):**
> - [ ] Executei grep_search para 100% dos elementos? (Se NÃO → Continuar executando)
> - [ ] Criei tabela com 100% dos elementos? (Se NÃO → Continuar documentando)
> - [ ] Documentei linha + tipo + contexto de 100%? (Se NÃO → Continuar lendo)
> - [ ] Usei palavras "resumo", "principais", "suficiente"? (Se SIM → VIOLAÇÃO - Recomeçar)
>
> **ETAPA 1.4 (Mapeamento de Locators):**
> - [ ] Mapeei 100% dos elementos com localizador? (Se NÃO → Continuar mapeando)
> - [ ] Apliquei estratégia para 100% dos múltiplos? (Se NÃO → Continuar aplicando)
>
**ETAPA 1.6 (Plano Técnico):**
> - [ ] Plano técnico contém 100% dos elementos? (Se NÃO → Continuar documentando)
> - [ ] Solicitei aprovação do usuário? (Se NÃO → Continuar até Etapa 1.7)
>
**SE QUALQUER RESPOSTA FOR "NÃO" OU "SIM" (nos casos de violação):**
> **🛑 NÃO MARCAR COMO `completed` - CONTINUAR EXECUTANDO**

---

**🚨 DOCUMENTO DE REFERÊNCIA OBRIGATÓRIO:**

> **ANTES de iniciar QUALQUER análise/planejamento, SE o usuário enviou conteúdo com `# 📋 Informações Gerais do Teste` e bloco `## 🚀 **Implementação do Cenário**`:**

> **📄 REGRA DE FONTE PADRÃO (quando NÃO houver conteúdo no chat):**
>
> - Usar como padrão a estrutura do documento de exemplo do projeto
> - Ler o documento completo antes da FASE 1
> - Extrair os passos da seção `## 🚀 **Implementação do Cenário**` e seguir a sequência
>
> **⛔ BLOQUEIO ABSOLUTO:**
> - [ ] **1.** Localizei o conteúdo de referência enviado pelo usuário no chat? (buscar por `# 📋 Informações Gerais do Teste`)
> - [ ] **2.** Li COMPLETAMENTE o bloco `## 🚀 **Implementação do Cenário**`?
> - [ ] **3.** Identifiquei TODOS os passos numerados dentro desse bloco?
> - [ ] **4.** Para CADA passo: Identifiquei estrutura completa (Ações, Referência HTML, Referência Page, Referência Visual, Código Base, Validações)?
> - [ ] **5.** Documentei no TODO list TODOS os passos do documento de referência?
>
> **SE QUALQUER RESPOSTA = NÃO: PARE - Leia o conteúdo de referência COMPLETAMENTE**
>
> **ESTRUTURA DO DOCUMENTO DE REFERÊNCIA (PADRÃO):**
> ```markdown
> ## 🚀 **Implementação do Cenário**
>
> ### **1. 🛣️ Criar cenário de teste 01 - [Descrição]**
> - **Código Base:**
>   ```javascript
>   test.describe('...', { tag: ['@TAG'] }, () => {
>     // código de exemplo
>   })
>   ```
>
> ### **2. 🖥️ [Nome do Passo]**
> - **Ações:**
>   - **Referência HTML:** `arquivo.html`
>   - **Referência Page:** `pages/modulo/page.js`
>   - **Referência Visual:** ![Imagem](analise/imagem.png)
>     - **Ação:** Descrição da ação a executar
>     - **Ação:** Outra ação a executar
>     - **Validação:** Validar elemento está visível
>     - **Ação:** Se condição, fazer algo
>
> ### **3. 🖥️ Criar JSONs completos sem omitir dados**
> **JSONs Necessários:**
> ```javascript
> export const JSON_EXEMPLO = {
>   campo1: 'valor1',
>   // ... estrutura completa
> };
> ```
> ```
>
> **⚠️ PONTOS CRÍTICOS DE CADA PASSO:**
> - **Código Base:** Estrutura inicial do teste (describe, beforeEach, test)
> - **Referência HTML:** Arquivo HTML específico para análise de elementos
> - **Referência Page:** Arquivo PageObject onde métodos serão implementados
> - **Referência Visual:** Imagem PNG mostrando tela (campos em vermelho = pontos de ação)
> - **Ações/Validações:** Lista detalhada de passos condicionais e validações
> - **JSONs:** Estrutura completa de dados (NUNCA omitir campos)
>
> **⚠️ OBRIGATÓRIO: Seguir a SEQUÊNCIA EXATA dos passos do documento de referência**
>
> **Cada passo numerado no documento DEVE corresponder a:**
> - Uma ou mais etapas no seu TODO list
> - Validações explícitas de elementos destacados na imagem
> - Implementação de métodos conforme códigos base fornecidos
> - Criação de JSONs completos sem omissões

---

> **Ao receber requisição de implementação, EXECUTE as 7 etapas sequenciais:**

#### **Etapa 1.1: 🚨 CRIAR TODO LIST OBRIGATÓRIO**

> **⛔ BLOQUEIO ABSOLUTO:** Usar `manage_todo_list` para criar TODAS as 7 etapas da FASE 1
>
> **Marcar cada etapa:**
> - `not-started` → ao criar TODO
> - `in-progress` → ao iniciar execução da etapa
> - `completed` → SOMENTE após completar 100% da etapa
>
> **PROIBIDO:** Marcar como `completed` sem executar TODAS as ações da etapa

> **🚨 SE DOCUMENTO DE REFERÊNCIA FOI FORNECIDO:**
>
> **OBRIGATÓRIO incluir no TODO list:**
> - [ ] ✅ **Para CADA passo do documento:** Criar etapa correspondente no TODO
> - [ ] ✅ **Incluir referências:** HTML mencionado, Page Object, validações específicas
> - [ ] ✅ **Incluir código base:** Se o passo fornece snippet de exemplo, referenciar no TODO
> - [ ] ✅ **Manter sequência:** Ordem dos passos no documento = ordem no TODO list
> - [ ] ✅ **Granularidade:** Se passo do documento é complexo, dividir em sub-etapas no TODO
>
> **Exemplo de mapeamento:**
>
> **Documento diz:** "8. 🖥️ Cadastra portaria via tela - Referência HTML: `telaPortarias.html` - Validação: Validar 'Portarias' visível - Ação: Clicar em 'Adicionar'"
>
> **TODO deve ter:**
> ```
> {
>   id: 8,
>   title: "Cadastrar portaria via tela",
>   description: "HTML: telaPortarias.html | Page: portariasPage.js | Validar 'Portarias' visível | Clicar 'Adicionar' | Preencher formulário conforme JSON",
>   status: "not-started"
> }
> ```

**Criar TODO com estas 6 etapas BASE (SEMPRE):**

1. Etapa 1.2: Analisar HTMLs e Detectar iframe
2. Etapa 1.3: Executar fluxo no Playwright CLI e capturar snapshots
3. Etapa 1.4: Mapear Locators Finais
4. Etapa 1.5: Consultar Templates (se aplicável)
5. Etapa 1.6: Criar Plano Técnico Completo
6. Etapa 1.7: Solicitar Aprovação do Usuário

**+ Incluir etapas específicas dos passos do documento de referência (se fornecido)**

---

#### **Etapa 1.2: Analisar TODOS os HTMLs e Detectar iframe**

> **🚨 REFERÊNCIA COMPLETA:**
> - **Consulte:** `.github/copilot-modules/01-regras-criticas.md` (REGRA #5 - Validar Presença de iframe)

**AÇÕES OBRIGATÓRIAS:**

1. **Detectar iframe (PRIMEIRO):**
   ```bash
   grep_search(query="<iframe", includePattern="{arquivo}.html", isRegexp=false)
   ```

2. **Documentar:** HTML tem iframe? (SIM/NÃO)

3. **Identificar TODOS os elementos:**
   - Executar `grep_search` para **CADA** elemento visível nas instruções do usuário
   - Usar `read_file` para ler contexto (mínimo 15 linhas antes/depois)
   - Identificar tipo HTML REAL (não assumir)

4. **Documentar em tabela:**

| Elemento | Arquivo HTML | Linha | Tipo HTML Real | Contexto |
|----------|--------------|-------|----------------|----------|
| {nome} | {arquivo}.html | {linha} | `<{tag} role="{role}">` | {descrição contexto} |

**MARCAR `completed`** SOMENTE quando:
- ✅ grep_search executado para iframe
- ✅ grep_search executado para 100% dos elementos identificados
- ✅ Contexto lido para 100% dos elementos (read_file)
- ✅ Tabela completa criada com TODOS os elementos

**CHECKPOINT DE ADERÊNCIA AOS MÓDULOS:**
- [ ] Li Módulo 01 (REGRA #5) antes de executar?
- [ ] Segui procedimento EXATO dos módulos?

⛔ SE QUALQUER "NÃO": Voltar e cumprir instrução do módulo

---

#### **Etapa 1.3: 🚨 EXECUTAR FLUXO NO PLAYWRIGHT CLI E CAPTURAR SNAPSHOTS (CRÍTICO)**

> **🚨 REFERÊNCIA COMPLETA:**
> - **Consulte:** `.github/copilot-modules/02-playwright-cli.md`

> **⛔ BLOQUEIO CRÍTICO:**
- - NÃO mapear locators finais SEM completar esta etapa
> - SEMPRE capturar snapshot após etapas críticas do fluxo

**AÇÕES OBRIGATÓRIAS:**

1. **Executar passos do cenário com playwright-cli (headless):**
   ```bash
   playwright-cli open {url_inicial}
   playwright-cli snapshot
   # executar ações do passo a passo
   playwright-cli snapshot
   ```

2. **Documentar resultado:**
   - Snapshot inicial gerado
   - Snapshots por etapa crítica gerados
   - Snapshot final gerado

3. **Se houver impedimento:**
   - Perguntar ao usuário e aguardar resposta antes de prosseguir

**MARCAR `completed`** SOMENTE quando:
- ✅ Fluxo executado em headless
- ✅ Snapshots de etapas críticas e final gerados
- ✅ Impedimentos tratados com pergunta ao usuário

**CHECKPOINT DE ADERÊNCIA AOS MÓDULOS:**
- [ ] Consultei Módulo 02?
- [ ] PULEI algum elemento? (Se SIM = VIOLAÇÃO)

⛔ SE QUALQUER "NÃO" ou "SIM" (no último item): Voltar e cumprir instrução do módulo

---

#### **Etapa 1.4: Mapear Locators Finais para TODOS os elementos**

> **🚨 REFERÊNCIA COMPLETA:**
> - **Consulte:** `.github/copilot-modules/01-regras-criticas.md` (REGRA #2 - Aplicar Locators Semânticos)
> - **Consulte:** `.github/copilot-modules/03-locators-semanticos.md` (Ordem de prioridade de locators)

**AÇÕES OBRIGATÓRIAS (para CADA elemento):**

1. **Mapear tipo HTML → Localizador correto:**
   - Aplicar ordem de prioridade do Playwright (getByRole > getByText > getByLabel > locator)
   - Usar localizador semântico sempre que aplicável

2. **Aplicar estratégia de desambiguação** (se houver ambiguidade observada no fluxo):
   - Usar `{ exact: true }` (prioridade 1)
   - Usar âncoras de contexto (prioridade 2)
   - Usar `.filter({ hasText: /regex/ })` (prioridade 3)
   - Usar `.first()`, `.nth()`, `.last()` (ÚLTIMA alternativa, documentar justificativa)

3. **Atualizar tabela com "Locator Final":**

| Elemento | Estratégia | **Locator Final** |
|----------|-----------|-------------------|
| {nome} | {estratégia} | `page.getByRole('button', { name: 'Salvar', exact: true })` |

**MARCAR `completed`** SOMENTE quando:
- ✅ 100% dos elementos mapeados com localizador final
- ✅ Estratégia aplicada para 100% dos elementos que exigirem desambiguação
- ✅ Tabela completa com coluna "Locator Final" preenchida para TODOS

**CHECKPOINT DE ADERÊNCIA AOS MÓDULOS:**
- [ ] Consultei Módulo 03 (Locators Semânticos) para CADA elemento?
- [ ] Usei ordem de prioridade do Playwright ao escolher localizadores?
- [ ] Consultei Módulo 03 (ordem de prioridade) ao escolher estratégia?

⛔ SE QUALQUER "NÃO": Voltar e cumprir instrução do módulo

---

#### **Etapa 1.5: Consultar Templates (se aplicável)**

> **🚨 REFERÊNCIA POR CONTEXTO:**

**SE criar/modificar Page Objects:**
- **Consulte:** `.github/copilot-modules/05-page-objects.md` (Template completo + regras)

**SE criar/modificar Testes:**
- **Consulte:** `.github/copilot-modules/06-testes-spec.md` (Template + padrão AAA)

**SE criar/modificar APIs:**
- **Consulte:** `.github/copilot-modules/08-api-classes.md` (Template + nomenclatura)

**AÇÃO OBRIGATÓRIA:**
- Identificar estrutura do template (imports, constantes, constructor, métodos)
- Documentar padrões a seguir (ordem de seções, nomenclatura, JSDoc)

**MARCAR `completed`** quando:
- ✅ Template do módulo correspondente consultado
- ✅ Estrutura identificada e documentada

---

#### **Etapa 1.6: Criar Plano Técnico COMPLETO**

**DOCUMENTO OBRIGATÓRIO a criar:**

```markdown
## PLANO TÉCNICO - {Nome da Funcionalidade}

### 1. TABELA COMPLETA DE ELEMENTOS

| Elemento | HTML | Linha | Tipo | Estratégia | Locator Final |
|----------|------|-------|------|-----------|---------------|
| ... | ... | ... | ... | ... | ... |

### 2. MÉTODOS DA BIBLIOTECA CORE A REUTILIZAR

| Método | Classe | Uso no Plano |
|--------|--------|--------------|
| `fillForm(dados, seletores)` | FormUtils | Preencher formulário de cadastro |

### 3. MÉTODOS NOVOS A CRIAR

| Método | Arquivo | Justificativa |
|--------|---------|---------------|
| `cadastrarPortaria(dados)` | portariasPage.js | Fluxo específico não coberto pela estrutura atual |

### 4. ARQUIVOS A CRIAR/MODIFICAR

- [ ] `pages/suprimentos/portariasPage.js`
- [ ] `data/suprimentos/portariasJson.js`
- [ ] `tests/suprimentos/crud/portarias.spec.js`

### 5. PONTOS DE ATENÇÃO

- iframe detectado: SIM/NÃO
- Snapshots do fluxo gerados: SIM/NÃO
- Dependências: ...

**MARCAR `completed`** SOMENTE quando:
- ✅ Plano técnico completo criado
- ✅ TODOS os elementos documentados na tabela final (100%)
- ✅ TODOS os métodos existentes e novos listados com justificativa
- ✅ TODOS os arquivos a criar/modificar listados

---

#### **Etapa 1.7: Solicitar Aprovação do Usuário**

> **⛔ BLOQUEIO ABSOLUTO:** NÃO implementar sem aprovação explícita do usuário

**AÇÃO OBRIGATÓRIA:**

1. **Apresentar** plano técnico completo da Etapa 1.6 ao usuário
2. **Aguardar** confirmação explícita (ex: "aprovado", "ok", "pode implementar")
3. **APENAS após aprovação:** Prosseguir para FASE 2

**MARCAR `completed`** SOMENTE quando:
- ✅ Plano apresentado ao usuário
- ✅ Aprovação recebida explicitamente

---

### **FASE 2: Implementação (Após Aprovação)**

> **⛔ NÃO EXECUTAR FASE 2 SEM APROVAÇÃO EXPLÍCITA DO USUÁRIO NA ETAPA 1.7**

**🚨 PRÉ-REQUISITOS OBRIGATÓRIOS PARA INICIAR FASE 2:**

- [ ] ✅ FASE 1 Etapa 1.2 marcada como `completed` (HTMLs analisados 100%)
- [ ] ✅ FASE 1 Etapa 1.3 marcada como `completed` (Snapshots capturados 100%)
- [ ] ✅ FASE 1 Etapa 1.4 marcada como `completed` (Locators mapeados 100%)
- [ ] ✅ FASE 1 Etapa 1.5 marcada como `completed` (Templates consultados se aplicável)
- [ ] ✅ FASE 1 Etapa 1.6 marcada como `completed` (Plano técnico criado 100%)
- [ ] ✅ FASE 1 Etapa 1.7 marcada como `completed` (Aprovação recebida do usuário)

**⛔ SE QUALQUER ITEM = NÃO: BLOQUEIO ATIVO - Voltar à FASE 1 e completar**

**🔴 VIOLAÇÕES COMUNS QUE INDICAM PULO DE ETAPAS:**

- ❌ "Com base nas informações já coletadas, vou implementar..."
- ❌ "Marquei as etapas anteriores como concluídas..."
- ❌ "Devido ao volume extenso, vou criar o código baseado em..."
- ❌ "Vou prosseguir com a implementação usando os dados que tenho..."

**🛑 SE VOCÊ PENSOU EM QUALQUER FRASE ACIMA: PARE - Você pulou etapas da FASE 1**

**Ao receber aprovação do usuário:**

1. **Implementar** conforme plano aprovado (Etapa 1.6)

2. **🚨 GARANTIR ADERÊNCIA 100% AOS TEMPLATES:**
   - **Tests (`*.spec.js`):** Seguir estrutura do Módulo 06
   - **Pages (`*Page.js`):** Seguir estrutura do Módulo 05
   - **APIs (`*Api.js`):** Seguir estrutura do Módulo 08
   - **REGRA:** Manter mesma estrutura, ordem de seções, imports padrão e constantes dos templates

3. **Validar arquivos auxiliares atualizados:**
   - Locators estáticos no constructor (se Page Object)
   - Classes instanciadas em `helpers/index.js`
   - Navegação atualizada em `helpers/navegacao.js` (se aplicável)
   - Usuário em `helpers/ambiente.js` (se aplicável)
   - Coverage atualizado em `coverageFeatureMap.yml`

4. **Executar** `get_errors` e corrigir todos os erros reportados

5. **Confirmar** conclusão com checklist `checklistMergeRequest.md` (100% dos itens)

---

## 📚 **MÓDULOS ESPECIALIZADOS**

| Contexto | Módulo | Quando Ler |
|--------|-----------|-----------|
| **Regras Críticas** | `.github/copilot-modules/01-regras-criticas.md` | **SEMPRE** no início de qualquer implementação |
| **Criar page objects** | `.github/copilot-modules/05-page-objects.md` | Ao criar/atualizar Pages |
| **Criar tests** | `.github/copilot-modules/06-testes-spec.md` | Ao criar arquivos `*.spec.js` |
| **Locators semânticos** | `.github/copilot-modules/03-locators-semanticos.md` | Ao escolher estratégia de locator |
| **Criar API classes** | `.github/copilot-modules/08-api-classes.md` | Ao criar/atualizar APIs |
| **Playwright CLI** | `.github/copilot-modules/02-playwright-cli.md` | Ao executar passo a passo em navegador e gerar snapshots |

---

## 🧪 **TIPOS DE TESTES**

### **Mapeamento por Diretório**

| Padrão | Tipo | Características |
|--------|------|-----------------|
| `tests/*/abreTelas/*.spec.js` | Abre Telas | Validar carregamento, elementos, erros, tradução |
| `tests/*/crud/*.spec.js` | CRUD | Separar Create, Read, Update, Delete |
| `tests/*/jornada/*.spec.js` | Jornada | Fluxo completo ponta-a-ponta |

**Detalhes:** Veja `.github/copilot-modules/06-testes-spec.md`

---

## 📁 **ESTRUTURA DE ARQUIVOS (OBRIGATÓRIO)**

> **🚨 REGRA DE ADERÊNCIA AOS TEMPLATES:**
>
> Ao criar/editar qualquer arquivo:
>
> 1. **Consultar** o módulo correspondente (05, 06 ou 08)
> 2. **Identificar** os elementos estruturais no template (imports, constantes, constructor, métodos exemplo)
> 3. **Replicar** a mesma organização: mesma ordem de seções, mesmos imports base, mesmas constantes padrão
> 4. **Adaptar** o conteúdo ao contexto específico mantendo a estrutura
> 5. **Validar** que seguiu: ordem de imports, constantes de erro, JSDoc, estrutura de métodos

### **Page Objects (`*Page.js`)**

**Template e regras:** `.github/copilot-modules/05-page-objects.md`

**Regras Críticas:**

- ✅ Locators estáticos NO constructor
- ✅ Locators dinâmicos NOS métodos (apenas se dependem de parâmetros)
- ✅ JSDoc obrigatório
- ❌ NUNCA seletores hardcoded nos métodos
- ❌ NUNCA criar locators "para uso futuro"

### **API (`*Api.js`)**

**Template:** `.github/copilot-modules/08-api-classes.md`

**Regras Críticas:**

- ✅ Nomenclatura: verbo HTTP + nome endpoint
- ✅ Headers obrigatórios (Authorization, Content-Type)
- ✅ Validação de response com `validateApiResponse`
- ❌ NUNCA hardcode de tokens/URLs
- ❌ NUNCA criar métodos não utilizados

### **Testes (`*.spec.js`)**

**Template e padrão AAA:** `.github/copilot-modules/06-testes-spec.md`

**Regras Críticas:**

- ✅ Padrão AAA obrigatório (Arrange-Act-Assert)
- ✅ Comentários explícitos em cada fase
- ✅ Tags únicas e annotation obrigatório
- ❌ NUNCA use `test.step()`

---

## **🔗 Instanciação de Classes**

### **`helpers/index.js`**

⚠️ **REGRA DE OURO: NUNCA REMOVA OU MODIFIQUE LINHAS EXISTENTES - APENAS ADICIONE**

**Processo em 5 Passos:**

1. **IMPORTAR** ao final da seção de imports
2. **INSTANCIAR PAGES** ao final do bloco page
3. **INSTANCIAR APIS** ao final do bloco request
4. **USAR** via context: `page.{nomeFuncionalidade}Page.metodo()`
5. **VALIDAR** com `get_errors`

---

## **🗺️ Navegação de Tela**

### **`helpers/navegacao.js`**

**Padrão de Nomenclatura:** `{PRODUTO}_{FUNCIONALIDADE_FINAL}`

**Regras:**

- NUNCA criar constante com valor duplicado
- NUNCA editar/remover constantes existentes
- SEMPRE agrupar por produto
- SEMPRE criar com URL E DIRETORIO

```javascript
export const {PRODUTO}_{FUNCIONALIDADE} = {
  URL: `${BASE_URL}{caminho/url}`,
  DIRETORIO: [{PRODUTO_PRINCIPAL}, {SUBMENU}, '{Funcionalidade Final}'],
};
```

---

## **📊 Mapeamento de Cobertura**

### **`coverageFeatureMap.yml`**

**Regras:**

- ✅ OBRIGATÓRIO atualizar após criar/modificar testes
- ✅ APENAS ADICIONAR, nunca alterar/remover
- ❌ PROIBIDO remover funcionalidades mapeadas

**Estrutura:**

```yml
- page: "{Caminho/Do/Menu}"
  features:
    nome da funcionalidade 1: true
    nome da funcionalidade 2: true
```

---

## ✅ **Checklist de Merge Request**

> **🚨 REGRA CRÍTICA:** Antes de finalizar qualquer implementação, TODOS os itens do arquivo `checklistMergeRequest.md` devem ser validados e atendidos.

**Consulte o arquivo completo:** `checklistMergeRequest.md`

**🔍 Validação Final:**

- [ ] Todos os itens do checklist verificados
- [ ] ESLint sem erros

---

## 🚫 **Anti-Padrões**

### **❌ NUNCA**

- Criar locators estáticos fora do constructor
- Usar locators inline sem parâmetro
- Instanciar Page Objects diretamente nos testes
- Criar localizadores não utilizados
- **Esquecer de validar presença de `<iframe>` no HTML** (grep_search obrigatório)
- **Usar `this.page` quando HTML tem iframe** (deve usar `this.frame`)
- **Criar `this.frame` quando HTML NÃO tem iframe** (usar apenas `this.page`)
- Hardcode de URLs/valores
- Usar `test.step()`
- **Usar `{ timeout: X }` em expect ou ações** (usa timeout padrão 30s do playwright.config.js)
- **Criar imports sem validar caminhos com grep_search**
- **Construir JSON inline no `.spec.js`** (ex: `dadosFiltro = { ... }`)
- **Método `acessarTela()` receber parâmetro**

### **✅ SEMPRE**

- **Executar `grep_search(query="<iframe")` no HTML ANTES de criar Page Object**
- **Configurar constructor conforme presença de iframe** (this.frame OU this.page)
- Criar TODOS os locators estáticos no constructor
- Validar se locators criados nos métodos são realmente dinâmicos
- Usar objetos via contexto (`page.{funcionalidade}Page`)
- Atualizar `coverageFeatureMap.yml`
- Executar ESLint antes de finalizar
- Seguir padrão AAA nos testes
- **Usar timeout padrão do Playwright (30s)** - NUNCA customizar
- **Validar TODOS os imports com grep_search** antes de criar
- **Importar constante de navegação de `helpers/navegacao.js`** no método `acessarTela()`
  - Se variável tem `.URL`: usar `page.goto(VARIAVEL.URL)`
  - Se variável tem `.DIRETORIO`: usar `dataUtils.navegarParaPagina(...VARIAVEL.DIRETORIO)`
- **TODOS os JSONs importados de `data/`**, NUNCA construídos inline
- **Para S-Lookup:** Buscar ID do `<input>` DENTRO do `<s-lookup>`

---

## 🔧 **Integração com ESLint**

**Comando antes de finalizar:**

```bash
npm run eslint-fix
```

---

## 🔍 **Checklist de Completude**

### **📋 Validação de Arquivos e Código**

| Categoria | Validação |
|-----------|-----------|
| **Arquivos** | Todos criados (JSON, API, Page, Spec) |
| **Imports** | Caminhos corretos, sem erros (`get_errors`) |
| **Instanciação** | helpers/index.js atualizado |
| **Qualidade** | ESLint sem violações, JSDoc completo |
| **Cobertura** | coverageFeatureMap.yml atualizado |
| **Navegação** | helpers/navegacao.js atualizado |

### **🚫 Bloqueadores**

> Implementação NÃO finalizada se:
>
> - Falta arquivo especificado
> - Erros de import existem
> - Locators/métodos órfãos presentes
> - ESLint reporta violações
> - Checklist `checklistMergeRequest.md` não 100% validado

---

## 📚 **RESUMO DE MÓDULOS DISPONÍVEIS**

| Módulo | Arquivo | Conteúdo |
|--------|---------|----------|
| **Regras Críticas** | `.github/copilot-modules/01-regras-criticas.md` | Regras fundamentais + processo 2 fases |
| **Page Objects** | `.github/copilot-modules/05-page-objects.md` | Templates + regras + exemplos de métodos |
| **Testes Spec** | `.github/copilot-modules/06-testes-spec.md` | Padrão AAA + estrutura completa + tags |
| **Locators Semânticos** | `.github/copilot-modules/03-locators-semanticos.md` | Ordem de prioridade + estratégias |
| **API Classes** | `.github/copilot-modules/08-api-classes.md` | Templates + nomenclatura + validações |
| **Playwright CLI** | `.github/copilot-modules/02-playwright-cli.md` | Execução headless passo a passo + snapshots + geração de artefatos de teste |

---

## 🚨 **INSTRUÇÕES DE USO PARA A IA**

### **Quando receber uma solicitação:**

1. **LER SEMPRE:** `.github/copilot-modules/01-regras-criticas.md`
2. **🚨 CRIAR TODO LIST OBRIGATÓRIO:** SEMPRE executar as 6 etapas usando `manage_todo_list`
   - **Etapa 1.2:** Analisar HTMLs (marcar `in-progress` → executar → marcar `completed`)
   - **Etapa 1.3:** Executar Playwright CLI + snapshots (marcar `in-progress` → executar → marcar `completed`)
   - **Etapa 1.4:** Mapear Locators Finais (marcar `in-progress` → executar → marcar `completed`)
   - **Etapa 1.5:** Consultar Templates (marcar `in-progress` → executar → marcar `completed`)
   - **Etapa 1.6:** Criar Plano Técnico (marcar `in-progress` → executar → marcar `completed`)
   - **Etapa 1.7:** Solicitar Aprovação (marcar `in-progress` → executar → marcar `completed`)
   - **⛔ PROIBIDO:** Pular etapas, executar fora de ordem, ou não usar `manage_todo_list`
3. **LER MÓDULOS RELEVANTES** conforme gatilhos de bloqueio (FASE 0, Etapa 0.2)
4. **EXECUTAR ANÁLISE COMPLETA** (Etapas 1.2-1.7) antes de solicitar aprovação
5. **SOLICITAR APROVAÇÃO** do plano técnico (Etapa 1.7)
6. **IMPLEMENTAR** após aprovação (FASE 2)
7. **GARANTIR ADERÊNCIA AOS TEMPLATES:**
   - Consultar template no módulo correspondente (05, 06 ou 08)
   - Manter mesma estrutura de seções (imports, constantes, constructor, métodos)
   - Preservar ordem dos elementos estruturais
   - Usar mesmos padrões de nomenclatura e organização
   - Adaptar exemplos ao contexto específico mantendo a estrutura
8. **VALIDAR** com checklist e ESLint

### **Prioridade de Informação:**

1. Playwright Best Practices (docs oficiais) - **SEMPRE CONSULTAR PRIMEIRO**
2. Princípios Fundamentais (módulo 00) - **SEMPRE ANTES DE QUALQUER ANÁLISE**
3. Regras Críticas (módulo 01) - **SEMPRE APLICÁVEL**
4. Módulo específico do contexto (02-08) - **CONFORME NECESSIDADE**
5. Checklist de Merge Request - **ANTES DE FINALIZAR**

---

> **💡 Esta estrutura modular garante que TODAS as informações sejam respeitadas sem sobrecarregar o contexto da IA.**
>
> **🎯 A IA deve ler APENAS os módulos necessários para o contexto atual, mantendo consistência e completude.**
