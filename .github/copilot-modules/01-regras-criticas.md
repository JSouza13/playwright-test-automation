# 🚨 **CRITICAL RULES WITH MAXIMUM PRIORITY**

> **⚠️ THIS MODULE HAS ABSOLUTE PRECEDENCE**
>
> **📌 Hierarchy:** Playwright Docs > Module 00 > Module 01 > Modules 02-08 > Main File
> **📌 READ THIS FILE COMPLETELY BEFORE ANY IMPLEMENTATION**
> **📌 In case of conflict with other instructions: THIS MODULE ALWAYS PREVAILS**

---

## **🎯 7 FUNDAMENTAL RULES**

> **⚠️ READ ALL 7 RULES BEFORE ANY IMPLEMENTATION**

### **RULE #0: ALWAYS Consult Playwright Docs First**

**BEFORE any implementation decision:**

1. Consult official documentation: https://playwright.dev/docs/intro
2. For locators: https://playwright.dev/docs/locators
3. For assertions: https://playwright.dev/docs/test-assertions
4. For best practices: https://playwright.dev/docs/best-practices

**Project instructions complement (do not replace) Playwright.**

---

### **RULE #1: ALL Static Locators IN THE CONSTRUCTOR (ALWAYS)**

**🚨 ABSOLUTE RULE - NO EXCEPTIONS:**

**BEFORE creating any method in a Page Object:**

1. **Identify ALL static locators that the method will use**
2. **Create ALL of them in the constructor BEFORE implementing the method**

**DEFINITION OF "STATIC LOCATOR":**
- Any `getByText()`, `getByRole()`, `locator()` with a **literal string** (fixed text in quotes)
- Any ID, Class or CSS selector used as a **literal string** (`'#id'`, `'.class'`, `'div.class'`)
- Any base locator used for nested `.filter()` or `.locator()`

**✅ MANDATORY in Constructor:**

```javascript
constructor(page) {
  // ✅ IDs/Classes/CSS ALWAYS with symbol
  this.ID_ORIGEM_NEGOCIO = '#businessOrigin';
  this.ID_TIPO_NEGOCIO = '#businessType';
  this.CLASS_KANBAN_CARD = '.kanban-card-title';

  // ✅ Locators with literal strings
  this.locatorDataFechamentoText = this.page.getByText('Data de Fechamento -');
  this.locatorValorEstimadoText = this.page.getByText('Valor Estimado R$0,00');

  // ✅ Base locators for nesting
  this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title');
}
```

**❌ FORBIDDEN in Methods:**

```javascript
async validarDados() {
  // ❌ FORBIDDEN - Literal string outside constructor
  await expect(this.page.getByText('Data de Fechamento -')).toBeVisible();

  // ❌ FORBIDDEN - Inline ID without constructor
  await this.formUtils.fillFieldPDropdown('#businessOrigin', dados.origem);

  // ❌ FORBIDDEN - Inline base locator
  const locator = this.page.locator('.kanban-card-title').filter({ hasText: dados.descricao });
}
```

**Reason:** Centralizing ALL selectors in the constructor improves maintainability and prevents duplication.

---

### **RULE #2: Apply Semantic Locators with Playwright Priority (ALWAYS)**

**BEFORE creating any locator:**

1. Identify the element in HTML with `grep_search`
2. Read context with `read_file` (minimum 15 lines before/after)
3. Apply Playwright official priority order: `getByRole > getByText > getByLabel > locator`
4. Use semantic locator whenever applicable
5. Document disambiguation strategy when ambiguity exists

**File:** `.github/copilot-modules/03-locators-semanticos.md`

---

### **RULE #3: Execute Flow in Playwright CLI (ALWAYS)**

**BEFORE creating any locator:**

**🚨 EXECUTE FUNCTIONAL FLOW AND CAPTURE SNAPSHOTS:**

1. Run `playwright-cli open {url}` in scenario context
2. Capture initial snapshot before interactions
3. Execute critical flow actions
4. Capture intermediate and final snapshots
5. Document observed interaction ambiguities and the strategy used in final locator

