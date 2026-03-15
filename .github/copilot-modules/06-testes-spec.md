# 📄 Test File Structure (*.spec.js)

> **Module 06:** Project-specific templates and patterns for testing

---

## 🚨 **CRITICAL RULE: NEVER CHANGE PRE-EXISTING TESTS**

> **⚠️ MAXIMUM ATTENTION: When implementing in an existing test file**

**ABSOLUTE RULE - NO EXCEPTIONS:**

- ❌ **NEVER modify** existing `test()` blocks
- ❌ **NEVER change** existing `test.beforeEach()` or `test.afterAll()`
- ❌ **NEVER remove** existing imports, variables or constants
- ❌ **NEVER change** existing test tags or annotations
- ❌ **NEVER change** order of existing tests
- ✅ **JUST ADD** new `test()` blocks to the end of `describe()`
- ✅ **JUST ADD** new imports if necessary
- ✅ **JUST ADD** new variables to the top (without removing existing ones)

**Reason:** Changing existing tests can cause regression or break already working validations. Every implementation must be ADDITIVE.

**Correct Example:**

```javascript
test.describe('CRUD - Feature', { tag: ['@MODULE'] }, () => {
  test.beforeEach(async ({ page }) => {
    // ✅ existing beforeEach preserved
    await page.featurePage.login(USER);
  });

  test('001 - Existing test', { tag: '@TEST_001' }, async ({ page }) => {
    // ✅ existing test preserved
  });

  test('002 - Existing test', { tag: '@TEST_002' }, async ({ page }) => {
    // ✅ existing test preserved
  });

  // ✅ CORRECT - New test added AT THE END
  test('003 - New test', {
    tag: '@TEST_003',
    annotation: { type: 'Jira', description: 'https://jira.com/TASK-123' }
  }, async ({ page }) => {
    // Arrange: New implementation
    // Act: New action
    // Assert: New validation
  });
});
```

**Incorrect Example:**

```javascript
// ❌ WRONG - Modify existing test
test('001 - Existing test', { tag: '@TEST_001' }, async ({ page }) => {
  // ❌ Changed test logic - FORBIDDEN
  await page.newPage.newMethod(); // BREAKS EXISTING VALIDATION
});

// ❌ WRONG - Change existing beforeEach
test.beforeEach(async ({ page }) => {
  // ❌ Added logic to existing beforeEach - FORBIDDEN
  await page.featurePage.login(USER);
  await page.newPage.newSetup(); // AFFECTS ALL TESTS
});
```

---

## 🚨 **CRITICAL RULE: SEPARATION OF RESPONSIBILITIES**

> **⚠️ Tests should NEVER contain logic for direct interaction with elements**

**ABSOLUTE RULE:**

- ❌ **PROHIBITED in .spec.js:** `page.locator()`, `page.getByRole()`, `page.click()`, `page.fill()`, `expect(page.locator())`
- ❌ **PROHIBITED in .spec.js:** Any direct interaction with DOM elements
- ✅ **MANDATORY in .spec.js:** ONLY call Page Object methods
- ✅ **MANDATORY in .spec.js:** ONLY use expects from Page methods that return locators

**Reason:** Tests must orchestrate flows using Page Objects abstraction. Location and interaction logic belongs to Page Objects.

**✅ CORRECT:**

```javascript
test('01 - Create user',
  {
    tag: '@USERS_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Open users screen
    await page.usersPage.accessScreen();

    // Act: Call the Page method
    await page.usersPage.create(data);

    // Assert: Validate using the Page method
    await page.usersPage.validateSuccessMessage();
  }
);
```

**❌ WRONG:**

```javascript
test('Create user', async ({ page }) => {
  // ❌ PROHIBITED - Direct interaction in the test
  await page.locator('#name').fill('John');
  await page.getByRole('button', { name: 'Save' }).click();

  // ❌ PROHIBITED - Expect on locator created in test
  await expect(page.locator('.success-message')).toBeVisible();
});
```

**Where to implement:**

| Responsibility | File | Example |
|------------------|---------|---------|
| Locators and interactions | `*Page.js` | `async create(data) { await this.locator.fill(); }` |
| Flow orchestration | `*.spec.js` | `await page.usersPage.create(data);` |
| Validations | `*.spec.js` | `expect(page.usersPage.messageLocator).toBeVisible()` |

---

## 🎭 **CONSULT PLAYWRIGHT DOCS FIRST**

> **⚠️ For testing structure, assertions and hooks:**
>
> - **Writing Tests:** https://playwright.dev/docs/writing-tests
> - **Test Assertions:** https://playwright.dev/docs/test-assertions
> - **Test Hooks:** https://playwright.dev/docs/api/class-test#test-before-each

**Principle:** Follow Playwright best practices for testing structure. The rules below are **project specific** (nomenclature, AAA standard with comments, custom tags).

---

## 🎯 **CRITICAL RULE: CONDITIONAL FIXTURES INJECTION**

> **⚠️ ALWAYS inject ONLY the necessary fixtures in each context**

### **Injection Rules:**

- **UI only (Page):** `async ({ page }) => { ... }`
- **ONLY inject what you use:** for this module, prioritize `async ({ page }) => { ... }`

### **✅ CORRECT PATTERN:**

