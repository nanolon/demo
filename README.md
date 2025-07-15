# Hello World Highlighter - VSCode Extension

## Überblick

Diese VSCode Extension erkennt die Phrasen "Hello World" und "Hallo Welt" in Text-Dateien (`.txt`) und hebt sie mit Syntax-Highlighting hervor. Die Extension demonstriert die Grundlagen der Sprach-Extension-Entwicklung in VSCode.

## Was macht diese Extension?

Die Extension erweitert VSCode um folgende Funktionen:

1. **Spracherkennung**: Alle `.txt`-Dateien werden als "Hello Text"-Dateien erkannt
2. **Syntax-Highlighting**: Die Begriffe "Hello World" und "Hallo Welt" werden farblich hervorgehoben
3. **Groß-/Kleinschreibung**: Die Erkennung funktioniert unabhängig von der Schreibweise (z.B. "HELLO WORLD", "hello world", "Hallo Welt")

## Erkannte Muster

Die Extension erkennt folgende Varianten:
- `Hello World` (englisch)
- `Hallo Welt` (deutsch)
- Alle Kombinationen aus Groß- und Kleinbuchstaben
- Mit beliebigen Leerzeichen zwischen den Wörtern

### Beispiele:
```
Hello World          ← wird hervorgehoben
HELLO WORLD          ← wird hervorgehoben  
hello world          ← wird hervorgehoben
Hello    World       ← wird hervorgehoben
Hallo Welt           ← wird hervorgehoben
HALLO WELT           ← wird hervorgehoben
hallo welt           ← wird hervorgehoben
```

## Technische Grundlagen

### Was ist Syntax-Highlighting?

Syntax-Highlighting ist die farbliche Hervorhebung von Textelementen in einem Editor. Es hilft dabei:
- Code oder Text besser zu verstehen
- Wichtige Begriffe schnell zu erkennen
- Strukturen visuell zu erfassen

VSCode verwendet dafür **TextMate Grammars** - ein System zur Definition von Sprachregeln.

### TextMate Grammar

Eine TextMate Grammar definiert:
- **Patterns**: Welche Textmuster erkannt werden sollen
- **Scopes**: Wie die erkannten Muster kategorisiert werden
- **Highlighting**: Welche Farben für welche Kategorien verwendet werden

### Scope-System

Jedes erkannte Muster bekommt einen **Scope** zugewiesen. In unserer Extension:
- `keyword.control.hello`: Hauptscope für Hello World/Hallo Welt
- `keyword.control.hello.greeting`: Für "Hello"/"Hallo"  
- `keyword.control.hello.target`: Für "World"/"Welt"

## Projektstruktur

```
hello-world-highlighter/
├── package.json                          # Extension-Manifest
├── language-configuration.json           # Sprachkonfiguration
├── syntaxes/
│   └── hello-text.tmGrammar.json         # TextMate Grammar
├── src/
│   └── extension.ts                      # Extension-Code
└── README.md                             # Diese Dokumentation
```

### Wichtige Dateien erklärt

#### package.json
Das **Manifest** der Extension. Definiert:
- Metadaten (Name, Version, Beschreibung)
- **Contributions**: Was die Extension zu VSCode beiträgt
- **Languages**: Neue Sprach-Unterstützung
- **Grammars**: Verknüpfung zu Grammar-Dateien

#### syntaxes/hello-text.tmGrammar.json
Die **TextMate Grammar** mit:
- **Patterns**: Regex-Muster für "Hello World" und "Hallo Welt"
- **Scopes**: Zuordnung der Muster zu Kategorien
- **Repository**: Strukturierte Sammlung der Erkennungsregeln

#### language-configuration.json
**Sprachkonfiguration** für grundlegende Editor-Features:
- Kommentar-Syntax
- Klammer-Paare
- Auto-Vervollständigung

## Installation und Test

### 1. Projekt kompilieren
```bash
# Dependencies installieren
yarn install

# TypeScript kompilieren
yarn run compile
```

### 2. Extension testen
1. Drücken Sie `F5` in VSCode
2. Ein neues VSCode-Fenster öffnet sich
3. Erstellen Sie eine neue `.txt`-Datei
4. Geben Sie "Hello World" oder "Hallo Welt" ein
5. Die Begriffe sollten farblich hervorgehoben werden