**DOCUMENT:** "Flow executed with snapshots. Locator adjustments applied: [strategy + justification]"

---

### **RULE #4: NEVER Use Custom Timeout**

**IN ANY expect or action:**

- ❌ **FORBIDDEN:** `.toBeVisible({ timeout: 10000 })`
- ❌ **FORBIDDEN:** `.toBeHidden({ timeout: 5000 })`
- ❌ **FORBIDDEN:** `.click({ timeout: 3000 })`
- ❌ **FORBIDDEN:** Any usage of `{ timeout: X }`
- ✅ **CORRECT:** Use default timeout from `playwright.config.js` (30s)

**Reason:** Custom timeout masks structural problems (slow selectors, incorrect waits, flakiness). The project's default 30s timeout is sufficient for all cases.

**File:** `.github/copilot-modules/05-page-objects.md` ("Custom Timeout" section)

---

### **RULE #5: Validate iframe Presence (ALWAYS)**

**BEFORE creating the Page Object constructor:**

1. Run: `grep_search(query="<iframe", includePattern="{file}.html", isRegexp=false)`
2. **IF `<iframe>` is found:**
   - Constructor uses: `this.frame = this.page.frameLocator('iframe[name="ci"]');`
   - FormUtils uses: `new FormUtils(this.frame)`
   - ALL locators use: `this.frame.getByRole(...)`, `this.frame.getByLabel(...)`
3. **IF `<iframe>` is NOT found:**
   - Constructor uses only: `this.page = page;`
   - FormUtils uses: `new FormUtils(this.page)`
   - ALL locators use: `this.page.getByRole(...)`, `this.page.getByLabel(...)`
4. **NEVER mix:** Using `this.frame` in some locators and `this.page` in others

**File:** `.github/copilot-modules/01-regras-criticas.md` + `.github/copilot-modules/05-page-objects.md`

---

### **RULE #6: Validate ALL Imports BEFORE Finishing (MANDATORY)**

**AFTER creating/modifying ANY file (`.spec.js`, `Page.js`, `Api.js`, `.json`):**

1. **RUN runtime validation** immediately after create/modify
2. **FIX 100% of errors** before marking implementation as complete
3. **NEVER finish** with import/module not found errors

**MANDATORY VALIDATION:**

For `.spec.js` files (detects runtime errors):

```bash
npx playwright test {path/file.spec.js} --list
```

For other files (`Page.js`, `Api.js`):

```bash
get_errors(filePaths=["{path/file}"])
```

**COMMON ERRORS TO FIX:**

❌ **Import without `.js` extension:**

```javascript
import { test } from '../../../helpers'; // ❌ ERROR: Cannot find module
```

✅ **Import with explicit extension:**

```javascript
import { test } from '../../../helpers/index.js'; // ✅ CORRECT
```

❌ **Relative path with incorrect levels:**

```javascript
// File: tests/jornadas/crmx/negocio.spec.js
import { test } from '../../helpers/index.js'; // ❌ ERROR: 2 levels (should be 3)
```

✅ **Correct relative path (calculate levels):**

```javascript
// File: tests/jornadas/crmx/negocio.spec.js
import { test } from '../../../helpers/index.js'; // ✅ CORRECT: 3 levels to root
```

**HOW TO CALCULATE RELATIVE PATH:**

1. Count levels from file to project root
   - `tests/jornadas/crmx/negocio.spec.js` = 3 levels (`../../../`)
   - `tests/jornadas/suprimentos/gestaoEstoques/consulta/file.spec.js` = 5 levels (`../../../../../`)
2. Add destination path from root
   - `helpers/index.js` → `../../../helpers/index.js`
   - `data/crmx/negocioJson.js` → `../../../data/crmx/negocioJson.js`

**MANDATORY PROCESS:**

1. Create/modify file
2. Execute validation (command above based on file type)
3. **IF there are errors:** Fix ALL before proceeding
4. **IF there are no errors:** Validate next file
5. **NEVER skip this validation**

