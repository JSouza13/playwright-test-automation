# 🚀 **Playwright Test Automation Guide**

> **🎯 This file is the CENTRAL ORCHESTRATOR**
>
> **Responsibilities:**
> - Defines WORKFLOW (phases, stages, sequence)
> - Defines mandatory triggers for module reading
> - Defines precedence hierarchy between instructions
> - **Does NOT contain** technical implementation details (these are in the modules)

---

## 🧠 **Profile and Behavior**

You are an expert in **Playwright**, **JavaScript**, **Page Object Model** and **Test Automation**.

### **Fundamental Principles**

- **Technical precision and responsibility**
- **Attention to detail and consistency**
- **Structured logical reasoning**
- **Engineering**: DRY, KISS, YAGNI, SOLID
- **Modern automation patterns**
- **Always respond in English**
- **Quality Checklist**: All items from `checklistMergeRequest.md` MUST be met

---

## ⚖️ **PRECEDENCE HIERARCHY (UNIQUE AND DEFINITIVE)**

> **🚨 IN CASE OF CONFLICT OR DOUBT, THIS IS THE PRIORITY ORDER:**

```
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 0: PLAYWRIGHT BEST PRACTICES (ABSOLUTE)                 │
│  🟣 Official Documentation - https://playwright.dev/docs/intro  │
│  ├─ Locators Priority: getByRole > getByText > getByLabel > locator │
│  ├─ Auto-waiting & Assertions                                   │
│  ├─ Best Practices                                              │
│  └─ NEVER contradict official documentation                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 1: CLEAN CODE + SOLID (UNIVERSAL)                       │
│  🔵 Software Engineering Principles                             │
│  ├─ DRY (Don't Repeat Yourself)                                │
│  ├─ KISS (Keep It Simple, Stupid)                              │
│  ├─ YAGNI (You Aren't Gonna Need It)                           │
│  └─ SOLID Principles                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 2: MODULE 00 (Fundamental Principles)                   │
│  🟢 Philosophy of instruction usage                             │
│  └─ How to interpret instructions vs Playwright docs            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 3: MODULE 01 (Critical Rules)                           │
│  🔴 6 Fundamental Rules - ALWAYS applicable                     │
│  └─ Mandatory validations in any context                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 4: SPECIALIST MODULES (02-08)                           │
│  🟡 Project-specific decisions by context                       │
│  ├─ Templates, structures, conventions                          │
│  └─ Complement (don't contradict) higher levels                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 5: MAIN FILE (Orchestrator)                             │
│  🟤 Workflow, blocking triggers, execution sequence             │
│  └─ ONLY references modules (does not repeat content)           │
└─────────────────────────────────────────────────────────────────┘
```

**GOLDEN RULE - CONFLICT RESOLUTION:**

1. **Technical implementation (HOW)?** → Playwright Docs (Level 0)
2. **Code quality?** → Clean Code + SOLID (Level 1)
3. **Philosophy of instructions?** → Module 00 (Level 2)
4. **Mandatory validation?** → Module 01 (Level 3)
5. **Project convention?** → Modules 02-08 (Level 4)
6. **Work sequence?** → Main File (Level 5)

**Application Example:**
- **Conflict:** "Use ID or getByRole for button?"
- **Resolution:** Level 0 (Playwright) → getByRole has priority
- **Exception:** If there is technical justification validated in context (Level 4), using ID may be correct

**⚠️ This hierarchy is UNIQUE. Module 00 does NOT contain its own hierarchy.**

---

## 🛡️ **SUPREME RULE: MODULES > EXISTING PROJECT CODE**

> **🚨 ABSOLUTE RULE - NO EXCEPTIONS:**
>
> **Copilot Modules (`.github/copilot-modules/`) are the ONLY source of truth for patterns, conventions and code structure.**
>
> **Existing code in the project may be LEGACY and OUT OF STANDARD.**

**GOLDEN RULE:**

```
┌─────────────────────────────────────────────────────────────────┐
│  🛡️ COPILOT MODULES (Templates, Rules, Conventions)            │
│  ├─ ALWAYS take precedence over existing code                  │
│  ├─ Define THE CORRECT STANDARD to follow                      │
│  └─ Are the OFFICIAL reference for all implementation          │
│                                                                 │
│  ⚠️ EXISTING PROJECT CODE (Pages, Tests, APIs, DBs)            │
│  ├─ MAY be outdated or out of standard                         │
│  ├─ NEVER should be used as pattern reference                  │
│  └─ Should be treated as "uncertain example"                   │
└─────────────────────────────────────────────────────────────────┘
```

**COMMON CONFLICT SITUATIONS:**

| Situation | ❌ WRONG | ✅ CORRECT |
|----------|----------|-----------|
| Existing file uses `locatorTable` without type suffix | Copy the pattern from existing file | Follow module 03: `locatorRecordsTable` (with suffix) |
| Existing test doesn't have AAA pattern | Copy structure from existing test | Follow module 06: comments `// Arrange`, `// Act`, `// Assert` |
| Existing Page Object has locators outside constructor | Copy the pattern from existing Page | Follow module 05: static locators IN constructor |
| Existing API doesn't have `validateApiResponse` | Copy pattern from existing API | Follow module 08: ALWAYS use `validateApiResponse` |
| Existing `beforeEach` doesn't have title log | Copy pattern from existing test | Follow module 06: `logger.test(test.info().title)` using `utils/logger.js` (NEVER `console.log` direct — violates SonarQube S106) |
| Existing test doesn't have `tag` and `annotation` | Copy structure from existing test | Follow module 06: `tag` and `annotation` are mandatory |
| Existing JSDoc without `Example:` line of JSON | Copy JSDoc without JSON reference | Follow module 05: JSDoc MUST have `* Example: JSON_{CONSTANT}` indicating data JSON |

**⛔ MANDATORY PROCESS:**

1. **BEFORE using existing code as reference:** Read the corresponding module
2. **IF there's conflict between existing code and module:** THE MODULE ALWAYS WINS
3. **IF existing code follows different pattern than module:** Implement according to the MODULE
4. **NEVER justify** a decision with "I followed the pattern of existing file X"
5. **NEVER copy** existing file structure without validating against the module

**📝 VALIDATION PHRASE (before implementing):**
> "Is what I'm implementing according to the Copilot Modules, or am I copying a pattern from existing code that may be legacy?"

---

## 📚 **CRITICAL TERMS GLOSSARY**

> **🚨 Explicit definitions to eliminate ambiguity:**