```javascript
// ✅ CORRECT - beforeEach uses only page
test.beforeEach(async ({ page }) => {
  await page.featurePage.login(TOKEN);
});

// ✅ CORRECT - Test uses ONLY page
test('01 - Create via UI',
  {
    tag: '@FEATURE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Prepare creation data

    // Act: Create record via UI
    await page.featurePage.create(JSON_DATA);

    // Assert: Validate successful creation
    await expect(page.featurePage.successAlertLocator).toBeVisible();
  }
);
test('02 - Edit and validate in UI',
  {
    tag: '@FEATURE_UPDATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-002' }
  },
  async ({ page }) => {
    // Arrange: Open existing record for editing
    await page.featurePage.accessEditByDescription(JSON_DATA.name);

    // Act: Navigate to record editing
    await page.featurePage.editRecord(JSON_DATA);

    // Assert: Validate correctly loaded data in the UI
    await expect(page.featurePage.nameInputLocator).toHaveValue(JSON_DATA.name);
  }
);
```

### **🔍 Validation Checklist:**

- [ ] Does each `test()` inject ONLY used fixtures?
- [ ] `beforeEach` only injects fixtures that it USES?
- [ ] `afterAll` only injects fixtures that it USES?
- [ ] NO fixtures are injected "just in case" without use?

**Reason:** Injecting unused fixtures causes Playwright warnings and unnecessarily pollutes the code.

---

## 🚨 **PROJECT STANDARD: AAA with Comments**

All `test()` blocks MUST have short and useful comments that indicate the intention of each block in the AAA structure (Arrange, Act, Assert), avoiding explaining the obvious and maintaining the Clean Code standard.

### **AAA Structure:**

- **Arrange:** Prepares the context (data, navigation, preconditions)
- **Act (Execution):** Executes ONE main action (submit, click, fill flow)
- **Assert:** Validates ONE main result (message, status, navigation)

### **AAA Rules:**

- ✅ Mandatory comments: `// Arrange:`, `// Act:`, `// Assert:`
- ✅ **Comments MUST add value** - describe WHAT is being done, not the obvious
- ✅ Add SPECIFIC description after the colon to document context and intent
- ✅ One responsibility per phase (avoid multiple actions or mixed validations)
- ✅ Arrange can have multiple preparation lines
- ✅ Act must have few lines and focus on ONE main business action
- ✅ Assert must validate the expected result of this action
- ✅ Use terms in English: **Arrange, Act, Assert** (international standard)
- ❌ **NEVER** generic comments like "Preparation", "Execution", "Validation"
- ❌ **NEVER** use `console.log()` directly — violates SonarQube S106. Use descriptive AAA reviews
- ❌ Do not mix preparation with action or validation

### **Comment Format:**

```javascript
// Arrange: {SPECIFIC and OBJECTIVE description of the prepared context}
// Act: {SPECIFIC description of the executed business action}
// Assert: {SPECIFIC description of the validated result}
```

### **❌ NOT Acceptable Comments:**

```javascript
// ❌ Generic (does not add value)
// Arrange: Preparation
// Arrange: Prepare data
// Act: Execution
// Act: Execute action
// Assert: Validation
// Assert: Validate result

// ❌ Using console.log to document (violates SonarQube S106)
console.log('Step 1: Create record');
console.log('Step 2: Validate grid');

// ❌ Using terms in Portuguese
// Preparation: Create vacation record
// Execution: Submit form
// Validation: Validate success message
```

### **✅ Acceptable Comments (Specific):**

```javascript
// Arrange: Open edit screen with existing record
// Arrange: Prepare gatehouse data with valid times and open the form
// Act: Submit concierge registration form with complete data
// Act: Apply date and status filters to the records list
// Assert: Validate success message and ensure that new record appears in the list
// Assert: Validate that record was deleted from list
```

---

## ✅ **Examples of Correct Tests**

### **Example 1: Registration Test (CRUD)**

```javascript
test('001 - must create record successfully',
  {
    tag: '@CRUD_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Prepare data and navigate to creation screen
    await page.featurePage.prepareData(JSON_DATA);
    await page.featurePage.accessForm();

    // Act: Create new record in system
    await page.featurePage.createRecord(JSON_DATA);

    // Assert: Validate that creation was successful
    await page.featurePage.validateSuccessMessage();
    await page.featurePage.validateRecordInList(JSON_DATA.field);
  }
);
```

### **Example 2: Editing Test (CRUD)**

```javascript
test('002 - must edit existing record',
  {
    tag: '@CRUD_UPDATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-002' }
  },
  async ({ page }) => {
    // Arrange: Open edit screen for existing record
    await page.featurePage.accessEditByDescription(JSON_DATA.description);

    // Act: Update form fields and save
    await page.featurePage.editRecord(UPDATED_JSON_DATA);

    // Assert: Validate that changes have been persisted
    await page.featurePage.validateSuccessMessage();
    await page.featurePage.validateUpdatedDataOnScreen(UPDATED_JSON_DATA);
  }
);
```

### **Example 3: Validation Test**

```javascript
test('003 - It should display an error when trying to save with empty mandatory fields',
  {
    tag: '@VALIDATION',
    annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-003' }
  },
  async ({ page }) => {
    // Arrange: Navigate to form without filling in data
    await page.featurePage.accessForm();

    // Act: Submit empty form
    await page.featurePage.clickSave();

    // Assert: Validate error messages in required fields
    await page.featurePage.validateErrorMessage('Required field was not filled in');
    await page.featurePage.validateFieldsWithError(['field1', 'field2']);
  }
);
```

---

## ❌ **Incorrect Example (Anti-Pattern)**

