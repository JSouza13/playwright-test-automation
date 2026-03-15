# 📄 **Page Objects Structure (`*Page.js`)**

> **Module 05:** Templates and rules for classes Page Object

---

## 🚨 **CRITICAL BLOCK - READ BEFORE CREATING/MODIFYING PAGE OBJECT**

> **⛔ IF YOU ARE CREATING OR MODIFYING A `*Page.js` FILE:**
>
> **STOP NOW AND READ THESE 3 CRITICAL RULES:**

### **🔴 CRITICAL RULE #1: `accessScreen()` NEVER RECEIVES PARAMETERS**

**❌ WRONG (DO NOT DO):**

```javascript
async accessScreen(url) { // PARAMETER = CRITICAL ERROR
  await this.page.goto(url);
}
```

**✅ Correct:**

```javascript
// 1. IMPORT constant at the top of the file
import { REAL_FEATURE_NAME } from '../../helpers/navegacao.js';

// 2. Method NO parameters - Use page.goto() if variable has .URL
async accessScreen() {
  await this.page.goto(REAL_FEATURE_NAME.URL);
  await expect(this.locatorTitleHeading).toBeVisible();
}

// OR - Use navigationToPage() if variable has .Directory
async accessScreen() {
  await this.featurePage.navigateToPage(...REAL_FEATURE_NAME.DIRECTORY);
  await expect(this.locatorTitleHeading).toBeVisible();
}
```

**Why:** URL/DIRECTORY is the responsibility of `navegacao.js`. `accessScreen()` must be called **without parameters** in tests.

---

### **🔴 CRITICAL RULE #2: ALL LOCATORS IN CONSTRUCTOR**

**❌ Wrong:**

```javascript
async clickSave() {
  await this.page.getByRole('button', { name: 'Save' }).click(); // ❌ Inline
}
```

**✅ Correct:**

```javascript
constructor(page) {
  this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
}

async clickSave() {
  await this.locatorSaveButton.click();
}
```

---

### **🔴 CRITICAL RULE #3: IMPORT ONLY WHAT WILL BE USED**

**❌ Wrong:**

```javascript
import { FEATURE_A, FEATURE_B, FEATURE_C } from '../../helpers/navegacao.js'; // ❌ Imports 3, uses 1

async accessScreen() {
  await this.page.goto(FEATURE_A.URL); // Use only 1
}
```

**✅ Correct:**

```javascript
import { REAL_FEATURE_NAME } from '../../helpers/navegacao.js'; // Only what is necessary

async accessScreen() {
  await this.page.goto(REAL_FEATURE_NAME.URL);
}
```

---

### **🔴 CRITICAL RULES #4: NOMENCLATURE MANDATORY OF LOCATORS**

> **⚠MANDATORY STANDARD: `locator{Description}{Type}`**

**Structure:**

- Always start with ‘locator’
- Followed by brief description of the element (e.g. 'Visitor Document', 'Save', 'Complete Name')
- Finish with element type: `Button`, `Input`, `Link`, `Heading`, `Checkbox`, `Table`, etc.

**❌ Wrong:**

```javascript
constructor(page) {
  this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });  // ❌ Wrong order
  this.locatorNameInput = this.page.getByLabel('Name');                        // ❌ Type in the middle
  this.addButton = this.page.getByRole('button', { name: 'Add' }); // Missing "locator"
  this.save = this.page.getByRole('button', { name: 'Save' });            // Missing standard name
}
```

**✅ Correct:**

```javascript
constructor(page) {
  this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });        // ✅ Type at the end
  this.locatorNameInput = this.page.getByLabel('Name');                                // ✅ Type at the end
  this.locatorAddButton = this.page.getByRole('button', { name: 'Add' }); // ✅ Correct pattern
  this.locatorTitleHeading = this.page.getByRole('heading', { name: 'Registration' });   // ✅ Correct pattern
}
```

**Common Types:**

- **Button** - Buttons (getByRole('button')`)
- **Input** - Input fields (`getByLabel`, `getByPlaceholder`)
- **Link** - Links (`getByRole('link')`)
- **Heading** - Titles (getByRole('heading')`)
- **Checkbox** - Checkboxes (`getByRole('checkbox')`)
- **Table** - Tables (`getByRole('table')`)
- **Dialog** - Modais (`getByRole('dialog')`)
- **Alert** - Alerts/Toasts (`getByRole('alert')`)

---

## 🚨 **CRITICAL RULE: NEVER MODIFY PRE-EXISTING CODE**

> **⚠MAXIMUM WARNING: When implementing in existing file**

**ABSOLUTE RULE - NO EXCEPTIONS:**

- ❌ **NEVER modify** existing methods
- ❌ **NEVER change** locators in the constructor already created
- ❌ **NEVER remove** existing constants or imports
- ❌ **NEVER change** signatures of existing methods
- ✅ **ONLY ADD** new methods at the end of the class
- ✅ **ONLY ADDITIONAL** new locators/IDs at the end of the constructor
- ✅ **ONLY ADDITIONAL** new imports required

**Reason:** Change existing code breaks tests already working. Every implementation must be ADDITIVE, never modifying.

**Correct Example:**

```javascript
// Correct - Add to constructor end
constructor(page) {
  this.page = page;
  // ...preserved existing code...

  // ✅ Novos locators adicionados AO FINAL
  this.locatorNovoElementoButton = this.page.getByRole('button', { name: 'Novo' });
}

// Correct - Add new methods TO THE end of the class
async metodoPreeexistente1() { /* preservado */ }
async metodoPreeexistente2() { /* preservado */ }

// New added method TO THE FINAL
async novoMetodo(data) {
  // new implementation
}
```

**Incorrect Example:**

```javascript
// Wrong - Modify existing method
async metodoPreeexistente1() {
  // Changed existing implementation - PROHIBITED
  await this.newLogic(); // BREAKS EXISTING TESTS
}

// WRONG - Change locator in constructor
constructor(page) {
  this.page = page;
  // ❌ Changed existing locator - FORBIDDEN
  this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
}
```

---

## 🎭 **MANDATORY BEST PRACTICES - PLAYWRIGHT PAGE OBJECTS**

> **🚨 READ THESE PRACTICES BEFORE CREATING ANY PAGE OBJECT**
>
> **These are not suggestions - they are the rules of the project**
>
> **🏆 GROUND:** All the principles below derive from the pillars **Clean Code** (Robert C. Martin)

### **📋 6 Fundamental Principles (Based on Clean Code):**

#### **1

> **RULE:** Clean code must be readable, simple, direct, and self-explanatory. Prioritize clarity over cleverness.

**Clean Code Principles Applied to Page Objects:**

**✅ Intent Revealing Names:**

```javascript
// Correct - Name reveals exactly what it does
async registerCompleteBusiness(data) {
  // Clear intent: register a business with all required data
}
```

```javascript
// WRONG - Generic name, does not reveal intention
async save(data) {
  // Save what? How? What validations?
}

async processStep1(data) {
  // What is process step 1? It does not express business intent
}
```

**✅ Avoid Obvious Comments:**

```javascript
// Correct - Code is self-explanatory
async fillRegistrationForm(data) {
  await this.locatorNameInput.fill(data.name);
  await this.locatorDescriptionInput.fill(data.description);
  await this.formUtils.fillFieldSLookup(this.ID_OWNER_LOOKUP, data.owner);
}
```

```javascript
// WRONG - Obvious comments (redundant)
async fillRegistrationForm(data) {
  // Fill the name field
  await this.locatorNameInput.fill(data.name);
  // Fill in the description field
  await this.locatorDescriptionInput.fill(data.description);
  // Fill in the responsible lookup
  await this.formUtils.fillFieldSLookup(this.ID_OWNER_LOOKUP, data.owner);
}
```

**✅ Formatting Consistent:**

```javascript
// Correct - Clear and consistent formatting
async registerBusiness(data) {
  // Open Form
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalDialog).toBeVisible();

  // Fill data
  await this.locatorNameInput.fill(data.name);
  await this.formUtils.fillFieldSLookup(this.ID_CONTA_LOOKUP, data.account);

  // Save and validate
  await this.locatorSaveButton.click();
  await expect(this.locatorToast).toBeVisible();
}
```

```javascript
// Wrong - Without organization, hard to read
async registerBusiness(data) {
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalDialog).toBeVisible();
  await this.locatorNameInput.fill(data.name);
  await this.formUtils.fillFieldSLookup(this.ID_CONTA_LOOKUP, data.account);
  await this.locatorSaveButton.click();
  await expect(this.locatorToast).toBeVisible();
}
```

**🎯 Checklist Clean Code for Page Objects:**

- [ ] **Names:** Methods and variables reveal intention without comment?
- [ ] **Liability:** Does every method do ONE thing and do good?
- [ ] **Size:** Methods have maximum 30-45 lines (if larger, organize in blocks)?
- [ ] **Comments:** Code is self-explanatory (comments only when inevitable)?
- [ ] **Formatting:** Logical blocks separated by blank lines?
- [ ] **Duplication:** No repeated code (DRY)?

### ⛔ IF ANY ANSWER = NO: Refactor before finishing

---

#### **2

> **RULE:** Page Objects should expose complete business flows, not isolated UI actions.

**❌ ANTI-PATTERN: Action-Based

```javascript
// WRONG - Fragmented methods without business context
await page.businessPage.clickAdd();
await page.businessPage.fillName('Company X');
await page.businessPage.fillOwner('John Smith');
await page.businessPage.clickSave();
await page.businessPage.validateSuccessMessage();

// PROBLEM: The test needs to know 5 technical UI steps
// IMPACT: Harder maintenance, technical leakage, weaker readability
```

### ✅ RIGHT STANDARD: Task-Based

```javascript
// Correct - Method encapsulates complete business flow
await page.{feature}Page.register{Feature}(JSON_{CONSTANT});

// GOOD because:
// - Expresses business intent in the test (register business)
// - Method encapsulates ALL technical steps (add, fill, save, validate)
// - Change in UI = change 1 method, not 5 tests
// - Reusable in multiple scenarios
```

**🎯 Practical Rule:**

- ✅ **CREATE:** Methods that represent user tasks (`registerBusiness`, `editOrder`, `applyFilters`)
- ❌ **NEVER CREATE:** Trivial methods with only 1 action (`clickSave`, `fillName`, `typeValue`)
- ✅ **EXCEPTION:** Auxiliary methods reused 3+ times with complex logic

---

#### **3

> **RULE:** Prioritize locators that simulate user behavior, not DOM structure.

**Priority Order (ABSOLUTE):**

1. **`getByRole()`** - Element by semantic role (button, heading, textbox)
2. **`getByLabel()`** - Input associated with a label
3. **`getByText()`** - Element by visible text
4. **`getByPlaceholder()`** - Input by visible placeholder
5. **`locator()` with CSS selector** - ONLY when none of the options above applies

**✅ Resilient Selectors:**

```javascript
// Correct - User-facing selectors using pattern locator{Description}{Type}
this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
this.locatorNameInput = this.page.getByLabel('Name');
this.locatorDescriptionInput = this.page.getByPlaceholder('Enter description');
this.locatorTitleHeading = this.page.getByRole('heading', { name: 'Business Registration' });
this.locatorNoRecordsProceduresText = this.page.getByLabel('Procedures').getByText('No records found');

// GOOD because:
// - Does not depend on HTML structure (classes, hierarchy)
// - CSS refactoring is less likely to break tests
// - Mirrors how users find elements
```

**❌ Fragile Selectors:**

```javascript
// ERROR - DOM-structure-dependent selectors
this.locatorSaveButton = this.page.locator('div.form-actions > button.btn-primary:nth-child(2)');
this.locatorNameInput = this.page.locator('#root > div > form > div:nth-child(1) > input');

// PROBLEM: Breaks if CSS, hierarchy, or order changes
// IMPACT: High maintenance, unstable tests
```

**🎯 Exceptions Allowed for `locator()` with ID:**

```javascript
// RIGHT - ID maintained when there is clear technical justification
this.ID_RESPONSAVEL_LOOKUP = '#responsible-autocomplete';
await this.formUtils.fillFieldSLookup(this.ID_RESPONSAVEL_LOOKUP, data.owner);

// JUSTIFICATIVE: the flow depends on a utility method that receives ID as parameter
```

**📘 Complete Reference:** See `.github/copilot-modules/03-semantic locators.md`

---

#### **4. DRY (Don't Repeat Yourself)**

> **RULE:** Eliminate duplications - each logic must exist in **1 single place**.

### ❌ VIOLATION: Code Duplicated in Multiple Methods

```javascript
// Wrong - Double logic in 3 methods
async registerBusiness(data) {
  await this.locatorAddButton.click();
  await expect(this.locatorModalDialog).toBeVisible();
  // ... filling ...
}

async editBusiness(data) {
  await this.locatorEditButton.click();
  await expect(this.locatorModalDialog).toBeVisible(); // ❌ Duplicated
  // ... filling ...
}

async duplicateBusiness(data) {
  await this.locatorDuplicateButton.click();
  await expect(this.locatorModalDialog).toBeVisible(); // ❌ Duplicated
  // ... filling ...
}
```

### ✅ Correct: Centralised logic

```javascript
// Reusable auxiliary method (used 3+ times)
async waitForOpenModal() {
  await expect(this.locatorModalDialog).toBeVisible();
  await expect(this.locatorLoadingSpinner).toBeHidden();
}

// Methods Reuse Helper
async registerBusiness(data) {
  await this.locatorAddButton.click();
  await this.waitForOpenModal(); // Reuse
  // ... filling ...
}

async editBusiness(data) {
  await this.locatorEditButton.click();
  await this.waitForOpenModal(); // Reuse
  // ... filling ...
}
```

**🎯 When Create Auxiliary Method:**

- ✅ Logic repeated in **3+ places**
- ✅ Complex sequence of commands (5+ lines)
- ❌ **Do not create** for 1 trivial command (`async click() {await this.botao.click()); }`)

---

#### **5. 🎨 YAGNI (You Aren't Gonna Need It)**

> **RULE:** Implement **only as necessary**. Do not create code for "possible" future scenarios.

### ❌ Over-Engineering

```javascript
// WRONG - Methods created "just in case"
async registerFullBusiness(data) { /* never used */ }
async registerSimpleBusiness(data) { /* never used */ }
async registerFastBusiness(data) { /* never used */ }
async registerBusinessWithValidation(data) { /* used once */ }

// PROBLEM: 4 methods created, only 1 really needed
// IMPACT: Dead code, unnecessary maintenance, confusion
```

