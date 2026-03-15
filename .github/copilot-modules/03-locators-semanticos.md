# 🎨 **Semantic Locators - Project Strategies**

> **🚨 CONSULT THIS FILE WHEN CHOOSING LOCATOR STRATEGY**

## 🎭 **ALWAYS CONSULT PLAYWRIGHT DOCS FIRST**

> **⚠️ Mandatory official documentation:**
>
> - **Locators Guide:** https://playwright.dev/docs/locators
> - **Auto-waiting:** https://playwright.dev/docs/actionability
> - **Strict Mode:** https://playwright.dev/docs/locators#strictness

**This module:** Specific strategies for project components (PrimeNG, dynamic menus, strict mode).

---

## 📋 **Priority Order (Reinforcing Playwright)**

> **🚨 ABSOLUTE RULE: ALWAYS follow this order. Test data attributes (`data-cy`, `data-testid`) are for Cypress/other tools, NOT for Playwright.**

| Priority | Locator | When to Use | ❌ DO NOT Use |
|-----------|-------------|-------------|-----------|
| **1** | `getByRole()` | **ALWAYS when possible**. For elements with clear accessibility role (buttons, links, headings, etc.). More resilient to DOM changes. | ❌ `getByTestId('action-button')` |
| **2** | Chaining / `.filter()` | **For precision and performance**. Refines search after a stable locator. Ex: `getByRole('list').filter({hasText: 'Active'})` | ❌ `locator('[data-cy="..."]')` |
| **3** | `getByLabel()` / `getByPlaceholder()` | **For Inputs**. Form fields with visible `<label>` or `placeholder`. | ❌ `locator('#input-id')` |
| **4** | `getByText()` | **For text content**. Spans, paragraphs, or visible text. Use **Regex** for resilience. | ❌ `locator('.text-class')` |
| **5** | `getByAltText()` / `getByTitle()` | **For visual elements/icons**. Images (`alt`) or buttons/icons with `title` or `aria-label`. | ❌ `locator('img')` |
| **6** | `locator('[attr=value]')` | **Stable Attribute Fallback**. When semantic locators fail, use static attributes: `[name="user-form"]`, `[value="123"]`. **NEVER `data-cy` or `data-testid`** | ❌ `locator('[data-*]')` |
| **7** | `locator('#ID')` / `locator('.class')` | **Implementation Fallback**. **Last resort**. IDs may be dynamic and classes change with styling. | ❌ `locator('[id*="dynamic"]')` |

### **🚫 FORBIDDEN: Test Data Attributes**

```javascript
// ❌ COMPLETELY WRONG (Cypress/other tools)
page.getByTestId('action-button')
page.locator('[data-cy="action-button"]')
page.locator('[data-testid="submit"]')
```

```javascript
// ✅ CORRECT (semantic Playwright)
page.getByRole('button', { name: 'Actions' })
page.getByRole('button', { name: 'Submit' })
```

**Why?**
- `data-cy`, `data-testid` are for **Cypress and other tools**
- Playwright prioritizes **accessibility** (`getByRole`, `getByText`, etc.)
- Semantic locators are more **resilient and maintainable**

### **Important Notes**

- ⚠️ **`<a>` in dynamic menus without `href`** → Use `getByText()` or `locator().filter()`
- ⚠️ **NEVER use `getByRole('columnheader')`** for table headers
- ⚠️ Use `exact: true` when needed to ensure exact matching

---

## 🔧 **Regular Expressions for Dynamic Content**

### **Counters**

```javascript
this.locatorTabWithCounterLink = this.frame.getByRole('link', { name: /{Text} \(\d+\)/ });
```

### **Dates**

```javascript
this.locatorDateText = this.frame.getByText(/\d{2}\/\d{2}\/\d{4}/);
```

### **Monetary Values**

```javascript
this.locatorAmountText = this.frame.getByText(/R\$ \d+,\d{2}/);
```

---

## 📊 **Table Validation**

### **Implementation Pattern**

```javascript
// Table anchor
this.locatorRecordsTable = this.frame.getByRole('table');
this.locatorHeaderRow = this.locatorRecordsTable.locator('thead tr');

// First row (most common in Open Screens)
this.locatorFirstRow = this.locatorRecordsTable.locator('tbody tr').first();

// Elements in row based on real HTML
this.locatorRowElementGeneric = this.locatorFirstRow.getByRole('{role}', { name: '{name}' });
// or
this.locatorRowElementGeneric = this.locatorFirstRow.locator('{selector}').filter({ hasText: '{text}' });
```