```javascript
// ❌ WRONG - Mixed phases, no comments AAA
test('001 - Test without structure', async ({ page }) => {
  await page.featurePage.accessScreen();
  await page.featurePage.fillField1('value');
  await page.featurePage.validateField1();
  await page.featurePage.fillField2('value');
  await page.featurePage.clickSave();
  await page.featurePage.validateMessage();
});

// ❌ WRONG - Generic comments that do NOT add value
test('002 - Test with bad comments', async ({ page }) => {
  // Arrange: Preparation
  await page.featurePage.prepareData();

  // Act: Execution
  await page.featurePage.executeAction();

  // Assert: Validation
  await page.featurePage.validateResult();
});

// ❌ WRONG - Using console.log() to document steps (violates SonarQube S106)
test('003 - Test with console.log()', async ({ page }) => {
  console.log('Step 1: Create record');
  await page.featurePage.createRecord();

  console.log('Step 2: Validate grid');
  await page.featurePage.validateGrid();

  console.log('Step 3: Delete record');
  await page.featurePage.deleteRecord();
});

// ❌ WRONG - Using test.step() instead of AAA comments
test('004 - Test with test.step()', async ({ page }) => {
  await test.step('Prepare data', async () => {
    await page.featurePage.prepareData();
  });

  await test.step('Execute action', async () => {
    await page.featurePage.executeAction();
  });

  await test.step('Validate result', async () => {
    await page.featurePage.validateResult();
  });
});
```

**Problems:**

- No AAA comments (example 1)
- Mixed Preparation/Execution/Validation (example 1)
- It is not clear what the main action is (example 1)
- Intermediate validations pollute the flow (example 1)
- **Generic comments that do not add value** (example 2)
- Comments do not explain WHAT is being done specifically (example 2)
- **Use of console.log() to document steps** (example 3 - pollutes logs and violates SonarQube S106)
- **Use of test.step() instead of simple comments** (example 4)
- test.step() adds unnecessary complexity (example 4)

---

## 🚨 **CRITICAL RULES BEFORE IMPLEMENTING**

### **RULE #0: Validate Mandatory Imports**

> **⚠️ ALL imports must be validated and correct BEFORE creating the test**

**✅ CORRECT IMPORTS:**

```javascript
// ✅ Data JSONs (ALWAYS with .js or validate if importing without .js works)
import { JSON_CONSTANT } from '../../data/{path}/{file}Json';
// or
import { JSON_CONSTANT } from '../../data/{path}/{file}Json.js';

// ✅ Project helpers
import { test } from '../helpers';

// ✅ Users for login (ALWAYS from helpers/environment)
import { TEST_USER } from '../helpers/ambiente';
```

**❌ INCORRECT IMPORTS:**

```javascript
// ❌ WRONG - Non-existent or incorrect path
import { JSON_CONSTANT } from '../../data/crmx/businessJson'; // Error: Cannot find module

// ❌ WRONG - Login user imported from incorrect location
import { CRMX_ERPXUI } from '../../../utils/config'; // NEVER use utils/config
import { ADMIN_ERPXUI } from '../../../config'; // NEVER use config
```

> **🚨 CRITICAL RULE: Login Users**
>
> **ALL users used in `dataUtils.login()` must be imported from `helpers/ambiente.js`**
>
> **✅ CORRECT:** `import { CRMX_ERPXUI } from '../helpers/ambiente';`
>
> **❌ WRONG:** `import { CRMX_ERPXUI } from '../utils/config';`

**🔍MANDATORY VALIDATION:**

Before creating any import:

1. **Run `grep_search`** to find the correct file:
   ```bash
  grep_search(query="{fileName}", includePattern="**/*.js", isRegexp=false)
   ```

2. **Validate relative path** from `.spec.js` to the found file

3. **Test import** with `get_errors` after creating

4. **NEVER assume** that the path is correct without validating

---

### **RULE #1: Follow "General Test Information" (MANDATORY)**

> **⚠️ WHENEVER there is "General Test Information", follow STEP BY STEP obligatorily**

**📋 What is "General Test Information":**

- User-specific instructions on how to implement the test
- Detailed preparation, execution and validation steps
- Specific data, flow or validation requirements
- Additional context that is NOT in the modules

**🚨 MANDATORY RULE:**

```
  IF the user provides "General Test Information":
  THEN follow EACH STEP exactly as described
  AND DO NOT assume or skip steps
  AND ask questions IF there are doubts
  AND NEVER rely only on the standard templates
```

---

### **🚨 RULE #1.1: Validate ALL HTML from ALL Steps (MANDATORY)**

> **⚠️ COMMON CRITICAL ERROR:** Analyze only the first mentioned HTML and ignore HTML from subsequent steps

**📋 Standard Structure in "General Test Information":**

Each step contains **3 mandatory references**:

```markdown
- **HTML Reference:** `{file}.html`
- **Page Reference:** `pages\{path}\{file}Page.js`
- **Visual Reference:** ![Text]({path}/{image}.png)
  - **Action:** {action description}
```

**🚨 MANDATORY PROCESS:**

1. **List ALL steps** from "General Test Information"
2. **For EACH step:** Identify the 3 reference fields
3. **For EACH "HTML Reference":** Run full file analysis
4. **NEVER assume** that elements are the same between different HTMLs

**✅ VALIDATION CHECKLIST (run for EACH step):**

```bash
# STEP 1: Identify ALL HTML references
grep "HTML Reference:" {instructions_file.md}
# Expected result: list of ALL referenced HTML files

# STEP 2: For EACH identified HTML, run the complete analysis
# Example: If you found 5 HTML files, run 5 independent analyses

# HTML 1: accessScreen.html
grep_search(query="<iframe", includePattern="accessScreen.html")
grep_search(query="{element1}", includePattern="accessScreen.html")
# ... validate ALL elements in this step

# HTML 2: mainBusinessCrud.html
grep_search(query="<iframe", includePattern="mainBusinessCrud.html")
grep_search(query="{element2}", includePattern="mainBusinessCrud.html")
# ... validate ALL elements in this step

# HTML 3: businessFilter.html (DO NOT SKIP!)
grep_search(query="<iframe", includePattern="businessFilter.html")
grep_search(query="{element3}", includePattern="businessFilter.html")
# ... validate ALL elements in this step

# STEP 3: Document unique elements from EACH HTML
# STEP 4: Create context-specific locators for EACH scenario
```

