# Erweiterte Projektstruktur - Unit & Integration Tests

## Vollständige Ordnerstruktur

```
vscode-extension-demo/
├── .devcontainer/
│   └── devcontainer.json         # Codespaces-Konfiguration
├── .vscode/
│   ├── launch.json               # Debug für Unit & Integration Tests
│   ├── tasks.json                # Tasks für alle Test-Typen
│   └── settings.json             # Workspace-Settings
├── src/
│   ├── utils.ts                  # 🟢 Business Logic (Unit-testbar)
│   ├── extension.ts              # 🔵 VSCode Integration
│   └── test/
│       ├── unit/                 # 🟢 Unit Tests (normale Node.js-Umgebung)
│       │   └── utils.test.ts     # Tests für reine Funktionen
│       └── integration/          # 🔵 Integration Tests (VSCode Extension Host)
│           ├── extension.test.ts # Tests für VSCode-APIs
│           └── suite/
│               └── index.ts      # Test Suite Runner
├── test-workspace/               # Workspace für Integration Tests
│   ├── sample.txt               
│   └── test-files/
├── .vscode-test.mjs             # Konfiguration für Integration Tests
├── package.json                 # Scripts für beide Test-Typen
├── tsconfig.json               
└── README.md
```

## Test-Architektur Überblick

### 🟢 Unit Tests (src/test/unit/)
- **Ziel**: Reine Funktionen ohne External Dependencies
- **Umgebung**: Standard Node.js + Mocha
- **Geschwindigkeit**: Sehr schnell (1-2 Sekunden)
- **Ausführung**: `yarn run test:unit`
- **Debug**: "Debug Unit Tests" (normale Node.js Debug-Session)

### 🔵 Integration Tests (src/test/integration/)
- **Ziel**: VSCode-API-Interaktion, Extension-Lifecycle
- **Umgebung**: Vollständige VSCode Extension Host-Instanz
- **Geschwindigkeit**: Langsamer (10-20 Sekunden)
- **Ausführung**: `yarn run test:integration`
- **Debug**: "Debug Integration Tests" (VSCode Extension Host Debug)

## Package.json Scripts

```json
{
  "scripts": {
    "test": "yarn run test:unit",              // Standard: Unit Tests
    "test:unit": "mocha out/test/unit/**/*.test.js",
    "test:integration": "vscode-test",         // Nutzt .vscode-test.mjs
    "test:all": "yarn run test:unit && yarn run test:integration"
  }
}
```

## Test-Ausführung Workflow

### Entwicklung (schneller Zyklus)
```bash
# 1. Watch-Modus starten
yarn run watch

# 2. Unit Tests bei Code-Änderungen
yarn run test:unit

# 3. Gelegentlich Integration Tests
yarn run test:integration
```

### CI/CD (vollständige Validierung)
```bash
# Alle Tests ausführen
yarn run test:all
```

### Debugging-Workflow

#### Unit Test Debugging
1. Breakpoint in `src/test/unit/utils.test.ts` setzen
2. F5 → "Debug Unit Tests" wählen
3. Normale Node.js Debug-Session
4. Schneller Debug-Zyklus

#### Integration Test Debugging  
1. Breakpoint in `src/test/integration/extension.test.ts` setzen
2. F5 → "Debug Integration Tests" wählen
3. VSCode Extension Host startet
4. Vollständige VSCode-Umgebung verfügbar

## Dependencies

### Unit Tests
```json
{
  "devDependencies": {
    "@types/mocha": "^10.0.10",
    "mocha": "^11.7.1"
  }
}
```

### Integration Tests
```json
{
  "devDependencies": {
    "@vscode/test-cli": "^0.0.11",
    "@types/vscode": "^1.102.0"
  }
}
```

## Test-Workspace

### test-workspace/ Ordner
```
test-workspace/
├── sample.txt              # Für Editor-Tests
├── test-files/
│   ├── document.md         # Verschiedene Dateitypen
│   └── code.js             # Für Language-spezifische Tests
└── .vscode/
    └── settings.json       # Test-spezifische VSCode-Settings
```

**Zweck**: Simulierte Arbeitsumgebung für realistische Integration Tests.

## Konfigurationsdateien

### .vscode-test.mjs
```javascript
export default defineConfig({
  files: 'out/test/integration/**/*.test.js',
  workspaceFolder: './test-workspace',
  mocha: {
    timeout: 20000
  }
});
```

### launch.json Debug-Konfigurationen
- **"Run Extension"**: Extension in neuer VSCode-Instanz starten
- **"Debug Unit Tests"**: Unit Tests mit Breakpoints debuggen
- **"Debug Integration Tests"**: Integration Tests in Extension Host debuggen
- **"Debug Single Unit Test File"**: Fokussierte Unit Test-Datei debuggen

## Naming Conventions

### Test-Dateien
- `*.test.ts`: Test-Dateien (sowohl Unit als auch Integration)
- `src/test/unit/`: Unit Tests für Business Logic
- `src/test/integration/`: Integration Tests für VSCode-APIs

### Test-Beschreibungen
```typescript
// Unit Tests
describe('countWords() - Business Logic', () => {
  it('should count words in simple text', () => {

// Integration Tests  
describe('Extension Integration Tests', () => {
  it('should register helloWorld command', async () => {
```

## Best Practices

### 1. Test-Isolation
- Unit Tests: Keine External Dependencies
- Integration Tests: Cleanup nach jedem Test

### 2. Performance
- Unit Tests für schnelle Entwicklung
- Integration Tests für Vollständigkeits-Validierung

### 3. Coverage
- Unit Tests: Hohe Coverage für Business Logic
- Integration Tests: Kritische User-Workflows abdecken

Diese Struktur ermöglicht sowohl schnelle Test-driven Development mit Unit Tests als auch umfassende Validierung mit Integration Tests.