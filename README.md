# OOP Grundlagen für VSCode Extensions

## 🎯 Lernziele

Diese Extension demonstriert **4 zentrale OOP-Konzepte** für VSCode Extensions:

1. **Interface-basierte Services** (strukturelle Typisierung)
2. **Abstrakte Basisklassen** (Template Method Pattern)  
3. **Dependency Injection** (manuell, einfach)
4. **Dispose-Pattern** (Ressourcen-Management)

## 📊 Architektur-Überblick

```mermaid
graph TB
    subgraph "VSCode Extension"
        A[extension.ts<br/>Entry Point] --> B[MessageService<br/>Singleton]
        A --> C[HelloCommand]
        A --> D[FileAnalyzeCommand]
        
        C --> E[BaseCommand<br/>Abstract]
        D --> E
        
        C -.->|injected| B
        D -.->|injected| B
        
        E -.->|uses| F[IMessageService<br/>Interface]
        B -.->|implements| F
    end
    
    subgraph "VSCode API"
        G[vscode.commands]
        H[vscode.window]
    end
    
    A --> G
    B --> H
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style F fill:#e8f5e8
    style B fill:#fff3e0
```

## 📁 Einfache Struktur

```
src/
├── extension.ts                    # Entry Point mit DI
├── services/
│   └── MessageService.ts          # Interface + Implementierung
└── commands/
    ├── BaseCommand.ts              # Abstrakte Basisklasse
    ├── HelloCommand.ts             # Einfacher Command
    └── FileAnalyzeCommand.ts       # Command mit Business Logic
```

## 🏗️ Klassendiagramm

```mermaid
classDiagram
    class IMessageService {
        <<interface>>
        +showInfo(message: string) void
        +showError(message: string) void
    }
    
    class MessageService {
        -messageCount: number
        +showInfo(message: string) void
        +showError(message: string) void
        +getMessageCount() number
        +dispose() void
    }
    
    class BaseCommand {
        <<abstract>>
        #commandId: string
        #messageService: IMessageService
        -executionCount: number
        +execute() void
        #performAction() void*
        +getId() string
        +getExecutionCount() number
    }
    
    class HelloCommand {
        +constructor(messageService)
        #performAction() void
    }
    
    class FileAnalyzeCommand {
        +constructor(messageService)
        #performAction() void
        -analyzeDocument(document) object
    }
    
    IMessageService <|.. MessageService : implements
    BaseCommand <|-- HelloCommand : extends
    BaseCommand <|-- FileAnalyzeCommand : extends
    BaseCommand ..> IMessageService : uses
    
    note for BaseCommand "Template Method Pattern:\nexecute() definiert Ablauf,\nperformAction() wird überschrieben"
    note for IMessageService "Strukturelle Typisierung:\nImplementierung prüft\nObjektstruktur, nicht Typ"
```

## 🔄 Sequenzdiagramm: Command-Ausführung

```mermaid
sequenceDiagram
    participant User
    participant VSCode
    participant Extension as extension.ts
    participant Cmd as HelloCommand
    participant Base as BaseCommand
    participant Svc as MessageService
    
    User->>VSCode: Ctrl+Shift+P "Demo: Hello OOP"
    VSCode->>Extension: Command "demo.hello" triggered
    Extension->>Cmd: execute()
    Cmd->>Base: execute() (inherited)
    
    Note over Base: Template Method Pattern
    Base->>Base: executionCount++
    Base->>Base: console.log(...)
    Base->>Base: try/catch wrapper
    Base->>Cmd: performAction() (abstract)
    
    Note over Cmd: Konkrete Implementierung
    Cmd->>Cmd: getExecutionCount()
    Cmd->>Svc: showInfo("Hello from OOP...")
    Svc->>Svc: messageCount++
    Svc->>VSCode: vscode.window.showInformationMessage()
    VSCode->>User: Notification erscheint
```

## 🔗 Modul-Dependencies

```mermaid
graph LR
    subgraph "Services Layer"
        MS[MessageService.ts]
        IMS[IMessageService Interface]
    end
    
    subgraph "Commands Layer"
        BC[BaseCommand.ts]
        HC[HelloCommand.ts]
        FAC[FileAnalyzeCommand.ts]
    end
    
    subgraph "Application Layer"
        EXT[extension.ts]
    end
    
    subgraph "VSCode API"
        VSCODE[vscode module]
    end
    
    HC --> BC
    FAC --> BC
    BC --> IMS
    MS --> IMS
    
    EXT --> HC
    EXT --> FAC
    EXT --> MS
    
    MS --> VSCODE
    EXT --> VSCODE
    FAC --> VSCODE
    
    style MS fill:#fff3e0
    style BC fill:#f3e5f5
    style EXT fill:#e1f5fe
    style VSCODE fill:#f5f5f5
```

## 🔧 Setup

```bash
# Ordner erstellen
mkdir -p src/services src/commands

# Code aus Artifact kopieren
# Files: MessageService.ts, BaseCommand.ts, HelloCommand.ts, FileAnalyzeCommand.ts, extension.ts

# Kompilieren und starten
yarn compile && F5
```

## 🎮 Commands testen

- `Demo: Hello OOP` - Einfacher Command mit Service
- `Demo: Analyze File` - Editor-Analyse  
- `Demo: Show Status` - Ausführungsstatistiken

## 🔍 OOP-Konzepte im Detail

### 1. Interface-basierte Services

```typescript
// Interface definiert Contract
interface IMessageService {
    showInfo(message: string): void;
    showError(message: string): void;
}

// Klasse implementiert Interface (strukturell!)
class MessageService implements IMessageService {
    // Implementation...
}
```

**Java-Unterschied:** TypeScript prüft strukturell, nicht nominal.

### 2. Abstrakte Basisklasse (Template Method)

```typescript
abstract class BaseCommand {
    public execute(): void {
        // Template Method definiert Ablauf
        this.performAction(); // Abstrakte Methode
    }
    
    protected abstract performAction(): void;
}
```

**Bekannt aus Java:** Gleiche Syntax, gleiche Semantik.

### 3. Dependency Injection (manuell)

```typescript
// Service wird in Constructor injiziert
class HelloCommand extends BaseCommand {
    constructor(messageService: IMessageService) {
        super('demo.hello', messageService);
    }
}

// In extension.ts: Services manuell erstellen und injizieren
const messageService = new MessageService();
const command = new HelloCommand(messageService);
```

**Vereinfacht:** Kein Framework wie Spring, aber gleiches Prinzip.

### 4. Dispose-Pattern

```typescript
class MessageService {
    public dispose(): void {
        // Cleanup-Logik
    }
}

// In extension.ts: Automatic cleanup
context.subscriptions.push({
    dispose: () => messageService.dispose()
});
```

**VSCode-spezifisch:** Automatisches Cleanup beim Deaktivieren.

## 📊 Vergleich: Funktional vs. OOP

| Aspekt | Funktional | OOP |
|--------|------------|-----|
| Commands | Einzelfunktionen | Klassen-Hierarchie |
| Shared Logic | Code-Duplikation | BaseCommand-Vererbung |  
| Services | Direkte API-Calls | Injizierte Dependencies |
| Testing | Schwer mockbar | Interface-Mocking |

## 🚀 Nächste Schritte

1. **Neuen Command hinzufügen:**
   - Klasse von `BaseCommand` ableiten
   - Service per Constructor injizieren
   - In `extension.ts` registrieren

2. **Neuen Service erstellen:**
   - Interface definieren
   - Klasse implementieren  
   - In Commands injizieren