**❌ CRITICAL ANTI-PATTERN (DO NOT DO):**

```javascript
// ❌ WRONG - Assuming that the "Description" field is the same in all HTMLs
// Only analyzed mainBusinessCrud.html
this.ID_DESCRIPTION = '#description'; // Created in the constructor

async createBusiness(data) {
  // Uses the registration-specific ID ✅
  await this.page.locator(this.ID_DESCRIPTION).fill(data.description);
}

async filterBusiness(data) {
  // ❌ ERROR: Reuses ID_DESCRIPTION without validating businessFilter.html
  // The "Description" field in the filter may have a different ID!
  await this.page.locator(this.ID_DESCRIPTION).fill(data.description);
}
```

**✅ CORRECT PATTERN:**

```javascript
// ✅ CORRECT - Validated BOTH HTMLs independently
constructor(page) {
  this.page = page;

  // IDs from mainBusinessCrud.html (validated with grep_search)
  this.ID_REGISTRATION_DESCRIPTION = '#description'; // Line 150 in mainBusinessCrud.html

  // IDs from businessFilter.html (validated with grep_search SEPARATELY)
  this.ID_FILTER_DESCRIPTION = '#filter-description'; // Line 89 in businessFilter.html
}

async createBusiness(data) {
  // Uses the specific registration ID ✅
  await this.page.locator(this.ID_REGISTRATION_DESCRIPTION).fill(data.description);
}

async filterBusiness(data) {
  // Uses the specific filter ID ✅
  await this.page.locator(this.ID_FILTER_DESCRIPTION).fill(data.description);
}
```

**📊 MANDATORY DOCUMENTATION IN THE TECHNICAL PLAN:**

```markdown
## Analyzed HTMLs (ALL)

| Step | Referenced HTML | Identified Elements | Status |
|-------|-------------------|------------------------|--------|
| Step 2 | accessScreen.html | Title "Manage Business" | ✅ Analyzed |
| Step 3 | mainBusinessCrud.html | Description field (#description), 9 s-lookups | ✅ Analyzed |
| Step 5 | businessFilter.html | Description field (#filter-description), Filter button | ✅ Analyzed |
| Step 6 | kanban.html | Cards, titles, status | ✅ Analyzed |

**⚠️ ATTENTION:** The "Description" field exists in 2 HTML files with DIFFERENT IDs:
- mainBusinessCrud.html: `#description` (line 150)
- businessFilter.html: `#filter-description` (line 89)

**Decision:** Create separate constants in the constructor for each context.
```

**💡 Anti-Error Checklist:**

- [ ] Did I list ALL the steps in the "General Test Information"?
- [ ] Did I identify ALL the referenced HTMLs (not just the first one)?
- [ ] Did I run `grep_search` on EACH HTML independently?
- [ ] Have I validated that elements with the SAME NAME can have DIFFERENT IDs/selectors in different HTMLs?
- [ ] Did I create SPECIFIC constants/locators for each context (registration, filter, etc.)?
- [ ] Did I document ALL the analyzed HTML in the technical plan?

**⛔ IF ANY ANSWER IS "NO":** Go back and analyze ALL HTML before implementing

---

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
  // ❌ WRONG - Ignore general information and use generic template
  test('001 - Generic test', async ({ page }) => {
  // Generic code that does NOT follow the specific information provided
  });
```

**✅ CORRECT PATTERN:**

```javascript
  // ✅ CORRECT - Follow general information provided step by step
  test('001 - Specific test according to information provided',
  {
    tag: '@SPECIFIC_TAG',
    annotation: { type: 'Issue', description: 'URL_JIRA' }
  },
  async ({ page }) => {
    // Arrange: Exactly as in step 1 of the general information
    // ...

    // Act: Exactly as in step 2 of the general information
    // ...

    // Assert: Exactly as in step 3 of the general information
    // ...
  }
);
```

**💡 Compliance Checklist:**

- [ ] Have I read ALL the "General Test Information" provided?
- [ ] Did I identify ALL the specific steps?
- [ ] Did I implement EACH step as described?
- [ ] I asked the user IF there was any doubt in any step?
- [ ] Did I NOT take over or skip any step?

---

## 📋 **Complete Test File Template**

> **🎯 Template with Generic Placeholders and Conditional Fixture Injection**

### **Fixture Injection Rules (MANDATORY):**

- **Page only (UI):** `async ({ page }) => { ... }`
- **Inject only what is necessary:** in this module, keep `async ({ page }) => { ... }`

**⚠️ NEVER inject unused fixture** (causes warning and code pollution)

---

### **Complete Base Template:**

> **📝 INSTRUCTIONS FOR USING THE TEMPLATE:**
>
> - Replace ALL placeholders with real values
> - **Remove unused fixtures**
> - **Instruction comments** (like this block) should NOT be copied to the actual file

