
## **1. Initialize Project Environment**

### **Prerequisites**
- Ensure the following are installed:
  - Node.js (latest LTS version recommended)
  - npm or yarn (as the package manager)
  - Git for version control

---

## **2. Steps to Initialize**

### **Step 1: Create a New Project**
**Prompt:**
- Create a new React app with TypeScript support.
  ```
  Create a React app named "mermaid-diagram-editor" using the TypeScript template.
  ```
- Move into the project directory.
  ```
  Navigate to "mermaid-diagram-editor".
  ```

### **Step 2: Install Required Dependencies**
**Prompt:**
- Install essential libraries:
  ```
  Install "shadcn-ui", "codemirror", and "mermaid".
  ```
- Install development tools:
  ```
  Install "eslint", "prettier", "eslint-config-prettier", and "eslint-plugin-react-hooks" as dev dependencies.
  ```

### **Step 3: Set Up Shadcn UI**
**Prompt:**
- Follow Shadcn UI setup documentation.
  ```
  Initialize Shadcn UI and set up basic components as per documentation.
  ```

### **Step 4: Configure CodeMirror**
**Prompt:**
- Install CodeMirror plugins for syntax highlighting and linting.
  ```
  Install "@codemirror/view", "@codemirror/state", and "@codemirror/language".
  ```
- Create a utility setup file.
  ```
  Create a file "src/utils/codeMirrorSetup.ts" and configure CodeMirror defaults.
  ```

### **Step 5: Version Control Setup**
**Prompt:**
- Initialize a Git repository and push to a remote repository.
  ```
  Initialize Git, commit all files, and push to the remote repository.
  ```

### **Step 6: Test Project Setup**
**Prompt:**
- Run the development server and check output.
  ```
  Start the development server and ensure the default React app is running without errors.
  ```

---

## **3. Folder Structure**

Suggested project structure:
```
mermaid-diagram-editor/
├── public/
├── src/
│   ├── components/       # UI components
│   ├── pages/            # Page-level components
│   ├── utils/            # Utility functions (e.g., CodeMirror setup)
│   ├── styles/           # Global and component-specific styles
│   ├── App.tsx           # Main App component
│   └── index.tsx         # Entry point
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── package.json          # Dependency management
└── tsconfig.json         # TypeScript configuration
```

**Prompt:**
- Set up the project folder structure as shown above.

---

## **4. Next Steps**
**Prompt:**
- Configure Shadcn UI components for sidebar and toolbar.
- Set up CodeMirror for Mermaid.js syntax.
- Create an initial layout for the diagram editor.