### ✅ Correct: Implement Under Demand

```javascript
// ✅ Create ONLY when the test scenario requires it
async registerBusiness(data) {
  // Method created because testing needs to register business
  // If in future you need variation, create at that moment
}

// Optional parameters if scenario varies
async registerBusiness(data, options = { validate: true }) {
  // ... filling ...
  if (options.validate) {
    await expect(this.locatorToast).toBeVisible();
  }
}
```

**🎯 Checklist Anti-Over-Engineering:**

- [ ] Is this method used by any existing ** test?
- [ ] Is this locator referenced in any **existing method**?
- [ ] Is this parameter used in some scenario **real**?
- [ ] Is this validation necessary now** (not "maybe in the future")?

**⛔ IF ANY ANSWER = NO: Don't implement it. Wait for real need.**

---

#### **6

> **RULE:** Page Objects should serve the **real flows**, not future hypothetical scenarios.

**❌ Examples of Over-Engineering:**

```javascript
// WRONG - Over-abstraction without need
class BaseModal {
  async open() { }
  async close() { }
  async validate() { }
}
class RegistrationModal extends BaseModal { }
class EditModal extends BaseModal { }

// PROBLEM: Complex hierarchy for simple functionality
// IMPACT: Difficulty understanding, debug, maintenance

// ERROR - generic "configurable" methods
async fillForm(fields, options = { validate: true, clear: false, wait: true }) {
  // ... 50 lines of conditional logic...
}

// PROBLEM: Method "does everything" with many conditionals
// IMPACT: Hard to test, debug, understand behavior
```

**✅ Pragmatic Approach:**

```javascript
// Correct - Simple classes, direct methods
export class BusinessPage {
  async registerBusiness(data) {
    // Direct implementation without unnecessary abstractions
    await this.locatorAddButton.click();
    await this.locatorNameInput.fill(data.name);
    // ...
  }

  async editBusiness(data) {
    // Another simple, direct method
    await this.locatorEditButton.click();
    await this.locatorNameInput.fill(data.name);
    // ...
  }
}

// GOOD because:
// - Code readable and self-explanatory
// - Easy debug (no layers of abstraction)
// - Direct maintenance (without complex inheritance)
// - What? Meets real need without artificial complexity
```

**🎯 Golden Rule:**

### "Simplicity first. Abstract only when real maintenance pain appears 3+ times."

---

### **📊 EXECUTIVE SUMMARY - 6 THANKS PRACTICES**

| # Oh, yeah | Practice | What to Do | WHAT NOT TO DO |
...----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| **1** | **Clean Code** | Legible code, self-explanatory, SRP, revealing names | Obvious comments, giant methods, generic names |
| **2** | **Task-Based** | Methods = complete flows ('registration') | Trivial methods (`click Save`) |
| **3** | **User-Facing Locators** | getByRole, getByLabel (priority order) | Complex CSS/XPath DOM-dependent |
| **4** | **DRY** | Centralize repeated logic (3+ times) | Duplicate code in multiple methods |
| **5** | **YAGNI** | Implement only what is necessary now | Create code "just in case" |
| **6** | **Anti-Over-Engineering** | Simple classes, direct methods | Complex hierarchies, premature abstractions |

---

### **🔗 COMPLETION: Official Playwright documentation**

> **⚠BEFORE implementing any Page Object, see:**
>
> - **Locators:** <https://playwright.dev/docs/locators>
> - **Best Practices:** <https://playwright.dev/docs/best-practices>
> - **Assertions:** <https://playwright.dev/docs/test-assertions>
> - **Auto-waiting:** <https://playwright.dev/docs/actionability>

**Basic Principle:** The 6 practices above **complement** the official Playwright documentation. For wait strategies, assertions and technical locator choice, **follow the official documentation**.

---

## ⚠️ **BEST PRACTICE: Try/Catch ONLY When Necessary**

> **🚨 Golden Rule:** Playwright has robust self-waiting. Try/catch is required ONLY in specific technical cases.

**✅ WHEN YOU USE Try/Catch:**

- S-button type "Actions" or "Options" (with `<p-tieredmenu appendto="body">`) - **ALWAYS WITH `{force: true }`**
- Elements with known unstable behavior
- Technical justification documented in code

**❌ WHEN YOU DON'T USE Try/Catch:**