```javascript
import { expect } from '@playwright/test';
import {
  {JSON_CONSTANT_01},
  {JSON_CONSTANT_02},
} from '../../data/{path}/{feature}Json.js';
import { test } from '../helpers';
import { {TEST_USER} } from '../helpers/ambiente.js';
import { logger } from '../../utils/logger.js';

test.describe('{describe name}', { tag: ['@{MODULE}', '@{FEATURE}'] }, () => {

  test.beforeEach(async ({ page }) => {
    logger.test(test.info().title);

    await page.featurePage.login({TEST_USER});
    await page.{feature}Page.accessScreen();
  });

  test(
    '01 - {Description of action 01} (UI)',
    {
      tag: '@{ACTION_TAG_01}',
      annotation: {
        type: 'Issue',
        description: '{JIRA_URL}',
      },
    },
    async ({ page }) => {
      // Arrange: Prepare data and context needed for action 01
      await page.{feature}Page.prepareContext({JSON_CONSTANT_01});

      // Act: Execute main business action 01
      await page.{feature}Page.executeAction01({JSON_CONSTANT_01});

      // Assert: Validate expected result of action 01
      await page.{feature}Page.validateAction01Result({JSON_CONSTANT_01});
      await expect(page.{feature}Page.successMessageAlertLocator).toBeVisible();
    }
  );

  test(
    '02 - {Description of action 02} (UI)',
    {
      tag: '@{ACTION_TAG_02}',
      annotation: {
        type: 'Issue',
        description: '{JIRA_URL}',
      },
    },
    async ({ page }) => {
      // Arrange: Navigate to edit and prepare data for action 02
      await page.{feature}Page.navigateToEditByFilter({JSON_CONSTANT_02});

      // Act: Execute main business action 02 via UI
      await page.{feature}Page.executeAction02({JSON_CONSTANT_02});

      // Assert: Validate result of the action in the UI
      await page.{feature}Page.validateAction02Result();
      await expect(page.{feature}Page.expectedFieldLocator).toHaveText({JSON_CONSTANT_02}.expectedField);
    }
  );

  test(
    '03 - {Description of action 03} - ERROR VALIDATION (UI)',
    {
      tag: '@{ACTION_TAG_03}',
      annotation: {
        type: 'Issue',
        description: '{JIRA_URL}',
      },
    },
    async ({ page }) => {
      // Arrange: Navigate to the form without filling required fields

      // Act: Submit an empty form or invalid data
      await page.{feature}Page.submitEmptyForm();

      // Assert: Validate error messages in required fields
      await page.{feature}Page.validateErrorMessages(['field1', 'field2']);
      await expect(page.{feature}Page.errorMessageAlertLocator).toBeVisible();
    }
  );
});
```

---

### **Template Usage Checklist:**

- [ ] Did I replace ALL placeholders with real values?
- [ ] **Removed `database` and `tenant` if not using DB?**
- [ ] Did I import JSONs WITH the `.js` extension?
- [ ] Did I use fixture injection only with `page`?
- [ ] Are AAA comments specific (not generic)?
- [ ] Describe tags are ARRAY, test tags are STRING?
- [ ] Does each test() have an annotation with a Jira link?
- [ ] I NEVER built inline objects (I always imported JSON from data/)?
- [ ] Did I run `get_errors` after creating imports?

---

## 🏷️ **Test Tags (MANDATORY)**

### **Tag Rules:**

1. **test.describe() MUST have ARRAY tag** with general module/feature tags
2. **test() MUST have a UNIQUE STRING tag** specific to that test
3. **Tags MUST NOT be repeated** between describe and test
4. Format: `@TAG_NAME` in capital letters
5. MANDATORY Annotation with Jira URL in each test()

### **Correct Structure:**

```javascript
// ✅ CORRECT - describe with ARRAY, test with SINGLE STRING
test.describe('Record Registration', { tag: ['@EXAMPLE_MODULE', '@FEATURE'] }, () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('001 - must create a new record',
    {
      tag: '@FEATURE_CREATE',  // ✅ STRING, not array
      annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-101' }
    },
    async ({ page }) => {
      // Test here
    }
  );

  test('002 - must edit existing record',
    {
      tag: '@FEATURE_UPDATE',  // ✅ STRING, not array
      annotation: { type: 'Issue', description: 'https://jira.example.com/browse/PROJ-102' }
    },
    async ({ page }) => {
      // Test here
    }
  );
});
```

### **❌ INCORRECT - Don't Do:**

```javascript
// ❌ WRONG - describe WITHOUT tags
test.describe('crud - feature', () => {

// ❌ WRONG - test with ARRAY instead of STRING
test('001 - Test', {
  tag: ['@TAG1', '@TAG2'],  // ❌ Array in test()
  annotation: { ... }
}, async () => {});

// ❌ WRONG - repeated tags between describe and test
test.describe('crud', { tag: ['@EXAMPLE_MODULE'] }, () => {
  test('001', {
    tag: '@EXAMPLE_MODULE',  // ❌ Repeated from describe
    annotation: { ... }
  }, async () => {});
});

// ❌ WRONG - test WITHOUT annotation
test('001 - Test', {
  tag: '@TAG'
  // ❌ Missing annotation
}, async () => {});
```

### **Tag Checklist:**

- [ ] test.describe() has tag like **ARRAY** `{ tag: ['@TAG1', '@TAG2'] }`
- [ ] test() has tag like **STRING** `{ tag: '@TAG_UNICA' }`
- [ ] Describe tags are general (module/feature)
- [ ] test() tags are specific (action/scenario)
- [ ] There is no repetition of tags between describe and test
- [ ] Annotation with Jira URL present in ALL test()

---

## 🚫 **PROHIBITIONS**

### **❌ NEVER construct inline JSON in .spec.js file**

> **⚠️ CRITICAL RULE: ALL JSONs must be in `data/`, NEVER create objects inside `.spec.js`**

**🚨 CRITICAL PROBLEM:** Construct objects like `filterData` and `registrationData` directly in the test

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
// ❌ WRONG - Create inline object in test
test('Must filter records', async ({ page }) => {
  const filterData = {
    name: 'Test',
    category: 'Category A',
    status: 'Active',
  };

  await page.featurePage.fillFilters(filterData);
});

// ❌ WRONG - Create registration object in the test
test('Must create a record', async ({ page }) => {
  const registrationData = {
    name: 'New Record',
    description: 'Description',
  };

  await page.featurePage.create(registrationData);
});
```

**✅ CORRECT SOLUTION:**

```javascript
// ✅ CORRECT - JSON imported from data/
import { JSON_FILTER_VALIDATION, JSON_CREATE_RECORD } from '../../data/{path}/{file}Json';

