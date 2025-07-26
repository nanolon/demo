# VSCode Extension Demo - Unit Testing für reine Funktionen

Diese VSCode Extension demonstriert professionelle Unit Test-Praktiken für Extension-Entwicklung. Der Fokus liegt auf **isolierten Funktionen ohne VSCode-Dependencies** - dem Fundament testbarer Extension-Architektur.

## Projektstruktur

```
├── src/
│   ├── extension.ts          # Extension mit exportierten, testbaren Funktionen
│   └── test/
│       └── extension.test.ts # Unit Tests für reine Funktionen
├── package.json              # Extension-Manifest mit Mocha-Test-Setup  
├── tsconfig.json            # TypeScript-Konfiguration
└── .vscode/
    ├── launch.json          # Debug-Konfiguration
    └── tasks.json           # Build-Tasks
```

## Testbare vs. Nicht-testbare Architektur

### ✅ Unit-testbar: Reine Funktionen

```typescript
// Geschäftslogik ohne Dependencies
export function isValidFilename(filename: string): boolean {
    if (!filename || filename.trim().length === 0) return false;
    return !/[<>:"/\\|?*]/.test(filename);
}

export function countWords(text: string): number {
    if (!text || text.trim().length === 0) return 0;
    return text.trim().split(/\s+/).length;
}
```

### ❌ Nicht Unit-testbar: VSCode-Integration

```typescript
// Framework-Code - braucht Integration Tests
vscode.window.showInformationMessage(greeting);
vscode.commands.registerCommand('demo.helloWorld', callback);
```

**Architektur-Prinzip**: Geschäftslogik von Framework-Code trennen.

## Installation und Setup

1. **Dependencies installieren:**
   ```bash
   yarn install
   ```

2. **TypeScript kompilieren:**
   ```bash
   yarn run compile
   ```

3. **Unit Tests ausführen:**
   ```bash
   yarn run test
   ```

## Architektur-Trennung für testbare VSCode Extensions

### Problem: VSCode-Dependencies in Unit Tests

**Fehlgeschlagener Ansatz:**
```
src/
├── extension.ts          # Enthält: VSCode-Import + Geschäftslogik
└── test/
    └── extension.test.ts # Importiert extension.ts → VSCode-Fehler
```

**Fehler:**
```
Error: Cannot find module 'vscode'
```

**Ursache:** Tests importieren `extension.ts`, welches `import * as vscode` enthält. Node.js kann VSCode-Modul nicht auflösen.

### Lösung: Layered Architecture

**Korrekte Struktur:**
```
src/
├── utils.ts             # Reine Geschäftslogik (keine VSCode-Dependencies)
├── extension.ts         # VSCode-Integration (importiert utils.ts)  
└── test/
    └── extension.test.ts # Importiert utils.ts (direkt testbar)
```

#### Layer 1: Business Logic (`utils.ts`)

```typescript
// ✅ Unit-testbar: Keine External Dependencies
export function isValidFilename(filename: string): boolean {
    if (!filename || filename.trim().length === 0) return false;
    return !/[<>:"/\\|?*]/.test(filename);
}

export function createGreeting(name: string): string {
    if (!name || name.trim().length === 0) return "Hello World!";
    return `Hello ${name.trim()}!`;
}

export function countWords(text: string): number {
    if (!text || text.trim().length === 0) return 0;
    return text.trim().split(/\s+/).length;
}
```

**Eigenschaften:**
- Reine Funktionen (deterministic, side-effect-free)
- Keine Imports außer Node.js Built-ins
- Direkt in Standard Node.js-Umgebung testbar

#### Layer 2: VSCode Integration (`extension.ts`)

```typescript
import * as vscode from 'vscode';
import { createGreeting, countWords } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('demo.helloWorld', () => {
        const greeting = createGreeting("VSCode Extension Developer");
        vscode.window.showInformationMessage(greeting);
    });

    const wordCountDisposable = vscode.commands.registerCommand('demo.countWords', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const text = editor.document.getText();
            const wordCount = countWords(text);
            vscode.window.showInformationMessage(`Word count: ${wordCount}`);
        }
    });

    context.subscriptions.push(disposable, wordCountDisposable);
}
```

**Eigenschaften:**
- VSCode-API-Interaktion
- Importiert Geschäftslogik aus `utils.ts`
- Dünner Layer ohne komplexe Logik

#### Layer 3: Unit Tests (`extension.test.ts`)

```typescript
import * as assert from 'assert';
import { isValidFilename, createGreeting, countWords } from '../utils';

describe('Business Logic Unit Tests', () => {
    it('should validate filename correctly', () => {
        assert.strictEqual(isValidFilename('test.txt'), true);
        assert.strictEqual(isValidFilename('test<.txt'), false);
    });
});
```

**Eigenschaften:**
- Importiert direkt aus `utils.ts` (keine VSCode-Dependencies)
- Läuft in Standard Node.js/Mocha-Umgebung
- Schnelle Ausführung, keine Extension Host erforderlich