- Normal clicks (getByRole('button').click()
- Fill, fillFieldSLookup
- Validations (expect, toBeVisible, toHaveText)
- Actions that Playwright auto-wait already treats

**Retry Standard for Action/Options Buttons:**

```javascript
// ✅ CORRECT - Retry loop with { force: true } (avoids SonarQube S1871 - duplicated branches)
for (let attempt = 1; attempt <= 2; attempt++) {
  try {
    await this.locatorActionsButton.click({ force: true });
    await this.locatorMenuEditLink.click({ force: true });
    break;
  } catch (error) {
    if (attempt === 2) throw error;
  }
}
```

```javascript
// ERROR - Duplicate Branches (Violates SonarQube S1871 / ESLint sonarjs/no-duplicated-branches)
try {
  await this.locatorActionsButton.click({ force: true });
  await this.locatorMenuEditLink.click({ force: true });
} catch {
  await this.locatorActionsButton.click({ force: true });
  await this.locatorMenuEditLink.click({ force: true });
}
```

```javascript
// WRONG - Missing { force: true }
for (let attempt = 1; attempt <= 2; attempt++) {
  try {
    await this.locatorActionsButton.click();
    await this.locatorMenuEditLink.click();
    break;
  } catch (error) {
    if (attempt === 2) throw error;
  }
}
```

**Reason:** Playwright auto-waiting is sufficient for 95% of cases. Try/unnecessary catch pollutes code and violates YAGNI (You Aren't Gonna Need It). For "Actions"/"Options" buttons, we use loop retry with `{force: true }` which ignores visibility checks ensuring effective retry, without violating SonarQube S1871.

---

## 🚨 **PROJECT-SPECIFIC RULES (NOT Playwright)**

### **A. Locator Organisation (Project Standard)**

> **⚠Architectural decision:** ALL locations with literal strings, IDs, classes and selectors CSS IN THE CONSTRUCTOR

**🚨 ABSOLUTE RULES

1. **ALL `expect()` with getByText/getByRole + literal string NO CONSTRUCTOR**
   - ❌ PROHIBITED: `await expect(this.page.getByText('Close Date - ')). toBeVisible();` within method
   - ✅ CORRECT: `this.locatorDataCloseText = this.page.getByText('Close Date -');` in the constructor

2. **ALL IDs/Classes/CSS inline IN CONSTRUCTOR as constants**
   - ❌ PROHIBITED: `await this.formUtils.fillFieldPDropdown('#businessOrigin', data. origin);`

- ✅ CORRECT: `this.ID_BUSINESS_ORIGIN_DROPDOWN = '#businessOrigin';` in the constructor + `await this.formUtils.fillFieldPDropdown(this.ID_BUSINESS_ORIGIN_DROPDOWN, data.origin);`

1. **Locators for nesting (.filter, .locator) NO CONSTRUCTOR**
   - ❌ PROHIBITED: `const locator = this.page.locator('.kanban-card-title'). filter({hasText: data. description });`
   - ✅ CORRECT: `this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title');` in constructor + `const locator = this.locatorKanbanCardTitleDiv.filter({hasText: data. description });` in the method

---

### **A.1 Elements with Multiple Contexts (MANDATORY)**

> **⚠COMMON CRITICAL ERROR:** Assuming elements with same NAME have identical IDs/selectors in different contexts

**📋 Common Page Objects Contexts:**

- **Register/Edit:** Main creation/modification form
- **Filter:** Search fields/filter in listing
- **View:** Read-only fields in modal/detail screen
- **Duplication:** Record copy form

**🚨 MANDATORY PROCEDURE:**

1. **Identify ALL contexts** where Page Object will be used
2. **For EVERY context:** Validate specific HTMLs with `grep search`
3. **NEVER assume** which field "Description" in the register = field "Description" in the filter
4. **Create SPECIFIC constants** for each context when IDs/selectors are different

**❌ CRITICAL ANTI-PATTERN (NOT TO DO):**

```javascript
// WRONG - He assumed that ID is equal in all contexts
constructor(page) {
  this.page = page;
  // He only analyzed rawMain.html
  this.ID_DESCRIPTION_INPUT = '#description'; // Used in multiple methods
}

async register(data) {
  // HTML: crudPrincipal.html
  await this.page.locator(this.ID_DESCRIPTION_INPUT).fill(data.description); // Works in this HTML
}

async filter(data) {
  // HTML: filter.html
  await this.page.locator(this.ID_DESCRIPTION_INPUT).fill(data.description); // ERROR: Different ID!
}
```

**✅ Correct pattern:**

```javascript
// Correct - Validated HTMLs from EVERY context independently
constructor(page) {
  this.page = page;

  this.ID_DESCRIPTION_REGISTRATION_INPUT = '#description';
  this.ID_COMPANY_REGISTRATION_LOOKUP = '#company-autocomplete';
  this.ID_DESCRIPTION_FILTER_INPUT = '#filter-description';
  this.ID_COMPANY_FILTER_INPUT = '#filter-company';

  this.locatorDescriptionText = this.page.getByText(/Description:/);
}

async register(data) {
  // Use specific IDs from the REGISTRATION context
  await this.page.locator(this.ID_DESCRIPTION_REGISTRATION_INPUT).fill(data.description);
  await this.formUtils.fillFieldSLookup(this.ID_COMPANY_REGISTRATION_LOOKUP, data.company);
}

async filter(data) {
  // Use FILTER context specific IDs
  await this.page.locator(this.ID_DESCRIPTION_FILTER_INPUT).fill(data.description);
  await this.page.locator(this.ID_COMPANY_FILTER_INPUT).fill(data.company);
}

async validateView(data) {
  // Uses specific locators of the context
  await expect(this.locatorDescriptionText).toBeVisible();
}
```

**📊 DOCUMENTATION ON THE TECHNICAL PLAN (NO code):**

> **🚨 WARNING:** Context/HTML comments are ONLY for documentation in the TECHNICAL PLAN during analysis. **NEVER add in Page Object code.**

**Document in the Technical Plan (Markdown):**

```markdown
## Constants Mapping by Context

| Constant | Context | Source HTML | Line | Real ID/Selector |
|-----------|----------|-------------|-------|-----------------|
| `ID_DESCRIPTION_REGISTRATION` | Registration/Edit | crudPrincipal.html | 150 | `#description` |
| `ID_COMPANY_REGISTRATION` | Registration/Edit | crudPrincipal.html | 160 | `#company-autocomplete` |
| `ID_DESCRIPTION_FILTER` | Filter | filter.html | 89 | `#filter-description` |
| `ID_COMPANY_FILTER` | Filter | filter.html | 95 | `#filter-company` |
| `locatorDescriptionText` | View | view.html | 45 | `getByText(/Description:/)` |

**⚠️ Attention:** "Description" and "Company" fields have DIFFERENT IDs between registration and filter!
```

**❌ NEVER DO (comments verbose in code):**

```javascript
constructor(page) {
  this.page = page;

  // ============================================ ❌ WRONG
  // CONTEXT: CORRESPONDENT/EDITION
  // HTML: rawMain.html
  // Validated: grep search in rawHome. html
  // ============================================ ❌ WRONG
  this.ID_DESCRICAO_CADASTRO_INPUT = '#description';
}
```

**✅ Line breaks without comments:**

```javascript
constructor(page) {
  this.page = page;

  this.ID_DESCRIPTION_REGISTRATION_INPUT = '#description';
  this.ID_COMPANY_REGISTRATION_LOOKUP = '#company-autocomplete';

  this.ID_DESCRIPTION_FILTER_INPUT = '#filter-description';
  this.ID_COMPANY_FILTER_INPUT = '#filter-company';
}
```

**💡 Checklist Anti-Error:**

- [ ] Have I identified ALL contexts where Page Object will be used?
- [ ] Did I run `grep search' in EVERY HTML context?
- [ ] I validated that elements with same NAME may have IDs/selectors different?
- [ ] I've created constants SPECIFIC for each context (e.g. `REGISTRATION`, `FILTER`)?
- [ ] Did I document in the constructor which HTML each constant reference?
- [ ] Did I use Correct constant in each method (`filter()')?

**⛔ IF ANY ANSWER FOR "NO":** Back and analyze all contexts before implementing

**Project Pattern:**

```javascript
constructor(page) {
  this.page = page;

  // ✅ Field IDs with CSS symbol (#) — Pattern: ID_{DESCRIPTION}_{ElementType}
  this.ID_FIELD_LOOKUP = '#field-autocomplete';
  this.ID_ORIGEM_NEGOCIO_DROPDOWN = '#businessOrigin';
  this.ID_TIPO_NEGOCIO_DROPDOWN = '#businessType';
  this.ID_CONTA_LOOKUP = '#account-autocomplete';
  this.ID_FUNIL_DROPDOWN = '#funnel';
  this.ID_ETAPA_FUNIL_DROPDOWN = '#funnelStep';

  // ✅ CSS classes — Pattern: CLASS_{DESCRIPTION}_{ElementType}
  this.CSS_SELECTOR_SUBMIT_BUTTON = 'button[type="submit"]';
  this.CSS_SELECTOR_REQUIRED_INPUT = 'input[required]';
  this.CSS_SELECTOR_KANBAN_DONE = '.kanban-card[data-status="done"]';

  // ✅ DIRECT locators (not nested in object) - Pattern: locator{Description}{Type}
  this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
  this.locatorTitleHeading = this.page.getByRole('heading', { name: 'Manage' });

  // ✅ Locators with literal strings (for static expect checks)
  this.locatorClosingDateText = this.page.getByText('Closing Date -');
  this.locatorEstimatedValueText = this.page.getByText('Estimated Value $0.00');
  this.locatorActualValueText = this.page.getByText('Actual Value $0.00');

  // Base locators for later nesting
  this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title');
  this.locatorKanbanCardDescriptionDiv = this.page.locator('.kanban-card-description');
  this.locatorKanbanCardFooterDiv = this.page.locator('.kanban-card-footer');
}

async validarDados() {
  // Correct - Use constructor locator
  await expect(this.locatorClosingDateText).toBeVisible();
  await expect(this.locatorEstimatedValueText).toBeVisible();
}

async preencherFormulario(data) {
  // Correct - Use Constructor ID constant
  await this.formUtils.fillFieldPDropdown(this.ID_ORIGEM_NEGOCIO_DROPDOWN, data.origin);
  await this.formUtils.fillFieldSLookup(this.ID_CONTA_LOOKUP, data.account);
}

async validarCardKanban(data) {
  // Correct - Use builder base locator + dynamic filter
  const locatorCardDescription = this.locatorKanbanCardTitleDiv.filter({ hasText: data.description });
  await expect(locatorCardDescription).toBeVisible();
}
```

**❌ Project Anti-standards:**

```javascript
// DO NOT create expect with literal string in the method
async validarDados() {
  await expect(this.page.getByText('Closing Date -')).toBeVisible(); // FORBIDDEN
  await expect(this.page.getByText('Estimated Value $0.00')).toBeVisible(); // FORBIDDEN
}

// DO NOT use inline IDs/Classes in the methods
async preencherFormulario(data) {
  await this.formUtils.fillFieldPDropdown('#businessOrigin', data.origin); // FORBIDDEN
  await this.formUtils.fillFieldSLookup('#account-autocomplete', data.account); // FORBIDDEN
}

// DO NOT create inline base locator without constructor
async validarCard(data) {
  const locator = this.page.locator('.kanban-card-title').filter({ hasText: data.description }); // FORBIDDEN
  await expect(locator).toBeVisible();
}

// ❌ DO NOT use nested object
this.locators = {
  saveButton: this.page.getByRole('button', { name: 'Save' })
};

// DO NOT create factory method
static async create(page) { return new MyPage(page); }

// ❌ IDs/Classes without CSS symbol and without type suffix
this.ID_FIELD = 'field-autocomplete'; // # and suffix LOOKUP missing
this.CLASS_MODAL = 'modal-content';   // Missing '.' and  DIV suffix
this.ID_ENVIAR = 'button[type="submit"]'; // It's not ID, it's CSS → it should be CSS SEND BUTTON
```

### **B. Field IDs in Builder**

> **⚠Must be constant in the constructor**
>
> **🚨 MANDATORY FORMAT: IDs and Classes MUST include the CSS selector symbol**

**MANDATORY NAME OF CONSTANTS: `TYPE {DESCRIPTION} {ElementType}`**

- **ID** (starts with `#`): `this.ID_ACCOUNT_LOOKUP = '#account-autocomplete';`
- **Class** (starts with `.`): `this.CLASS CONTEUDO DIV = '.modal-content';`
- **CSS** (generic selector — tag, attribute, combination, etc.): `this.CSS SEND BUTTON = 'button[type="submit"]';`
- **XPath** (path — `//`, `/`, `[@attr]`, etc.): `this.XPATH_SAVE_BUTTON = '//button[contains(text(), "Save")]';`

**Common suffix(s):**

| Suffix | Usage |
| -------- | ----- |
| ‘INPUT’ | Text fields (`<input>`, `<textarea>`) |
| ‘LOOKUP’ | S-lookup components (`<s-lookup>`) |
| 'DROPDOWN' | p-dropdown components (`<p-dropdown>`) |
| 'Button' | Buttons (`<button>`) |
| ‘TABLE’ | Tables (`<table>`) |
| ‘DIV’ | Generic containers/divs |
| ‘SPAN’ | Span widgets |
| 'CALEND' | p-calendar components (`<p-calendar>`) |
| ‘DIALOG’ | Modal/dialogues |
| 'LABEL' | Labels |

> **Decision rule — Prefix:** If the value starts with `#` → `ID`. If it starts with `.` → `CLASS`. If it is XPath (`/`, `/`) → `XPATH`. Any other case → `CSS`.
>
> **Decision rule — Suffix:** The last segment ALWAYS indicates the type of HTML element/target component of the selector.

**❌ CRITICAL ANTI-PATTERN (NOT TO DO):**

```javascript
constructor(page) {
  this.page = page;

  // Wrong - IDs/Classes without CSS selector symbol and without type suffix
  this.ID_FIELD = 'id-field';           // # and suffix LOOKUP missing
  this.CLASS_MODAL = 'modal-content';   // Missing '.' and  DIV suffix
  this.ID_INPUT = 'container input';    // CSS selector, not ID → should be CSS CONTAINER INPUT
}
```

```javascript
async validateEditData(data) {
  // WRONG - FIXED locators outside the constructor (literal strings and fixed CSS selectors)
  await expect(this.page.getByText('Closing Date -')).toBeVisible();
  await expect(this.page.getByText('Estimated Value $0.00')).toBeVisible();
  await expect(this.page.locator('table tbody tr')).toBeVisible();
  await this.formUtils.fillFieldSLookup('#id-field', data.value);

  // Wrong - Use inline ID without being in the constructor
  await this.page.locator('.class-field').click();
}
```

```javascript
async validateEditData(data) {
  // Correct - DINAMIC locators in the method (variable use)
  await expect(this.page.getByText(data.description)).toBeVisible();
  await expect(this.page.getByText(`Date ${currentDate}`)).toBeVisible();
  await expect(this.page.locator(`tr[id="${data.id}"]`)).toBeVisible();
  await this.formUtils.fillFieldSLookup(this.ID_FIELD_LOOKUP, data.value);
}
```

**✅ COMPLETE RIGHT STANDARD:**

```javascript
constructor(page) {
  this.page = page;

  // CORRECT - Nomenclature TYPE {DESCRIPTION} {ElementType}
  this.ID_FIELD_LOOKUP = '#field-autocomplete';                       // ID + description + component type
  this.CLASS_CONTENT_DIV = '.modal-content';                         // CLASS + description + element type
  this.CSS_CONTAINER_INPUT = 'div#container input#field';             // CSS + description + element type
  this.CSS_SUBMIT_BUTTON = 'button[type="submit"]';                   // CSS + description + element type
  this.XPATH_SAVE_BUTTON = '//button[contains(text(),"Save")]';   // XPATH + description + element type

  // ✅ CORRECT - FIXED locators in constructor (literal strings and fixed CSS selectors)
  this.locatorClosingDateText = this.page.getByText('Closing Date -');
  this.locatorEstimatedValueText = this.page.getByText('Estimated Value $0.00');
  this.locatorTableBody = this.page.locator('table tbody tr');
}

async validateEditData(data) {
  // Correct - Use FIXED constructor locators
  await expect(this.locatorClosingDateText).toBeVisible();
  await expect(this.locatorEstimatedValueText).toBeVisible();
  await expect(this.locatorTableBody).toBeVisible();

  // Correct - Use constructor constants (IDs/Classes)
  await this.formUtils.fillFieldSLookup(this.ID_FIELD_LOOKUP, data.value);
  await this.page.locator(this.CLASS_CONTENT_DIV).click();
  await this.page.locator(this.CSS_CONTAINER_INPUT).fill(data.value);

  // Correct - DINAMIC locators in the method (depends on variable)
  await expect(this.page.getByText(data.description)).toBeVisible();
  await expect(this.page.getByText(`Date ${currentDate}`)).toBeVisible();
  await expect(this.page.locator(`tr[id="${data.id}"]`)).toBeVisible();
}
```

**MANDATORY VALIDATION:**

Before finishing, check if ALL constants:

- **IDs** start with `#` and have type suffix (e.g. `LOOKUP`, `DROPDOWN`, `INPUT`)
- **Class** start with `.` and have type suffix (e.g. `DIV`, `SPAN`)
- **Compound selectors** include complete symbols and prefix `CSS`
- **XPaths** have prefix `XPATH` and type suffix
- **ALL** constants follow the pattern `TYPE {DESCRIPTION} {ElementType}`

**Reason:** Constants without CSS selector symbol cause error while trying to locate elements. Playwright requires full CSS selector in `page.locator()`.

---

### **C. Do not Repeat Value in fillFieldSLookup**

> **⚠If value and valueClick are equal, pass only value**

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
// Wrong - Repeat value unnecessarily
await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, valor, valor);
```

**✅ Correct pattern:**

```javascript
// Correct - Pass only value (Click value is optional)
await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, valor);

// Correct - Pass ValueClick only if different
await this.formUtils.fillFieldSLookup(this.ID_CAMPO_LOOKUP, valor, valorDiferente);
```

**Reason:** The `fillFieldSLookup' method uses the value as click if valueClick is not provided.

---

## **CRITICAL RULES OF JSDOC**

> **📘 Complete rules, correct/incorrect examples and validation checklist: refer to section `**

### **JSDoc Required for Object Parameters**

> **🚨 ABSOLUTE RULE: NEVER DETAIL JSON'S INDIVIDUAL FIELDS**
>
> **Reason:** Avoids duplication of information (data is in JSON) and outdated when JSON changes.
> **⛔ THANK YOU: `@param {object}` ↔ `Example: JSON {CONSTANT}`**
>
> The line `Example: JSON_{CONSTANT}` is **MANDATORY** and **EXCLUSIVELY LINKED** to a `@param {object}`.
>
> **Where NOT applicable:** `@param {object} page` (Playwright parameter, not JSON data)
>
> **🛡CHECKLIST BEFORE WRITTEN `Example:` (TRY FOR EVERY JSDoc):**
>
> 1. I'm writing JSDoc's class? → **PROHIBITED `Example:`** — describes only general purpose
> 2. Does the method have `@param {object}` representing JSON data? → **MANDATORY `Example: JSON {CONSTANT}`**
> 3. The method **NO** has `@param {object}`? (e.g. `accessate()`, `clean()`, `save()`) → **PROHIBITED `Example:`**
> 4. `@param {object}` is Playwright 'page'? → **DO NOT apply** (not JSON data)
>
> **⛔ If answer 1 or 3 = YES: REMOVE `Example:` IMMEDIATELY**

**Full class example — where ‘Example:’ is prohibited vs Correct:**

```javascript
// Wrong - Example: appears in the class and in method without @param {object}
/**
 * Page Object for {FeatureName}
 * Encapsulates actions for {description}
 * Example: JSON_{CONSTANT}              ← ❌ FORBIDDEN: class JSDoc
 */
export class {NomeFuncionalidade}Page {
  constructor(page) { /* ... */ }

  /**
   * Access the {feature} screen
  * Example: JSON_{CONSTANT}            ← ❌ FORBIDDEN: method without @param {object}
   */
  async accessScreen() { }

  /**
   * Add record with data
   * @param {object} data - Record data
  * Example: JSON_{CONSTANT}            ← ✅ CORRECT: method with @param {object}
   */
  async addRecord(data) { }
}
```

```javascript
// Correct - Example: appears ONLY in the method with @param {object}
/**
 * Page Object for {FeatureName}
 * Encapsulates actions for {description}
 */
export class {NomeFuncionalidade}Page {
  constructor(page) { /* ... */ }

  /**
   * Access the {feature} screen
   */
  async accessScreen() { }

  /**
   * Add record with data
   * @param {object} data - Record data
  * Example: JSON_{CONSTANT}
   */
  async addRecord(data) { }
}
```

**Mandatory structure (Only in methods, NEVER in classes):**

```javascript
/**
 * Description of what the method does
 * @param {object} data - Parameter description
 * Example: JSON_{CONSTANT}
 */
async nomeDoMetodo(data) {
  // implementation
}
```

> **⚠WARNING:** The line `Example: JSON {CONSTANT}` is EXCLUSIVE from JSDoc of **methods**.
> The JSDoc of the**class** NEVER contains `Example:` — describes only functionality.

**Quick Rules:**

- ✅ **1 JSON:**`Example: JSON {CONSTANT}`
- ✅ **Multiple JSONs:**`Example: JSON {CONSTANT 1} or JSON {CONSTANT 2}`
- ✅ Use placeholder `JSON {CONSTANT}` in templates, replace with JSON's REAL name in implementation
- ❌ **NEVER detail fields:** `data. field1`, 'data. field2`
- ❌ **NEVER omit** line `Example:` when `@stop {object}` exists and JSON is known
- ❌ **NEVER add** line `Example:` without `@param {object}` corresponding on the previous line

**❌ ANTI-PATTERN:**

```javascript
// WRONG - Detailing fields (FORBIDDEN)
/**
 * @param {object} data - Record data
 * @param {string} data.action - 'add' or 'edit'
 * @param {string} data.description - Description
 */
async addOrEditRecord(data) { }
```

**✅ Correct pattern:**

```javascript
// Correct - Simple and referenced
/**
 * Adds or edits record according to the specified action
 * @param {object} data - Record data
 * Example: JSON_{CONSTANT}
 */
async addOrEditRecord(data) { }
```

---

### **Locators Without Parameters Always in Builder**

> **⚠UNIVERSAL RULE: Any locator that does not depend on parameters MUST be declared in the constructor**

**Definition of "Locator Without Parameters":**

- Locator with fixed value/hardcoded
- Locator not dependent on method data
- Locator that does not use parameter values

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
async saveForm() {
  // WRONG - All these locations use FIXED STRINGS and must be in the constructor
  const locatorSaveButton = this.page.getByRole('button', { name: 'Save' }); // ❌ String 'Save' is FIXED
  await locatorSaveButton.click();
  await expect(this.page.getByText('Success')).toBeVisible(); // ❌ String 'Success' is FIXED
}

async fillName(name) {
  // ERROR - Locator with FIXA string outside the constructor
  const locatorNameInput = this.page.getByLabel('Name'); // ❌ String 'Name' is FIXED
  await locatorNameInput.fill(name);
  await expect(this.page.getByRole('button', { name: 'Balloon' })).toBeVisible(); // ❌ String 'Balloon' is FIXED
}
```

**✅ Correct pattern:**

```javascript
constructor(page) {
  this.page = page;

  // RIGHT - ALL locators without parameters in the constructor
  this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
  this.locatorNameInput = this.page.getByLabel('Name');
  this.locatorRecordsTable = this.page.getByRole('table');
  this.locatorReturnedBillingRow = this.page.getByRole('row').filter({ hasText: 'Returned billing' });
}

async saveForm() {
  // Correct - Use constructor locator
  await this.locatorSaveButton.click();
}

async fillName(name) {
  // Correct - Use constructor locator
  await this.locatorNameInput.fill(name);
  await expect(this.locatorReturnedBillingRow).toBeVisible();
}
```

**Permitted Single Exception (Dynamic Locators):**

```javascript
async findRecordByName(recordName) {
  // PERMITED - Dynamic locator (use parameter/variable)
  const locatorRecordRow = this.page.getByRole('row').filter({ hasText: recordName });
  await locatorRecordRow.click();
}

async validarDados(data) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  // PERMITED - Dynamic locators (use variables)
  await expect(this.page.getByText(data.description)).toBeVisible();
  await expect(this.page.getByText(`Data de Abertura ${dataAtual}`)).toBeVisible();
}
```

**🔍 MANDATORY VALIDATION ( BEFORE FINISHING):**

```bash
# Run grep to find ALL locators in the file
grep_search(query="this\\.(page|frame)\\.(getBy|locator|frameLocator)",
            includePattern="{file}Page.js",
            isRegexp=true)