test('01 - Must filter records',
  {
    tag: '@FEATURE_FILTER',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Prepare filter context
    await page.featurePage.accessScreen();

    // Act: Apply filters and perform search
    await page.featurePage.fillFilters(JSON_FILTER_VALIDATION);
    await page.featurePage.executeSearch();

    // Assert: Validate filtered results
    await page.featurePage.validateResults(JSON_FILTER_VALIDATION);
  }
);

test('02 - Must create a record',
  {
    tag: '@FEATURE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-002' }
  },
  async ({ page }) => {
    // Arrange: Access the registration form
    await page.featurePage.openForm();

    // Act: Create the record with predefined JSON
    await page.featurePage.create(JSON_CREATE_RECORD);

    // Assert: Validate that the record was created
    await page.featurePage.validateCreation();
  }
);
```

**💡 Why this is mandatory:**

- ✅ Keeps data centralized in `data/`
- ✅ Facilitates reuse of JSONs in multiple tests
- ✅ Simplified maintenance (changing JSON changes all tests)
- ✅ Cleaner and more readable test code
- ❌ Create inline = data duplication and difficult maintenance

---

### **❌ NEVER expand JSON fields inline**

> **⚠️ CRITICAL RULE: ALWAYS pass full JSON from `data/`, NEVER create inline objects in `.spec.js`**

**🚨 CRITICAL PROBLEM:** Code polluted with manual field expansion

**❌ ANTI-PATTERN (DO NOT DO):**

```javascript
// ❌ WRONG - Expand JSON fields inline
await page.featurePage.create({
  name: JSON_CREATE_RECORD.name,
  description: JSON_CREATE_RECORD.description,
  category: JSON_CREATE_RECORD.category,
  startDate: JSON_CREATE_RECORD.startDate,
});

// ❌ WRONG - Destructure fields individually
await page.featurePage.validateInGrid({
  name: JSON_FILTER_VALIDATION.name,
  category: JSON_FILTER_VALIDATION.category,
  status: JSON_FILTER_VALIDATION.status,
  startDate: JSON_FILTER_VALIDATION.startDate,
});
```

**✅ CORRECT SOLUTION:**

```javascript
// ✅ CORRECT - Pass full JSON directly
await page.featurePage.create(JSON_CREATE_RECORD);

// ✅ CORRECT - Pass full JSON
await page.featurePage.validateInGrid(JSON_FILTER_VALIDATION);

// ✅ CORRECT - Pass full JSON
await page.featurePage.fillFilters(JSON_FILTER_VALIDATION);
```

**🎯Golden Rule:**

| Situation | How to do it |
|----------|-----------|
| **Method receives JSON object** | ✅ Pass the full JSON constant |
| **JSON has all fields** | ✅ Pass it directly without expanding |
| **Needs customization** | ✅ Create new JSON or use spread: `{ ...JSON_BASE, field: 'new value' }` |
| **Inline expansion** | ❌ **NEVER DO THIS** - Pollutes the code |

**💡 Benefits:**

- ✅ Clean and readable code
- ✅ Fewer lines in the test file
- ✅ JSON-centric maintenance
- ✅ Easy reuse in multiple tests
- ✅ Makes it easy to identify which JSON is being used

**🔧 Implementation:**

1. **JSON must contain ALL necessary fields** for the scenario
2. **Page Object accepts full JSON** and extracts required fields
3. **Test passes JSON directly** without expansion
4. **If you need to customize:** Create new JSON or use spread operator

**Complete Example:**

```javascript
// ✅ data/recordsJson.js
export const JSON_CREATE_RECORD = {
  name: 'Example Record',
  category: 'Category A',
  status: 'Active',
  startDate: '2024-01-01',
  description: 'Record description',
};

export const JSON_FILTER_VALIDATION = {
  // Filter Fields
  name: 'Example Record',
  category: 'Category A',
  status: 'Active',
  // Validation Fields
  itemCount: 5,
};

// ✅ pages/featurePage.js
async create(data) {
  await this.nameInputLocator.fill(data.name);
  await this.formUtils.fillFieldPDropdown('#category', data.category);
  // ... extracts the required fields from JSON
}

async fillFilters(filters) {
  if (filters.name) await this.filterNameInputLocator.fill(filters.name);
  if (filters.category) {
    await this.formUtils.fillFieldPDropdown('#filterCategory', filters.category);
  }
  // ... conditionally extracts fields
}