---

## 🚫 **Dynamic ID Handling**

### **Unstable IDs (NEVER USE)**

❌ **Avoid:**
- `#ui-panel-{number}-label`
- `#s-button-{number}`
- `#dialog-{timestamp}`

### **Stable Alternatives (USE)**

```javascript
// With anchor
this.locatorContainerInput = this.frame.getByRole('{role}', { name: '{name}' });
this.locatorElementInput = this.locatorContainerInput.getByRole('{role}');
this.locatorNestedElementInput = this.frame.getByLabel('{label}').getByText('{text}');

// With state attributes
this.locatorActiveInput = this.frame.getByRole('{role}', { expanded: true });
// With filters
this.locatorFilteredInput = this.frame.getByRole('{role}').filter({ hasText: '{text}' });
```

---

## 🎯 **Resolution Strategies for Strict Mode Violations**

### **Problem**

Multiple elements match the same locator (ex: `name: ''`, tabs without unique identifiers).

### **Solutions**

#### **1. Container Hierarchy**

```javascript
// Identify unique containers first
this.locatorConfigSectionRegion = this.frame.getByRole('region', { name: 'Configuration' });
this.locatorConfigTab = this.locatorConfigSectionRegion.getByRole('tab');
```

#### **2. State Attributes**

```javascript
this.locatorActiveTab = this.frame.getByRole('tab', { expanded: true });
this.locatorsInactiveTab = this.frame.getByRole('tab', { expanded: false });
```

#### **3. Content Filters**

```javascript
this.locatorTabWithText = this.frame.getByRole('tab').filter({ hasText: 'Settings' });
this.locatorTabWithIcon = this.frame.getByRole('tab').filter({ has: this.frame.locator('.icon') });
```

#### **4. Combined Strategies**

```javascript
this.locatorMainPanel = this.frame.getByRole('main');
this.locatorActiveTab = this.locatorMainPanel
  .getByRole('tab', { expanded: true })
  .filter({ hasText: 'Config' });
```

---

## ⚠️ **Menu Components (`p-tieredmenu`, `p-menu`)**

### **Problem**

`getByRole('link')` does not work in dynamic menus (`<a>` without `href`).

### **Solution**

```javascript
// ❌ INCORRECT - Fails in dynamic menus
this.locatorMenuItemLink = this.frame.getByRole('link', { name: '{Menu Item}' });
```

```javascript
// ✅ CORRECT - Option 1: getByText
this.locatorMenuItemText = this.frame.getByText('{Menu Item}', { exact: true });

// ✅ CORRECT - Option 2: locator + filter
this.locatorMenuItemLink = this.frame.locator('a').filter({ hasText: '{Menu Item}' });
```

**Identification:** HTML contains `<p-tieredmenu>`, `<p-menu>`, or `<a>` without `href` attribute.

---

## 🔄 **Try/Catch Handling**

### **For business actions with dynamic elements**

```javascript
/**
 * Deletes selected record with automatic recovery
 */
async deleteRecord() {
  try {
    await this.locatorActionsButton.click({ force: true });
    await this.locatorDeleteLink.click({ force: true });
  } catch {
    await this.locatorActionsButton.click({ force: true });
    await this.locatorDeleteLink.click({ force: true });
  }

  await this.locatorConfirmDeleteButton.click();
  await expect(this.locatorSuccessMessageAlert).toBeVisible();
}
```

---

## ✅ **Final Checklist**

- [ ] Do locators follow priority order (1-7)?
- [ ] Do headers use `getByRole('heading')`?
- [ ] Do buttons use `getByRole('button')`?
- [ ] Do dynamic menus use `getByText()` or `locator().filter()`?
- [ ] Are anchors used for multiple elements?
- [ ] Is `exact: true` used when needed?
- [ ] **NEVER** `getByRole('columnheader')`?
- [ ] Is absence of strict mode violations confirmed?
- [ ] Are dynamic IDs avoided?

---

> **💡 Prioritize semantic locators (`getByRole`, `getByLabel`) over CSS/ID selectors.**
