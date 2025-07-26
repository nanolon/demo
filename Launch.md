# Unit Tests in VSCode debuggen

Debugging von Unit Tests ist ein essentieller Bestandteil der Test-driven Development. VSCode bietet integrierte Debug-Unterstützung für Node.js-basierte Unit Tests mit Breakpoints, Variablen-Inspektion und Step-Through-Debugging.

## Debug-Konfiguration für Unit Tests

VSCode Extensions verwenden zwei verschiedene Debug-Umgebungen je nach Testtyp:

### 1. Unit Tests (Node.js Environment)
- **Ziel**: Reine Funktionen ohne VSCode-Dependencies
- **Umgebung**: Standard Node.js mit Mocha
- **Geschwindigkeit**: Schnell (1-2 Sekunden)
- **Use Case**: Business Logic, Algorithmen, Utilities

### 2. Integration Tests (VSCode Extension Host)
- **Ziel**: VSCode-API-Interaktion, Extension-Lifecycle  
- **Umgebung**: Vollständige VSCode-Instanz
- **Geschwindigkeit**: Langsam (10-15 Sekunden)
- **Use Case**: Kommando-Registrierung, Editor-Integration

## Launch-Konfigurationen

### Debug Unit Tests (Alle Tests)

```json
{
    "name": "Debug Unit Tests",
    "type": "node",
    "request": "launch",
    "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
    "args": [
        "--timeout", "999999",
        "--colors", 
        "${workspaceFolder}/out/test/**/*.test.js"
    ],
    "preLaunchTask": "npm: compile"
}
```

**Funktion**: Startet alle Unit Tests im Debug-Modus mit unbegrenztem Timeout für Debugging-Sessions.

### Debug Single Test File (Fokussierte Tests)

```json
{
    "name": "Debug Single Test File",
    "type": "node", 
    "request": "launch",
    "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
    "args": [
        "--timeout", "999999",
        "--colors",
        "${file}"
    ],
    "preLaunchTask": "npm: compile"
}
```

**Funktion**: Debuggt nur die aktuell geöffnete Test-Datei. Nützlich für fokussierte Entwicklung.

## Debug-Workflow

### 1. Breakpoints setzen

**In Test-Code:**
```typescript
it('should count words correctly', () => {
    // Arrange
    const text = 'Hello world test';
    const expected = 3;
    
    // ⬅️ Breakpoint hier setzen (F9)
    const result = countWords(text);
    
    // ⬅️ Oder hier, um result zu inspizieren
    assert.strictEqual(result, expected);
});
```

**In Business Logic (`utils.ts`):**
```typescript
export function countWords(text: string): number {
    if (!text || text.trim().length === 0) {
        return 0;  // ⬅️ Breakpoint für Edge Case
    }
    
    const words = text.trim().split(/\s+/);  // ⬅️ Breakpoint für Algorithmus
    return words.length;
}
```

### 2. Debug-Session starten

**Methode 1: Run and Debug View**
1. `Ctrl+Shift+D` (Debug View öffnen)
2. "Debug Unit Tests" aus Dropdown wählen
3. `F5` oder ▶️ Button klicken

**Methode 2: Command Palette**
1. `Ctrl+Shift+P` 
2. "Debug: Start Debugging" eingeben
3. Konfiguration auswählen

**Methode 3: Keyboard Shortcut**
- `F5` startet letzte Debug-Konfiguration

### 3. Debug-Navigation

**Step Commands:**
- `F10`: Step Over (nächste Zeile, ohne in Funktionen zu gehen)
- `F11`: Step Into (in Funktionen hineinspringen)
- `Shift+F11`: Step Out (aus aktueller Funktion herausspringen)
- `F5`: Continue (bis zum nächsten Breakpoint)

**Inspection:**
- **Variables Panel**: Zeigt lokale Variablen und Parameter
- **Watch Panel**: Benutzerdefinierte Expressions überwachen
- **Call Stack**: Funktionsaufruf-Hierarchie
- **Debug Console**: Expressions zur Laufzeit evaluieren

## Praktisches Debugging-Beispiel

### Test mit komplexer Logik

```typescript
describe('countWords() edge cases', () => {
    it('should handle mixed whitespace correctly', () => {
        // Arrange
        const text = '  Hello\n\nworld\t\t\ttest  ';
        const expected = 3;
        
        // ⬅️ Breakpoint: Was ist der exakte Input?
        const result = countWords(text);
        
        // ⬅️ Breakpoint: Was ist das actual result?
        assert.strictEqual(result, expected);
    });
});
```

### Debug-Session durchführen

**1. Breakpoint bei `const result = countWords(text);`**

**Variables Panel zeigt:**
```
text: "  Hello\n\nworld\t\t\ttest  "
expected: 3
```

**2. Step Into (`F11`) → Springt in `countWords()` Funktion**

**3. In `countWords()` bei `const words = text.trim().split(/\s+/);`**

**Variables Panel zeigt:**
```
text: "  Hello\n\nworld\t\t\ttest  "
// Nach trim():
trimmedText: "Hello\n\nworld\t\t\ttest"
```

**4. Step Over (`F10`) → `split()` wird ausgeführt**

**Variables Panel zeigt:**
```
words: Array(3) ["Hello", "world", "test"]
```

**5. Debug Console verwenden:**
```javascript
> text.split(/\s+/)
["", "Hello", "world", "test", ""]
> text.trim().split(/\s+/)  
["Hello", "world", "test"]
```