# For EACH result, check:
# 1. Is it in the constructor? -> ✅ OK
# 2. Is it in the method AND uses FIXED STRING or FIXED CSS SELECTOR? -> ❌ MOVE TO CONSTRUCTOR
# 3. Is it in the method AND uses VARIABLE/PARAMETER? -> ✅ OK

# Examples of FIXED STRING/SELECTOR (MUST be in the constructor):
# - this.page.getByRole('button', { name: 'Save' })  <- String 'Save' is FIXED
# - this.page.getByText('Success')                     <- String 'Success' is FIXED
# - this.page.locator('table tbody tr')                <- CSS selector is FIXED
# - this.frame.locator('.modal-content')               <- CSS class is FIXED

# Examples of VARIABLE (CAN remain in the method):
# - this.page.getByText(data.name)                    <- Uses variable
# - this.page.locator(`tr:has-text("${id}")`)          <- Uses template literal with variable
# - this.locatorRecordsTable.locator('tr').filter({ hasText: name }) <- Chains with variable
```

**Decision Checklist:**

| Question | Response | Action |
♪ ♪ -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
| Locator uses fixed value? | YES | ✅ Constructor |
| Do you use parameter value? | NO | ✅ Constructor |
| Locator uses `.filter()` with variable? | NO | ✅ Constructor |
| Locator depends on method data? | NO | ✅ Constructor |
| Does locator use method parameter? | YES | You can stay in the method |

**Reason:** Centralizing all static locators facilitates maintenance and avoids duplication.

---

### **D. Try/Catch Required for Action Buttons and Options**

> **⚠CRITICAL AND MANDATORY RULE: Action Buttons and Options that open dropdown menu MUST ALWAYS use try/catch with `{force: true }` to ensure reliable execution**

**🔍 AUTOMATIC DETECTION - WHEN TO APPLY:**

Apply this rule when identifying button with:

- HTML structure: `<s-button><p-tieredmenu appendto="body"></p-tieredmenu><button>Actions</button></s-button>`
- Common text: "Actions" or "Options" (but it can be any text)
- Located in grids/tables
- Menu items rendered in 'body' (button structure OUTSIDE)

**🚨 MANDATORY STANDARD:**

```javascript
constructor(page) {
  this.page = page;

  // ✅ Button locator (inside the grid)
  this.locatorActionsButton = this.page.getByRole('button', { name: 'Actions' });

  // Menu options locators (rendered in body)
  this.locatorMenuEditLink = this.page.getByRole('menuitem', { name: 'Edit' });
  this.locatorMenuDuplicateLink = this.page.getByRole('menuitem', { name: 'Duplicate' });
  this.locatorMenuDeleteLink = this.page.getByRole('menuitem', { name: 'Delete' });
}

/**
 * Open edit modal for selected record via Actions menu
 */
async openEdit() {
  // Required Retry: appendto="body" in s-button causes intermittent visual problem
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await this.locatorActionsButton.click({ force: true });
      await this.locatorMenuEditLink.click({ force: true });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
}

/**
 * Duplicate selected record via Actions menu
 */
async duplicateRecord() {
  // Required Retry: appendto="body" in s-button causes intermittent visual problem
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await this.locatorActionsButton.click({ force: true });
      await this.locatorMenuDuplicateLink.click({ force: true });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
}
```

**📋 CHECKLIST CORRECT:**

- [ ] Loop `for` with `try <= 2` around ALL sequence (menu button + menu option)
- [ ] BOTH clicks use `{force: true }`
- [ ] Catch block re-throwers in the last attempt (`if (attempt === 2) throw error`)
- [ ] Try block ends with ‘break’ to quit the loop in case of success
- [ ] Comment documenting motive: `// Retry mandatory: appendto="body" in s-button causes intermittent visual problem`

**❌ ANTI-PATTERNS (DO NOT DO):**

```javascript
// WRONG - No Retry
async openEdit() {
  await this.locatorActionsButton.click();
  await this.locatorMenuEditLink.click();
}

// ERROR - Duplicate Branches (violates SonarQube S1871)
async openEdit() {
  try {
    await this.locatorActionsButton.click({ force: true });
    await this.locatorMenuEditLink.click({ force: true });
  } catch {
    await this.locatorActionsButton.click({ force: true });
    await this.locatorMenuEditLink.click({ force: true });
  }
}

// WRONG - Missing { force: true }
async openEdit() {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await this.locatorActionsButton.click();
      await this.locatorMenuEditLink.click();
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
}

// WRONG - Using timeout/wait
async openEdit() {
  await this.locatorActionsButton.click();
  await this.page.waitForTimeout(1000);
  await this.locatorMenuEditLink.click();
}
```

**⚙TECHNICAL REASON:**

- Menu with `appendto="body' causes visual loading problem
- First click may not open the options correctly
- `{force: true }` ignores visibility/interactivity checks
- Try/catch ensures automatic retry without adding unnecessary waits

**🎯 APPLICATION:**

- **ALWAYS:** "Actions"/"Options" buttons in grids with `p-tieredmenu appendto="body"`
- **NEVER:** Normal clicks (getByRole('button').click() without dropdown menu)

---

### **E. Forbidden Multiple CSS Selectors in A Locator**

> **⚠CRITICAL RULE: NEVER use multiple CSS selectors separated by comma or unnecessary complex selectors in a single locator**

**DEFINITION OF ANTI-PATTERN:**

- Location with multiple CSS selectors separated by comma (`,`)
- Selectors with complex wildcards (`[class*="..."][class*="..."]`)
- Try "cover all possibilities" in a single locator

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
constructor(page) {
  this.page = page;

  // WRONG - Multiple CSS comma selectors
  this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title, .kanban-item__header, [class*="kanban"][class*="title"]');

  // Wrong - Unnecessary complex selector
  this.locatorModalDialog = this.page.locator('[class*="modal"][class*="content"], .modal-dialog, #modal');

  // WRONG - Trying to cover multiple variations
  this.locatorBotao = this.page.locator('button.primary, button.main, button[type="submit"]');
}
```

**✅ Correct pattern:**

```javascript
constructor(page) {
  this.page = page;

  // Correct - Validate HTML and use ONLY the REAL selector that exists
  // After grep search in HTML, identify that the real class is .kanban-card-title
  this.locatorKanbanCardTitleDiv = this.page.locator('.kanban-card-title');

  // Correct - If element has scroll, use getByRole
  this.locatorModalDialog = this.page.getByRole('dialog');

  // Correct - Use Playwright semantic locator
  this.locatorBotaoSubmit = this.page.getByRole('button', { name: 'Enviar' });
}
```

**MANDATORY PROCEDURE:**

1. **Run grep search in specific HTML** to identify the REAL selector
2. **Use ONLY the selector that exists in HTML** (do not try to "prevent" variations)
3. **Prioritize semantic locations** (getByRole, getByText) instead of CSS
4. **If you need CSS:** Use ONLY a class/ID, not multiple options

**Why locators with multiple selectors are bad:**

- ❌ **Fragile:** If any of the selectors changes, locator can break
- ❌ **Ambiguous:** It is unclear which element will be found
- ❌ **Hard to debugging:** When it fails, it is not known which selector caused the problem
- ❌ **Performance:**Playwright needs to test multiple selectors
- ❌ **Maintenance:** Impossible to know which selector is in use without testing

**MANDATORY VALIDATION (grep search in HTML):**

```bash
# STEP 1: Identificar elemento no HTML
grep_search(query="{texto_elemento}", includePattern="{arquivo}.html", isRegexp=false)

# STEP 2: Ler contexto HTML para ver estrutura REAL
read_file(startLine={linha-10}, endLine={linha+10})

# STEP 3: Usar APENAS o seletor/role que existe no HTML
# NEVER try to "cover possibilities" with multiple selectors
```

**Reason:** Locators should be accurate and based on REAL HTML, not on assumptions or attempts to "cover variations".

---

### **F. Forbidden Create Unused Locators**

> **⚠CRITICAL RULE: NEVER create locators in the constructor that are not used in any method**

**DEFINITION OF ORphan LOCATOR:**

Locator declared in constructor but NOT shown in NO method of class.

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
constructor(page) {
  this.page = page;

  this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
  this.locatorCancelButton = this.page.getByRole('button', { name: 'Cancel' });
  this.locatorKanbanCardBody = this.page.locator('.kanban-card-body'); // NEVER used
  this.locatorConfirmationModal = this.page.getByRole('dialog'); // NEVER used
}

async saveRecord() {
  await this.locatorSaveButton.click();
  // locatorCancelButton, locatorKanbanCardBody and locatorConfirmationModal NEVER used
}
```

**✅ Correct pattern:**

```javascript
constructor(page) {
  this.page = page;

  // RIGHT - Create ONLY locators that will be used
  this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
  this.locatorCancelButton = this.page.getByRole('button', { name: 'Cancel' });
}

async saveRecord() {
  await this.locatorSaveButton.click();
}

async cancelEdit() {
  await this.locatorCancelButton.click();
}
```

**MANDATORY VALIDATION PROCEDURE ( BEFORE FINISHING):**

```bash
# STEP 1: Listar TODOS os locators do constructor
grep_search(query="this\\.locator", includePattern="{file}Page.js", isRegexp=true)

# STEP 2: For EACH locator found, check if it is used:
grep_search(query="{nomeLocator}", includePattern="{file}Page.js", isRegexp=false)

# STEP 3: Contar occurrences:
# - 1 occurrence = ONLY in constructor (ORPHAN - REMOVE)
# - 2+ occurrences = constructor + method(s) (OK)

# STEP 4: Remover TODOS os locators com apenas 1 occurrence
```

**Validation Checklist:**

| Locator | Events | Status | Action |
| --------- | ----------- | -------- | ------ |
| `this.locatorSaveButton' | 3 (builder + 2 methods) | USED | Keep |
| `this.locatorKanbanCardBody' | 1 (constructor only) | ORFAN | Remove |
| 'this.locatorModalConfirmation' | 1 (constructor only) | ORFAN | Remove |

**Why orphaned locators are bad:**

- ❌ **Code pollination:**Difficult constructor reading
- ❌ **Maintenance:** Someone might think it's used and be afraid to remove
- ❌ **Confusion:** Can indicate incomplete functionality
- ❌ **Minimal performance:** Consumes memory unnecessarily

**SINGLE EXCEPTION PERMITED:**

Locations for future features** Should have explicit comment:

```javascript
// ALL: Implement modal validation (JIRA-123)
// this.locatorConfirmationModal = this.page.getByRole('dialog');
```

**Reason:** Constructor must contain ONLY locators that are effectively used in the implemented methods.

---

### **G. Forbidden Slint-disable Without Valid Justification**

> **⚠CRITICAL RULE: NEVER use `// slint-disable-next-line` or `// slint-disable` without valid technical justification**

**WHEN SLINT-disable It is forbidden:**

- ❌ To silence warning indicating incorrect code
- ❌ To "facilitate" implementation by ignoring good practices
- ❌ To bypass Playwright rule without understanding why
- ❌ No comment explaining why it is necessary

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
// WRONG - Silenced warning of bad practice without justification
async buscarPrimeiroRegistro() {
  // eslint-disable-next-line playwright/no-nth-methods
  return this.page.locator('tr').first();
}

// Wrong - Disabling rule that should be followed
async accessScreen() {
  // eslint-disable-next-line playwright/missing-playwright-await
  this.page.goto('/tela'); // ❌ Falta await
}

// Wrong - Disable for entire file for no reason
/* eslint-disable playwright/no-wait-for-timeout */
```

**✅ WHEN SLINT-DISABLE IS PERMITED:**

```javascript
// PERMITED - Specific case with valid technical justification
async buscarRegistroPorPosicao(posicao) {
  // eslint-disable-next-line playwright/no-nth-methods
  // Reason: Position is method parameter, cannot use constructor
  // Exhausted alternatives: filters per text/roll not applicable
  return this.page.locator('tr').nth(posicao);
}

// PERMITED - External library without types
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lib = require('biblioteca-legada');
```

**MANDATORY PROCEDURE BEFORE USING SLINT-disable:**

1. **Understand warning:** Read rule documentation in ESLint/Playwright
2. **Try to fix code:** Apply the correction suggested by the rule
3. **Search alternatives:** Consult Playwright docs for proper solution
4. **Validate need:** Confirm that there is NO way to follow the rule
5. **Document justification:** Comment COMPLETE EXPLAINING:
   - Why the rule cannot be followed
   - What alternatives have been attempted
   - Why this is the only solution

**RULES DE slint-disable MORE VIOLATED (AND HOW TO RUN):**

| Violated Rule | ❌ Wrong code with disable | ✅ Correct code WITHOUT disable |
...----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
| ‘playwright/no-nth-methods’ | `// slint-disable` / `locator.first()` | `this.locatorFirst Line = this.locator.first();` in the constructor |
| ‘playwright/missing-playwright-await’ | `// slint-disable` / `page.goto(url)` | `await page.goto(url)` |
| ‘playwright/no-wait-for-timeout’ | `// slint-disable` / `page.waitForTimeout(1000)` | Use `expect(locator).toBeVisible()` (auto-wait) |
| ‘playwright/no-page-pause’ | `// slint-disable` / `await page.pause()` | Remove pause (use only in local debug) |

**MANDATORY VALIDATION ( BEFORE FINISHING):**

```bash
# Buscar TODOS os eslint-disable no arquivo
grep_search(query="eslint-disable", includePattern="{file}Page.js", isRegexp=false)

# Para CADA occurrence:
# 1. Ler contexto (5 linhas antes/depois)
# 2. Identify which rule is being disabled
# 3. Check if there is technical justification in comment
# 4. Validate if code can be fixed instead of disabled
# 5. If there is NO valid justification: REMOVE eslint-disable and FIX the code
```