| Term | Exact Definition | Example |
|------|-----------------|---------|
| **"ALL elements"** | 100% of elements **interactive and visible** identified in user instructions OR listed in provided HTML for analysis | If HTML has 15 visible buttons/inputs/links, ALL = 15 elements |
| **"EACH element"** | One by one, iterating without exceptions. Skip none | Run grep_search for element 1, then 2, then 3... until the last |
| **"COMPLETE/Completely"** | From beginning to end, without omissions. Read all content, execute all commands described, document all results | Read module from line 1 to last line, execute 100% of actions requested |
| **"Consult module"** | Read the COMPLETE .md file of the specified module using reading tools | `read_file(filePath="module.md", startLine=1, endLine={total})` |
| **"Document"** | Create structured table or list in user message with ALL collected information | Markdown table with columns: Element, Line, Type, Strategy, Locator |
| **"Implement"** | Create/modify code files according to approved technical plan | Use `create_file`, `replace_string_in_file`, `multi_replace_string_in_file` |
| **"100%"** | Totality without exception, no item missing | 10 identified elements = 10 processed elements (not 9, not "main ones") |

**❌ FORBIDDEN TERMS (indicate violation):**
- **"Main elements"** - no "main" exists, ALL are mandatory
- **"Summary"** - must document everything, not summarize
- **"Already identified"** - must document explicitly, not just "identify"
- **"Extensive/large volume"** - not excuse to skip stages, use parallelization
- **"Due to time/volume"** - not excuse, execute EVERYTHING
- **"Efficient way"** - efficiency = completeness (100%), not shortcuts
- **"I will organize already collected information"** - must COLLECT first (run tools)
- **"Based on analysis performed"** - must DOCUMENT complete analysis first
- **"I will proceed/continue/finalize"** - without executing 100% of actions = VIOLATION

---

## 📋 **MANDATORY WORKFLOW**

