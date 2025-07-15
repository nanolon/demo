# TypeScript Demo Extension für VSCode

Eine umfassende Demonstration der wichtigsten TypeScript-Konzepte für VSCode Extension-Entwicklung, speziell entwickelt für Java-Entwickler mit Eclipse-Hintergrund.

## 🎯 Zweck und Lernziele

Diese Extension ist ein **didaktisches Projekt** zur Vermittlung von TypeScript-Konzepten, die sich fundamental von Java unterscheiden. Sie demonstriert praxisrelevante TypeScript-Features im Kontext der VSCode Extension API.

### Nach der Verwendung dieser Extension verstehen Sie:

- **Strukturelle Typisierung** vs. Javas nominale Typisierung
- **Typinferenz** und automatische Typableitung
- **Union Types** für flexible APIs
- **Asynchrone Programmierung** mit async/await
- **Interface-basierte Konfiguration** mit optionalen Properties
- **Generische Hilfsfunktionen** und Type Guards
- **VSCode Extension Lifecycle** und Event-Handling

## 🏗️ Architektur und TypeScript-Konzepte

### 1. Strukturelle Typisierung

```typescript
interface CommandDefinition {
    id: string;
    title: string;
    category?: string;
}

// Strukturell kompatibel - keine explizite Implementierung nötig
const helloCommand: CommandDefinition = { 
    id: 'demo.helloWorld', 
    title: 'Hello World' 
};
```

**Java-Unterschied:** TypeScript prüft die Objektstruktur, nicht die Klassenhierarchie. Ein Objekt ist kompatibel, wenn es die erforderlichen Properties besitzt.

### 2. Union Types und Typinferenz

```typescript
type MessageLevel = 'info' | 'warn' | 'error';

const extensionState = {
    isActive: false,    // TypeScript inferiert: boolean
    commandCount: 0,    // TypeScript inferiert: number
    lastCommand: 'none' as const  // Literal Type
};
```

**Java-Unterschied:** Union Types ermöglichen Variablen mit mehreren möglichen Typen. Typinferenz reduziert explizite Typangaben.

### 3. Asynchrone Programmierung

```typescript
async function saveAllOpenFiles(): Promise<number> {
    let savedCount = 0;
    for (const document of vscode.workspace.textDocuments) {
        if (document.isDirty && !document.isUntitled) {
            const success = await document.save(); // await statt .then()
            if (success) savedCount++;
        }
    }
    return savedCount;
}
```

**Java-Unterschied:** async/await ist deutlich lesbarer als CompletableFuture und integriert sich nahtlos mit try/catch.

### 4. Interface-basierte Konfiguration

```typescript
interface ExtensionConfig {
    readonly name: string;
    userSettings: {
        autoSave: boolean;
        logLevel: MessageLevel;
    };
    features?: {  // Optional mit ?
        experimentalMode: boolean;
    };
}
```

**Java-Unterschied:** Optionale Properties mit `?`, Optional Chaining mit `?.` und Nullish Coalescing mit `??`.

### 5. Generische Funktionen und Type Guards

```typescript
function getWorkspaceConfig<T>(section: string, key: string, defaultValue: T): T {
    return vscode.workspace.getConfiguration(section).get<T>(key, defaultValue);
}

function isTextEditor(obj: any): obj is vscode.TextEditor {
    return obj && typeof obj.document === 'object';
}
```

**Java-Unterschied:** Type Guards bieten Typsicherheit zur Laufzeit. Generics mit automatischer Typinferenz.

## 🚀 Installation und Ausführung

### Voraussetzungen
- Node.js (Version 18+)
- Visual Studio Code
- Yarn oder npm

### Setup
```bash
# Dependencies installieren
yarn install

# TypeScript kompilieren
yarn compile

# Extension im Development Mode starten
# Drücken Sie F5 in VSCode oder:
code --extensionDevelopmentPath=.
```

### Build und Watch Mode
```bash
# Kontinuierlicher Build bei Änderungen
yarn watch

# Einmalige Kompilierung
yarn compile

# Linting
yarn lint
```

## 🎮 Verfügbare Commands

Öffnen Sie die Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) und suchen Sie nach "Demo":

| Command | Beschreibung | TypeScript-Konzept |
|---------|--------------|-------------------|
| `Demo: Hello World` | Grundlegende Message-Anzeige | Strukturelle Typisierung, Union Types |
| `Demo: Save All Files` | Asynchrones Speichern aller geöffneten Dateien | async/await, Promise-Behandlung |
| `Demo: Analyze Current File` | Analysiert die aktuelle Datei | Type Guards, Optional Chaining |
| `Demo: Show Configuration` | Zeigt Workspace-Konfiguration | Generics, Typinferenz |
| `Demo: Show Extension Stats` | Extension-Nutzungsstatistiken | State Management, Template Literals |
| `Demo: Analyze File (Structural Example)` | Strukturelle Typisierung Demo | Strukturelle vs. nominale Typisierung |

