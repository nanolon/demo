# VSCode Extension Demo: Statusbar und Webview

Diese VSCode-Extension demonstriert die Integration von Statusbar-Items und Webview-Panels. Sie zeigt, wie erfahrene Entwickler schnell funktionale Extensions mit persistenter UI-Präsenz und flexiblen Anzeigemöglichkeiten erstellen können.

## Funktionalität

- **Statusbar-Item**: Links positionierter Button "Show Panel" mit Click-Handler
- **Webview-Panel**: HTML-basiertes Panel mit VSCode-Theme-Integration
- **Command-System**: Verknüpfung von UI-Elementen mit Extension-Funktionen

## Implementierung

### Statusbar-Integration

Die Extension erstellt ein Statusbar-Item links in der VSCode-Statusleiste:

```typescript
const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left, 
    100 // Priorität für Positionierung
);
statusBarItem.text = "Show Panel";
statusBarItem.command = 'demo.showWebview';
statusBarItem.show();
```

Das Item wird über die `command`-Eigenschaft mit einem registrierten Command verknüpft. VSCode führt diesen Command bei Klick automatisch aus.

### Webview-Panel Implementierung

Webview-Panels sind eigenständige Browser-Instanzen innerhalb von VSCode, die HTML/CSS/JavaScript rendern können:

```typescript
function createWebviewPanel(context: vscode.ExtensionContext): void {
    const panel = vscode.window.createWebviewPanel(
        'demoWebview',           // Eindeutige Typ-ID
        'Mein Webview',          // Angezeigter Titel
        vscode.ViewColumn.One,   // Editor-Spalte
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );
    
    panel.webview.html = getWebviewContent();
}
```

### VSCode-Theme-Integration

Das Webview nutzt VSCode-CSS-Variablen für nahtlose Theme-Integration:

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

Die `var(--vscode-*)` CSS-Variablen passen sich automatisch an das aktuelle VSCode-Theme an.

## Architektur

### Command-Registrierung

Commands müssen sowohl im TypeScript-Code registriert als auch in der `package.json` deklariert werden:

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

### Ressourcenverwaltung

VSCode-Extensions müssen explizit Ressourcen verwalten. Das `ExtensionContext.subscriptions`-Array sammelt Disposable-Objekte für automatische Bereinigung:

```typescript
context.subscriptions.push(
    statusBarItem,
    disposableWebview,
    disposableHello
);
```

Bei Extension-Deaktivierung ruft VSCode automatisch `dispose()` auf allen registrierten Objekten auf.

## Entwicklung und Testing

### Lokale Entwicklung

1. **Dependencies installieren:**
   ```bash
   yarn install
   ```

2. **TypeScript kompilieren:**
   ```bash
   yarn run compile
   ```

3. **Extension testen:**
   - `F5` drücken für Debug-Modus
   - Neue VSCode-Instanz öffnet sich
   - Statusbar-Item "Show Panel" klicken

### Watch-Modus

Für kontinuierliche Entwicklung:
```bash
yarn run watch
```

### Linting

Code-Qualität prüfen:
```bash
yarn run lint
```

## Anwendungsszenarien

### Statusbar-Items eignen sich für:
- Schnellzugriff auf häufige Funktionen
- Anzeige von Extension-Status  
- Toggle-Funktionen (Ein/Aus-Schalter)

### Webview-Panels eignen sich für:
- Konfigurationsoberflächen
- Datenvisualisierung
- Formulare und Eingabemasken
- Dokumentation und Hilfeseiten

## Erweiterte Funktionen

### Bidirektionale Kommunikation

Webviews können mit der Extension kommunizieren:

```typescript
// Extension → Webview
panel.webview.postMessage({ command: 'update', data: someData });

// Webview → Extension  
panel.webview.onDidReceiveMessage(message => {
    switch (message.command) {
        case 'save':
            // Daten verarbeiten
            break;
    }
});
```

### Performance-Überlegungen

- Webviews sind ressourcenintensiv - sparsam verwenden
- HTML-Content cachen bei wiederholter Anzeige
- Große Datenmengen chunked übertragen

### Sicherheitsaspekte

- `enableScripts` nur aktivieren wenn notwendig
- Benutzereingaben in Webviews validieren
- Externe Ressourcen über Content Security Policy beschränken

## Technische Details

**Entwickelt für:** VSCode ^1.102.0  
**Sprache:** TypeScript  
**Build-System:** tsc + yarn  
**Testing:** @vscode/test-cli

Diese Implementierung bietet eine solide Grundlage für Extensions mit persistenter UI-Präsenz und flexiblen Anzeigemöglichkeiten. Die Kombination aus Statusbar-Item und Webview-Panel deckt typische Extension-Anforderungen ab und lässt sich entsprechend spezifischer Anwendungsfälle erweitern.