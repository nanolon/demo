# VSCode Extension Demo - TreeView Integration

## Überblick

Diese Extension demonstriert die grundlegenden Konzepte der VSCode Extension-Entwicklung mit TypeScript, einschließlich der Integration von TreeViews in die Explorer-Ansicht.

## Features

### Hello World Command
- **Command ID**: `demo.helloWorld`
- **Ausführung**: Über Command Palette (`Ctrl+Shift+P` > "Hello World")
- **Funktion**: Zeigt eine Informationsmeldung an

### Example TreeView
- **View ID**: `exampleView`
- **Position**: Explorer-Panel (linke Seitenleiste)
- **Inhalt**: Statische Liste mit drei Einträgen ("Eintrag A", "Eintrag B", "Eintrag C")

## TreeView-Architektur

### Komponenten

Die TreeView-Implementation besteht aus drei Hauptkomponenten:

1. **TreeItem-Klasse** (`ExampleTreeItem`)
   - Erbt von `vscode.TreeItem`
   - Definiert einzelne Knoten mit Label, Icon und Tooltip
   - Bestimmt Kollaps-Zustand der Knoten

2. **TreeDataProvider** (`ExampleTreeDataProvider`)
   - Implementiert `vscode.TreeDataProvider<T>`
   - Stellt Daten für die TreeView bereit
   - Behandelt Refresh-Events

3. **View-Registrierung**
   - Konfiguration in `package.json` unter `contributes.views`
   - Registrierung des DataProviders in der `activate()`-Funktion

### Konfiguration in package.json

```json
{
  "contributes": {
    "views": {
      "explorer": [
        {
          "id": "exampleView",
          "name": "Example View",
          "when": "true"
        }
      ]
    }
  }
}
```

**Parameter-Erklärung:**
- `explorer`: Platziert die View im Explorer-Panel
- `id`: Eindeutige Bezeichnung für programmatischen Zugriff
- `name`: Angezeigter Titel in der UI
- `when`: Bedingung für Sichtbarkeit (`"true"` = immer sichtbar)

### Anzeigeverhalten

Die TreeView wird **automatisch angezeigt**, wenn:
- Die Extension aktiviert ist
- Das Explorer-Panel geöffnet ist
- Die `when`-Bedingung erfüllt ist (hier: `"true"`)

**Aktivierung der Extension:**
- Beim ersten Ausführen eines registrierten Commands
- Bei VSCode-Start, falls `activationEvents` definiert sind
- Manuell über Extension-Panel

## Code-Erweiterungen

### Dynamische Inhalte

Erweitern Sie `getChildren()` für dynamische Daten:

```typescript
getChildren(element?: ExampleTreeItem): Thenable<ExampleTreeItem[]> {
    if (!element) {
        // Dynamische Daten laden
        return this.loadDataFromSource();
    }
    return Promise.resolve([]);
}

private async loadDataFromSource(): Promise<ExampleTreeItem[]> {
    // Beispiel: Dateisystem, API-Calls, Workspace-Inhalte
    const items = await someAsyncDataSource();
    return items.map(item => new ExampleTreeItem(item.name));
}
```

### Hierarchische Strukturen

Für verschachtelte Bäume:

```typescript
getChildren(element?: ExampleTreeItem): Thenable<ExampleTreeItem[]> {
    if (!element) {
        // Root-Ebene
        return Promise.resolve([
            new ExampleTreeItem('Parent A', vscode.TreeItemCollapsibleState.Collapsed),
            new ExampleTreeItem('Parent B', vscode.TreeItemCollapsibleState.Collapsed)
        ]);
    }
    
    // Child-Ebene basierend auf Parent
    switch (element.label) {
        case 'Parent A':
            return Promise.resolve([
                new ExampleTreeItem('Child A1'),
                new ExampleTreeItem('Child A2')
            ]);
        case 'Parent B':
            return Promise.resolve([
                new ExampleTreeItem('Child B1')
            ]);
        default:
            return Promise.resolve([]);
    }
}
```

### Context-Menüs und Commands

Fügen Sie in `package.json` hinzu:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "exampleView.itemClicked",
        "title": "Item Action"
      }
    ],
    "menus": {
      "view/item/context": [
        {
          "command": "exampleView.itemClicked",
          "when": "view == exampleView"
        }
      ]
    }
  }
}
```

Registrieren Sie das Command:

```typescript
const itemClickCommand = vscode.commands.registerCommand('exampleView.itemClicked', (item: ExampleTreeItem) => {
    vscode.window.showInformationMessage(`Clicked: ${item.label}`);
});
context.subscriptions.push(itemClickCommand);
```

### Refresh-Funktionalität

Die implementierte `refresh()`-Methode ermöglicht programmatische Updates:

```typescript
// Manueller Refresh
treeDataProvider.refresh();

// Automatischer Refresh bei Dateiänderungen
const watcher = vscode.workspace.createFileSystemWatcher('**/*');
watcher.onDidChange(() => treeDataProvider.refresh());
context.subscriptions.push(watcher);
```

## Installation und Test

1. **Entwicklungsumgebung starten**: `F5` in VSCode
2. **TreeView finden**: Explorer-Panel → "Example View" Sektion
3. **Command testen**: `Ctrl+Shift+P` → "Hello World"

## Typische Anwendungsfälle

- **Projekt-Explorer**: Spezielle Dateisicht für Framework-Strukturen
- **Dependency-Viewer**: Anzeige von Package-Abhängigkeiten
- **Task-Management**: Integration von Build-Tasks oder TODOs
- **API-Explorer**: Darstellung von REST-Endpoints oder Datenbank-Schemata

Die TreeView-API bietet durch ihre Flexibilität umfassende Möglichkeiten für domänenspezifische Navigationsstrukturen innerhalb von VSCode Extensions.