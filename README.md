# Workspace File Picker

VSCode Extension for quick file selection in workspace using fuzzy-search dialog.

## Purpose

The extension implements a `workspaceFilePicker.pick` command that lists all files in the active workspace and offers them for selection via a `showQuickPick` dialog. Upon selection, the file is automatically opened in the editor.

**Target scenario:** Quick navigation to known files without browsing through folder structure in Explorer.

## Invocation

### Command Palette
- `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
- Enter command: `Pick Workspace File`

### Keyboard Shortcut
- `Ctrl+Shift+O` (Windows/Linux)
- `Cmd+Shift+O` (macOS)

### Programmatically
```typescript
await vscode.commands.executeCommand('workspaceFilePicker.pick');
```

## Functionality

1. **File Detection**: Recursive search of all files in workspace
2. **Filtering**: Automatic exclusion of build folders (`node_modules`, `out`, `dist`, `.git`, `.vscode-test`)
3. **Sorting**: Alphabetical by filename
4. **Fuzzy Search**: Search in filename, directory path, and full path
5. **Opening**: Automatic opening in new editor tab with focus

## User Interface

```
┌─ Pick Workspace File ────────────────────────────┐
│ Type filename to filter...                       │
├─────────────────────────────────────────────────┤
│ ► extension.ts          src/               📄    │
│   package.json          .                  📄    │
│   README.md             .                  📄    │
│   tsconfig.json         .                  📄    │
└─────────────────────────────────────────────────┘
```

**Display format per entry:**
- **Label**: Filename
- **Description**: Directory path (relative to workspace)
- **Detail**: Complete relative path

## API Usage

### Core Components

**File Finding:**
```typescript
// All files with exclusion filter
const files = await vscode.workspace.findFiles(
    '**/*',                                          // All files recursively
    '{**/node_modules/**,**/out/**,**/dist/**}',     // Exclusion pattern
    undefined,                                       // Unlimited limit
    cancellationToken                                // For progress dialog
);
```

**QuickPick Configuration:**
```typescript
const quickPick = vscode.window.createQuickPick<FileQuickPickItem>();
quickPick.placeholder = 'Type filename to filter...';
quickPick.matchOnDescription = true;  // Search in directory path
quickPick.matchOnDetail = true;       // Search in full path
```

**File Opening:**
```typescript
const document = await vscode.workspace.openTextDocument(fileUri);
await vscode.window.showTextDocument(document, {
    preview: false,      // New tab (not preview)
    preserveFocus: false // Focus editor
});
```

### Extension Lifecycle

**Activation:**
- Occurs automatically on first command invocation
- No explicit `activationEvents` configuration required

**Registration:**
```typescript
const disposable = vscode.commands.registerCommand('workspaceFilePicker.pick', handler);
context.subscriptions.push(disposable);
```

## Extension Possibilities

### 1. Advanced Filter Options

**Configurable Include/Exclude Patterns:**
```typescript
// settings.json
"workspaceFilePicker.includePattern": "**/*.{ts,js,json}",
"workspaceFilePicker.excludePattern": "**/node_modules/**"
```

**Implementation:**
```typescript
const config = vscode.workspace.getConfiguration('workspaceFilePicker');
const includePattern = config.get<string>('includePattern', '**/*');
const excludePattern = config.get<string>('excludePattern', defaultExcludes);
```

### 2. File Type Icons

**FileType-based Icons:**
```typescript
interface FileQuickPickItem extends vscode.QuickPickItem {
    $(symbol-file) fileName.ts     // TypeScript icon
    $(symbol-class) Component.tsx  // React component icon
}
```

### 3. Recently Opened Files

**MRU List Integration:**
```typescript
// Prioritize recently opened files
const recentFiles = context.workspaceState.get<string[]>('recentFiles', []);
items.sort((a, b) => {
    const aIndex = recentFiles.indexOf(a.relativePath);
    const bIndex = recentFiles.indexOf(b.relativePath);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.label.localeCompare(b.label);
});
```

### 4. Multi-Workspace Support

**Cross-workspace Search:**
```typescript
const allWorkspaceFolders = vscode.workspace.workspaceFolders || [];
const filePromises = allWorkspaceFolders.map(folder => 
    vscode.workspace.findFiles(
        new vscode.RelativePattern(folder, '**/*'),
        excludePattern
    )
);
const allFiles = (await Promise.all(filePromises)).flat();
```

### 5. Performance Optimization

**Lazy Loading for Large Workspaces:**
```typescript
const quickPick = vscode.window.createQuickPick();
quickPick.busy = true;  // Loading indicator

// Streaming update of items
for await (const fileBatch of getFilesBatched()) {
    quickPick.items = [...quickPick.items, ...fileBatch];
}
quickPick.busy = false;
```

## Architecture

```
src/extension.ts
├── activate()                    # Extension entry point
├── pickAndOpenWorkspaceFile()    # Main function
├── findAllWorkspaceFiles()       # Find workspace files
├── createQuickPickItems()        # Create UI items
├── showFileQuickPick()           # Show dialog
└── openFileInEditor()            # Open file
```

**Data Flow:**
1. Command invocation → `pickAndOpenWorkspaceFile()`
2. `vscode.workspace.findFiles()` → URI list
3. URI transformation → `QuickPickItem[]`
4. `showQuickPick()` → User selection
5. `openTextDocument()` → Editor display

## Build and Test

```bash
# Compilation
npm run compile

# Watch mode
npm run watch

# Test extension
F5 (VS Code Debug)
```

**Test Scenarios:**
- Empty workspace (warning)
- Large workspace (performance)
- Special characters in filenames
- Interrupted search (cancellation)