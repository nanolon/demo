# VSCode Extension Demo: Statusbar and Webview

This VSCode extension demonstrates the integration of statusbar items and webview panels. It shows how experienced developers can quickly create functional extensions with persistent UI presence and flexible display options.

## Functionality

- **Statusbar Item**: Left-positioned "Show Panel" button with click handler
- **Webview Panel**: HTML-based panel with VSCode theme integration
- **Command System**: Connection of UI elements with extension functions

## Implementation

### Statusbar Integration

The extension creates a statusbar item on the left side of the VSCode status bar:

```typescript
const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, 
    100 // Priority for positioning
);
statusBarItem.text = "Show Panel";
statusBarItem.command = 'demo.showWebview';
statusBarItem.show();
```

The item is linked to a registered command via the `command` property. VSCode automatically executes this command when clicked.

### Webview Panel Implementation

Webview panels are standalone browser instances within VSCode that can render HTML/CSS/JavaScript:

```typescript
function createWebviewPanel(context: vscode.ExtensionContext): void {
    const panel = vscode.window.createWebviewPanel(
        'demoWebview',           // Unique type ID
        'My Webview',            // Displayed title
        vscode.ViewColumn.One,   // Editor column
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );
    
    panel.webview.html = getWebviewContent();
}
```

### VSCode Theme Integration

The webview uses VSCode CSS variables for seamless theme integration:

```css
body {
    font-family: var(--vscode-font-family);
    color: var(--vscode-foreground);
    background-color: var(--vscode-editor-background);
}
h1 {
    color: var(--vscode-textLink-foreground);
    border-bottom: 1px solid var(--vscode-textSeparator-foreground);
}
```

The `var(--vscode-*)` CSS variables automatically adapt to the current VSCode theme.

## Architecture

### Command Registration

Commands must be both registered in TypeScript code and declared in `package.json`:

**package.json:**
```json
{
  "contributes": {
    "commands": [
      {
        "command": "demo.showWebview",
        "title": "Show Webview Panel"
      }
    ]
  }
}
```

**TypeScript:**
```typescript
const disposableWebview = vscode.commands.registerCommand('demo.showWebview', () => {
    createWebviewPanel(context);
});
```

### Resource Management

VSCode extensions must explicitly manage resources. The `ExtensionContext.subscriptions` array collects Disposable objects for automatic cleanup:

```typescript
context.subscriptions.push(
    statusBarItem,
    disposableWebview,
    disposableHello
);
```

When the extension deactivates, VSCode automatically calls `dispose()` on all registered objects.

## Development and Testing

### Local Development

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Compile TypeScript:**
   ```bash
   yarn run compile
   ```

3. **Test extension:**
   - Press `F5` for debug mode
   - New VSCode instance opens
   - Click statusbar item "Show Panel"

### Watch Mode

For continuous development:
```bash
yarn run watch
```

### Linting

Check code quality:
```bash
yarn run lint
```

## Use Cases

### Statusbar items are suitable for:
- Quick access to frequent functions
- Displaying extension status  
- Toggle functions (on/off switches)

### Webview panels are suitable for:
- Configuration interfaces
- Data visualization
- Forms and input masks
- Documentation and help pages

## Advanced Features

### Bidirectional Communication

Webviews can communicate with the extension:

```typescript
// Extension → Webview
panel.webview.postMessage({ command: 'update', data: someData });

// Webview → Extension  
panel.webview.onDidReceiveMessage(message => {
    switch (message.command) {
        case 'save':
            // Process data
            break;
    }
});
```

### Performance Considerations

- Webviews are resource-intensive - use sparingly
- Cache HTML content for repeated display
- Transfer large amounts of data in chunks

### Security Aspects

- Only activate `enableScripts` when necessary
- Validate user input in webviews
- Restrict external resources via Content Security Policy

## Technical Details

**Developed for:** VSCode ^1.102.0  
**Language:** TypeScript  
**Build System:** tsc + yarn  
**Testing:** @vscode/test-cli

This implementation provides a solid foundation for extensions with persistent UI presence and flexible display options. The combination of statusbar item and webview panel covers typical extension requirements and can be extended according to specific use cases.