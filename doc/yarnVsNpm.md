# Package Manager in VSCode Tasks: yarn vs npm

VSCode Tasks unterstützen verschiedene Package Manager. Wenn Ihr Projekt yarn verwendet (erkennbar an `yarn.lock`), sollten Sie das auch in den Tasks konsequent nutzen.

## Drei Ansätze für Package Manager Tasks

### 1. `type: "npm"` (Standard, funktioniert mit yarn)

```json
{
    "type": "npm",
    "script": "compile",
    "group": "build"
}
```

**Verhalten:**
- VSCode verwendet automatisch den konfigurierten Package Manager
- Wenn yarn installiert und `yarn.lock` vorhanden → verwendet yarn
- Sonst → verwendet npm

**Nachteile:**
- Nicht explizit, welcher Package Manager verwendet wird
- Kann inkonsistent sein in Teams mit unterschiedlichen Setups

### 2. `type: "shell"` (Explizit, empfohlen)

```json
{
    "type": "shell",
    "label": "yarn: compile",
    "command": "yarn",
    "args": ["run", "compile"],
    "group": "build"
}
```

**Vorteile:**
- Explizit yarn als Package Manager
- Konsistent über alle Entwickler hinweg
- Bessere Fehlermeldungen bei yarn-spezifischen Issues

### 3. `type: "process"` (Low-level)

```json
{
    "type": "process",
    "label": "yarn compile",
    "command": "yarn",
    "args": ["run", "compile"],
    "options": {
        "cwd": "${workspaceFolder}"
    }
}
```

**Use Case:** Für komplexe Setups mit spezifischen Environment-Variablen.

## Empfohlene yarn-Tasks für Extension-Projekte

### Vollständige tasks.json

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "shell",
            "label": "yarn: watch",
            "command": "yarn",
            "args": ["run", "watch"],
            "problemMatcher": "$tsc-watch",
            "isBackground": true,
            "group": {
                "kind": "build",
                "isDefault": true
            }
        },
        {
            "type": "shell", 
            "label": "yarn: compile",
            "command": "yarn",
            "args": ["run", "compile"],
            "group": "build",
            "problemMatcher": "$tsc"
        },
        {
            "type": "shell",
            "label": "yarn: test",
            "command": "yarn", 
            "args": ["run", "test"],
            "group": "test"
        },
        {
            "type": "shell",
            "label": "yarn: pretest", 
            "command": "yarn",
            "args": ["run", "pretest"],
            "group": "test"
        }
    ]
}
```

## Task-Labels und Referenzierung

### In launch.json referenzieren

```json
{
    "name": "Debug Unit Tests",
    "type": "node",
    "request": "launch",
    "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
    "preLaunchTask": "yarn: compile"  // ← Task-Label referenzieren
}
```

### Naming Convention

**Empfohlen:**
- `"yarn: compile"` - Eindeutig identifizierbar
- `"yarn: watch"` - Konsistent mit Package Manager
- `"yarn: test"` - Selbsterklärend

**Vermeiden:**
- `"compile"` - Unspezifisch 
- `"build"` - Mehrdeutig

## Task-Gruppen nutzen

```json
{
    "type": "shell",
    "label": "yarn: compile",
    "command": "yarn",
    "args": ["run", "compile"], 
    "group": {
        "kind": "build",
        "isDefault": true  // ← Ctrl+Shift+P → "Run Build Task"
    }
}
```

**Available Groups:**
- `"build"`: Kompilierung, Bundling
- `"test"`: Test-Ausführung  
- `"clean"`: Cleanup-Operations

## Problem Matchers für yarn

### TypeScript-Kompilierung

```json
{
    "type": "shell",
    "label": "yarn: compile",
    "command": "yarn",
    "args": ["run", "compile"],
    "problemMatcher": "$tsc"  // ← Versteht tsc-Fehlerformat
}
```

### ESLint-Integration

```json
{
    "type": "shell", 
    "label": "yarn: lint",
    "command": "yarn",
    "args": ["run", "lint"],
    "problemMatcher": "$eslint-stylish"  // ← ESLint-Errors in Problems Panel
}
```

## Cross-Platform Compatibility

yarn-Tasks funktionieren automatisch cross-platform:

**Windows:**
```cmd
yarn run compile
```

**macOS/Linux:**
```bash
yarn run compile  
```

VSCode handhabt die Platform-Unterschiede automatisch.

## Debugging yarn-Tasks

### Task-Ausgabe sichtbar machen

```json
{
    "type": "shell",
    "label": "yarn: compile",
    "command": "yarn", 
    "args": ["run", "compile"],
    "presentation": {
        "echo": true,        // Kommando anzeigen
        "reveal": "always",  // Terminal immer öffnen
        "focus": true,       // Terminal fokussieren
        "panel": "shared"    // Gleicher Terminal für alle Tasks
    }
}
```

### Task-Execution debuggen

**Command Palette:**
1. `Ctrl+Shift+P`
2. "Tasks: Run Task" 
3. Task auswählen
4. Output im Terminal beobachten

## Häufige Probleme

### yarn nicht gefunden

**Fehler:** `'yarn' is not recognized as an internal or external command`

**Lösung:**
1. yarn global installieren: `npm install -g yarn`
2. PATH-Umgebungsvariable prüfen
3. VSCode neustarten

### Scripts nicht in package.json

**Fehler:** `error Command "compile" not found`

**Lösung:** package.json prüfen:
```json
{
    "scripts": {
        "compile": "tsc -p ./",
        "watch": "tsc -watch -p ./",
        "test": "mocha out/test/**/*.test.js"
    }
}
```

### preLaunchTask fehlgeschlagen

**Fehler:** Debug startet nicht wegen Task-Fehler

**Lösung:**
1. Task einzeln ausführen: `Ctrl+Shift+P` → "Tasks: Run Task"
2. Fehlerausgabe analysieren
3. Task-Konfiguration korrigieren

## Best Practices

### 1. Konsistenz im Team

Alle Entwickler sollten yarn verwenden:
```bash
# .nvmrc or README.md
Node.js: 20.x
Package Manager: yarn
```

### 2. Task-Dependencies

```json
{
    "type": "shell",
    "label": "yarn: test-full",
    "command": "yarn", 
    "args": ["run", "pretest"],
    "dependsOn": ["yarn: compile", "yarn: lint"]
}
```

### 3. Workspace-spezifische Tasks

Für Monorepos oder Workspaces:
```json
{
    "type": "shell",
    "label": "yarn: test-extension",
    "command": "yarn",
    "args": ["workspace", "extension", "test"],
    "options": {
        "cwd": "${workspaceFolder}"
    }
}
```
