# TypeScript Demo Extension for VSCode

A comprehensive demonstration of the most important TypeScript concepts for VSCode extension development, specifically designed for Java developers with an Eclipse background.

## 🎯 Purpose and Learning Objectives

This extension is a **didactic project** for conveying TypeScript concepts that fundamentally differ from Java. It demonstrates practically relevant TypeScript features in the context of the VSCode Extension API.

### After using this extension, you will understand:

* **Structural typing** vs. Java’s nominal typing
* **Type inference** and automatic type deduction
* **Union types** for flexible APIs
* **Asynchronous programming** with async/await
* **Interface-based configuration** with optional properties
* **Generic helper functions** and type guards
* **VSCode extension lifecycle** and event handling

## 🏗️ Architecture and TypeScript Concepts

### 1. Structural Typing

```typescript
interface CommandDefinition {
    id: string;
    title: string;
    category?: string;
}

// Structurally compatible – no explicit implementation needed
const helloCommand: CommandDefinition = { 
    id: 'demo.helloWorld', 
    title: 'Hello World' 
};
```

**Java difference:** TypeScript checks the object structure, not the class hierarchy. An object is compatible if it has the required properties.

### 2. Union Types and Type Inference

```typescript
type MessageLevel = 'info' | 'warn' | 'error';

const extensionState = {
    isActive: false,    // TypeScript infers: boolean
    commandCount: 0,    // TypeScript infers: number
    lastCommand: 'none' as const  // Literal type
};
```

**Java difference:** Union types allow variables with multiple possible types. Type inference reduces explicit type declarations.

### 3. Asynchronous Programming

```typescript
async function saveAllOpenFiles(): Promise<number> {
    let savedCount = 0;
    for (const document of vscode.workspace.textDocuments) {
        if (document.isDirty && !document.isUntitled) {
            const success = await document.save(); // await instead of .then()
            if (success) savedCount++;
        }
    }
    return savedCount;
}
```

**Java difference:** async/await is significantly more readable than CompletableFuture and integrates seamlessly with try/catch.

### 4. Interface-Based Configuration

```typescript
interface ExtensionConfig {
    readonly name: string;
    userSettings: {
        autoSave: boolean;
        logLevel: MessageLevel;
    };
    features?: {  // Optional with ?
        experimentalMode: boolean;
    };
}
```

**Java difference:** Optional properties with `?`, optional chaining with `?.` and nullish coalescing with `??`.

### 5. Generic Functions and Type Guards

```typescript
function getWorkspaceConfig<T>(section: string, key: string, defaultValue: T): T {
    return vscode.workspace.getConfiguration(section).get<T>(key, defaultValue);
}

function isTextEditor(obj: any): obj is vscode.TextEditor {
    return obj && typeof obj.document === 'object';
}
```

**Java difference:** Type guards provide runtime type safety. Generics with automatic type inference.

## 🚀 Installation and Execution

### Requirements

* Node.js (version 18+)
* Visual Studio Code
* Yarn or npm

### Setup

```bash
# Install dependencies
yarn install

# Compile TypeScript
yarn compile

# Start extension in development mode
# Press F5 in VSCode or:
code --extensionDevelopmentPath=.
```

### Build and Watch Mode

```bash
# Continuous build on changes
yarn watch

# One-time compilation
yarn compile

# Linting
yarn lint
```

## 🎮 Available Commands

Open the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for "Demo":

| Command                                   | Description                         | TypeScript Concept                  |
| ----------------------------------------- | ----------------------------------- | ----------------------------------- |
| `Demo: Hello World`                       | Basic message display               | Structural typing, union types      |
| `Demo: Save All Files`                    | Asynchronously saves all open files | async/await, promise handling       |
| `Demo: Analyze Current File`              | Analyzes the current file           | Type guards, optional chaining      |
| `Demo: Show Configuration`                | Displays workspace configuration    | Generics, type inference            |
| `Demo: Show Extension Stats`              | Extension usage statistics          | State management, template literals |
| `Demo: Analyze File (Structural Example)` | Structural typing demo              | Structural vs. nominal typing       |

## ⚙️ Configuration

The extension supports various workspace settings in `settings.json`:

```json
{
    "demo.autoSave": true,
    "demo.logLevel": "info",
    "demo.maxFiles": 100,
    "demo.logging": false,
    "demo.extensions": ["ts", "js"],
    "demo.experimental": {
        "mode": false,
        "debug": false
    }
}
```

### Configuration Options

| Setting             | Type      | Default        | Description                        |
| ------------------- | --------- | -------------- | ---------------------------------- |
| `demo.autoSave`     | boolean   | `true`         | Enable auto-save                   |
| `demo.logLevel`     | string    | `"info"`       | Log level: "info", "warn", "error" |
| `demo.maxFiles`     | number    | `100`          | Max number of files to process     |
| `demo.logging`      | boolean   | `false`        | Enable logging                     |
| `demo.extensions`   | string\[] | `["ts", "js"]` | File extensions to include         |
| `demo.experimental` | object    | `{}`           | Experimental features              |

## 📚 Code Structure and Learning Path

### Recommended study order:

1. **Structural Typing** (lines 10–30)

   * `CommandDefinition` interface
   * Structurally compatible objects
   * `registerCommand` helper function

2. **Union Types** (lines 35–60)

   * `MessageLevel` type
   * `showTypedMessage` function
   * Automatic type inference

3. **Async/Await** (lines 65–95)

   * `saveAllOpenFiles` promise function
   * `handleSaveAllCommand` with error handling
   * VSCode API integration

4. **Interface Configuration** (lines 100–145)

   * `ExtensionConfig` interface
   * Optional properties
   * Workspace integration

5. **Generics and Type Guards** (lines 150–190)

   * Generic `getWorkspaceConfig` function
   * `isTextEditor` type guard
   * Safe API usage

6. **Extension Integration** (lines 195–end)

   * Command registry
   * Event listener
   * Lifecycle management

## 🔍 Practical Exercises

### Exercise 1: Extend Command

Add a new command that:

* Counts the number of characters in the current document
* Uses typed configuration
* Works asynchronously

### Exercise 2: Extend Configuration

Extend `ExtensionConfig` with:

* A new optional section `themes`
* Union type for theme names
* Default values in `loadExtensionConfig`

### Exercise 3: Implement Type Guard

Create a type guard for:

```typescript
function isMarkdownDocument(obj: any): obj is vscode.TextDocument {
    // Implementation
}
```

## 🔬 TypeScript vs. Java – Comparison Table

| Concept                  | Java                              | TypeScript               |
| ------------------------ | --------------------------------- | ------------------------ |
| **Type system**          | Nominal (class hierarchy)         | Structural (duck typing) |
| **Type inference**       | Limited (`var`, diamond operator) | Extensive (automatic)    |
| **Null safety**          | Optional\<T>, verbose             | ?., ??, more elegant     |
| **Async programming**    | CompletableFuture, verbose        | async/await, intuitive   |
| **Union types**          | Not available                     | Natively supported       |
| **Interface extensions** | Implementation required           | Structural compatibility |

## 🛠️ Development and Debugging

### Debug Configuration

The extension is preconfigured for debugging:

* Start with `F5`
* Set breakpoints in `src/extension.ts`
* Debug console shows output

### Common Issues

**Problem:** `command 'demo.xyz' already exists`
**Solution:** Command already registered, check for duplicates

**Problem:** `Cannot find module 'vscode'`
**Solution:** Run `yarn install`

**Problem:** TypeScript compilation error
**Solution:** Check `tsconfig.json` and run `yarn compile`

## 📖 Further Resources

### TypeScript

* [TypeScript Handbook](https://www.typescriptlang.org/docs/)
* [TypeScript for Java Developers](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### VSCode Extension Development

* [VSCode Extension API](https://code.visualstudio.com/api/references/vscode-api)
* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
* [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### Related Training Modules

* **Extension lifecycle and activation**
* **Command registration and user interaction**
* **Workspace APIs and file system**
* **Webviews and tree views**

## 📄 License

This project is for educational purposes only and is part of a TypeScript training course for Java developers.

---

**Developed for the training: VSCode Extension Development with TypeScript**
*Target audience: Experienced Java developers with Eclipse background*
