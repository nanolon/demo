# Insert Comment Example - VSCode Extension

A VSCode extension for automatically inserting TODO comments above the current cursor position. The project demonstrates basic extension development principles in TypeScript.

## Functionality

### Behavior
The extension registers the command `insertComment.insert`, which performs the following actions when called:

1. **Position Detection**: Determining the current cursor position in the active editor
2. **Indentation Analysis**: Extracting the indentation (whitespace/tabs) of the current line
3. **Comment Insertion**: Inserting the line `// TODO: Comment this section` above the cursor position
4. **Cursor Repositioning**: Moving the cursor to the original position (one line down)

### Invocation
The command can be executed in three ways:

1. **Command Palette**: `Ctrl+Shift+P` → `Insert TODO Comment`
2. **Programmatically**: `vscode.commands.executeCommand('insertComment.insert')`
3. **Keybinding** (optionally configurable): Definable in `keybindings.json`

## Extension Architecture

### Activation Model
The extension uses VSCode's **Lazy Loading** principle:

- **Activation**: Occurs only on first call of the registered command
- **Deactivation**: Automatically on VSCode shutdown or manual extension deactivation
- **Lifecycle Events**: `activate()` and `deactivate()` as main entry points

### Component Structure

#### package.json (Extension Manifest)
```json
{
  "contributes": {
    "commands": [
      {
        "command": "insertComment.insert",
        "title": "Insert TODO Comment"
      }
    ]
  }
}
```

Defines commands that become available in the Command Palette. The `command` identifier is globally unique and must match the registration in TypeScript.

#### extension.ts (Main Module)
The module exports two mandatory functions:

- **`activate(context: ExtensionContext)`**: Extension initialization, command registration
- **`deactivate()`**: Cleanup logic (minimal in this case)

### API Integration

#### Editor Access
```typescript
const editor = vscode.window.activeTextEditor;
const document = editor.document;
const selection = editor.selection;
```

VSCode provides direct access to the currently focused editor via `vscode.window.activeTextEditor`. The `TextDocument` provides read-only access to content, while `TextEditor` enables modifications.

#### Text Manipulation
```typescript
await editor.edit(editBuilder => {
    editBuilder.insert(insertPosition, todoComment);
});
```

Text changes occur via the **Edit Builder Pattern**. VSCode guarantees atomic operations and undo/redo compatibility.

#### Position Model
```typescript
const insertPosition = new vscode.Position(line, character);
const selection = new vscode.Selection(start, end);
```

VSCode uses 0-based line and column indexing. `Position` defines a point, `Selection` defines a range in the document.

## Development Setup

### Prerequisites
- Node.js 18+
- Yarn Package Manager
- VSCode 1.102.0+

### Installation
```bash
yarn install
```

### Development
```bash
# Compilation
yarn compile

# Watch Mode (automatic recompilation)
yarn watch

# Testing
yarn test

# Linting
yarn lint
```

### Debugging
1. Press `F5` → new VSCode instance with extension
2. `Ctrl+Shift+P` → execute `Insert TODO Comment`
3. Set breakpoints in `src/extension.ts`

## Architecture Patterns

### Extension Host Pattern
VSCode extensions run in a separate Node.js process (Extension Host), isolated from the main process. Communication occurs via VSCode API abstractions.

### Command Pattern
Commands are loosely coupled, executable units. They can be executed via Command Palette, keybindings, or programmatically.

### Dependency Injection
The `ExtensionContext` is injected during activation and contains extension-specific metadata and lifecycle management.

## Extension Possibilities

### Configuration
Adding `contributes.configuration` in `package.json` for custom comment text:

```json
"contributes": {
  "configuration": {
    "properties": {
      "insertComment.template": {
        "type": "string",
        "default": "// TODO: Comment this section",
        "description": "Template for inserted comments"
      }
    }
  }
}
```

### Keybindings
Default key combination in `package.json`:

```json
"contributes": {
  "keybindings": [
    {
      "command": "insertComment.insert",
      "key": "ctrl+alt+c",
      "when": "editorTextFocus"
    }
  ]
}
```

### Language-Specific Comments
Extension to support different comment syntaxes based on file extension or Language Mode.

## Build and Distribution

### Create VSIX Package
```bash
vsce package
```

### Installation
```bash
code --install-extension insert-comment-example-0.0.1.vsix
```

The resulting `.vsix` package is a ZIP file with manifest and compiled JavaScript files, installable in any VSCode instance.