**Reason:** Files with import errors prevent test execution. `get_errors` does not detect Playwright runtime errors - explicit validation with `npx playwright test --list` is mandatory for `.spec.js`.

---

## **✅ Compliance Checklist**

**BEFORE implementing, confirm:**

- [ ] **I validated iframe presence in HTML** (Rule #5)
- [ ] **Constructor configured correctly** (`this.frame` OR `this.page` according to iframe)
- [ ] I executed `grep_search` for EACH element
- [ ] I read full context in HTML (minimum 15+ lines before/after)
- [ ] I identified REAL type in HTML
- [ ] I applied **locator priority order** (Rule #2)
- [ ] I will use **CORRECT locators (✅)**
- [ ] I executed Playwright CLI flow with snapshots (Rule #3)
- [ ] **I did NOT use `{ timeout: X }` anywhere** (Rule #4)
- [ ] I created a **detailed technical plan**
- [ ] **I REQUESTED APPROVAL** before implementing

**AFTER implementing, confirm:**

- [ ] **I validated imports with `npx playwright test --list`** for `.spec.js` (Rule #6)
- [ ] **I validated imports with `get_errors`** for `Page.js`/`Api.js` (Rule #6)
- [ ] **I fixed ALL errors** found
- [ ] **Imports use explicit `.js` extension**
- [ ] **Relative paths calculated correctly** (I counted levels)
- [ ] **In Page Objects: class JSDoc without `Example:` and without `@param` (parameterization only in `constructor`)**

> **🚫 IF ANY ITEM IS "NO": STOP AND EXECUTE THE MISSING STEP**

---

## **📋 MANDATORY PROCESS: 2 PHASES**

> **⚠️ This process is SYNCHRONIZED with the Main File (`copilot-instructions.md`)**
>
> **Main File defines:** 7 detailed stages (1.1 to 1.7)
> **This module defines:** Summarized view of phases

### **🔍 PHASE 1: Analysis and Planning**

**The Main File details 6 operational stages (1.2 to 1.7):**

1. **Analyze HTMLs and Detect iframe**
   - `grep_search("<iframe")` FIRST
   - `grep_search` + `read_file` for each element (minimum 15 lines of context)
   - Document: line, real HTML type, context

2. **Execute Flow in Playwright CLI** (EXECUTE BEFORE MAPPING)
   - `playwright-cli open` + scenario interactions
   - Capture snapshots of critical stages
   - Document ambiguities and applied strategy

3. **Map Final Locators** (AFTER validation)
   - Map EACH element using Playwright priority order
   - Apply disambiguation strategy if needed
   - Document: strategy + final locator ✅

4. **Consult Templates** (if applicable)
   - Page Objects → Module 05
   - Tests → Module 06
   - APIs → Module 08

5. **Create Technical Plan**
   - Table: element | line | type | strategy | locator
   - List: all methods and files involved
   - Files to create/modify
   - Attention points

6. **Request User Approval**
   - **BLOCK:** DO NOT implement without explicit approval

---

### **✅ PHASE 2: Implementation**

**After explicit approval:**

1. Implement according to approved plan
2. Validate compliance:
   - Locators in constructor
   - Classes in `helpers/index.js`
   - Coverage in `coverageFeatureMap.yml`
3. Run `get_errors` and fix issues
4. Validate full `checklistMergeRequest.md`

---

## **📚 Module References**

| # | Module | File | When to Read |
|---|--------|---------|-----------|
| **05** | Page Objects | `.github/copilot-modules/05-page-objects.md` | When creating/updating Pages |
| **06** | Spec Tests | `.github/copilot-modules/06-testes-spec.md` | When creating `.spec.js` files |
| **03** | Semantic Locators | `.github/copilot-modules/03-locators-semanticos.md` | When choosing locator strategy |
| **08** | API Classes | `.github/copilot-modules/08-api-classes.md` | When creating/updating APIs |

---

> **💡 This module is the entry point. Always read it fully before starting.**
>
> **🎯 The 7 Fundamental Rules guarantee correct analysis and code quality.**
>
> **🎯 Specific implementation rules are in the specialized modules (03, 05, 06, 08).**
