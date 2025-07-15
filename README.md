# Workspace File Picker

VSCode Extension für schnelle Dateiauswahl im Workspace mittels Fuzzy-Search-Dialog.

## Zweck

Die Extension implementiert einen `workspaceFilePicker.pick` Command, der alle Dateien des aktiven Workspace auflistet und über einen `showQuickPick`-Dialog zur Auswahl anbietet. Bei Auswahl wird die Datei automatisch im Editor geöffnet.

**Zielszenario:** Schnelle Navigation zu bekannten Dateien ohne Durchsuchen der Ordnerstruktur im Explorer.

## Aufruf

### Command Palette
- `Ctrl+Shift+P` (Windows/Linux) oder `Cmd+Shift+P` (macOS)
- Command eingeben: `Pick Workspace File`

### Tastenkürzel
- `Ctrl+Shift+O` (Windows/Linux)
- `Cmd+Shift+O` (macOS)

### Programmatisch
```typescript
await vscode.commands.executeCommand('workspaceFilePicker.pick');
```

## Funktionalität

1. **Dateierkennung**: Rekursive Suche aller Dateien im Workspace
2. **Filterung**: Automatischer Ausschluss von Build-Ordnern (`node_modules`, `out`, `dist`, `.git`, `.vscode-test`)
3. **Sortierung**: Alphabetisch nach Dateiname
4. **Fuzzy-Search**: Suche in Dateiname, Verzeichnispfad und vollständigem Pfad
5. **Öffnung**: Automatisches Öffnen in neuem Editor-Tab mit Fokus

## Benutzeroberfläche

```
┌─ Pick Workspace File ────────────────────────────┐
│ Dateiname eingeben zum Filtern...                │
├─────────────────────────────────────────────────┤
│ ► extension.ts          src/               📄    │
│   package.json          .                  📄    │
│   README.md             .                  📄    │
│   tsconfig.json         .                  📄    │
└─────────────────────────────────────────────────┘
```

**Anzeigeformat pro Eintrag:**
- **Label**: Dateiname
- **Description**: Verzeichnispfad (relativ zum Workspace)
- **Detail**: Vollständiger relativer Pfad

## API-Verwendung

### Kernkomponenten

**Dateifindung:**
```typescript
// Alle Dateien mit Ausschlussfilter
const files = await vscode.workspace.findFiles(
    '**/*',                                          // Alle Dateien rekursiv
    '{**/node_modules/**,**/out/**,**/dist/**}',     // Ausschlussmuster
    undefined,                                       // Unbegrenztes Limit
    cancellationToken                                // Für Progress-Dialog
);
```

**QuickPick-Konfiguration:**
```typescript
const quickPick = vscode.window.createQuickPick<FileQuickPickItem>();
quickPick.placeholder = 'Dateiname eingeben zum Filtern...';
quickPick.matchOnDescription = true;  // Suche in Verzeichnispfad
quickPick.matchOnDetail = true;       // Suche in vollständigem Pfad
```

**Datei öffnen:**
```typescript
const document = await vscode.workspace.openTextDocument(fileUri);
await vscode.window.showTextDocument(document, {
    preview: false,      // Neuer Tab (nicht Preview)
    preserveFocus: false // Editor fokussieren
});
```

### Extension-Lifecycle

**Aktivierung:**
- Erfolgt automatisch bei erstem Command-Aufruf
- Keine explizite `activationEvents`-Konfiguration erforderlich

**Registrierung:**
```typescript
const disposable = vscode.commands.registerCommand('workspaceFilePicker.pick', handler);
context.subscriptions.push(disposable);
```

## Erweiterungsmöglichkeiten

### 1. Erweiterte Filteroptionen

**Include/Exclude-Pattern konfigurierbar:**
```typescript
// settings.json
"workspaceFilePicker.includePattern": "**/*.{ts,js,json}",
"workspaceFilePicker.excludePattern": "**/node_modules/**"
```

**Implementierung:**
```typescript
const config = vscode.workspace.getConfiguration('workspaceFilePicker');
const includePattern = config.get<string>('includePattern', '**/*');
const excludePattern = config.get<string>('excludePattern', defaultExcludes);
```

### 2. Dateityp-Icons

**FileType-basierte Icons:**
```typescript
interface FileQuickPickItem extends vscode.QuickPickItem {
    $(symbol-file) fileName.ts     // TypeScript-Icon
    $(symbol-class) Component.tsx  // React-Component-Icon
}
```

### 3. Kürzlich geöffnete Dateien

**MRU-Liste Integration:**
```typescript
// Kürzlich geöffnete Dateien priorisieren
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

### 4. Multi-Workspace-Support

**Workspace-übergreifende Suche:**
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

### 5. Performance-Optimierung

**Lazy Loading großer Workspace:**
```typescript
const quickPick = vscode.window.createQuickPick();
quickPick.busy = true;  // Loading-Indikator

// Streaming-Update der Items
for await (const fileBatch of getFilesBatched()) {
    quickPick.items = [...quickPick.items, ...fileBatch];
}
quickPick.busy = false;
```

## Architektur

```
src/extension.ts
├── activate()                    # Extension-Einstiegspunkt
├── pickAndOpenWorkspaceFile()    # Hauptfunktion
├── findAllWorkspaceFiles()       # Workspace-Dateien finden
├── createQuickPickItems()        # UI-Items erstellen
├── showFileQuickPick()           # Dialog anzeigen
└── openFileInEditor()            # Datei öffnen
```

**Datenfluss:**
1. Command-Aufruf → `pickAndOpenWorkspaceFile()`
2. `vscode.workspace.findFiles()` → URI-Liste
3. URI-Transformation → `QuickPickItem[]`
4. `showQuickPick()` → Benutzerauswahl
5. `openTextDocument()` → Editor-Anzeige

## Build und Test

```bash
# Kompilierung
npm run compile

# Watch-Modus
npm run watch

# Extension testen
F5 (VS Code Debug)
```

**Test-Szenarios:**
- Leerer Workspace (Warnung)
- Großer Workspace (Performance)
- Spezielle Zeichen in Dateinamen
- Unterbrochene Suche (Cancellation)