**Why Slint-disable without justification is bad:**

- ❌ **Silence real problems:** Warnings exist to improve quality
- ❌ **Bad technique accepted:** Perpetrates bad practice instead of correcting
- ❌ **Makes code review harder:** Reviewer does not know if it was intentional or forgotten
- ❌ **Degrade codebase:** Exceptional accumulation makes code less reliable

**Reason:** ESLint and Playwright rules exist to ensure quality and reliability. Disable without valid technical justification compromises these objectives.

---

## **CRITICAL IMPORT RULES**

### **A. Imports of External Dependencies**

> **⚠NEVER use internal external package paths when public export is available**

---

### **B. Required Navigation Imports**

> **⚠js`**

**✅ Correct pattern:**

```javascript
import { FEATURE_NAME } from '../../helpers/navegacao.js';
```

**Use in the method `accessScreen()`:**

```javascript
async accessScreen() {
  // Navigate to specified URL
  await this.page.goto(FEATURE_NAME.URL);
  // OU
  await this.featurePage.navigateToPage(...FEATURE_NAME.DIRECTORY);

  await expect(this.locatorHeadingPrincipal).toBeVisible();
}
```

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
// Wrong - Method receiving URL parameter
async accessScreen(url) {
  await this.page.goto(url);
}

// ERROR - hardcoded URL
async accessScreen() {
  await this.page.goto('https://system. with/module/screen');
}
```

---

## 📊 **EXECUTIVE SUMMARY: 13 Golden Rules**

| # Oh, yeah | Rule | What to do | WHAT NOT TO DO |
♪ ♪ -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
| **1** | **Full methods** | Full flow with internal logic blocks (strategic comments) | Fragment in micro-methods Or create confusing giant methods |
| **2** | **Locators in the Builder** | ALL static locators in the constructor | Create inline locators in the methods |
| **3** | **No Test Actions** | Encapsulate EVERYTHING in Page Object methods | ❌ `.click()`, `.fill()`, `expect()` diretos nos testes |
| **4** | **Useful Helpers** | Create helper ONLY if used 3+ times | ❌ Trivial methods (1 command) |
| **5** | **Clean Code** | Descriptive names in English, DRY, validations | Generic names, English, duplication |
| **6** | **Try/Catch "Actions"** | ALWAYS try/catch for "Actions"/"Options" buttons in grids | ❌ Direct click without retry (intermittent failure) |
| **7** | **JSDoc with JSON** | `@param {object} data` + line `Example: JSON CONSTANT` | Omit or detail fields |
| **8** | **Locators Without Parameter** | ALWAYS in the constructor (universal rule) | ❌ Criar locator sem parameter no method |
| **9** | **Standard Timeout** | Use Playwright (30s global timeout) | NEVER use `{timeout: X }` in expect/actions |
| **10** | **Public Imports** | Use public package exports | ❌ internal dependency paths |
| **11** | **Single CSS Selector** | Use real HTML selector only validated with grep | Multiple comma selectors (`a, .b, .c`) |
| **12** | *No Orphan Locators* | Create ONLY used locators (validate with grep) | ❌ Locators no constructor not usados em methods |
| **13** | **Justified** | Use ONLY with comment explaining technical reason | ❌ eslint-disable without justification or to bypass bad practice |

---

## 🎯 **Purpose**

Page Objects encapsulate interaction with interface elements and user actions on a page/screen.

**When to create:**

- Represent a system-specific screen/functionality
- Encapsulate locators and methods of interaction with UI
- Reuse common actions in multiple tests

**When NOT to create:**

- For external backend/services operations

---

## 📁 **Page Object Model (POM)**

### **Fundamental Guidelines:**

- ✅ One class per page/component in `pages/`
- ✅ **Methods represent specific business actions or user actions**
- ✅ **Each method must have a unique purpose, clear name and be reusable when applicable**
- ✅ **Semantic structured methods:** commands grouped with clear responsibility
- ✅ **MANDATORY LANGUAGE: English** - All methods, variables and comments MUST be in English (never mix Portuguese with English)
- ❌ **NEVER** hardcoded selectors in methods
- ❌ **NEVER** create trivial methods such as 'clickBotao()', 'clickButton()', 'click()' - prefer business actions like 'saveFormulation()', 'confirmExclusion()', 'applyFilters()'
- ❌ ** NEVER mix English with Portuguese in the nomenclature of methods or variables

---

## 🎯 **RULE #1: Complete and Functional Methods**

> **⚠THIS IS THE MOST IMPORTANT RULE FOR PAGE OBJECTS**
>
> **Methods to perform COMPLETE business FLOWS, internally organized into clear logical blocks**

### **🏗Ideal Method Structure:**

**Each method shall:**

1. **Perform a complete business flow** (not too fragmented)
2. **Organize internally into logical blocks** (with strategic comments)
3. **Maintain good readability** (clean and self-explanatory code)
4. **Validate important states** with `expect()`
5. **Use only constructor locators** (no inline locators, except dynamic)

> **📘 For priority order when creating locators:** See `.github/copilot-modules/03-locators-semanticos.md`

---

---

## 📦 **Imports Template**

```javascript
// Navigation Imports
import { FEATURE_NAME } from '../../helpers/navegacao.js';

// Imports of constants (if necessary)
import { ID_CONTA_LOOKUP, ID_TIPO_DROPDOWN } from '../../data/{caminho}/{arquivo}Json.js';
```

**Imports Checklist:**

- [ ] Imported navigation of 'helpers/navigation. js`
- [ ] Extension `.js' present in relative imports
- [ ] No module resolution errors

---

### **✅ CREATE Methods For:**

#### **1. Complete Business Actions (Flow Whole)**

**Basic Principle:** A method = a complete user action, internally organized into clear logical blocks.

**🎯 Ideal Balance:**

- ✅ **Complete method:** Represents entire business flow (not fragmentary)
- ✅ **Internal organisation:** Split into logical blocks with strategic comments
- ❌ **Avoid:** Giant and confusing methods (without organization)
- ❌ **Avoid:** Excessive fragmentation in trivial micro-methods

**Full flow examples:**

- **Register complete record:** Open form + fill all fields + save + validate success
- **Edit Register:** Find in table + open edit + modify fields + save + validate
- **Delete with Confirmation:** Select item + open modal + confirm + validate removal
- **Apply filters:** Expand panel + meet criteria + execute search + validate results

**🎯 Example of Ideal Internal Organization:**

```javascript
async registerGateEntry(data) {
  // Open registration modal and wait for full load
  await this.locatorAdicionarButton.click();
  await expect(this.locatorRegistrationModal).toBeVisible();

  // Fill required fields
  await this.locatorNameInput.fill(data.name);
  await this.formUtils.fillFieldSLookup(ID_PHYSICAL_LOCATION, data.physicalLocation);
  await this.locatorTemporaryValidityInput.fill(data.temporaryValidity);

  // Fill optional fields
  if (data.scheduledValidity) {
    await this.locatorScheduledValidityInput.fill(data.scheduledValidity);
  }

  if (data.visitControl) {
    await this.locatorVisitControlCheckbox.check();
  }

  // Submit the form and validate success
  await this.locatorSaveButton.click();
  await expect(this.locatorSuccessAlert).toBeVisible();
  await expect(this.locatorRegistrationModal).toBeHidden();
}
```

**✅ GOOD BECAUSE:**

- **Complete flow:** One method contains the entire registration journey
- **Clear blocks:** Each section has a well-defined purpose (Opening, Filling, Submission)
- **Strategic comments:** Demarcate the beginning of each logical block
- **Legibility:** Easy to understand what each part does
- **Maintenance:** Changes located in specific blocks
- **No fragmentation:** No need to call 5 different methods to register

**❌ CONTRA-EXAMPLE: Excessive Fragmentation (DO NOT DO):**

```javascript
// Wrong: 4 small methods for one action only
async openRegistrationModal() {
  await this.locatorAdicionarButton.click();
  await expect(this.locatorRegistrationModal).toBeVisible();
}

async fillRequiredFields(data) {
  await this.locatorNameInput.fill(data.name);
  await this.formUtils.fillFieldSLookup(ID_PHYSICAL_LOCATION, data.physicalLocation);
}

async fillOptionalFields(data) {
  if (data.scheduledValidity) {
    await this.locatorScheduledValidityInput.fill(data.scheduledValidity);
  }
}

async submitForm() {
  await this.locatorSaveButton.click();
  await expect(this.locatorSuccessAlert).toBeVisible();
}

// PROBLEM: Now the test needs to call 4 methods for 1 action:
// await page.openRegistrationModal();
// await page.fillRequiredFields(data);
// await page.fillOptionalFields(data);
// await page.submitForm();
// IMPACT: Verbose code, difficult maintenance, Violates Clean Code
```

**❌ CONTRA-EXAMPLE: Giant Method Without Organization (DO NOT DO):**

```javascript
// WRONG: Giant method without logical blocks
async registerGateEntry(data) {
  await this.locatorAdicionarButton.click();
  await expect(this.locatorRegistrationModal).toBeVisible();
  await this.locatorNameInput.fill(data.name);
  await this.formUtils.fillFieldSLookup(ID_PHYSICAL_LOCATION, data.physicalLocation);
  await this.locatorTemporaryValidityInput.fill(data.temporaryValidity);
  if (data.scheduledValidity) {
    await this.locatorScheduledValidityInput.fill(data.scheduledValidity);
  }
  if (data.visitControl) {
    await this.locatorVisitControlCheckbox.check();
  }
  await this.locatorSaveButton.click();
  await expect(this.locatorSuccessAlert).toBeVisible();
  await expect(this.locatorRegistrationModal).toBeHidden();
}
// PROBLEM: Hard to identify where to start/end each step
// IMPACT: Confused maintenance, difficult debug
```

**🎯 Practical Rule:**

| Situation | Solution |
| ---------- | --------- |
| **Complete business flow** (register, edit, delete, filter) | ✅ **1 method completo** com internal logical blocks |
| **Method getting too big**(>25 lines) | **Divide into blocks** with clear comments (DO NOT create micro-methods) |
| **Logic repeats 3+ times** | **Create auxiliary method**reusable (e.g. ‘waitLoading()’) |
| **Trivial method** (1-2 commands) | **DO NOT create** - incorporate into the main method |

---

#### **2. Business Validations (State/Result)**

- **Validate full screen loading:** Title + main elements + no loading
- **Validate action result:** Toast + data update + correct final status
- **Validate registration presence:** Search table + extract data + return object

**Example:**

```javascript
async validateRegisteredGateEntry(gateEntryName) {
  // Wait for loading to disappear
  await expect(this.locatorLoadingSpinner).toBeHidden();

  // Locate record in table
  const locatorRow = this.locatorRecordsTable.locator('tbody tr').filter({ hasText: gateEntryName });
  await expect(locatorRow).toBeVisible();

  // Extract and return data (for additional validations in the test)
  const name = await locatorRow.locator('td').nth(1).textContent();
  const status = await locatorRow.locator('td').nth(2).textContent();

  return { name: name.trim(), status: status.trim() };
}
```

---

#### **3. Method `accessScreen()` (MANDATORY)**

> **🚨 ABSOLUTE CRITICAL RULE - FREQUENT VIOLATION:**
>
> **⛔ Method `accessScreen()` NEVER, UNDER ANY CIRCUMSTANCE, RECEIVES PARAMETERS**

**🔴 MANDATORY PROCEDURE (3 STEPS):**

**STEP 1:** Import navigation constant at the top of file

```javascript
import { REAL_FEATURE_NAME } from '../../helpers/navegacao.js'; // Replace with the real name from navegacao.js
```

**STEP 2:** Create Method No parameters

```javascript
/**
 * Access the [Feature Name] screen
 */
async accessScreen() {
  // Option 1: Browse directly through the URL
  await this.page.goto(REAL_FEATURE_NAME.URL);

  // Option 2: Browse the menu using spread operator
  await this.featurePage.navigateToPage(...REAL_FEATURE_NAME.DIRECTORY);

  // Wait for the main element on screen
  await expect(this.locatorMainTitle).toBeVisible();
}
```

**STEP 3:** Use in the without passing parameters test

```javascript
// Correct - Call without parameters
test.beforeEach(async ({ page }) => {
  logger.test(test.info().title);
  await page.featurePage.login(TOKEN_USUARIO);
  await page.featurePage.accessScreen(); // No arguments
});
```

---

**❌ IMPLEMENTATIONS NOT TO DO:**

```javascript
// CRITICAL ERROR #1 - Signature parameter
async accessScreen(url) { // NEVER add parameters here
  await this.page.goto(url);
}

// CRITICAL ERROR #2 - Constant parameter
async accessScreen(NAVIGATION_CONSTANT) { // NEVER add parameters here
  await this.page.goto(NAVIGATION_CONSTANT.URL);
}

// ❌ ERROR #3 - URL hardcoded (without importing constant)
async accessScreen() {
  await this.page.goto('https://system. with/screen'); //
}

// ❌ ERROR #4 - Undefined variable (constant not imported)
async accessScreen() {
  await this.page.goto(REAL_FEATURE_NAME.URL); // Constant was not imported
}
```

---

**❌ INCORRECT CALLS IN THE TEST:**

```javascript
// ERROR - Passing constant as parameter
await page.featurePage.accessScreen(REAL_FEATURE_NAME);

// ERROR - Passing URL as parameter
await page.featurePage.accessScreen(REAL_FEATURE_NAME.URL);

