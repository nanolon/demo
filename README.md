# VSCode Extension Demo - Unit Testing mit Mocha

Diese VSCode Extension demonstriert die Grundlagen der Extension-Entwicklung mit TypeScript und zeigt, wie Unit Tests mit Mocha erstellt und ausgeführt werden.

## Projektstruktur

```
├── src/
│   ├── extension.ts          # Hauptcode der Extension
│   └── test/
│       └── extension.test.ts # Unit Tests
├── package.json              # Extension-Manifest und Dependencies
└── tsconfig.json            # TypeScript-Konfiguration
```

## Installation und Setup

1. **Dependencies installieren:**
   ```bash
   yarn install
   ```

2. **TypeScript kompilieren:**
   ```bash
   yarn run compile
   ```

## Tests ausführen

### Methode 1: Kommandozeile (empfohlen)

```bash
# Tests kompilieren und ausführen
yarn run test
```

### Methode 2: VSCode Test Runner

1. **Extension Test Runner installieren:**
   - Öffnen Sie die Extensions-Ansicht (`Ctrl+Shift+X`)
   - Suchen Sie nach "Extension Test Runner"
   - Installieren Sie die Extension von Microsoft

2. **Tests ausführen:**
   - Öffnen Sie die Test-Ansicht in der Aktivitätsleiste
   - Klicken Sie auf "Run Tests"

### Methode 3: VSCode Debug-Konfiguration

1. Drücken Sie `F5` um die Extension in einem neuen VSCode-Fenster zu starten
2. Im Debug-Fenster können Sie Tests debuggen

## Was wird getestet?

Die Tests demonstrieren verschiedene Aspekte des Unit Testing:

### 1. Einfache Funktions-Tests
- **isValidFilename()**: Validierung von Dateinamen
- **createGreeting()**: Erstellung von Begrüßungsnachrichten  
- **countWords()**: Zählung von Wörtern in Texten

### 2. Edge Cases und Fehlerbehandlung
- Leere Strings und null/undefined Werte
- Whitespace-Behandlung
- Ungültige Eingaben

### 3. VSCode Integration Tests
- Überprüfung registrierter Kommandos
- Extension-Aktivierung

### 4. Array-Operationen (TypeScript/JavaScript typisch)
- indexOf() Methoden
- filter() Operationen

## Test-Struktur verstehen

```typescript
suite('Test Suite Name', () => {
    test('should do something specific', () => {
        // Arrange: Testdaten vorbereiten
        const input = 'test.txt';
        
        // Act: Funktion ausführen
        const result = isValidFilename(input);
        
        // Assert: Ergebnis überprüfen
        assert.strictEqual(result, true);
    });
});
```

## Wichtige Test-Assertions

```typescript
// Gleichheit prüfen
assert.strictEqual(actual, expected);

// Deep Equality für Objekte/Arrays
assert.deepStrictEqual(actualArray, expectedArray);

// Wahrheitswerte prüfen
assert.ok(value); // value ist truthy

// Fehler erwarten
assert.throws(() => functionThatShouldThrow());
```

## Extension testen

Die Extension stellt zwei Kommandos zur Verfügung:

1. **Hello World** (`demo.helloWorld`)
   - Zeigt eine Begrüßungsnachricht an

2. **Count Words** (`demo.countWords`)
   - Zählt Wörter im aktiven Editor

### Kommandos ausführen:
1. Drücken Sie `Ctrl+Shift+P` (Command Palette)
2. Tippen Sie "Hello World" oder "Count Words"
3. Wählen Sie das gewünschte Kommando aus

## Kontinuierliche Entwicklung

Für die Entwicklung können Sie den Watch-Modus verwenden:

```bash
# TypeScript automatisch kompilieren bei Änderungen
yarn run watch
```

## Häufige Probleme

**Tests werden nicht gefunden:**
- Stellen Sie sicher, dass `yarn run compile` erfolgreich war
- Überprüfen Sie, dass Dateien im `out/` Ordner existieren

**Extension lädt nicht:**
- Prüfen Sie die Console auf Kompilierungsfehler
- Stellen Sie sicher, dass alle Dependencies installiert sind

**VSCode API Tests schlagen fehl:**
- Diese Tests benötigen eine vollständige VSCode-Umgebung
- Verwenden Sie `yarn run test` für vollständige Testausführung

## Weiterführende Informationen

- [VSCode Extension API](https://code.visualstudio.com/api)
- [Mocha Testing Framework](https://mochajs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)