## ⚙️ Konfiguration

Die Extension unterstützt verschiedene Workspace-Einstellungen in der `settings.json`:

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

### Konfigurationsoptionen

| Setting | Typ | Default | Beschreibung |
|---------|-----|---------|--------------|
| `demo.autoSave` | boolean | `true` | Automatisches Speichern aktivieren |
| `demo.logLevel` | string | `"info"` | Log-Level: "info", "warn", "error" |
| `demo.maxFiles` | number | `100` | Maximale Anzahl zu verarbeitender Dateien |
| `demo.logging` | boolean | `false` | Logging aktivieren |
| `demo.extensions` | string[] | `["ts", "js"]` | Zu berücksichtigende Dateierweiterungen |
| `demo.experimental` | object | `{}` | Experimentelle Features |

## 📚 Code-Struktur und Lernpfad

### Empfohlene Reihenfolge zum Studium:

1. **Strukturelle Typisierung** (Zeilen 10-30)
   - `CommandDefinition` Interface
   - Strukturell kompatible Objekte
   - `registerCommand` Hilfsfunktion

2. **Union Types** (Zeilen 35-60)
   - `MessageLevel` Type
   - `showTypedMessage` Funktion
   - Automatische Typinferenz

3. **Async/Await** (Zeilen 65-95)
   - `saveAllOpenFiles` Promise-Funktion
   - `handleSaveAllCommand` mit Error-Handling
   - VSCode API Integration

4. **Interface-Konfiguration** (Zeilen 100-145)
   - `ExtensionConfig` Interface
   - Optional Properties
   - Workspace-Integration

5. **Generics und Type Guards** (Zeilen 150-190)
   - Generische `getWorkspaceConfig` Funktion
   - `isTextEditor` Type Guard
   - Sichere API-Verwendung

6. **Extension Integration** (Zeilen 195-Ende)
   - Command Registry
   - Event-Listener
   - Lifecycle Management

## 🔍 Praxisübungen

### Übung 1: Command erweitern
Fügen Sie einen neuen Command hinzu, der:
- Die Anzahl der Zeichen im aktuellen Dokument zählt
- Eine typisierte Konfiguration verwendet
- Asynchron arbeitet

### Übung 2: Konfiguration erweitern
Erweitern Sie `ExtensionConfig` um:
- Eine neue optionale Sektion `themes`
- Union Type für Theme-Namen
- Default-Werte in `loadExtensionConfig`

### Übung 3: Type Guard implementieren
Erstellen Sie einen Type Guard für:
```typescript
function isMarkdownDocument(obj: any): obj is vscode.TextDocument {
    // Implementierung
}
```

## 🔬 TypeScript vs. Java - Vergleichstabelle

| Konzept | Java | TypeScript |
|---------|------|------------|
| **Typsystem** | Nominal (Klassenhierarchie) | Strukturell (Duck Typing) |
| **Typinferenz** | Begrenzt (var, diamond operator) | Umfassend (automatisch) |
| **Null-Sicherheit** | Optional\<T\>, verbose | ?., ??, eleganter |
| **Async Programming** | CompletableFuture, verbose | async/await, intuitiv |
| **Union Types** | Nicht verfügbar | Native Unterstützung |
| **Interface Extensions** | Implementierung erforderlich | Strukturelle Kompatibilität |

## 🛠️ Entwicklung und Debugging

### Debug-Konfiguration
Die Extension ist für Debugging vorkonfiguriert:
- Starten Sie mit `F5`
- Setzen Sie Breakpoints in `src/extension.ts`
- Debug Console zeigt Ausgaben

### Häufige Probleme

**Problem:** `command 'demo.xyz' already exists`
**Lösung:** Command ist bereits registriert, überprüfen Sie doppelte Registrierungen

**Problem:** `Cannot find module 'vscode'`
**Lösung:** Führen Sie `yarn install` aus

**Problem:** TypeScript-Compilation Fehler
**Lösung:** Überprüfen Sie `tsconfig.json` und führen Sie `yarn compile` aus

## 📖 Weiterführende Ressourcen

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript für Java-Entwickler](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

### VSCode Extension Development
- [VSCode Extension API](https://code.visualstudio.com/api/references/vscode-api)
- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
- [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)

### Verwandte Schulungsmodule
- **Extension Lifecycle und Aktivierung**
- **Command Registration und User Interaction**
- **Workspace APIs und File System**
- **Webviews und Tree Views**

## 📄 Lizenz

Dieses Projekt dient ausschließlich Bildungszwecken und ist Teil einer TypeScript-Schulung für Java-Entwickler.

---

**Entwickelt für die Schulung: VSCode Extension Development mit TypeScript**  
*Zielgruppe: Erfahrene Java-Entwickler mit Eclipse-Hintergrund*