// ✅ tests/feature.spec.js
test('001 - Create record',
  {
    tag: '@FEATURE_CREATE',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Ensure the screen is ready for record creation
    await page.featurePage.prepareRegistrationScreen();

    // Act: Create the record by passing the complete JSON
    await page.featurePage.create(JSON_CREATE_RECORD);

    // Act: Apply filters by passing the full JSON
    await page.featurePage.fillFilters(JSON_FILTER_VALIDATION);
    await page.featurePage.applyFilters();

    // Assert: Validate the grid using the full JSON
    await page.featurePage.validateInGrid(JSON_FILTER_VALIDATION);
  }
);
```

**🚨 VALIDATION CHECKLIST:**

Before finishing a test, check:

- [ ] ❌ Is there inline field expansion like `{ field1: JSON.field1, field2: JSON.field2 }`?
- [ ] ❌ Are there multiple lines with `JSON_CONSTANT.field` inside the method?
- [ ] ✅ Do all calls pass full JSON directly?
- [ ] ✅ Do JSONs contain ALL the fields needed for the scenario?
- [ ] ✅ Do Page Objects extract fields internally from the received JSON?

---

## 📊 **Creation Rules vs. Update**

| Scenario | Action | Rules |
|---------|------|--------|
| **New file** | Create | Complete structure: `describe`, `beforeEach`, `test()` |
| **Existing file** | Update | ONLY add `test()`, NEVER remove/change existing |

### **When Updating Existing File:**

1. **Add `test()` to the end** of the `describe` block
2. **NEVER remove** existing tests
3. **NEVER modify** existing `beforeEach` or `afterAll`
4. **KEEP** test naming standard (sequential numbering)

---

## 📂 **Mandatory Imports**

```javascript
import { {JSON_CONSTANT} } from '../data/{path}/{file}Json';
import { test } from '../helpers';
import { {TEST_USER} } from '../helpers/ambiente';
```

### **Imports Checklist:**

- [ ] Imported data JSON (if necessary)
- [ ] `test` imported from `helpers` (not `@playwright/test`)
- [ ] Test user imported from `helpers/ambiente`
- [ ] Correct relative paths (count `../`)
- [ ] Execute `get_errors` after creating imports

---

## 🎯 **Standard beforeEach Structure**

```javascript
test.beforeEach(async ({ page }) => {
  logger.test(test.info().title);

  // Log in and navigate to the screen
  await page.featurePage.login({TEST_USER});
  await page.{feature}Page.accessScreen();
});
```

### **Mandatory Elements:**

1. **Test log:** `logger.test(test.info().title)` (using `utils/logger.js`)
2. **Login:** `await page.featurePage.login({TEST_USER})`
3. **Navigation:** `await page.{feature}Page.accessScreen()`

**⚠️ NEVER use `console.log()` directly** — violates SonarQube S106. Use `logger` from `utils/logger.js`

---

## 🔄 **Scenario Cleaning Structure**

Use Page's own methods when there is a need to clear the screen state between scenarios.

**When to use:**
- Restoration of the initial state of the interface
- Cleaning filters and fields on screen
- Closing modes and returning to listing

---

### **Final Validation Checklist**

Before finalizing test file:

- [ ] AAA standard implemented in ALL tests
- [ ] Specific AAA comments (non-generic: "Preparation", "Execution", "Validation")
- [ ] NEVER expanded inline JSON fields
- [ ] Mandatory tags in `describe` (array) and `test()` (single string)
- [ ] Annotations with Jira URL
- [ ] Sequential numbering of tests (001, 002, 003...)
- [ ] `beforeEach` with standard structure
- [ ] Correct and validated imports with `get_errors`
- [ ] If existing file: ONLY added, not removed/changed

---

## 🎨 **Test Nomenclature**

### **Required Format:**

```
{number} - {infinitive verb} {clear and objective description}
```

### **Correct Examples:**

```javascript
test('001 - must create record successfully', ...)
test('002 - must edit existing record', ...)
test('003 - Must delete record when confirmed', ...)
test('004 - It should display an error when trying to save with empty fields', ...)
test('005 - Must filter records by creation date', ...)
```

### **Incorrect Examples:**

```javascript
// ❌ No number
test('Must register registration', ...)

// ❌ Past tense verb
test('001 - Registered registration', ...)

// ❌ Vague description
test('001 - Registration test', ...)

// ❌ No clear action
test('001 - Feature', ...)
```

---

## 🔍 **Import Validation**

**ABSOLUTE RULE:** Calculate relative paths correctly.

### **Checklist:**

- [ ] Count directory levels (`../`)
- [ ] Validate destination file path exists
- [ ] Compile code mentally
- [ ] Execute `get_errors` after creating imports

### **Calculation Example:**

```
Current file: tests/gatehouseManagement/crud/gatehouses.spec.js
Import from:  data/gatehouseManagement/gatehousesJson.js

Calculation:
tests/gatehouseManagement/crud/ → ../ (go up 1) → tests/gatehouseManagement/
                                 → ../ (go up 2) → tests/
                                 → ../ (go up 3) → root/

Result: '../../../data/gatehouseManagement/gatehousesJson'
```

> **🚨 RULE:** ALWAYS use `get_errors` after creating/modifying imports.

---

## 📊 **Coverage Mapping**

### **coverageFeatureMap.yml update**

**REQUIRED:** Update after creating/modifying tests

**Structure:**

```yml
- page: "{Menu/Path}"
  features:
    feature name 1: true
    feature name 2: true
```

### **Rules:**

- ✅ Use exact menu path (**Product** header field)
- ✅ JUST ADD new features
- ❌ NEVER change/remove existing features
- ❌ NEVER modify YAML structure

---

## 🎯 **Hierarchy of Information Sources**

When creating specification-based tests:

| Source | Usage | Mandatory Validation |
|-------|-----|----------------------|
| **1. HTML** | Exact text, real type, attributes | `grep_search` for components |
| **2. PNG** | Positioning, order (1st, 2nd, last) | Correlate elements with HTML |
| **3. Docs** | Navigation flow, context | Use only if it does not conflict with HTML/PNG |

---

## 📝 **RULE: Follow Specifications Steps**

> **⚠️ CRITICAL RULE: Steps determined in the "General Test Information" section of the specification are MANDATORY and must be followed IN THE EXACT ORDER**

### **✅ Correct Process**

**WHEN TO RECEIVE SPECIFICATION:**

1. **Read the "General Test Information" section** completely
2. **Identify ALL steps listed**
3. **Implement each step IN THE EXACT ORDER**
4. **NEVER skip or reorder steps**
5. **IF there is doubt:** Question the user explicitly

### **❌ PROHIBITED:**

```javascript
// ❌ WRONG - Taking unspecified steps
test('Create record', async ({ page }) => {
  // Specification said: "Complete required fields"
  // AI assumed: "I must fill in ALL fields"
  await page.featurePage.fillForm(COMPLETE_JSON); // WRONG
});

