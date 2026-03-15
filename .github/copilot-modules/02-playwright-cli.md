# 🧭 **Playwright CLI - Snapshot and Test File Generation**

> **Module 02:** Process for executing user steps with `playwright-cli` (without headed mode), capturing snapshots, and preparing test file generation according to project instructions.

---

## 🎯 **Objective**

This module defines how to:

- Receive a user step-by-step flow (what to access, click, fill, and validate)
- Execute browser flow with `playwright-cli` **without headed mode**
- Capture snapshots during and at the end of the flow
- Generate test files aligned with `.github/copilot-instructions.md` and modules 05/06

---

## 📥 **Mandatory User Input**

### **📄 Default Step-by-Step Source (MANDATORY)**

When no other explicit document is provided in chat, use as default:

- The project example document structure

**Mandatory reading process:**

1. Read the full reference document
2. Extract steps from section `## 🚀 Scenario Implementation`
3. Execute steps in order with `playwright-cli` (headless)

The user must provide at minimum:

1. Initial URL
2. Sequence of actions (access, click, fill, select, validate)
3. Expected result per step (when applicable)

### **Recommended format**

```markdown
# 📋 Test General Information

- **Script No.:** 01
- **Jira issue No.:** ERPONU-0000
- **Type:** Journey Test
- **Product:** Product name
- **Name:** Scenario name
- **Description:** Short scenario description

---

## 🚀 Scenario Implementation

### **1. 🖥️ Access initial screen**

- **Actions:**
  - **Action:** Access https://site.com/login.
  - **Validation:** Validate Login is visible.

### **2. 🖥️ Execute login**

- **Actions:**
  - **Action:** Fill Email with test@domain.com.
  - **Action:** Fill Password with 123456.
  - **Action:** Click Sign In.
  - **Validation:** Validate Welcome text is visible.

### **3. 🖥️ Execute main flow**

- **Actions:**
  - **Action:** Click New Register.
  - **Action:** Fill Name with John Test.
  - **Action:** Click Save.
  - **Validation:** Validate message Record saved successfully.
```

**Format rules:**

- Keep steps numbered and in real execution order.
- Each step must contain an Actions block.
- Use explicit bullets with Action and Validation.
- Element text must match the text visible on screen.

---

## 🧪 **Mandatory Execution with Playwright CLI (Headless)**

> **ABSOLUTE RULE:** DO NOT use `--headed` in this flow.

### **Step 1: Open headless session**

```bash
playwright-cli open {initial_url}
```

### **Step 2: Execute each action in order**

Allowed commands (examples):

```bash
playwright-cli goto {url}
playwright-cli click {ref}
playwright-cli fill {ref} "{text}"
playwright-cli press Enter
playwright-cli select {ref} "{value}"
playwright-cli check {ref}
playwright-cli uncheck {ref}
playwright-cli snapshot
```

### **Step 3: Validate stages with snapshot**

- Capture snapshot after critical stages
- Capture final flow snapshot
- Use snapshot references for subsequent clicks/fills

---

## ⚠️ **Impediment Handling (Mandatory)**

If any blocker occurs, **stop and ask the user** before continuing.

### **Blocker examples**

- Element not found within default timeout
- Multiple elements with same text and no clear context
- CAPTCHA, MFA, permission pop-up, unexpected modal
- Missing data (credentials, form values, correct URL)
- Missing reference document or missing `## 🚀 Scenario Implementation` section

### **Decision rule**

- ❌ Do not invent missing data
- ❌ Do not assume click on ambiguous element
- ✅ Ask an objective and short question to unblock

---

## 📸 **Snapshot Output**

At the end of execution, ensure:

1. Final snapshot of target screen
2. Relevant intermediate snapshots (when state transition exists)
3. Record of generated files in `.playwright-cli/`

---

## 🏗️ **Test File Generation (With Copilot Instructions)**

After finishing snapshots:

1. Apply `.github/copilot-instructions.md` for analysis/planning flow
2. Use module 05 for Page Objects
3. Use module 06 for `*.spec.js` files
4. Generate required files for requested scenario (Page, Spec, and JSON when applicable)

### **Consistency guideline**

- Page Object locators must reflect elements identified in snapshots
- AAA structure must be applied in the test
- Naming and organization must follow project modules

---

## ✅ **Quick Checklist**

- [ ] I received complete step-by-step instructions from the user
- [ ] I executed `playwright-cli` without `--headed`
- [ ] I captured intermediate and final snapshots
- [ ] For blockers, I asked the user before proceeding
- [ ] I generated test files according to `copilot-instructions` + modules 05/06