// ERROR - Passing string
await page.featurePage.accessScreen('url');
```

---

**✅ VALIDATION CHECKLIST:**

- [ ] **1.** Did I import the navigation constant at the top of the Page file?
- [ ] **2.** Imported constant has a real name of the functionality (e.g. 'PORTARIAS', 'CONTAS', not placeholder)?
- [ ] **3.** Is the method signature EXACTLY `async accessScreen() {`(No parameters)?
- [ ] **4.** Within the method use `CONSTANT IMPORTED.URL` or `...CONSTANT IMPORTED. DIRECTORY`?
- [ ] **5.** Did I import ONLY constant that will be used (I did not import 5 and used 1)?
- [ ] **6.** In the test, I call method NO arguments: `await page. xxxPage.accessScreen()`?

### ⛔ IF ANY ANSWER = NO: IMPLEMENTATION INCORRECT - Adjust before proceeding

---

**📋 ABSOLUTE RULES:**

1. ✅ Always import constant from 'helpers/navigation. js` at the top of file
2. ✅ Use `CONSTANT REAL.URL` or `...CONSTANT REAL.Directory' within the method
3. ✅ Validate main element after navigation
4. ✅ Import ONLY what will be used
5. ❌ NEVER add parameter 'url' to the method signature
6. ❌ NEVER add 'constant' parameter to the method signature
7. ❌ NEVER add ANY parameter in the method signature
8. ❌ NEVER hardcoded URLs
9. ❌ NEVER use unimported variable

---

#### **🚨 ANTI-ERROR CHECKLIST

> **⚠These are the two most frequent mistakes - always valid:**

**ERROR #1: Parameter on `accessscreen()`**

- [ ] ✅ Method `accessScreen()` is WITHOUT parameters in signature?
- [ ] ✅ Navigation constant is imported at the top of the file?
- [ ] ❌ Method DOES NOT receive `url`, `constant', or any parameter?

**Correct example:**

```javascript
import { FEATURE_NAME } from '../../helpers/navegacao.js';
async accessScreen() {
  await this.page.goto(FEATURE_NAME.URL);
  await expect(this.locatorTitleHeading).toBeVisible();
}
```

### ERROR #2: JSDoc with generic placeholder or no line Example

- [ ] ✅ JSDoc has line ‘Example:’ (never isolated)?
- [ ] ✅ Does JSON's name use placeholder `JSON {CONSTANT}` in the template?
- [ ] ✅ In the implementation, placeholder was replaced by the REAL JSON name corresponding to the file in `data/`?
- [ ] ❌ JSDoc DO NOT detail fields ('data. field1`, 'data. field2`)?
- [ ] ❌ IS THERE NO `Example: JSON` without `@param {object}` on the previous line?

**Correct example:**

```javascript
/**
 * Registers a new record in the system
 * @param {object} data - Record data
 * Example: JSON_{CONSTANT}
 */
async registerRecord(data) { }
```

---

#### **4. USEFUL Auxiliary Methods (Not Too Fragmentary)**

**⚠IMPORTANT: Create auxiliary methods ONLY when:**

- Action repeats in 3+ places
- It involves reusable complex logic
- Significantly improves legibility

**✅ VALID examples of assistants:**

```javascript
// ✅ GOOD: Reused in register, edit, and search
async waitForCompleteLoading() {
  await expect(this.locatorLoadingSpinner).toBeHidden();
  await expect(this.locatorMainContent).toBeVisible();
}

// ✅ GOOD: Complex logic used in multiple flows
async openEditModal(identifier) {
  const locatorRow = this.locatorRecordsTable.locator('tbody tr').filter({ hasText: identifier });
  await locatorRow.locator(this.locatorActionButton).click();
  await this.locatorEditOption.click();
  await expect(this.locatorEditModal).toBeVisible();
}
```

**❌ Examples INVALID (excessive fragmentation):**

```javascript
// ❌ BAD: Trivial method (only 1 command)
async clickSaveButton() {
  await this.locatorSaveButton.click();
}

// ❌ BAD: Trivial method (only 1 validation)
async validateButtonVisible() {
  await expect(this.locatorButton).toBeVisible();
}

// ❌ BAD: Method used only once
async fillNameField(name) {
  await this.locatorNameInput.fill(name);
}
```

**🎯 Practical Rule:**

- **Auxiliary method:** Only if you use 3+ times OR involve complex logic
- **Flow method:** Always create complete (not fragmented into micro-methods)

---

#### **5. Methods Should NOT be Created For:**

**❌ PROHIBITED: Trivial actions (1 command only):**

```javascript
// Never do it.
async clickSaveButton() {
  await this.locatorSaveButton.click();
}

async fillName(name) {
  await this.locatorNameInput.fill(name);
}

async validateTitleVisible() {
  await expect(this.locatorTitleHeading).toBeVisible();
}
```

**❌ PROHIBITED: Excessive fragmentation:**

```javascript
// Wrong: 5 small methods
async openModal() { await this.locatorButton.click(); }
async waitForModal() { await expect(this.locatorModalDialog).toBeVisible(); }
async fillField1() { await this.locator1.fill('...'); }
async fillField2() { await this.locator2.fill('...'); }
async save() { await this.locatorSave.click(); }
```

```javascript
// Correct: 1 complete method
async registerRecord(data) {
  // Open modal
  await this.locatorButton.click();
  await expect(this.locatorModalDialog).toBeVisible();

  // Fill fields
  await this.locator1.fill(data.field1);
  await this.locator2.fill(data.field2);

  // Save and validate
  await this.locatorSave.click();
  await expect(this.locatorToast).toBeVisible();
}
```

**❌ PROHIBITED: Generic or English names:**

```javascript
// Never do it.
async validate() { }
async save() { }
async clickButton() { }
async fillField() { }
async validateButton() { } // English-only naming
```

---

## 🔒 **RULE #2: ALL Locators in the Constructor**

> **⚠CRITERIA: Locators MUST be in the constructor and MUST NEVER be inline in methods (except dynamic locators)**

### **📋 Locator Checklist:**

**✅ BUSINESS IN CONSTRUCTOR:**

1. **All static locators** (fixed values without parameter dependency)
2. **All locators reused** in multiple methods
3. **All basic elements** of page/modal/form
4. **Any locator that does NOT depend on the method parameter**

**✅ Allowed in Methods (Only if dynamic):**

- Locators that depend on method parameter
- Locators using variable value `.filter()`
- Locators built from method data

### **Correct example:**

```javascript
constructor(page) {
  this.page = page;
  this.frame = this.page.frameLocator('iframe[name="ci"]');

  this.ID_{DESCRIPTION}_{ELEMENT_TYPE} = '#{fieldId}';

  // ✅ ALL static locators here
  this.locatorTitleHeading = this.frame.getByRole('heading', { name: 'Balloons' });
  this.locatorAddButton = this.frame.getByRole('button', { name: 'Add' });
  this.locatorSaveButton = this.frame.getByRole('button', { name: 'Save' });
  this.locatorCancelButton = this.frame.getByRole('button', { name: 'Cancel' });
  this.locatorNameInput = this.frame.getByLabel('Name');
  this.locatorDescriptionInput = this.frame.getByLabel('Description');
}

// ✅ Dynamic locator in method (depends on parameter)
async findRecordByName(recordName) {
  const locatorRow = this.locatorRecordsTable
    .locator('tbody tr')
    .filter({ hasText: recordName }); // Dynamic: uses method parameter

  await expect(locatorRow).toBeVisible();
}
```

### **Example Wrong:**

```javascript
// NEVER DO: Static locators within methods
async clickSave() {
  const locatorSave = this.frame.getByRole('button', { name: 'Save' }); // WRONG
  await locatorSave.click();
}

async fillName(name) {
  const locatorName = this.frame.getByLabel('Name'); // WRONG
  await locatorName.fill(name);
}
```

```javascript
// Correct: Use constructor locators
async saveForm() {
  await this.locatorSaveButton.click(); // ✅ From constructor
}

async fillNameField(name) {
  await this.locatorNameInput.fill(name); // ✅ From constructor
}
```

### **🎯 Practical Decision Rule:**

**Before creating a locator in a method, ask:**

1. ❓ **Does this locator depend on a method parameter?**
   - ✅ YES → You can stay in the method
   - ❌ NO → Must be in the constructor

2. ❓ **Does this locator use a fixed value/hardcoded?**
   - ✅ YES → Must be in the constructor
   - ❌ NO → Check item 1

3. ❓ **Does this locator use '.filter()' with variable value?**
   - ✅ YES → You can stay in the method
   - ❌ NO → Must be in the constructor

---

## 🧪 **RULES #3: Tests Must NOT Have Direct Actions**

**🚨 CRITICAL RULE: Tests must not have direct '.click()`, '.fill()`, 'expect()`**

**Everything must be encapsulated in Page Object methods:**

```javascript
// COMPLETELY WRONG - Direct actions in the test
test(
  '001 - Should register a record',
  {
    tag: '@FEATURE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira. example.com/TASK-001'}
  },
  async ({ page }) => {
    // Arrange:
    const data = JSON_{CONSTANT}; // ❌ FORBIDDEN

    // Act:
    await page.featurePage.locatorNameInput.fill(data.name);           // ❌ FORBIDDEN
    await page.featurePage.locatorDescriptionInput.fill(data.description); // ❌ FORBIDDEN
    await page.featurePage.locatorSaveButton.click();                 // ❌ FORBIDDEN

    // Assert:
    await expect(page.featurePage.locatorSuccessAlert).toBeVisible(); // ❌ FORBIDDEN
  }
);
```

```javascript
// COMPLETELY RIGHT - All encapsulated in methods
test(
  '001 - Should register a record',
  {
    tag: '@FEATURE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira. example.com/TASK-001'}
  },
  async ({ page }) => {
    // Arrange: Prepare context for registration
    await page.featurePage.accessScreen();

    // Act: Encapsulation method All shares
    await page.featurePage.registerRecord(data);

    // Assert: Encapsulation method ALL validations
    await page.featurePage.validateRegisteredRecord(data.name);
  }
);
```

**Why encapsulate ALL?**

- ✅ **Reuse:** Same method used in multiple tests
- ✅ **Maintenance:** Change in locator = change in 1 place only
- ✅ **Clarity:** Express test Business INTENTION, not technical implementation
- ✅ **Clean Code:**Extraction of technical details
- ✅ **Legibility:** Test reads as natural language

## 🎯 **Principles of Well Structured Methods**

**Each method must follow these 5 principles:**

### **1. Complete Business Flow (No Fragmentation)**

- A method = a complete user action
- **Balance:** Complete method
- Example: `registrarBalooes()` does opening + filling + saving + validation (ALL in 1 method)

### **2. Organisation in Logic Blocks (Internal Clarity)**

- Use simple comments** to separate steps when the method is more complex
- Comments describe the intention of each section (opening, filling, submission, validation)
- **Not mandatory** for simple and direct methods
- Facilitates reading and maintenance **without creating micro-methods**

```javascript
// Example with comments (more complex method):
async registerRecord(data) {
  // Open registration modal and wait for full load
  await this.locatorAdicionarButton.click();
  await expect(this.locatorModalDialog).toBeVisible();

  // Fill required fields
  await this.locatorNameInput.fill(data.name);
  await this.locatorDescriptionInput.fill(data.description);

  // Save and validate operation success
  await this.locatorSaveButton.click();
  await expect(this.locatorToast).toBeVisible();
}

// Example without comments (simple method):
async fecharModal() {
  await this.locatorFecharButton.click();
  await expect(this.locatorModalDialog).toBeHidden();
}
```

### **3. Auxiliary Methods Only if Useful (Avoid Fragmentation)**

- Create Helper ONLY if used 3+ times OR complex logic
- **DO NOT create** trivial methods (1 command)
- **NO fragmentary** flows in micro-methods
- Valid examples: ‘WaitLoad()’, ‘OpenModalEdicate(identifier)’

### **4. All Hirers in Builder (No Exceptions)**

- Static locators = constructor (ALWAYS)
- Dynamic locators = methods ( ONLY depend on parameter)
- Stable and semantic selectors

### **5. Clean Code**

- Descriptive names in English
- No duplication (DRY)
- Validations with 'expect()' in key points
- JSDoc complete

---

## 🏆 **EXAMPLES OF WELL-STRUCTURED METHODS**

> **📌 USE THESE EXAMPLES AS REFERENCE FOR ALL METHODS**
>
> **🚨 REMEMBER: Tests should NEVER have direct actions, only called methods**

### **Example 1: Complete Business Action**

```javascript
/**
 * Create a new record with all required data
 * @param {object} data - Object with registration data
 * Example: JSON_{CONSTANT} (imported from data/{module}/{feature}Json.js)
 */
async registerRecord(data) {
  // Fill basic fields
  await this.locatorNameInput.fill(data.name);
  await this.locatorDescriptionInput.fill(data.description);

  // Interact with complex components
  if (data.category) {
    await this.formUtils.fillFieldPDropdown(this.ID_CATEGORY_DROPDOWN, data.category);
  }

  if (data.owner) {
    await this.formUtils.fillFieldSLookup(this.ID_OWNER_LOOKUP, data.owner);
  }

  if (data.startDate) {
    await this.formUtils.fillFieldPCalendar(this.ID_START_DATE_CALENDAR, data.startDate);
  }

  // Submit Form
  await this.locatorSaveButton.click();

  // Validate success
  await expect(this.locatorSuccessAlert).toBeVisible();
}
```

**✅ GOOD BECAUSE:**

- Represents full business action
- Group multiple related commands
- Accepts parameterable data object
- Validate action result

---

### **Example 2: Reusable Flow with Logic**

```javascript
/**
 * Apply filters to the list and wait for results
 * @param {object} criteria - Filter criteria
 * Example: JSON_{CONSTANTE_FILTRO}
 */
async applyFilters(criteria) {
  // Open filter panel
  await this.locatorOpenFiltersButton.click();
  await expect(this.locatorPainelFiltros).toBeVisible();

  // Apply filters with conditional logic
  if (criteria.status) {
    await this.locatorStatusSelect.selectOption(criteria.status);
  }

  if (criteria.periodo) {
    await this.locatorPeriodoRadio.check();
    await this.locatorPeriodoSelect.selectOption(criteria.periodo);
  }

  if (criteria.name) {
    await this.locatorNameFilterInput.fill(criteria.name);
  }

  // Execute filter
  await this.locatorFilterButton.click();

  // Wait for results update
  await expect(this.locatorLoadingSpinner).toBeHidden();
  await expect(this.locatorResults).toBeVisible();
}
```

**✅ GOOD BECAUSE:**

- Full flow of reusable use
- Conditional logic based on parameters
- Expects intermediate states
- Validate final status

---

### **Example 3: Complex Business Validation**

```javascript
/**
 * Validates if the record was correctly registered in the table
 * @param {string} identifierText - Unique record text
 * @returns {Promise<object>} Found record data
 */