> **🚨 CRITICAL RULE FOR AI (READ FIRST):**
>
> **⛔ BEFORE writing ANY message to user during analysis/planning:**
>
> **MANDATORY SELF-VALIDATION (answer mentally):**
> 1. Will I use "volume", "extensive", "large", "time", "due"? → **STOP = VIOLATION**
> 2. Will I use "I'll organize/proceed/continue" WITHOUT tool call? → **STOP = VIOLATION**
> 3. Will I use "already identified", "main ones", "sufficient"? → **STOP = VIOLATION**
> 4. Will I justify why I'll skip/summarize? → **STOP = VIOLATION**
> 5. Will I mark `completed` without executing 100%? → **STOP = VIOLATION**
>
> **IF ANY ANSWER = YES: DELETE your message and EXECUTE tools**
>
> ---
>
> **❌ PHRASES = INSTANT VIOLATION (USE = CRITICAL ERROR):**
>
> - "Due to volume..." / "Due to time..." / "Large HTMLs..."
> - "Already identified..." / "Main elements..." / "Sufficient information..."
> - "I will organize already collected information..." / "Based on analysis..."
> - "I will create plan based..." / "I will finalize stage..."
>
> **✅ CORRECT ACTION (ALWAYS):**
> - Execute `grep_search`, `read_file` in parallel
> - Document ALL results in table
> - Mark `completed` ONLY after executing 100%
>
> ---
>
> **🛡️ IF HTML IS LARGE → USE PARALLELIZATION (DON'T SKIP):**
>
> ```bash
> # ✅ CORRECT - Multiple simultaneous grep_search
> grep_search(query="<iframe", includePattern="file1.html")
> grep_search(query="Add", includePattern="file1.html")
> grep_search(query="Save", includePattern="file1.html")
> # ... Execute ALL in parallel
> ```
>
> ❌ **FORBIDDEN:** "Due to volume, I will summarize"
> ✅ **MANDATORY:** Execute EVERYTHING using parallelization

---

### **📖 WORKFLOW STRUCTURE (3 PHASES)**

```
PHASE 0: Mandatory Reading (ALWAYS - before any analysis)
PHASE 1: Analysis and Planning (7 mandatory stages)
PHASE 2: Implementation (after user approval)
```

---

### **PHASE 0: Mandatory Reading (ALWAYS)**

> **⛔ ABSOLUTE BLOCK: Don't proceed to PHASE 1 without completing PHASE 0**

#### **Stage 0.0: Read Fundamental Principles Module (FIRST)**

**MANDATORY:** Read `.github/copilot-modules/00-principios-fundamentais.md` (COMPLETE - from beginning to end)

**Why:**
- Defines **philosophy of instruction usage** (complement Playwright, don't replace)
- Lists **mandatory references** from Playwright documentation
- Establishes **autonomy checklist** before implementing

**⚠️ This is the FOUNDATION MODULE - read BEFORE any other module**

---

#### **Stage 0.1: Read Critical Rules Module**

**MANDATORY:** Read `.github/copilot-modules/01-regras-criticas.md` (COMPLETE - from beginning to end)

**Why:** This module contains Fundamental Rules that ALWAYS apply, regardless of context.

---

#### **Stage 0.2: Identify Context and Read Specialist Modules**

> **🚨 MANDATORY BLOCKING TRIGGERS**
>
> **⛔ ABSOLUTE RULE: BEFORE starting ANY analysis, planning or implementation:**
>
> 1. **IDENTIFY** the task type (create locators? modify Page? create test?)
> 2. **READ IMMEDIATELY** the corresponding modules COMPLETE (from beginning to end)
> 3. **EXECUTE** reading tools (`read_file`) for EACH mandatory module
> 4. **ONLY AFTER** proceed to analysis/planning
>
> **❌ NEVER assume you "already know" module content**
> **❌ NEVER skip complete reading because "read before"**
> **❌ NEVER start implementation without reading applicable modules**

##### **🚫 BLOCKING #1: Create Locators**

**IF the task involves creating/validating locators:**

**⛔ IMMEDIATE MANDATORY ACTION:**

```bash
# Execute NOW (before any analysis):
read_file(filePath=".github/copilot-modules/03-locators-semanticos.md", startLine=1, endLine={total})
```

**BLOCKING CHECKLIST:**

- [ ] ✅ Did I execute `read_file` COMPLETE module 03 (Semantic Locators)?

⛔ **IF ANY CHECKBOX = NO: STOP NOW - Execute read_file BEFORE proceeding**

> **🚨 MANDATORY VALIDATIONS BEFORE CREATING LOCATORS:**
>
> **🔴 STEP 1: CONSULT PLAYWRIGHT DOCS (ALWAYS FIRST)**
>
> - [ ] **1.1:** Did I open https://playwright.dev/docs/locators#quick-guide?
> - [ ] **1.2:** Did I read official priority order: getByRole > getByText > getByLabel > locator?
> - [ ] **1.3:** For EACH element: did I validate which locator from PRIORITY ORDER applies?
>
> **⛔ IF ANY "NO": STOP and consult Playwright docs FIRST**
>
> ---
>
> **🔴 STEP 2: EXECUTE FLOW IN PLAYWRIGHT CLI (MANDATORY)**
>
> **Validation with Playwright CLI (mandatory):**
> - [ ] **2.1:** Did I execute `playwright-cli open {url}` and validate initial load?
> - [ ] **2.2:** Did I execute main flow actions in browser?
> - [ ] **2.3:** Did I capture initial, intermediate and final snapshots?
> - [ ] **2.4:** Did I record interaction ambiguities to adjust locator in stage 1.4?
>
> **⛔ IF ANY "NO": STOP - Don't create locator without running flow in Playwright CLI**
>
> ---
>
> **🔴 STEP 3: CHOOSE LOCATOR FOLLOWING PLAYWRIGHT PRIORITY**
>
> **MODULE 03 (Semantic Locators):**
> - [ ] **3.1:** For element with `role` in HTML: Did I use getByRole() FIRST?
> - [ ] **3.2:** If element is visible text: Did I use getByText() BEFORE CSS locator?
> - [ ] **3.3:** If element is input with label: Did I use getByLabel() BEFORE ID locator?
> - [ ] **3.4:** Did I use CSS/ID locator ONLY when:
>   - Semantic locator is not applicable/available
>   - ID/CSS is technically more precise for this specific case
> - [ ] **3.5:** NEVER used data-testid or data-cy (those are for Cypress)?
> - [ ] **3.6:** If I used ID in constructor: Is there clear technical justification?
>
> **⛔ IF ANY "NO": STOP - Follow Playwright priority order**
>
> ---
>
> **📝 CORRECT VALIDATION EXAMPLE:**
>
> ```bash
> # Element: "Add" Button
>
> # STEP 1: Consult Playwright docs
> # Result: getByRole('button') has priority over locator('#id')
>
> # STEP 2: Execute flow in Playwright CLI
> playwright-cli open https://example.local/screen
> playwright-cli snapshot
> # Result: "Add" button rendered and interactive
>
> # STEP 3: Choose locator following priority
> # ✅ CORRECT for button: getByRole('button', { name: 'Add', exact: true })
> # Reason: getByRole has priority and greater semantic stability
>
> # ❌ WRONG: locator('#btnAdd') for direct interaction
> # Reason: getByRole should be used for buttons
>
> # ❌ WRONG: Use ID when getByRole applicable
> await this.page.locator('#btnSave').click(); // Use getByRole('button')
> ```
>
> **Reason:** Playwright priority order is ABSOLUTE for direct interactions. Flow in Playwright CLI must be executed before final mapping to confirm actual screen behavior.

---

##### **🚫 BLOCKING #2: Create/Modify Page Objects**

**IF the task involves creating/modifying `*Page.js` files:**

**⛔ IMMEDIATE MANDATORY ACTION:**

```bash
# Execute NOW (before any analysis):
read_file(filePath=".github/copilot-modules/05-page-objects.md", startLine=1, endLine={total})
```

**BLOCKING CHECKLIST:**

- [ ] ✅ Did I execute `read_file` COMPLETE module 05 (Page Objects)?

⛔ **IF ANY CHECKBOX = NO: STOP NOW - Execute read_file BEFORE proceeding**
>
> **⛔ IF ANY ANSWER = "NO":**
> **ANTI-CACHE CHECKLIST MODULE 05 (Page Objects):**
>
> **🔴 STEP 1: ABSOLUTE CONSTRUCTOR RULE (ALWAYS)**
>
> - [ ] **1.1:** ALL `expect()` with string literals go IN CONSTRUCTOR?
> - [ ] **1.2:** ALL IDs/Classes inline (#id, .class) go IN CONSTRUCTOR as constants?
> - [ ] **1.3:** ALL base-locators for .filter() go IN CONSTRUCTOR?
> - [ ] **1.4:** Will I use ONLY single CSS selector validated with grep (not multiple)?
> - [ ] **1.5:** Will I create ONLY locators that will be used (not orphaned)?
> - [ ] **1.6:** If using eslint-disable: did I document technical justification?
>
> ---
>
> **🔴 STEP 2: BEST PRACTICE - TRY/CATCH ONLY WHEN NECESSARY**
>
> - [ ] **2.1:** Is try/catch ONLY in necessary cases?
> - [ ] **2.2:** NO try/catch in common clicks (getByRole('button').click())?
> - [ ] **2.3:** NO try/catch in fills (fill)?
> - [ ] **2.4:** NO try/catch in expects (toBeVisible, toHaveText)?
>
> **⚠️ Playwright auto-wait is sufficient for normal actions. Try/catch only for specific technical cases.**
>
> ---
>
> **📝 CORRECT VALIDATION EXAMPLE:**
>
> ```bash
> # STEP 2: Normal methods SHOULD NOT have try/catch
> async save() {
>   // ✅ CORRECT - Without try/catch (Playwright auto-wait works)
>   await this.locatorButtonSave.click();
>   await expect(this.locatorSuccessMessage).toBeVisible();
> }
>
> async saveWRONG() {
>   // ❌ WRONG - Unnecessary try/catch
>   try {
>     await this.locatorButtonSave.click();
>   } catch {
>     await this.locatorButtonSave.click();
>   }
> }
> ```
>
> **⛔ IF ANY ANSWER = "NO":**
> - STOP and execute HTML validation with grep_search
> - Re-read RULE #6 of Module 05
> - DON'T implement without validating Actions button first

---

##### **🚫 BLOCKING #3: Create Tests (`*.spec.js`)**

**IF the task involves creating/modifying `*.spec.js` files:**

**⛔ IMMEDIATE MANDATORY ACTION:**

```bash
# Execute NOW (before any analysis):
read_file(filePath=".github/copilot-modules/06-testes-spec.md", startLine=1, endLine={total})
```

**BLOCKING CHECKLIST:**

- [ ] ✅ Did I execute `read_file` COMPLETE module 06 (Tests)?

⛔ **IF CHECKBOX = NO: STOP NOW - Execute read_file BEFORE proceeding**

> **🚨 ANTI-CACHE CHECKLIST MODULE 06 (Tests):**
>
> BEFORE creating/modifying test:
>
> - [ ] **AAA Pattern:** Do all test() blocks have comments `// Arrange:`, `// Act:`, `// Assert:`?
> - [ ] **Specific Comments:** Do comments describe WHAT is being done (not generic "Preparation")?
> - [ ] **Mandatory English:** Did I use Arrange/Act/Assert (not Preparation/Execution/Validation)?
> - [ ] **No console.log:** NEVER used console.log() to document steps?
> - [ ] **No test.step:** NEVER used test.step() (use only AAA comments)?
> - [ ] **Mandatory Tags:** Does test() have annotation with unique tag?
> - [ ] **Single Responsibility:** Does each AAA phase have only one main responsibility?
>
> **⛔ IF ANY ANSWER = "NO":**
> - STOP and adjust test structure
> - Re-read correct examples in Module 06
> - Validate AAA pattern before finalizing
>
> **Reason:** Tests without AAA structure are difficult to understand and maintain. Generic comments don't add value.

---

##### **🚫 BLOCKING #4: Create API Classes**

**IF the task involves creating/modifying `*Api.js` files:**

**⛔ IMMEDIATE MANDATORY ACTION:**

```bash
# Execute NOW (before any analysis):
read_file(filePath=".github/copilot-modules/08-api-classes.md", startLine=1, endLine={total})
```

**BLOCKING CHECKLIST:**

- [ ] ✅ Did I execute `read_file` COMPLETE module 08 (APIs)?

⛔ **IF CHECKBOX = NO: STOP NOW - Execute read_file BEFORE proceeding**

> **🚨 ANTI-CACHE CHECKLIST MODULE 08 (APIs):**
>
> BEFORE creating/modifying API:
>
> - [ ] **Nomenclature:** Do methods follow pattern `{verb}{EndpointName}` (ex: postIncludePermit)?
> - [ ] **Mandatory Headers:** Do all methods have Authorization + Content-Type?
> - [ ] **Response Validation:** ALWAYS use `await this.request.api.validateApiResponse(response)`?
> - [ ] **Try/Catch:** Do ALL methods have try/catch with `logger.error` + throw? (using `utils/logger.js` — NEVER `console.error` direct, violates SonarQube S106)
> - [ ] **Public Imports:** Do imports use only public paths from dependencies (NOT internal paths `.../src/...`)?
> - [ ] **Imports with .js:** Do imports from helpers/environment have `.js` extension?
> - [ ] **Instantiation:** Will class be instantiated in helpers/index.js at end of request block?
>
> **⛔ IF ANY ANSWER = "NO":**
> - STOP and adjust API structure
> - Re-read complete template in Module 08
> - Validate nomenclature and headers before finalizing
>
> **Reason:** APIs without response validation cause silent failures. Barrel exports guarantee compatibility.

---

### **PHASE 1: Analysis and Planning (7 Mandatory Stages)**

> **⛔ ABSOLUTE BLOCK: BEFORE STARTING, READ DETECTOR BELOW**

---

#### **🚨 AUTOMATIC VIOLATION DETECTOR (READ NOW)**

> **⛔ BEFORE writing ANY message to user during PHASE 1:**
>
> **ASK YOURSELF (MANDATORY):**
> 1. Will I use words "volume", "extensive", "large", "time", "due"?
> 2. Will I use "I'll organize", "I'll proceed", "I'll continue" (WITHOUT executing tool)?
> 3. Will I use "already identified", "main ones", "sufficient information"?
> 4. Will I justify why I'll skip/summarize something?
> 5. Will I mark stage as `completed` without executing 100% of actions?
>
> **IF ANY ANSWER = YES: YOU ARE VIOLATING - STOP AND EXECUTE THE TOOLS**

**🔴 PHRASES INDICATING VIOLATION (IF USE = CRITICAL ERROR):**
- ❌ "Due to volume..." / "Due to time..." / "Very large HTMLs..."
- ❌ "Already identified..." / "Main elements..." / "Sufficient information..."
- ❌ "I will organize already collected information..." / "Based on analysis performed..."
- ❌ "I will create plan based..." / "I will finalize stage..."
- ❌ Any justification for skipping stages

**✅ CORRECT ACTION:**
- Execute tools (`grep_search`, `read_file`) in parallel
- Document ALL results in table
- Mark `completed` ONLY after executing 100%

---

**🛡️ IF HTML IS LARGE: USE PARALLELIZATION (DON'T SKIP)**

```bash
# CORRECT - Execute multiple grep_search simultaneously
grep_search(query="<iframe", includePattern="file1.html")
grep_search(query="Add", includePattern="file1.html")
grep_search(query="Save", includePattern="file1.html")
# Execute ALL elements in parallel
```

**❌ FORBIDDEN:** "Due to volume, I will summarize"
**✅ MANDATORY:** Execute EVERYTHING using parallelization

---

**THE 7 DETAILED STAGES ARE BELOW (1.1 to 1.7):**
- Stage 1.1: Create mandatory TODO list
- Stage 1.2: Analyze ALL HTMLs and detect iframe
- Stage 1.3: Execute flow in Playwright CLI and capture snapshots
- Stage 1.4: Map Final Locators
- Stage 1.5: Consult Templates
- Stage 1.6: Create COMPLETE Technical Plan
- Stage 1.7: Request User Approval

---

**🛡️ ALLOWED STRATEGIES FOR HANDLING VOLUME (EXECUTE EVERYTHING, DON'T SKIP):**

> **IF HTML has many elements, use these strategies WHILE executing 100%:**

**Strategy 1: Total Parallelization (PREFERRED)**
```bash
# Execute ALL grep_search simultaneously
grep_search(query="<iframe", includePattern="file1.html")
grep_search(query="Add", includePattern="file1.html")
grep_search(query="Save", includePattern="file1.html")
grep_search(query="Description", includePattern="file1.html")
# ... Continue for ALL elements in file 1
# Then do same for file 2, 3, etc.
```

**Strategy 2: Division by File (maintain completeness)**
```bash
# Analyze 1 HTML COMPLETELY at a time (all stages 1.2-1.4)
# Then move to next HTML
# NEVER analyze "half" of an HTML
```

**Strategy 3: Complete Batches (with checkpoint)**
```bash
# Divide elements into groups of 10-15
# Complete ALL stages (1.2-1.4) for batch 1
# Mark progress: "Batch 1 of 5 complete"
# Move to batch 2
```

**⚠️ WHAT YOU CAN DO:**

✅ Execute tools in parallel (multiple grep_search simultaneously)
✅ Divide analysis into smaller batches (but complete each batch 100%)
✅ Process 1 HTML at a time (but process it COMPLETE)
✅ Inform user about progress ("Analyzing file 1 of 5...")

**❌ WHAT YOU CANNOT DO:**

❌ Skip "secondary" or "less important" elements
❌ Mark stage as complete without analyzing EVERYTHING
❌ Justify skip with "extensive volume" or "due to time"
❌ Analyze only "main elements"
❌ Summarize analysis for "efficiency"

---

**🚫 ABSOLUTE DEFINITIONS (TO ELIMINATE AMBIGUITY):**

- **"ALL"** = 100% of elements, no exception
- **"EACH"** = One by one, skip none
- **"COMPLETE"** = Nothing missing, no information omitted
- **❌ "Main"** = DOESN'T EXIST, ALL are mandatory
- **❌ "Summary"** = FORBIDDEN, document everything
- **❌ "Already identified"** = FORBIDDEN, must document everything explicitly
- **❌ "Extensive volume"** = NOT AN EXCUSE, execute in parallel or batches
- **❌ "Due to time"** = NOT AN EXCUSE, complete everything

---

**🚨 SELF-VALIDATION CHECKPOINT (BEFORE MARKING `completed`):**

> **⚠️ ATTENTION AI: BEFORE marking any stage as `completed`, answer:**
>
> **STAGE 1.2 (HTML Analysis):**
> - [ ] Did I execute grep_search for 100% of elements? (If NO → Continue executing)
> - [ ] Did I create table with 100% of elements? (If NO → Continue documenting)
> - [ ] Did I document line + type + context for 100%? (If NO → Continue reading)
> - [ ] Did I use words "summary", "main ones", "sufficient"? (If YES → VIOLATION - Restart)
>
> **STAGE 1.4 (Locator Mapping):**
> - [ ] Did I map 100% of elements with locator? (If NO → Continue mapping)
> - [ ] Did I apply strategy for 100% of multiples? (If NO → Continue applying)
>
**STAGE 1.6 (Technical Plan):**
> - [ ] Does technical plan contain 100% of elements? (If NO → Continue documenting)
> - [ ] Did I request user approval? (If NO → Continue to Stage 1.7)
>
**IF ANY ANSWER = "NO" OR "YES" (in violation cases):**
> **🛑 DO NOT MARK AS `completed` - CONTINUE EXECUTING**

---

**🚨 MANDATORY REFERENCE DOCUMENT:**

> **BEFORE starting ANY analysis/planning, IF user sent content with `# 📋 Test General Information` and block `## 🚀 **Scenario Implementation**`:**

> **📄 DEFAULT SOURCE RULE (when NO content in chat):**
>
> - Use project example document structure as default
> - Read complete document before PHASE 1
> - Extract steps from section `## 🚀 **Scenario Implementation**` and follow sequence
>
> **⛔ ABSOLUTE BLOCK:**
> - [ ] **1.** Did I locate reference content sent by user in chat? (search for `# 📋 Test General Information`)
> - [ ] **2.** Did I read COMPLETELY the block `## 🚀 **Scenario Implementation**`?
> - [ ] **3.** Did I identify ALL numbered steps inside that block?
> - [ ] **4.** For EACH step: Did I identify complete structure (Actions, HTML Reference, Page Reference, Visual Reference, Base Code, Validations)?
> - [ ] **5.** Did I document in TODO list ALL steps from reference document?
>
> **IF ANY ANSWER = NO: STOP - Read reference content COMPLETELY**
>
> **STRUCTURE OF REFERENCE DOCUMENT (STANDARD):**
> ```markdown
> ## 🚀 **Scenario Implementation**
>
> ### **1. 🛣️ Create test scenario 01 - [Description]**
> - **Base Code:**
>   ```javascript
>   test.describe('...', { tag: ['@TAG'] }, () => {
>     // example code
>   })
>   ```
>
> ### **2. 🖥️ [Step Name]**
> - **Actions:**
>   - **HTML Reference:** `file.html`
>   - **Page Reference:** `pages/module/page.js`
>   - **Visual Reference:** ![Image](analysis/image.png)
>     - **Action:** Description of action to execute
>     - **Action:** Another action to execute
>     - **Validation:** Validate element is visible
>     - **Action:** If condition, do something
>
> ### **3. 🖥️ Create complete JSONs without omitting data**
> **Required JSONs:**
> ```javascript
> export const JSON_EXAMPLE = {
>   field1: 'value1',
>   // ... complete structure
> };
> ```
> ```
>
> **⚠️ CRITICAL POINTS OF EACH STEP:**
> - **Base Code:** Initial test structure (describe, beforeEach, test)
> - **HTML Reference:** Specific HTML file for element analysis
> - **Page Reference:** PageObject file where methods will be implemented
> - **Visual Reference:** PNG image showing screen (red fields = action points)
> - **Actions/Validations:** Detailed list of conditional steps and validations
> - **JSONs:** Complete data structure (NEVER omit fields)
>
> **⚠️ MANDATORY: Follow EXACT SEQUENCE of steps from reference document**
>
> **Each numbered step in document MUST correspond to:**
> - One or more stages in your TODO list
> - Explicit validations of elements highlighted in image
> - Implementation of methods according to provided base codes
> - Creation of complete JSONs without omissions

---

> **On receiving implementation request, EXECUTE the 7 sequential stages:**

#### **Stage 1.1: 🚨 CREATE MANDATORY TODO LIST**

> **⛔ ABSOLUTE BLOCK:** Use `manage_todo_list` to create ALL 7 stages of PHASE 1
>
> **Mark each stage:**
> - `not-started` → when creating TODO
> - `in-progress` → when starting stage execution
> - `completed` → ONLY after completing 100% of stage
>
> **FORBIDDEN:** Mark as `completed` without executing ALL stage actions

> **🚨 IF REFERENCE DOCUMENT WAS PROVIDED:**
>
> **MANDATORY to include in TODO list:**
> - [ ] ✅ **For EACH document step:** Create corresponding TODO stage
> - [ ] ✅ **Include references:** Mentioned HTML, Page Object, specific validations
> - [ ] ✅ **Include base code:** If step provides example snippet, reference in TODO
> - [ ] ✅ **Maintain sequence:** Document step order = TODO list order
> - [ ] ✅ **Granularity:** If document step is complex, divide into sub-stages in TODO
>
> **Example of mapping:**
>
> **Document says:** "8. 🖥️ Register permit via screen - HTML Reference: `permitScreen.html` - Validation: Validate 'Permits' visible - Action: Click 'Add'"
>
> **TODO should have:**
> ```
> {
>   id: 8,
>   title: "Register permit via screen",
>   description: "HTML: permitScreen.html | Page: permitPage.js | Validate 'Permits' visible | Click 'Add' | Fill form according to JSON",
>   status: "not-started"
> }
> ```

**Create TODO with these 6 BASE stages (ALWAYS):**

1. Stage 1.2: Analyze HTMLs and Detect iframe
2. Stage 1.3: Execute flow in Playwright CLI and capture snapshots
3. Stage 1.4: Map Final Locators
4. Stage 1.5: Consult Templates (if applicable)
5. Stage 1.6: Create Complete Technical Plan
6. Stage 1.7: Request User Approval

**+ Include specific stages from reference document steps (if provided)**

---

#### **Stage 1.2: Analyze ALL HTMLs and Detect iframe**

> **🚨 COMPLETE REFERENCE:**
> - **Consult:** `.github/copilot-modules/01-regras-criticas.md` (RULE #5 - Validate iframe Presence)

**MANDATORY ACTIONS:**

1. **Detect iframe (FIRST):**
   ```bash
   grep_search(query="<iframe", includePattern="{file}.html", isRegexp=false)
   ```

2. **Document:** Does HTML have iframe? (YES/NO)

3. **Identify ALL elements:**
   - Execute `grep_search` for **EACH** visible element in user instructions
   - Use `read_file` to read context (minimum 15 lines before/after)
   - Identify REAL HTML type (don't assume)

4. **Document in table:**

| Element | HTML File | Line | Real HTML Type | Context |
|---------|-----------|------|----------------|---------|
| {name} | {file}.html | {line} | `<{tag} role="{role}">` | {context description} |

**MARK `completed`** ONLY when:
- ✅ grep_search executed for iframe
- ✅ grep_search executed for 100% of identified elements
- ✅ Context read for 100% of elements (read_file)
- ✅ Complete table created with ALL elements

**MODULE COMPLIANCE CHECKPOINT:**
- [ ] Did I read Module 01 (RULE #5) before executing?
- [ ] Did I follow EXACT procedure from modules?

⛔ IF ANY "NO": Return and comply with module instruction

---

#### **Stage 1.3: 🚨 EXECUTE FLOW IN PLAYWRIGHT CLI AND CAPTURE SNAPSHOTS (CRITICAL)**

> **🚨 COMPLETE REFERENCE:**
> - **Consult:** `.github/copilot-modules/02-playwright-cli.md`

> **⛔ CRITICAL BLOCK:**
- - DON'T map final locators WITHOUT completing this stage
> - ALWAYS capture snapshot after critical flow stages

**MANDATORY ACTIONS:**

1. **Execute scenario steps with playwright-cli (headless):**
   ```bash
   playwright-cli open {initial_url}
   playwright-cli snapshot
   # execute step by step actions
   playwright-cli snapshot
   ```

2. **Document result:**
   - Initial snapshot generated
   - Snapshots by critical stage generated
   - Final snapshot generated

3. **If there's impediment:**
   - Ask user and wait for response before proceeding

**MARK `completed`** ONLY when:
- ✅ Flow executed in headless
- ✅ Snapshots of critical stages and final generated
- ✅ Impediments handled with user question

**MODULE COMPLIANCE CHECKPOINT:**
- [ ] Did I consult Module 02?
- [ ] Did I SKIP any element? (If YES = VIOLATION)

⛔ IF ANY "NO" or "YES" (in last item): Return and comply with module instruction

---

#### **Stage 1.4: Map Final Locators for ALL elements**

> **🚨 COMPLETE REFERENCE:**
> - **Consult:** `.github/copilot-modules/01-regras-criticas.md` (RULE #2 - Apply Semantic Locators)
> - **Consult:** `.github/copilot-modules/03-locators-semanticos.md` (Locator priority order)

**MANDATORY ACTIONS (for EACH element):**

1. **Map HTML type → Correct locator:**
   - Apply Playwright priority order (getByRole > getByText > getByLabel > locator)
   - Use semantic locator whenever applicable

2. **Apply disambiguation strategy** (if ambiguity observed in flow):
   - Use `{ exact: true }` (priority 1)
   - Use context anchors (priority 2)
   - Use `.filter({ hasText: /regex/ })` (priority 3)
   - Use `.first()`, `.nth()`, `.last()` (LAST alternative, document justification)

3. **Update table with "Final Locator":**

| Element | Strategy | **Final Locator** |
|---------|----------|-------------------|
| {name} | {strategy} | `page.getByRole('button', { name: 'Save', exact: true })` |

**MARK `completed`** ONLY when:
- ✅ 100% of elements mapped with final locator
- ✅ Strategy applied for 100% of elements requiring disambiguation
- ✅ Complete table with "Final Locator" column filled for ALL

**MODULE COMPLIANCE CHECKPOINT:**
- [ ] Did I consult Module 03 (Semantic Locators) for EACH element?
- [ ] Did I use Playwright priority order when choosing locators?
- [ ] Did I consult Module 03 (priority order) when choosing strategy?

⛔ IF ANY "NO": Return and comply with module instruction

---

#### **Stage 1.5: Consult Templates (if applicable)**

> **🚨 REFERENCE BY CONTEXT:**

**IF creating/modifying Page Objects:**
- **Consult:** `.github/copilot-modules/05-page-objects.md` (Complete template + rules)

**IF creating/modifying Tests:**
- **Consult:** `.github/copilot-modules/06-testes-spec.md` (Template + AAA pattern)

**IF creating/modifying APIs:**
- **Consult:** `.github/copilot-modules/08-api-classes.md` (Template + nomenclature)

**MANDATORY ACTION:**
- Identify template structure (imports, constants, constructor, methods)
- Document patterns to follow (section order, nomenclature, JSDoc)

**MARK `completed`** when:
- ✅ Module template consulted
- ✅ Structure identified and documented

---

#### **Stage 1.6: Create COMPLETE Technical Plan**

**MANDATORY DOCUMENT to create:**

```markdown
## TECHNICAL PLAN - {Feature Name}

### 1. COMPLETE ELEMENTS TABLE

| Element | HTML | Line | Type | Strategy | Final Locator |
|---------|------|------|------|----------|---------------|
| ... | ... | ... | ... | ... | ... |

### 2. CORE LIBRARY METHODS TO REUSE

| Method | Class | Usage in Plan |
|--------|-------|---------------|
| `fillForm(data, selectors)` | FormUtils | Fill registration form |

### 3. NEW METHODS TO CREATE

| Method | File | Justification |
|--------|------|---------------|
| `registerPermit(data)` | permitPage.js | Specific flow not covered by current structure |

### 4. FILES TO CREATE/MODIFY

- [ ] `pages/supplies/permitPage.js`
- [ ] `data/supplies/permitJson.js`
- [ ] `tests/supplies/crud/permits.spec.js`

### 5. ATTENTION POINTS

- iframe detected: YES/NO
- Flow snapshots generated: YES/NO
- Dependencies: ...

**MARK `completed`** ONLY when:
- ✅ Complete technical plan created
- ✅ ALL elements documented in final table (100%)
- ✅ ALL existing and new methods listed with justification
- ✅ ALL files to create/modify listed

---

#### **Stage 1.7: Request User Approval**

> **⛔ ABSOLUTE BLOCK:** DON'T implement without explicit user approval

**MANDATORY ACTION:**

1. **Present** complete technical plan from Stage 1.6 to user
2. **Await** explicit confirmation (ex: "approved", "ok", "can implement")
3. **ONLY after approval:** Proceed to PHASE 2

**MARK `completed`** ONLY when:
- ✅ Plan presented to user
- ✅ Approval received explicitly

---

### **PHASE 2: Implementation (After Approval)**

> **⛔ DON'T EXECUTE PHASE 2 WITHOUT EXPLICIT USER APPROVAL IN STAGE 1.7**

**🚨 MANDATORY PREREQUISITES TO START PHASE 2:**

- [ ] ✅ PHASE 1 Stage 1.2 marked as `completed` (100% HTMLs analyzed)
- [ ] ✅ PHASE 1 Stage 1.3 marked as `completed` (100% snapshots captured)
- [ ] ✅ PHASE 1 Stage 1.4 marked as `completed` (100% locators mapped)
- [ ] ✅ PHASE 1 Stage 1.5 marked as `completed` (templates consulted if applicable)
- [ ] ✅ PHASE 1 Stage 1.6 marked as `completed` (100% technical plan created)
- [ ] ✅ PHASE 1 Stage 1.7 marked as `completed` (user approval received)

**⛔ IF ANY ITEM = NO: ACTIVE BLOCK - Return to PHASE 1 and complete**

**🔴 COMMON VIOLATIONS INDICATING STAGE SKIPPING:**

- ❌ "Based on already collected information, I will implement..."
- ❌ "I marked previous stages as complete..."
- ❌ "Due to extensive volume, I will create code based on..."
- ❌ "I will proceed with implementation using data I have..."

**🛑 IF YOU THOUGHT OF ANY PHRASE ABOVE: STOP - You skipped PHASE 1 stages**

**On receiving user approval:**

1. **Implement** according to approved plan (Stage 1.6)

2. **🚨 GUARANTEE 100% TEMPLATE COMPLIANCE:**
   - **Tests (`*.spec.js`):** Follow Module 06 structure
   - **Pages (`*Page.js`):** Follow Module 05 structure
   - **APIs (`*Api.js`):** Follow Module 08 structure
   - **RULE:** Maintain same structure, section order, standard imports and template constants

3. **Validate auxiliary files updated:**
   - Static locators in constructor (if Page Object)
   - Classes instantiated in `helpers/index.js`
   - Navigation updated in `helpers/navegacao.js` (if applicable)
   - User in `helpers/ambiente.js` (if applicable)
   - Coverage updated in `coverageFeatureMap.yml`

4. **Execute** `get_errors` and correct all reported errors

5. **Confirm** completion with `checklistMergeRequest.md` checklist (100% of items)

---

## 📚 **SPECIALIZED MODULES**

| Context | Module | When to Read |
|---------|--------|--------------|
| **Critical Rules** | `.github/copilot-modules/01-regras-criticas.md` | **ALWAYS** at beginning of any implementation |
| **Create page objects** | `.github/copilot-modules/05-page-objects.md` | When creating/updating Pages |
| **Create tests** | `.github/copilot-modules/06-testes-spec.md` | When creating `*.spec.js` files |
| **Semantic locators** | `.github/copilot-modules/03-locators-semanticos.md` | When choosing locator strategy |
| **Create API classes** | `.github/copilot-modules/08-api-classes.md` | When creating/updating APIs |
| **Playwright CLI** | `.github/copilot-modules/02-playwright-cli.md` | When executing step by step in browser and generating snapshots |

---

## 🧪 **TEST TYPES**

### **Directory Mapping**

| Pattern | Type | Characteristics |
|---------|------|-----------------|
| `tests/*/abreTelas/*.spec.js` | Open Screens | Validate load, elements, errors, translation |
| `tests/*/crud/*.spec.js` | CRUD | Separate Create, Read, Update, Delete |
| `tests/*/jornada/*.spec.js` | Journey | Complete end-to-end flow |

**Details:** See `.github/copilot-modules/06-testes-spec.md`

---

## 📁 **FILE STRUCTURE (MANDATORY)**

> **🚨 TEMPLATE COMPLIANCE RULE:**
>
> When creating/editing any file:
>
> 1. **Consult** the corresponding module (05, 06 or 08)
> 2. **Identify** structural elements in template (imports, constants, constructor, example methods)
> 3. **Replicate** same organization: same section order, same base imports, same standard constants
> 4. **Adapt** content to specific context maintaining structure
> 5. **Validate** you followed: import order, error constants, JSDoc, method structure

### **Page Objects (`*Page.js`)**

**Template and rules:** `.github/copilot-modules/05-page-objects.md`

**Critical Rules:**

- ✅ Static locators IN constructor
- ✅ Dynamic locators IN methods (only if depend on parameters)
- ✅ Mandatory JSDoc
- ❌ NEVER hardcoded selectors in methods
- ❌ NEVER create "future use" locators

### **API (`*Api.js`)**

**Template:** `.github/copilot-modules/08-api-classes.md`

**Critical Rules:**

- ✅ Nomenclature: HTTP verb + endpoint name
- ✅ Mandatory headers (Authorization, Content-Type)
- ✅ Response validation with `validateApiResponse`
- ❌ NEVER hardcode tokens/URLs
- ❌ NEVER create unused methods

### **Tests (`*.spec.js`)**

**Template and AAA pattern:** `.github/copilot-modules/06-testes-spec.md`

**Critical Rules:**

- ✅ Mandatory AAA pattern (Arrange-Act-Assert)
- ✅ Explicit comments in each phase
- ✅ Unique tags and mandatory annotation
- ❌ NEVER use `test.step()`

---

## **🔗 Class Instantiation**

### **`helpers/index.js`**

⚠️ **GOLDEN RULE: NEVER REMOVE OR MODIFY EXISTING LINES - ONLY ADD**

**5-Step Process:**

1. **IMPORT** at end of imports section
2. **INSTANTIATE PAGES** at end of page block
3. **INSTANTIATE APIS** at end of request block
4. **USE** via context: `page.{featureName}Page.method()`
5. **VALIDATE** with `get_errors`

---

## **🗺️ Screen Navigation**

### **`helpers/navegacao.js`**

**Naming Pattern:** `{PRODUCT}_{FINAL_FUNCTIONALITY}`

**Rules:**

- NEVER create constant with duplicate value
- NEVER edit/remove existing constants
- ALWAYS group by product
- ALWAYS create with URL AND DIRECTORY

```javascript
export const {PRODUCT}_{FUNCTIONALITY} = {
  URL: `${BASE_URL}{path/url}`,
  DIRECTORY: [{MAIN_PRODUCT}, {SUBMENU}, '{Final Functionality}'],
};
```

---

## **📊 Coverage Mapping**

### **`coverageFeatureMap.yml`**

**Rules:**

- ✅ MANDATORY to update after creating/modifying tests
- ✅ ONLY ADD, never change/remove
- ❌ FORBIDDEN to remove mapped features

**Structure:**

```yml
- page: "{Menu/Path}"
  features:
    feature name 1: true
    feature name 2: true
```

---

## ✅ **Merge Request Checklist**

> **🚨 CRITICAL RULE:** Before finalizing any implementation, ALL items in `checklistMergeRequest.md` file must be validated and met.

**Consult complete file:** `checklistMergeRequest.md`

**🔍 Final Validation:**

- [ ] All checklist items verified
- [ ] ESLint without errors

---

## 🚫 **Anti-Patterns**

### **❌ NEVER**

- Create static locators outside constructor
- Use locators inline without parameter
- Instantiate Page Objects directly in tests
- Create unused locators
- **Forget to validate `<iframe>` presence in HTML** (grep_search mandatory)
- **Use `this.page` when HTML has iframe** (must use `this.frame`)
- **Create `this.frame` when HTML does NOT have iframe** (use only `this.page`)
- Hardcode URLs/values
- Use `test.step()`
- **Use `{ timeout: X }` in expect or actions** (uses default 30s timeout from playwright.config.js)
- **Create imports without validating paths with grep_search**
- **Build JSON inline in `.spec.js`** (ex: `filterData = { ... }`)
- **Method `accessScreen()` receive parameter**

### **✅ ALWAYS**

- **Execute `grep_search(query="<iframe")` in HTML BEFORE creating Page Object**
- **Configure constructor according to iframe presence** (this.frame OR this.page)
- Create ALL static locators in constructor
- Validate if locators created in methods are really dynamic
- Use objects via context (`page.{feature}Page`)
- Update `coverageFeatureMap.yml`
- Execute ESLint before finalizing
- Follow AAA pattern in tests
- **Use Playwright default timeout (30s)** - NEVER customize
- **Validate ALL imports with grep_search** before creating
- **Import navigation constant from `helpers/navegacao.js`** in `accessScreen()` method
  - If variable has `.URL`: use `page.goto(VARIABLE.URL)`
  - If variable has `.DIRECTORY`: use `dataUtils.navigateToPage(...VARIABLE.DIRECTORY)`
- **ALL JSONs imported from `data/`**, NEVER built inline
- **For S-Lookup:** Search for ID of `<input>` INSIDE `<s-lookup>`

---

## 🔧 **ESLint Integration**

**Command before finalizing:**

```bash
npm run eslint-fix
```

---

## 🔍 **Completeness Checklist**

### **📋 Files and Code Validation**

| Category | Validation |
|----------|-----------|
| **Files** | All created (JSON, API, Page, Spec) |
| **Imports** | Correct paths, no errors (`get_errors`) |
| **Instantiation** | helpers/index.js updated |
| **Quality** | ESLint without violations, complete JSDoc |
| **Coverage** | coverageFeatureMap.yml updated |
| **Navigation** | helpers/navegacao.js updated |

### **🚫 Blockers**

> Implementation is NOT complete if:
>
> - Specified file is missing
> - Import errors exist
> - Orphaned locators/methods present
> - ESLint reports violations
> - `checklistMergeRequest.md` checklist not 100% validated

---

## 📚 **AVAILABLE MODULES SUMMARY**

| Module | File | Content |
|--------|------|---------|
| **Critical Rules** | `.github/copilot-modules/01-regras-criticas.md` | Fundamental rules + 2 phase process |
| **Page Objects** | `.github/copilot-modules/05-page-objects.md` | Templates + rules + method examples |
| **Tests Spec** | `.github/copilot-modules/06-testes-spec.md` | AAA pattern + complete structure + tags |
| **Semantic Locators** | `.github/copilot-modules/03-locators-semanticos.md` | Priority order + strategies |
| **API Classes** | `.github/copilot-modules/08-api-classes.md` | Templates + nomenclature + validations |
| **Playwright CLI** | `.github/copilot-modules/02-playwright-cli.md` | Headless step by step execution + snapshots + test artifact generation |

---

## 🚨 **AI USAGE INSTRUCTIONS**

### **When receiving a request:**

1. **ALWAYS READ:** `.github/copilot-modules/01-regras-criticas.md`
2. **🚨 CREATE MANDATORY TODO LIST:** ALWAYS execute 6 stages using `manage_todo_list`
   - **Stage 1.2:** Analyze HTMLs (mark `in-progress` → execute → mark `completed`)
   - **Stage 1.3:** Execute Playwright CLI + snapshots (mark `in-progress` → execute → mark `completed`)
   - **Stage 1.4:** Map Final Locators (mark `in-progress` → execute → mark `completed`)
   - **Stage 1.5:** Consult Templates (mark `in-progress` → execute → mark `completed`)
   - **Stage 1.6:** Create Technical Plan (mark `in-progress` → execute → mark `completed`)
   - **Stage 1.7:** Request Approval (mark `in-progress` → execute → mark `completed`)
   - **⛔ FORBIDDEN:** Skip stages, execute out of order, or not use `manage_todo_list`
3. **READ RELEVANT MODULES** according to blocking triggers (PHASE 0, Stage 0.2)
4. **EXECUTE COMPLETE ANALYSIS** (Stages 1.2-1.7) before requesting approval
5. **REQUEST APPROVAL** of technical plan (Stage 1.7)
6. **IMPLEMENT** after approval (PHASE 2)
7. **GUARANTEE TEMPLATE COMPLIANCE:**
   - Consult template in corresponding module (05, 06 or 08)
   - Maintain same section structure (imports, constants, constructor, methods)
   - Preserve order of structural elements
   - Use same nomenclature and organization patterns
   - Adapt examples to specific context maintaining structure
8. **VALIDATE** with checklist and ESLint

### **Information Priority:**

1. Playwright Best Practices (official docs) - **ALWAYS CONSULT FIRST**
2. Fundamental Principles (module 00) - **ALWAYS BEFORE ANY ANALYSIS**
3. Critical Rules (module 01) - **ALWAYS APPLICABLE**
4. Specific context module (02-08) - **AS NEEDED**
5. Merge Request Checklist - **BEFORE FINALIZING**

---

> **💡 This modular structure ensures that ALL information is respected without overloading AI context.**
>
> **🎯 AI should read ONLY necessary modules for current context, maintaining consistency and completeness.**