### Vorteile dieser Architektur

#### 1. Testbarkeit
- **Unit Tests**: Schnell, isoliert, deterministisch
- **Integration Tests**: Separat, falls VSCode-API-Tests benötigt

#### 2. Separation of Concerns
- **Business Logic**: Unabhängig von VSCode-Framework
- **Integration Logic**: Fokus auf VSCode-API-Nutzung

#### 3. Wiederverwendbarkeit
- Geschäftslogik kann in anderen Kontexten genutzt werden
- Einfaches Refactoring ohne VSCode-Dependencies

#### 4. Development Experience
- Schnelle Test-Zyklen durch normale Node.js-Ausführung
- Einfaches Debugging ohne Extension Host

### Migration bestehender Extensions

#### Schritt 1: Geschäftslogik identifizieren

```typescript
// Vorher: Alles in extension.ts
export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('demo.process', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const text = editor.document.getText();
            // ⚠️ Diese Logik gehört in utils.ts
            const words = text.trim().split(/\s+/).length;
            vscode.window.showInformationMessage(`Words: ${words}`);
        }
    });
}
```

#### Schritt 2: Reine Funktionen extrahieren

```typescript
// utils.ts - Extrahierte Geschäftslogik
export function countWords(text: string): number {
    if (!text || text.trim().length === 0) return 0;
    return text.trim().split(/\s+/).length;
}

// extension.ts - Nur noch VSCode-Integration
import { countWords } from './utils';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('demo.process', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const text = editor.document.getText();
            const wordCount = countWords(text);  // ✅ Importierte Funktion
            vscode.window.showInformationMessage(`Words: ${wordCount}`);
        }
    });
}
```

#### Schritt 3: Unit Tests erstellen

```typescript
// extension.test.ts - Tests für Geschäftslogik
import { countWords } from '../utils';

describe('Word Counting', () => {
    it('should count words correctly', () => {
        assert.strictEqual(countWords('hello world'), 2);
    });
});
```

## Ausführung

```bash
# Kompilieren
yarn run compile

# Unit Tests (utils.ts) - schnell, direkt
yarn run test

# Extension testen (integration) - separat, später
# F5 oder VSCode Extension Development Host
```

## Best Practices

### 1. Klare Grenze zwischen Layern
```typescript
// ❌ Schlecht: VSCode-Code in Business Logic
export function processFile(uri: vscode.Uri): string {
    // Business Logic mit VSCode-Dependency
}

// ✅ Gut: Separate Concerns
export function processFileContent(content: string): string {
    // Reine Business Logic
}
```

### 2. Minimale Integration Layer
```typescript
// ✅ Extension.ts soll dünn sein
export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('cmd', () => {
        const input = getInputFromVSCode();
        const result = processInput(input);  // utils.ts
        showResultInVSCode(result);
    });
}
```

### 3. Konsistente Exports
```typescript
// utils.ts
export { isValidFilename, createGreeting, countWords };

// extension.ts - Re-export für Backwards Compatibility
export { isValidFilename, createGreeting, countWords } from './utils';
```

Diese Architektur ermöglicht echte Unit Tests ohne VSCode-Dependencies und bereitet den Weg für spätere Integration Tests vor.

## Test-Ausführung

### Kommandozeile (Empfohlen für CI/CD)

```bash
# Vollständiger Test-Zyklus: Lint + Compile + Test
yarn run pretest && yarn run test

# Nur Tests (Code bereits kompiliert)
yarn run test

# Mit Watch-Modus für TDD
yarn run watch  # Terminal 1: Auto-Compile
yarn run test   # Terminal 2: Tests bei Bedarf
```

### VSCode Test Runner (Interaktive Entwicklung)

1. **Extension Test Runner** installieren: `Ctrl+Shift+X` → "Extension Test Runner"
2. **Test-Ansicht** öffnen: Aktivitätsleiste → Test-Symbol
3. **Tests selektiv ausführen**: Einzelne Tests oder Gruppen

**Vorteil**: Live-Feedback, selektive Testausführung, integriertes Debugging.

## Was wird getestet?

### 1. Geschäftslogik-Funktionen

**`isValidFilename(filename: string)`**
- Gültige Dateinamen: `test.txt`, `document.pdf`, `file_name.js`
- Ungültige Zeichen: `<>:"/\|?*`
- Edge Cases: leer, null, undefined, whitespace

**`createGreeting(name: string)`**
- Personalisierte Begrüßungen: `"Alice"` → `"Hello Alice!"`
- Fallback-Verhalten: leer/null → `"Hello World!"`
- Input-Sanitization: Whitespace-Trimming

**`countWords(text: string)`**
- Einfacher Text: `"Hello world"` → `2`
- Whitespace-Normalisierung: Multiple Spaces, Tabs, Newlines
- Boundary Cases: leer, null, undefined

### 2. Test-Kategorien

**Positive Tests (Happy Path)**
```typescript
it('should count words in simple text', () => {
    const result = countWords('Hello world test');
    assert.strictEqual(result, 3);
});
```