async validateRegisteredRecord(identifierText) {
  // Create dynamic locator to search log
  const locatorRow = this.locatorRecordsTable
    .locator('tbody tr')
    .filter({ hasText: identifierText });

  // Validate visibility
  await expect(locatorRow).toBeVisible();

  // Extract data from row
  const name = await locatorRow.locator('td').nth(1).textContent();
  const status = await locatorRow.locator('td').nth(2).textContent();
  const date = await locatorRow.locator('td').nth(3).textContent();

  // Return Structured Object
  return {
    name: name.trim(),
    status: status.trim(),
    date: date.trim(),
  };
}
```

**✅ GOOD BECAUSE:**

- Structured validation with useful return
- Parameter-based dynamic locator
- Organized data extraction
- Typed return for test use

---

### **Example 4: Complex Interaction with Components**

```javascript
/**
 * Opens edit modal and fills updated data
 * @param {string} recordName - Name of the record to edit
 * @param {object} newData - Data for update
 * Example: JSON_{CONSTANT_EDIT}
 */
async editRecord(recordName, newData) {
  // Locate record row
  const locatorRow = this.locatorRecordsTable
    .locator('tbody tr')
    .filter({ hasText: recordName });

  // Open Action Menu
  await locatorRow.locator(this.locatorActionsButton).click();
  await this.locatorEditOption.click();

  // Wait for modal
  await expect(this.locatorEditModal).toBeVisible();

  // Update only changed fields
  if (newData.name) {
    await this.locatorNameInput.fill(newData.name);
  }

  if (newData.status) {
    await this.locatorStatusSelect.selectOption(newData.status);
  }

  // Save Changes
  await this.locatorSaveButton.click();

  // Validate modal close and success
  await expect(this.locatorEditModal).toBeHidden();
  await expect(this.locatorSuccessAlert).toBeVisible();
}
```

**✅ GOOD BECAUSE:**

- Full editing flow
- Conditional logic for optional fields
- Intermediate and final validations
- Represents actual user action

---

### **Example 5: Try/Catch Method for "Actions"/"Options" Buttons**

```javascript
/**
 * Delete selected record via Actions menu
 * @param {string} recordName - Name of the record to delete
 */
async deleteRecord(recordName) {
  // Locate and select record
  const locatorRow = this.locatorRecordsTable
    .locator('tbody tr')
    .filter({ hasText: recordName });

  await locatorRow.locator('input[type="checkbox"]').check();

  // Required Retry: appendto="body" in s-button causes intermittent visual problem
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await this.locatorActionsButton.click({ force: true });
      await this.locatorMenuDeleteLink.click({ force: true });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }

  // Confirm deletion
  await this.locatorConfirmDeleteButton.click();

  // Validate success
  await expect(this.locatorSuccessAlert).toBeVisible();

  // Validate that registration no longer exists
  await expect(locatorLinha).toBeHidden();
}
```

**✅ GOOD BECAUSE:**

- Robust treatment with try/catch + `{force: true }`
- Automatic Recovery without Failed Test
- Multiple successful validations
- Represents complete flow of exclusion

---

### **❌ CONTRA-EXAMPLES (DO NOT DO)**

```javascript
// EXAMPLE 1: Direct actions in the test (ABSOLUTELY PROHIBITED)
test(
  '001 - Incorrect test',
  {
    tag: '@EXAMPLE_WRONG',
    annotation: { type: 'Issue', description: 'https://jira. example.com/TASK-001'}
  },
  async ({ page }) => {
    // Arrange: (omitted to brevity)

    // Act:
    await page.featurePage.locatorNameInput.fill('John');              // Never do it.
    await page.featurePage.locatorSaveButton.click();                // Never do it.

    // Assert:
    await expect(page.featurePage.locatorMensagem).toBeVisible();      // Never do it.
  }
);
// PROBLEM: Test know technical details of UI (locators, Playwright commands)
// IMPACT: Hard maintenance, not reusable, violates Clean Code
// SOLUTION: Create registration methodRegister() encapsulating ALL actions

// EXAMPLE 2: Trivial method of a command (ABSOLUTELY PROHIBITED)
async clickSaveButton() {
  await this.locatorSaveButton.click();
}
// PROBLEM: Only encapsulates 1 command without added value or business context
// IMPACT: Violation of business methods, creates code pollution
// SOLUTION: Create complete method (e.g. saveFormularyComValidation()) that includes click + validations

// EXAMPLE 3: Trivial method of a command in English
async clickButton() {
  await this.locatorButton.click();
}
// PROBLEM 1: Trivial method of a command (forbidden)
// PROBLEM 2: Name in Portuguese (forbidden - must be English)
// SOLUTION: Create business method in English (e.g. ConfirmAction())

// EXAMPLE 4: Method that fills only one field
async fillName(name) {
  await this.locatorNameInput.fill(name);
}
// PROBLEM: Only 1 command, no business context
// SOLUTION: Create registration methodRegister() that fills all fields

// EXAMPLE 5: Generic name method
async validarCampos() {
  await expect(this.locatorCampo1).toBeVisible();
  await expect(this.locatorCampo2).toBeVisible();
}
// PROBLEM: Name does not describe WHAT is being validated
// SOLUTION: Rename to validate Required fieldsFormulatory()

// EXAMPLE 6: Method mixing English with Portuguese (PROHIBIDO)
async validarButton() { }
async clickSalvar() { }
async fillName() { }
// PROBLEM: Mixing languages in nomenclature
// SOLUTION: Use ONLY English: validateButton(), saveForm(), fillName()

// EXAMPLE 7: Multiple responsibility method
async registerAndValidate(data) {
  await this.register(data);
  await this.validateSuccessMessage();
  await this.validateInTable(data.name);
  await this.validateInDatabase(data.id);
}
// PROBLEM: Mixing action + validations UI + bank validations
// SOLUTION: Separate in different methods (registration, validationUI, validationDB) and orchestrate in the test
```

### 🚨 SUMMARY: WHAT NEVER TO DO

| PROHIBITED | Correct |
| ------------ | ----------- |
| **Direct actions in the test** (`.click()`, `.fill()`, `expect()`) | **Encapsulate EVERYTHING in methods** from Page Object |
| **Trivial methods** (`clickBotao()`, `clickButton()`) | **Full business methods**('saveFormulation()', 'confirmExclusion()') |
| **Mix English with Portuguese**(`validarButton()`, `clickSave()`) | **Only English**(`validateButton()`, `saveForm()`) |
| Method with 1 command only | Complete business method (multiple related actions) |
| Generic name (`valid()`, `save()`) | Specific name(`validateFull-loadFromscreen()`) |
| Multiple responsibility method | Separate methods, single responsibility |

---

## 📝 **Methods Design Guidelines**

### **1. Clear and Descriptive Nomenclature**

```javascript
// BAD - English or generic
async validate() { }
async save() { }
async fetch(id) { }
async clickButton() { }
async fillField() { }
```

```javascript
// ❌ BAD - Mixes English with Portuguese
async validateButton() { }
async clickSave() { }
async fillField() { }
```

```javascript
// ✅ GOOD - English, specific and descriptive
async validateCompleteScreenLoad() { }
async saveFormWithValidation() { }
async fetchRecordByIdInTable(id) { }
async confirmDeletion() { }
async fillMandatoryFields() { }
```

### **2. Single Responsibility**

```javascript
// ❌ BAD - Does many different things
async processRegistration(data) {
  await this.validatePermission();
  await this.registerRecord(data);
  await this.sendEmail();
  await this.updateDashboard();
}
```

```javascript
// GOOD - Separate methods, compound in the test
async registerRecord(data) { /* registration only */ }
async validateRegistrationInTable(name) { /* validation only */ }
// In test: await register(); await validate();
```

### **3. Significant Parameters**

```javascript
// ❌ BAD
async edit(a, b, c) { }
```

```javascript
// ✅ GOOD
async editRecord(identifier, newData) { }
```

### **4. Custom Timeout - PROHIBITED**

```javascript
// WRONG - NEVER use custom timeout
await expect(this.locatorSuccessAlert).toBeVisible({ timeout: 10000 });
await expect(this.locatorModalDialog).toBeVisible({ timeout: 5000 });
await this.locatorBotao.click({ timeout: 3000 });
```

```javascript
// Correct - Use Playwright default timeout
await expect(this.locatorSuccessAlert).toBeVisible();
await expect(this.locatorModalDialog).toBeVisible();
await this.locatorBotao.click();
```

**🚨 CRITICAL RULES: NEVER use `{timeout: X }` in expect or actions**

- ❌ **FORBIDDEN:** `toBeVisible({ timeout: 10000 })`
- ❌ **FORBIDDEN:** `toBeHidden({ timeout: 5000 })`
- ❌ **FORBIDDEN:** `locator.click({ timeout: 3000 })`
- ✅ **CORRECT:** Use default timeout set to `playwright. config.js`

**Reason:** The standard timeout of the project (30s) is configured globally and meets all cases. Custom timeouts indicate structural problems (slow selectors, incorrect waits) that should be corrected at source.

### **5. Simplified Conditional Validations**

```javascript
// ERROR - redundant validation
if (data.provisoryCredentialsMonthlyLimit !== undefined) {
  await this.formUtils.fillField(ID_CAMPO_INPUT, data.provisoryCredentialsMonthlyLimit.toString());
}

if (data.schedulingCredentialValidityInHours !== undefined) {
  await expect(celulas.nth(2)).toContainText(data.schedulingCredentialValidityInHours.toString());
}
```

```javascript
// Correct - Simplified validation
if (data.provisoryCredentialsMonthlyLimit) {
  await this.formUtils.fillField(ID_CAMPO_INPUT, data.provisoryCredentialsMonthlyLimit.toString());
}

if (data.schedulingCredentialValidityInHours) {
  await expect(celulas.nth(2)).toContainText(data.schedulingCredentialValidityInHours.toString());
}
```

### 🚨 RULE: Use true/falsy validation, no explicit comparison with ‘undefined’

- ❌ **REDUNDANT:** `if (data.field !== undefined)`
- ❌ **REDUNDANT:** `if (data.field !== null)`
- ✅ **CORRECT:** ‘if (data.field)’

**Reason:** JavaScript automatically evaluates trout/falsy values. Explicit comparison with 'undefined' is verbose and unnecessary.

---

## 📝 *JSDoc*

### **Class Structure:**

> **🚨 ABSOLUTE RULE: JSDoc de CLASSE should never contain line `Example: JSON ...'**
> **🚨 ABSOLUTE RULE: JSDoc de CLASSE must never contain`@param`**
>
> The line `Example:` is EXCLUSIVE from JSDoc of **methods** receiving parameter `{object}`.
> The class JSDoc describes only WHAT the class does — NEVER refers to JSONs.
> `@param` of `page` must exist ONLY in the 'constructor' JSDoc, never in the class block.

```javascript
// Correct - JSDoc class SEM Example:
/**
 * Page Object para a tela de {NomeFuncionalidade}
 * Encapsulates actions for {description of actions}
 */
export class {NomeFuncionalidade}Page {
  /**
   * Constructor da classe
   * @param {object} page - Playwright page context
   */
  constructor(page) {
    // ...implementation...
  }
}
```

> **🚨 RESUMED RULE: ‘Example:’ ONLY EXISTS when there is JSON {object}` in the previous line.**
> **Any other use (class, method without parameter, method with @param {string}) = VIOLATION.**
>
> **For complete examples of Wrong vs Correct:** See section **MANDATORY VICTLE: `@param {object}` ↔ `Example: JSON {CONSTANT}`** above this module.

```javascript
// WRONG - Mix class description with constructor signature in the same block
/**
 * Page Object for the user registration screen.
 * @param {import('@playwright/test').Page} page - Page context.
 */
export class NomeDaFuncionalidadePage {
  constructor(page) {
    this.page = page;
  }
}

// RIGHT - Class block separated from the constructor block
/**
 * Page Object for the user registration screen.
 */
export class NomeDaFuncionalidadePage {
  /**
   * Creates the instance of the user registration page.
   * @param {import('@playwright/test').Page} page - Playwright page context.
   */
  constructor(page) {
    this.page = page;
  }
}
```

### **Structure for Methods:**

```javascript
/**
 * {Clear description of what the method does}
 * @param {string} parameter - Parameter description
 * @returns {Promise<string>} Return description
 */
async meuMetodo(parametro) {
  // ...implementation...
}
```

### **JSDoc Standard for JSON Parameters:**

> **🚨 ABSOLUTE RULE: NEVER DETAIL JSON'S INDIVIDUAL FIELDS**
>
> **✅ Correct:** `@param {Object} data - Data object` + line `Example: JSON CONSTANT`
>
> **❌ PROHIBITED:** `@param {string} data. field1` or `@param {Object} data. field2`

```javascript
/**
 * {Feature description}
 * @param {Object} data - Object with business data
 * Example: JSON_{CONSTANT}
 * @returns {Promise<void>}
 */
async metodoComJSON(data) {
  // ...implementation...
}

/**
 * {Feature description with multiple JSONs}
 * @param {Object} data - Objeto com data
 * Example: JSON_{CONSTANT_INCLUDE} or JSON_{CONSTANT_EDIT}
 * @returns {Promise<void>}
 */
async metodoComMultiplosJSONs(data) {
  // ...implementation...
}
```

---

### **✅ Correct examples vs. INCORRECT EXAMPLES**

#### **✅ Correct - Simple JSDoc with Reference:**

```javascript
/**
 * Adds or edits a business according to JSON action
 * @param {Object} data - Object with business data
 * Example: JSON_{CONSTANT_INCLUDE} or JSON_{CONSTANT_EDIT}
 * @returns {Promise<void>}
 */
async addOrEditBusiness(data) {
  if (data.action === 'include') {
    await this.botaoAdicionar.click();
  }
  await this.page.getByLabel('Description').fill(data.description);
  // ...the rest of the implementation
}
```

**Why is it correct:**

- ✅ Use `@param {Object} generic data`
- ✅ Includes line `Example: JSON {CONSTANT INCLUDING} or JSON {CONSTANT EDITING}`
- ✅ Developer consults referenced JSON to see full structure
- ✅ Do not duplicate information that is in the JSON file
- ✅ Avoids out-of-date (if JSON changes, JSDoc does not need to be updated)

---

#### **❌ INCORRECT - Detailing Fields ( NEVER DO):**

```javascript
/**
 * Adds or edits a business according to JSON action
 * @param {Object} data - Object with business data
 * @param {string} data.action - Action to execute ('include' or 'edit')
 * @param {string} data.description - Business description
 * @param {Object} data.branchCompany - Branch company data
 * @param {string} data.branchCompany.value - Value to filter
 * @param {string} data.branchCompany.clickValue - Value to click
 * @param {Object} data.owner - Owner data
 * @param {Object} data.account - Account data
 * @param {Object} data.businessType - Business type
 * @param {Object} data.businessSource - Business source
 * @param {Object} data.businessMode - Business mode
 * @param {Object} data.funnel - Funnel
 * @param {Object} data.funnelStage - Funnel stage
 * @param {Array} data.grid - Array of values to validate
 * @returns {Promise<void>}
 */