// ❌ WRONG - Reorder steps
test('Validate filter', async ({ page }) => {
  // Specification - CORRECT order:
  // 1. Fill filters
  // 2. Click search
  // 3. Validate result

  // AI did (WRONG):
  await page.featurePage.validateResult(); // Step 3 FIRST
  await page.featurePage.fillFilters(); // Step 1 AFTER
});

// ❌ WRONG - Skipping steps
test('Delete record', async ({ page }) => {
  // Specification - COMPLETE steps:
  // 1. Fetch record
  // 2. Click delete
  // 3. Confirm deletion

  // AI did this (WRONG - skipped Step 1):
  await page.featurePage.deleteRecord(); // Step 2
  await page.featurePage.confirmDeletion(); // Step 3
});

// ❌ WRONG - Add unnecessary step separators
test('Complete journey', async ({ page }) => {
  // ==================== STEP 1: ADD RECORD ==================== ❌ WRONG
  // Arrange: Access screen
  await page.featurePage.accessScreen();

  // ==================== STEP 2: VALIDATE RECORD ==================== ❌ WRONG
  // Assert: Validate creation
  await page.featurePage.validateCreation();
});
```

### **✅ Correct Implementation:**

```javascript
// ✅ CORRECT - Follow the specification steps EXACTLY
test('01 - Validate filter according to specification',
  {
    tag: '@FEATURE_FILTER',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Specification described:
    // 1. Access screen
    // 2. Fill filters
    // 3. Click search
    // 4. Validate result in the grid

    // Arrange: Access the screen according to the specification
    await page.featurePage.accessScreen();

    // Act: Fill filters and search according to the specification
    await page.featurePage.fillFilters(FILTER_JSON);
    await page.featurePage.clickSearch();

    // Assert: Validate the result according to the specification
    await page.featurePage.validateGridResult(FILTER_JSON);
  }
);

// ✅ CORRECT - Descriptive AAA comments without step separators
test('01 - Complete CRUD journey',
  {
    tag: '@FEATURE_CRUD_JOURNEY',
    annotation: { type: 'Issue', description: 'https://jira.example.com/PROJ-001' }
  },
  async ({ page }) => {
    // Arrange: Access the registration screen
    await page.featurePage.accessScreen();

    // Act: Add a new record to the system
    await page.featurePage.addRecord(JSON_DATA);

    // Assert: Validate that the record was created successfully
    await page.featurePage.validateSuccessMessage();

    // Arrange: Reload the screen for validation
    await page.featurePage.accessScreen();

    // Act: Apply filters to find the created record
    await page.featurePage.filterRecord(JSON_DATA);

    // Assert: Validate which record appears in the grid
    await page.validationUtils.validateGrid(JSON_DATA.grid);
  }
);
```

### **🔍 IF THERE ARE DOUBTS:**

**✅ ALWAYS question the user:**

```markdown
**Question About the Specification:**

The specification mentions "Fill filters" but does not specify WHICH fields.

Do you want to:
1. Fill ALL available fields in the filter?
2. Fill ONLY required fields?
3. Fill specific fields? (which ones?)

Please clarify to ensure correct implementation.
```

**❌ NEVER assume or deduce:**

```javascript
// ❌ WRONG - Assuming without questioning
// "The specification didn't say it, but I'll fill everything"
await page.featurePage.fillForm(COMPLETE_JSON);
```

### **⚠️ Reason for the Rule**

- Specifications define **functional requirements**
- Skipping or reordering steps **invalidates the test**
- Taking unspecified steps **does not meet the requirements**
- Tests must reflect **exactly** expected behavior

---

## 📚 **IMPORTS RULE AND .js Extension**

> **⚠️ CRITICAL RULE: use only public imports and `.js` extension for data/helpers when applicable**

### **❌ ANTI-PATTERN (DO NOT DO):**

```javascript
// ❌ WRONG - No .js extension in data
import { JSON_CREATE } from '../../data/module/featureJson';
// Error: Cannot find module

// ❌ WRONG - direct import of test from Playwright
import { test } from '@playwright/test';
```

### **✅ CORRECT IMPORT STANDARD:**

```javascript
import { expect } from '@playwright/test';

// ✅ CORRECT - With .js extension in data/helpers
import { JSON_CREATE } from '../../data/module/featureJson.js';
import { NAVIGATION_CONSTANT } from '../../helpers/navegacao.js';
```

### **📝 Complete Imports Template for Testing**

```javascript
// ✅ Library imports (barrel exports)
import { expect } from '@playwright/test';

// ✅ Data imports (with required .js extension)
import {
  JSON_CREATE,
  JSON_FILTER,
  JSON_VALIDATION,
} from '../../data/module/featureJson.js';

// ... rest of the test
```

**Reason:**

- Barrel exports guarantee compatibility with the internal structure of the package
- `.js` extension is mandatory for ES6 modules
- Facilitates maintenance and avoids import resolution errors

---

## ✅ **Critical Rules Summary**

1. **MANDATORY AAA standard** in all tests with specific (non-generic) comments
2. **NEVER use `console.log()` directly** — violates SonarQube S106. Use descriptive AAA comments or `logger` from `utils/logger.js`
3. **NEVER expand JSON fields inline** - pass full JSON directly
4. **Required Tags** in `describe` (array) and `test()` (single string)
5. **Annotations** with Jira URL in each test()
6. **Correct Imports** with validated relative paths
7. **beforeEach pattern** (token, login, navigation)
8. **Clear nomenclature** (number + infinitive verb + description)
9. **When updating:** ONLY add, never remove
10. **Validate with get_errors** always after modifications
11. **Complete JSONs** containing ALL necessary scenario fields