**Edge Case Testing**
```typescript
it('should handle null and undefined input', () => {
    assert.strictEqual(countWords(null as any), 0);
    assert.strictEqual(countWords(undefined as any), 0);
});
```

**Data-Driven Tests**
```typescript
const testCases = [
    { input: 'Hello world', expected: 2 },
    { input: 'Hello    world', expected: 2 },
    { input: 'Hello\nworld\ttest', expected: 3 }
];

testCases.forEach(({ input, expected }) => {
    it(`should handle: "${input}"`, () => {
        assert.strictEqual(countWords(input), expected);
    });
});
```

## Test-Patterns verstehen

### Arrange-Act-Assert

```typescript
it('should trim whitespace from name', () => {
    // Arrange: Testdaten vorbereiten
    const name = '  Bob  ';
    const expected = 'Hello Bob!';
    
    // Act: Funktion ausführen
    const result = createGreeting(name);
    
    // Assert: Ergebnis prüfen
    assert.strictEqual(result, expected);
});
```

### Assertion-Typen

```typescript
// Primitive Gleichheit (Strings, Numbers, Booleans)
assert.strictEqual(actual, expected);

// Array/Objekt-Vergleiche
assert.deepStrictEqual(actualArray, expectedArray);

// Wahrheitswerte
assert.ok(value);  // value ist truthy

// Fehler-Erwartungen
assert.throws(() => riskyFunction(), /Error pattern/);
```

## Extension manuell testen

Die Extension stellt Kommandos bereit, die die getesteten Funktionen verwenden:

### Verfügbare Kommandos

1. **Hello World** (`demo.helloWorld`)
   - Verwendet `createGreeting()` für personalisierte Begrüßung
   - Test: Command Palette → "Hello World"

2. **Count Words** (`demo.countWords`)
   - Verwendet `countWords()` für Text-Analyse im aktiven Editor
   - Test: Textdatei öffnen → Command Palette → "Count Words"

**Command Palette**: `Ctrl+Shift+P` (Windows/Linux) oder `Cmd+Shift+P` (Mac)

## Development Workflow

### Test-Driven Development (TDD)

1. **Red**: Test schreiben (schlägt fehl)
2. **Green**: Minimale Implementierung (Test besteht)
3. **Refactor**: Code verbessern mit Test-Sicherheitsnetz

### Kontinuierliche Tests

```bash
# Terminal 1: Watch-Modus für automatische Kompilierung
yarn run watch

# Terminal 2: Tests nach Code-Änderungen ausführen
yarn run test
```

## Troubleshooting

### Tests werden nicht gefunden

**Problem**: Test Runner zeigt keine Tests
**Lösung**: 
```bash
yarn run compile  # TypeScript → JavaScript kompilieren
ls out/test/      # Prüfen: .js Dateien existieren
```

### Kompilierungsfehler

**Problem**: `error TS2304: Cannot find name 'describe'`
**Lösung**: `@types/mocha` installiert? `yarn install` ausführen

### Import-Probleme

**Problem**: `Cannot find module '../extension'`
**Lösung**: 
- Relative Pfade prüfen: `../extension` für `src/test/extension.test.ts`
- Extension-Funktionen als `export` markiert?

### Assert-Fehler verstehen

```bash
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
+ actual: 2
- expected: 3
```
**Interpretation**: `actual` (2) vs. `expected` (3) - Logik oder Test-Erwartung prüfen

## Best Practices

### Testbare Funktionen schreiben

```typescript
// ✅ Gut: Reine Funktion, deterministisch
export function processText(input: string): string {
    return input.trim().toLowerCase();
}

// ❌ Schlecht: Externe Dependencies, Seiteneffekte
function logAndProcess(input: string): string {
    console.log(input);  // Seiteneffekt
    vscode.window.showInformationMessage(input);  // VSCode-Dependency
    return input.trim();
}
```

### Test-Isolation

```typescript
describe('Function Tests', () => {
    // Keine shared state zwischen Tests
    // Jeder Test soll unabhängig ausführbar sein
});
```

### Aussagekräftige Test-Namen

```typescript
// ✅ Gut: Beschreibt Verhalten und Kontext
it('should return false for filename with invalid characters', () => {

// ❌ Schlecht: Vage Beschreibung
it('should work correctly', () => {
```

## Nächste Schritte

Nach Beherrschung der Unit Tests:

1. **Integration Tests**: VSCode-API-Interaktion testen
2. **End-to-End Tests**: Vollständige Workflows validieren
3. **Mock/Stub-Patterns**: External Dependencies isolieren
4. **Test Coverage**: Systematische Abdeckungs-Analyse

## Weiterführende Ressourcen

- **[Mocha Documentation](https://mochajs.org/)**: Test-Framework Details
- **[Node.js Assert](https://nodejs.org/api/assert.html)**: Assertion-Bibliothek
- **[TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)**: TypeScript-spezifische Patterns