async addOrEditBusiness(data) {
  // ...implementation...
}
```

**Why You're Wrong:**

- ❌ Detail all individual fields (`data. action', 'data. description, etc.)
- ❌ Detail nested fields (`data.branchCompany.value`, `data.branchCompany.valueClick`)
- ❌ JSDoc giant and hard to maintain
- ❌ Duplicates information already present in JSON file
- ❌ If JSON structure changes, JSDoc gets outdated
- ❌ Hard to read code

---

#### **✅ Correct - Simple Array Method:**

```javascript
/**
 * Validates data in the grid after operation
 * @param {Array<string>} valores - Array de valores esperados na grid
 * Example: JSON_{CONSTANT}.grid
 * @returns {Promise<void>}
 */
async validarGrid(valores) {
  const validationUtils = new ValidationUtils(this.page);
  await validationUtils.validarGrid(valores);
}
```

**Why is it correct:**

- ✅ Uses simple type `Array<string>`
- ✅ Reference where the array comes from ('JSON {CONSTANT}.grid`)
- ✅ Tight and clear

---

#### **❌ INCORRECT - Detailing Array Content:**

```javascript
/**
 * Validates data in the grid after operation
 * @param {Array<string>} valores - Array de valores esperados
 * @param {string} values[0] - Full Company/Branch
 * @param {string} values[1] - Business description
 * @param {string} values[2] - Owner
 * @param {string} values[3] - Account
 * @param {string} values[4] - Funnel/Stage
 * @returns {Promise<void>}
 */
async validarGrid(valores) {
  // ...implementation...
}
```

**Why You're Wrong:**

- ❌ Detail each array index
- ❌ Unnecessary information (array is dynamic)
- ❌ Hard to maintain

---

### **🚨 CRITICAL RULES OF JSDoc (summary):**

| # Oh, yeah | Rule | What to do | WHAT NOT TO DO |
| --- | --- | --- | --- |
| **1** | **JSON parameters** | `@param {Object} data` + `Example: JSON CONSTANT` | field1` |
| **2** | **Arrays** | @param with array of strings + `Example: JSON.grid` | ❌ `@param {string} values[0]` |
| **3** | **Multiple JSONs** | ‘Example: JSON {CONSTANT 1} or JSON {CONSTANT 2} or JSON {CONSTANT 3}` | Detail fields of each JSON |
| **4** | **Return** | `@returns {Promise<void>}` or `@returns {Promise<Object>}` | Omit `@returns` |
| **5** | **Description** | Describe WHAT the method does (business) | ❌ Describe HOW (technical implementation) |

---

### **✅ JSDoc's VALIDATION CHECKLIST:**

Before finishing any method, validate:

- [ ] JSDoc has `/**` opening and `*/` closing
- [ ] Line 1: Clear description of what the method does (not HOW)
- [ ] `@param {object}` for JSONs ( NEVER detail fields)
- [ ] **Line `Example: JSON {CONSTANT}` PRESENT ALWAYS that `@stop {object}` exist and JSON is known ( ONLY in methods)**
- [ ] **Line ‘Example:’ VINCULATED TO `@param {object}` (never isolated, never without @param {object})**
- [ ] Whether method accepts multiple JSONs: `Example: JSON {CONSTANT 1} or JSON {CONSTANT 2} or JSON {CONSTANT 3}`
- [ ] `@returns` present (even if it is `Promise<void>`)
- [ ] NO line with `@param {type} data. field` or `json.field` (PROHIBITED)
- [ ] NO line with `@param {type} values[0]` or similar (PROHIBITED)
- [ ] **NO line ‘Example:’ in CLASSE’S JSDoc** (PROHIBITED — unique to methods)
- [ ] All locators without parameters are in the constructor ( NEVER inline in the method)

---

**🎯 MOTIVATION OF THIS RULE:**

1. **Avoid duplication:** JSON already documents complete structure
2. **Facilitate maintenance:** If JSON changes, JSDoc does not need to be updated
3. **Legibility:**JSDoc concise is easier to read
4. **Consistent pattern:** All methods follow same format
5. **Clear responsibility:** JSON defines structure, JSDoc defines use

---

## 📦 **Import Correct**

Use only public imports and valid project relative paths.

---

## 📄 **Complete Template: Page Object**

```javascript
import { expect } from '@playwright/test';

import { FEATURE_NAME } from '../../helpers/navegacao.js';

/**
 * Page Object for {ScreenName}
 * {Brief feature description}
 * ⚠️ NEVER add line "Example: JSON_..." here (exclusive to methods)
 */
export class {NomeTela}Page {
  /**
   * Constructor of class {ScreenName}Page
   * @param {object} page - Playwright page context
   */
  constructor(page) {
    this.page = page;
    this.dataUtils = new DataUtils(this.page);
    this.formUtils = new FormUtils(this.page);

    // If HTML contains <iframe>: uncomment line below and use this. frame in the locators
    // this.frame = this.page.frameLocator('iframe[name="ci"]');
    // this.formUtils = new FormUtils(this.frame);

    // Other Organiser
    this.ID_LOOKUP_FIELD = '#{lookupFieldId}';
    this.ID_DROPDOWN_FIELD = '#{dropdownFieldId}';

    this.locatorTitleHeading = this.page.getByRole('heading', { name: '{Title}' });
    this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
    this.locatorCancelButton = this.page.getByRole('button', { name: 'Cancel' });
    this.locatorField1Input = this.page.getByLabel('{Label1}');
    this.locatorField2Input = this.page.getByLabel('{Label2}');
    this.locatorRecordsTable = this.page.getByRole('table');
    this.locatorSuccessAlert = this.page.getByRole('alert');
  }

  /**
   * Accesses the feature screen
   * ⚠️ NEVER add parameters in this method
   */
  async accessScreen() {
    await this.page.goto(FEATURE_NAME.URL);
    await expect(this.locatorTitleHeading).toBeVisible();
  }

  /**
   * Creates new record with complete data
   * @param {object} data - Record data for registration
  * Example: JSON_{CONSTANT}
   */
  async registerRecord(data) {
    await this.locatorField1Input.fill(data.field1);
    await this.locatorField2Input.fill(data.field2);

    if (data.lookupField) {
      await this.formUtils.fillFieldSLookup(this.ID_LOOKUP_FIELD, data.lookupField);
    }
    if (data.dropdownField) {
      await this.formUtils.fillFieldPDropdown(this.ID_DROPDOWN_FIELD, data.dropdownField);
    }

    await this.locatorSaveButton.click();
    await expect(this.locatorSuccessAlert).toBeVisible();
  }

  /**
   * Applies filters to the listing
   * @param {string} filterValue - Value used to filter
   */
  async applyFilters(filterValue) {
    await this.locatorOpenFiltersButton.click();
    await this.locatorFilterFieldInput.fill(filterValue);
    await this.locatorFilterButton.click();
    await expect(this.locatorResults).toBeVisible();
  }

  /**
   * Validates whether record was correctly registered
   * @param {string} expectedText - Expected text in record
   * @returns {Promise<string>} Found record text
   */
  async validateRegisteredRecord(expectedText) {
    const locatorRecord = this.locatorRecordsTable
      .locator('tbody tr')
      .filter({ hasText: expectedText });

    await expect(locatorRecord).toBeVisible();
    return await locatorRecord.textContent();
  }

  /**
   * Deletes selected record
   * @param {string} recordText - Record identifying text
   */
  async deleteRecord(recordText) {
    const locatorRow = this.locatorRecordsTable
      .locator('tbody tr')
      .filter({ hasText: recordText });

    await locatorRow.locator('input[type="checkbox"]').check();
    await this.locatorDeleteButton.click();
    await this.locatorConfirmButton.click();
    await expect(this.locatorSuccessAlert).toBeVisible();
  }
}
```

---

## ✅ **Rules for Page Objects Update**

**Updating existing file:**

1. **New Locator Positioning:**Always add to the end of the locator section in the constructor
2. **New Methods Positioning:** Add ALWAYS at the end of class, after existing methods
3. **Total Preservation:** NEVER change, move or remove existing locators or methods
4. **New Imports:** Add only to the end of the import section if needed

---

## 🔍 **Page Objects Auditorium**

**BEFORE YOU FINISH Page Object:**

| Item | Validation | Command/Action |
| ------ | ----------- | -------------- |
| **Locators** | Only used in methods | `grep "this.locator.*=" {file}. js` vs `grep "this.locator. *\." {file}. js` |
| **Methods** | All called in tests | Check references in `.spec.js' files |
| **HTML** | Components identified | `grep search(query="<p-\|<s-\|ui-", isRegexp=true)` |
| **IDs** | No dynamic IDs | Avoid `ui-panel-{n}`, `s-button-{n}` |
| **Orphans** | Remove unused | Delete locators/methods without reference |

**Signals to remove:**

- ❌ Comments "for future use" or "if needed"
- ❌ Methods with 1 trivial command
- ❌ Duplicate locators with different names

---

## 📋 **Page Objects Final Checklist**

### **Locators:**

- [ ] All in the constructor are used in methods
- [ ] **Nomenclature OBLIGATOR:** `locator{Description}{Type}` (ex: `locatorSaveButton`, `locatorNameInput`)
- [ ] Type in the final name (Button, Input, Link, Heading, etc.)
- [ ] Priority semantic selectors
- [ ] HTML based (not PNG)
- [ ] Single (find 1 element)

### **Methods:**

- [ ] JSDoc complete
- [ ] ALL CALLED IN TESTS
- [ ] Correct signatures
- [ ] Appropriate validations

### **Quality:**

- [ ] No dynamic IDs
- [ ] Special components treated
- [ ] No strict mode violations

### **Compliance:**

- [ ] Validated against `checklistMergeRequest. md` complete
- [ ] ESLint without errors

---

## 🔧 **Iframe validation**

### **Rules:**

- **Check** if HTML contains `<iframe>`
- **ONLY** use `this. frame` if present frame
- **NEVER** use `this. frame` without iframe

### **How to Check:**

```bash
grep_search(query="<iframe", includePattern="{file}.html", isRegexp=false)
```

---

## 🔍 **SPECIFIC RULE: S-Lookup Component**

> **⚠CRITICAL RULES: S-Lookup ALWAYS uses internal `input` ID, NEVER external component**

### **🎯 How to Identify the Right ID**

**MANDATORY PROCEDURE:**

1. **Find the `<s-lookup>` component in HTML:**

   ```html

  <s-lookup id="e070filCrmx" label="Branch" ...>
     <!-- inner content -->
     <input id="e070filCrmx-autocomplete" type="text" ...>
   </s-lookup>

   ```

2. **Search for `<input>` INSIDE the component**
3. **The input will have ID with suffix `-autocomplete`**
4. **Use THIS ID in the locator**

### **⚠️ Reason for the Rule**

- The component `<s-lookup>` is a custom wrapper
- The INTERACTIVE element is the internal input.
- The ID of `<input>` always has '-autocomplete' suffix
- Using external component ID results in unclickable/fillable locator

---

## 🚫 **Critical Anti-Patterns**

### **❌ NEVER:**

- **Create static locator outside the constructor**
- **Use inline locators without parameter**
- **Create trivial methods** (`clickButton()`, `clickSave()`, `click()`)
- **Mix English with Portuguese** in the nomenclature of methods and variables
- **Forget running `grep search(query="<iframe")' in HTML before creating Page Object**
- **Use `this. page` when HTML contains `<iframe>`** (use `this.frame`)
- **Create `this. frame` when HTML DOES NOT contain `<iframe>`** (use only `this.page`)
- Install Page Objects directly in the tests
- Create unused locators
- Ignore 'frameLocator' for iframes
- Hardcode URLs
- Trivial methods (one command only)

### **✅ Always:**

- **Create all static locations in the constructor**
- **Validate if locators created in the methods are dynamic**
- **Use ONLY English** for methods, variables and comments
- **Create complete business methods** (never trivial methods)
- Use objects via context ('page.{functionality}Page`)
- Create dynamic locators ONLY when they depend on parameters
- Use capture pattern: `return await this.locator.textContent()`
- Follow naming conventions in English

---

## 📊 **Instantiation in helpers/index. Js**

### **5-Step Process:**

#### **1 IMPORT:**

```javascript
// FINAL OF THE IMPORTS SECTION
import { {FeatureName}Page } from '../pages/{path}/{featureName}Page';
```

#### **2 INSTANTIATE PAGES:**

```javascript
// AT THE END of the page block
context['{featureName}Page'] = new {FeatureName}Page(page);
```

#### **3 USE IN TESTS:**

```javascript
await page.{featureName}Page.myMethod();
```

#### **4 VALIDATE:**

```javascript
// Always run get errors after modifying helpers/index. js
```

### **⚠GOLD RULE:**

> **NEVER REMOVE OR MODIFY EXISTING LINES - ONLY ADD**

---

## ✅ **Summary of Critical Rules**

1. **Required language: English** - All methods, variables and comments in English
2. **ALL IDs in the constructor** with type suffix (e.g. `this.ID_LOOKUP_FIELD = '#autocompletefield'`)
3. **ALL static locators in the constructor** (MANDATORY)
4. **Do not repeat value in fillFieldSLookup** if value and valueClick are equal
5. **Dynamic locators in methods** (only if dependent on parameters)
6. **JSDoc without detailing fields** - use "Example: JSON CONSTANT"
7. **Complete business methods** ( NEVER trivial methods)
8. **NEVER mix English with Portuguese** in the nomenclature
9. **Validate iframe** before using `this. frame`
10. **Install in helpers/index.js** (never directly in tests)
11. **Audit before completion** (remove orphans)
12. **ESLint without errors** (always validate)
13. **MANDATORY locator nomenclature** (`locator{Description}{Type}` - ex: `locatorSaveButton`, `locatorNameInput`)
14. **MANDATORY nomenclature of constants** (`TYPE {DESCRIPTION} {ElementType}` - ex: `ID_ACCOUNT_LOOKUP`, `CSS_SUBMIT_BUTTON`)
15. **Correct Imports** (validate with `get errors`)