## Conditional Breakpoints

Für komplexe Test-Daten mit Schleifen:

```typescript
it('should validate multiple filenames', () => {
    const testCases = [
        { filename: 'valid.txt', expected: true },
        { filename: 'invalid<.txt', expected: false },
        // ... 20 weitere Cases
    ];
    
    testCases.forEach((testCase, index) => {
        // ⬅️ Conditional Breakpoint: index === 15
        const result = isValidFilename(testCase.filename);
        assert.strictEqual(result, testCase.expected);
    });
});
```

**Conditional Breakpoint setzen:**
1. Rechtsklick auf Breakpoint-Symbol
2. "Edit Breakpoint" wählen
3. Condition eingeben: `index === 15`

## Error-Debugging

### Failing Assertion debuggen

```typescript
it('should count words with punctuation', () => {
    const text = 'Hello, world! How are you?';
    const expected = 5;
    
    const result = countWords(text);
    // ❌ AssertionError: Expected 6 but got 5
    assert.strictEqual(result, expected);
});
```

**Debug-Strategie:**
1. Breakpoint vor Assertion setzen
2. Debug Console verwenden:
   ```javascript
   > text
   "Hello, world! How are you?"
   > text.split(/\s+/)
   ["Hello,", "world!", "How", "are", "you?"]
   > result
   5
   ```
3. Problem identifizieren: Interpunktion wird mitgezählt
4. Test oder Implementierung korrigieren

## Performance-Debugging

### Memory und Timing analysieren

```typescript
it('should handle large text efficiently', () => {
    const startTime = process.hrtime.bigint();
    const largeText = 'word '.repeat(100000);
    
    // ⬅️ Breakpoint: Memory usage vor Verarbeitung
    const result = countWords(largeText);
    
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // ms
    
    // ⬅️ Breakpoint: Performance-Metriken inspizieren
    console.log(`Processing time: ${duration}ms`);
    assert.strictEqual(result, 100000);
});
```

## Test-spezifische Debug-Konfiguration

### Einzelne Test-Suite debuggen

```json
{
    "name": "Debug Word Count Tests",
    "type": "node",
    "request": "launch", 
    "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
    "args": [
        "--timeout", "999999",
        "--grep", "countWords",
        "${workspaceFolder}/out/test/**/*.test.js"
    ]
}
```

**`--grep` Parameter**: Führt nur Tests aus, deren Name "countWords" enthält.

## Debug-Console Commands

**Während Debug-Session verfügbar:**

```javascript
// Variable inspizieren
> filename
"test<.txt"

// Funktionen testen
> isValidFilename("valid.txt")
true

// Regular Expressions testen
> /[<>:"/\\|?*]/.test("test<.txt")
true

// Arrays manipulieren
> text.split(/\s+/).filter(word => word.length > 0)
["Hello", "world", "test"]
```

## Best Practices

### 1. Strategic Breakpoint Placement

```typescript
// ✅ Gut: Breakpoints an Entscheidungspunkten
export function isValidFilename(filename: string): boolean {
    if (!filename || filename.trim().length === 0) {
        return false;  // ⬅️ Breakpoint für Edge Case
    }
    
    const invalidChars = /[<>:"/\\|?*]/;
    const hasInvalidChars = invalidChars.test(filename);  // ⬅️ Breakpoint für Regex-Test
    return !hasInvalidChars;
}
```

### 2. Debug-freundliche Test-Daten

```typescript
// ✅ Aussagekräftige Test-Daten für Debugging
const testCases = [
    { name: 'empty string', input: '', expected: false },
    { name: 'whitespace only', input: '   ', expected: false },
    { name: 'valid filename', input: 'document.pdf', expected: true },
    { name: 'invalid char <', input: 'test<.txt', expected: false }
];
```

### 3. Logging vs. Debugging

```typescript
// ❌ Nicht optimal: Console.log für Debugging
export function countWords(text: string): number {
    console.log('Input:', text);  // Wird in Tests sichtbar
    const result = text.trim().split(/\s+/).length;
    console.log('Result:', result);
    return result;
}

// ✅ Besser: Breakpoints und Debug Console verwenden
// Kein permanenter Logging-Code in Business Logic
```

## Troubleshooting

### Breakpoints werden ignoriert

**Problem**: Breakpoints haben keine Wirkung
**Lösung**: 
- Source Maps aktiviert? `"sourceMap": true` in tsconfig.json
- Code kompiliert? `yarn run compile` ausführen
- Richtige Launch-Konfiguration gewählt?

### Debug-Session startet nicht

**Problem**: "Cannot find module" oder Launch-Fehler
**Lösung**:
- Dependencies installiert? `yarn install`
- Mocha verfügbar? `ls node_modules/mocha/bin/_mocha`
- preLaunchTask erfolgreich? Compile-Fehler prüfen

### Tests laufen ohne Debug-Stop

**Problem**: Tests beenden sich, ohne bei Breakpoints zu stoppen
**Lösung**:
- Timeout erhöht? `"--timeout", "999999"` in Launch-Konfiguration
- Breakpoint in ausgeführtem Code-Pfad? Conditional prüfen

Unit Test Debugging in VSCode ermöglicht präzise Fehleranalyse und acceleriert die Test-driven Development. Die Integration von Breakpoints, Variable-Inspection und Debug Console macht komplexe Debugging-Szenarien effizient bearbeitbar.