### 3. Test-Datei erstellen
Erstellen Sie eine Datei `test.txt` mit folgendem Inhalt:
```
Hello World
HELLO WORLD
hello world
Hallo Welt
HALLO WELT
hallo welt
Hello    World
Normal text without highlighting
```

## Wie funktioniert die Grammar?

### Regex-Pattern Erklärung

```json
"match": "(?i)\\b(hello)\\s+(world)\\b"
```

- `(?i)`: Case-insensitive Matching (Groß-/Kleinschreibung ignorieren)
- `\\b`: Wortgrenze (stellt sicher, dass "hello" ein ganzes Wort ist)
- `(hello)`: Capturing Group für "hello"
- `\\s+`: Ein oder mehrere Leerzeichen
- `(world)`: Capturing Group für "world"
- `\\b`: Wortgrenze am Ende

### Scope-Zuordnung

```json
"captures": {
  "1": { "name": "keyword.control.hello.greeting" },
  "2": { "name": "keyword.control.hello.target" }
}
```

- Group 1 ("hello"): Bekommt Scope `keyword.control.hello.greeting`
- Group 2 ("world"): Bekommt Scope `keyword.control.hello.target`

## Extension-Aktivierung

### Wann wird die Extension aktiviert?

Die Extension wird automatisch aktiviert, wenn:
1. VSCode startet (da `activationEvents` leer ist)
2. Eine `.txt`-Datei geöffnet wird

### Language Association

```json
"languages": [{
  "id": "hello-text",
  "extensions": [".txt"]
}]
```

Dies teilt VSCode mit:
- Alle `.txt`-Dateien gehören zur Sprache "hello-text"
- Für diese Sprache soll die Grammar angewendet werden

## Anpassung und Erweiterung

### Neue Sprachen hinzufügen

Um weitere Varianten zu unterstützen (z.B. "Bonjour Monde"), erweitern Sie die Grammar:

```json
"hello-world-fr": {
  "patterns": [{
    "name": "keyword.control.hello",
    "match": "(?i)\\b(bonjour)\\s+(monde)\\b"
  }]
}
```

### Andere Dateitypen unterstützen

Ändern Sie in `package.json`:
```json
"extensions": [".txt", ".md", ".log"]
```

### Farben anpassen

Die tatsächlichen Farben werden vom VSCode-Theme bestimmt. Der Scope `keyword.control.hello` wird standardmäßig als Keyword formatiert.

## Häufige Probleme

### Extension wird nicht aktiviert
- Prüfen Sie die VSCode Developer Console (`Help > Toggle Developer Tools`)
- Stellen Sie sicher, dass `yarn run compile` erfolgreich war

### Highlighting funktioniert nicht
- Überprüfen Sie, ob die Datei als "hello-text" erkannt wird (rechts unten in der Statusleiste)
- Testen Sie mit exakten Begriffen "Hello World" oder "Hallo Welt"

### Grammar-Änderungen werden nicht übernommen
- Laden Sie das Extension Development Host Fenster neu (`Ctrl+R` / `Cmd+R`)
- Oder starten Sie den Debug-Prozess neu (`F5`)

## Weiterführende Konzepte

### Theme Integration
VSCode-Themes können spezifische Farben für Custom Scopes definieren:
```json
"textMateRules": [{
  "scope": "keyword.control.hello",
  "settings": {
    "foreground": "#ff6b6b",
    "fontStyle": "bold"
  }
}]
```

### Semantic Highlighting
Für komplexere Sprachen können Sie anstatt TextMate auch Semantic Highlighting verwenden, das kontextabhängige Hervorhebung ermöglicht.

### Language Server Protocol (LSP)
Für vollständige Sprachunterstützung (IntelliSense, Fehlerprüfung, etc.) ist ein Language Server die richtige Lösung.

## Zusammenfassung

Diese Extension demonstriert die Grundlagen des Syntax-Highlightings in VSCode:
- **TextMate Grammars** für Pattern-basierte Hervorhebung
- **Scope-System** für die Kategorisierung von Text
- **Language Contributions** in VSCode Extensions
- **Regex-Pattern** für flexible Texterkennung

Das Beispiel ist bewusst einfach gehalten, zeigt aber alle wichtigen Konzepte für die Entwicklung von Sprach-Extensions in VSCode.