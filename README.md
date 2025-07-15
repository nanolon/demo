# Insert Comment Example - VSCode Extension

Eine VSCode Extension zur automatischen Einfügung von TODO-Kommentaren oberhalb der aktuellen Cursor-Position. Das Projekt demonstriert grundlegende Extension-Entwicklungsprinzipien in TypeScript.

## Funktionalität

### Verhalten
Die Extension registriert den Command `insertComment.insert`, der beim Aufruf folgende Aktionen ausführt:

1. **Positionsermittlung**: Bestimmung der aktuellen Cursor-Position im aktiven Editor
2. **Einrückungsanalyse**: Extraktion der Einrückung (Whitespace/Tabs) der aktuellen Zeile
3. **Kommentareinfügung**: Insertion der Zeile `// TODO: Kommentieren Sie diesen Abschnitt` oberhalb der Cursor-Position
4. **Cursor-Repositionierung**: Verschiebung des Cursors auf die ursprüngliche Position (eine Zeile nach unten)

### Aufruf
Der Command kann auf drei Arten ausgeführt werden:

1. **Command Palette**: `Ctrl+Shift+P` → `Insert TODO Comment`
2. **Programmatisc**h: `vscode.commands.executeCommand('insertComment.insert')`
3. **Keybinding** (optional konfigurierbar): In `keybindings.json` definierbar

## Extension-Architektur

### Aktivierungsmodell
Die Extension nutzt VSCodes **Lazy Loading**-Prinzip:

- **Aktivierung**: Erfolgt erst beim ersten Aufruf des registrierten Commands
- **Deaktivierung**: Automatisch beim VSCode-Shutdown oder manueller Extension-Deaktivierung
- **Lifecycle-Events**: `activate()` und `deactivate()` als Haupteinstiegspunkte

### Komponentenstruktur

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

Definiert Commands, die in der Command Palette verfügbar werden. Der `command`-Identifier ist global eindeutig und muss der Registrierung in TypeScript entsprechen.

#### extension.ts (Hauptmodul)
Das Modul exportiert zwei obligatorische Funktionen:

- **`activate(context: ExtensionContext)`**: Extension-Initialisierung, Command-Registrierung
- **`deactivate()`**: Cleanup-Logik (in diesem Fall minimal)

### API-Integration

#### Editor-Zugriff
```typescript
const editor = vscode.window.activeTextEditor;
const document = editor.document;
const selection = editor.selection;
```

VSCode stellt über `vscode.window.activeTextEditor` direkten Zugriff auf den aktuell fokussierten Editor bereit. Das `TextDocument` bietet read-only Zugriff auf Inhalte, während `TextEditor` Modifikationen ermöglicht.

#### Text-Manipulation
```typescript
await editor.edit(editBuilder => {
    editBuilder.insert(insertPosition, todoComment);
});
```

Textänderungen erfolgen über das **Edit Builder Pattern**. VSCode garantiert atomare Operationen und Undo/Redo-Kompatibilität.

#### Positionsmodell
```typescript
const insertPosition = new vscode.Position(line, character);
const selection = new vscode.Selection(start, end);
```

VSCode verwendet 0-basierte Zeilen- und Spaltenindizierung. `Position` definiert einen Punkt, `Selection` einen Bereich im Dokument.

## Entwicklungssetup

### Voraussetzungen
- Node.js 18+
- Yarn Package Manager
- VSCode 1.102.0+

### Installation
```bash
yarn install
```

### Entwicklung
```bash
# Compilation
yarn compile

# Watch Mode (automatische Recompilation)
yarn watch

# Testing
yarn test

# Linting
yarn lint
```

### Debugging
1. `F5` drücken → neue VSCode-Instanz mit Extension
2. `Ctrl+Shift+P` → `Insert TODO Comment` ausführen
3. Breakpoints in `src/extension.ts` setzen

## Architektur-Patterns

### Extension Host Pattern
VSCode Extensions laufen in einem separaten Node.js-Prozess (Extension Host), isoliert vom Hauptprozess. Kommunikation erfolgt über VSCode API-Abstraktionen.

### Command Pattern
Commands sind lose gekoppelte, ausführbare Einheiten. Sie können über Command Palette, Keybindings oder programmatisch ausgeführt werden.

### Dependency Injection
Der `ExtensionContext` wird bei Aktivierung injiziert und enthält Extension-spezifische Metadaten und Lifecycle-Management.

## Erweiterungsmöglichkeiten

### Konfiguration
Hinzufügung von `contributes.configuration` in `package.json` für benutzerdefinierten Kommentartext:

```json
"contributes": {
  "configuration": {
    "properties": {
      "insertComment.template": {
        "type": "string",
        "default": "// TODO: Kommentieren Sie diesen Abschnitt",
        "description": "Template für eingefügte Kommentare"
      }
    }
  }
}
```

### Keybindings
Standard-Tastenkombination in `package.json`:

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

### Sprachspezifische Kommentare
Erweiterung um Unterstützung verschiedener Kommentarsyntaxen basierend auf Dateierweiterung oder Language Mode.

## Build und Distribution

### VSIX-Paket erstellen
```bash
vsce package
```

### Installation
```bash
code --install-extension insert-comment-example-0.0.1.vsix
```

Das resultierende `.vsix`-Paket ist eine ZIP-Datei mit Manifest und kompilierten JavaScript-Dateien, installierbar in jeder VSCode-Instanz.