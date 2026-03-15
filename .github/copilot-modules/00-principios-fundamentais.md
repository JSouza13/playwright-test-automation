# 🎯 **Fundamental Principles - Read First**

> **Module 00:** Philosophy for using instructions + Mandatory references

---

## 🎭 **PLAYWRIGHT DOCUMENTATION - ALWAYS CONSULT**

> **⚠️ ABSOLUTE RULE:** The instructions in this project **complement** Playwright official documentation; they do not replace it.

### **📚 Mandatory References**

| Topic | Link | When to Consult |
|--------|------|------------------|
| **Locators** | https://playwright.dev/docs/locators | Before creating any locator |
| **Best Practices** | https://playwright.dev/docs/best-practices | Before any implementation |
| **Assertions** | https://playwright.dev/docs/test-assertions | When validating elements or states |
| **Auto-waiting** | https://playwright.dev/docs/actionability | When working with timeouts/waits |
| **Writing Tests** | https://playwright.dev/docs/writing-tests | Before creating `.spec.js` files |
| **Page Object Model** | https://playwright.dev/docs/pom | Before creating Page Objects |

---

## 🧠 **Instruction Philosophy**

### **WHAT IS IN THE INSTRUCTIONS:**

✅ **Project architectural decisions:**
- English language for naming
- Directory and file structure
- AAA pattern with specific comments
- Instantiation conventions (`helpers/index.js`)
- Project-specific tags and annotations

✅ **Context-specific rules:**
- Custom PrimeNG components
- Project disambiguation strategies
- JSON and test data patterns
- Integration with `coverageFeatureMap.yml`

### **WHAT IS NOT INCLUDED (consult Playwright):**

❌ **Playwright fundamentals:**
- How to create locators (`getByRole`, `getByText`, etc.)
- Locator priority order
- How to use assertions (`toBeVisible`, `toHaveText`, etc.)
- Auto-waiting and actionability
- Test structure (`describe`, `test`, `beforeEach`)

---

## 🎯 **How to Use the Instructions**

### **STEP 1: Understand the Problem**
- Identify the task type (create Page, create test, etc.)

### **STEP 2: Consult Playwright Docs**
- Read the relevant section of official documentation
- Understand Playwright best practices

### **STEP 3: Consult the Specific Module**
- Find applicable project decisions
- Check templates and examples

### **STEP 4: Apply Clean Code + SOLID**
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- YAGNI (You Aren't Gonna Need It)
- Single Responsibility

### **STEP 5: Validate**
- Did ESLint pass?
- Are imports correct?
- Did you follow project standards?
- Did you consult Playwright docs?

---

## ✅ **Autonomy Checklist**

Before implementing, ask:

- [ ] **Did I read Playwright documentation** on this topic?
- [ ] **Did I understand official best practices**?
- [ ] **Did I identify project-specific decisions**?
- [ ] **Did I apply Clean Code** and SOLID principles?
- [ ] **Did I validate with `grep_search`** (imports)?

---

## 🚫 **Critical Anti-Patterns**

### **❌ Excessive Dependency:**

```javascript
// ❌ WRONG - Following template blindly
await this.locators.button.waitFor({ state: 'visible' }); // Playwright uses expect()
```

```javascript
// ✅ CORRECT - Consult Playwright best practices
await expect(this.locatorConfirmButton).toBeVisible(); // Correct assertion
```

### **❌ Micromanagement:**

```markdown
❌ Instructions: "Use expect().toBeVisible() to validate visibility"
✅ Better: "Consult Playwright assertions docs for validations"
```

### **❌ Ignoring Official Documentation:**

```javascript
// ❌ WRONG - Creating locator without consulting docs
this.locatorGenericDiv = this.page.locator('.complex-class[attr="value"]');
```

```javascript
// ✅ CORRECT - Playwright priority: getByRole > getByText > getByLabel
this.locatorSaveButton = this.page.getByRole('button', { name: 'Save' });
```

---

## 💡 **Golden Principle**

> **"Project instructions define WHAT to do (architectural decisions).**
> **Playwright documentation defines HOW to do it (technical implementation)."**

**Example:**

- **Instruction (WHAT):** "Methods in English, direct locators in constructor"
- **Playwright (HOW):** "Use `getByRole()` with priority, `expect()` for assertions"

---

## 🎓 **AI Responsibility**

1. **Consult Playwright docs** before deciding technical implementation
2. **Follow official best practices** (locators, assertions, waits)
3. **Apply project decisions** (language, structure, conventions)
4. **Use Clean Code** and engineering principles
5. **Validate autonomously** (ESLint, imports, flow)

---

## 🔗 **Priority Hierarchy**

```
┌─────────────────────────────────────────┐
│  1. Playwright Best Practices          │
│  (Official documentation - HOW to do)  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. Clean Code + SOLID                  │
│  (Universal software engineering)       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. Project Instructions                │
│  (Specific decisions - WHAT to do)      │
└─────────────────────────────────────────┘
```

**In case of doubt:**
- **Implementation technique?** → Playwright docs
- **Project convention?** → Instruction modules
- **Code quality?** → Clean Code + SOLID

---

## 🚀 **Conclusion**

**This project relies on your ability to:**
1. Read and interpret technical documentation (Playwright)
2. Apply engineering best practices (Clean Code)
3. Adapt to specific context (project instructions)

**Do not follow instructions blindly. Think, consult, decide.**
