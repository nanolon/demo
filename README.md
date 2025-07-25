# OOP Fundamentals for VSCode Extensions

## 🎯 Learning Objectives

This extension demonstrates **4 central OOP concepts** for VSCode Extensions:

1. **Interface-based Services** (structural typing)
2. **Abstract Base Classes** (Template Method Pattern)  
3. **Dependency Injection** (manual, simple)
4. **Dispose Pattern** (resource management)

## 📊 Architecture Overview

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

## 📁 Simple Structure

```
src/
├── extension.ts                    # Entry Point with DI
├── services/
│   └── MessageService.ts          # Interface + Implementation
└── commands/
    ├── BaseCommand.ts              # Abstract Base Class
    ├── HelloCommand.ts             # Simple Command
    └── FileAnalyzeCommand.ts       # Command with Business Logic
```

## 🏗️ Class Diagram

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
    
    note for BaseCommand "Template Method Pattern:\nexecute() defines flow,\nperformAction() is overridden"
    note for IMessageService "Structural Typing:\nImplementation checks\nobject structure, not type"
```

## 🔄 Sequence Diagram: Command Execution

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
    
    Note over Cmd: Concrete Implementation
    Cmd->>Cmd: getExecutionCount()
    Cmd->>Svc: showInfo("Hello from OOP...")
    Svc->>Svc: messageCount++
    Svc->>VSCode: vscode.window.showInformationMessage()
    VSCode->>User: Notification appears
```

## 🔗 Module Dependencies

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
# Create folders
mkdir -p src/services src/commands

# Copy code from Artifact
# Files: MessageService.ts, BaseCommand.ts, HelloCommand.ts, FileAnalyzeCommand.ts, extension.ts

# Compile and start
yarn compile && F5
```

## 🎮 Testing Commands

- `Demo: Hello OOP` - Simple command with service
- `Demo: Analyze File` - Editor analysis  
- `Demo: Show Status` - Execution statistics

## 🔍 OOP Concepts in Detail

### 1. Interface-based Services

```typescript
// Interface defines contract
interface IMessageService {
    showInfo(message: string): void;
    showError(message: string): void;
}

// Class implements interface (structurally!)
class MessageService implements IMessageService {
    // Implementation...
}
```

**Java Difference:** TypeScript checks structurally, not nominally.

### 2. Abstract Base Class (Template Method)

```typescript
abstract class BaseCommand {
    public execute(): void {
        // Template Method defines flow
        this.performAction(); // Abstract method
    }
    
    protected abstract performAction(): void;
}
```

**Known from Java:** Same syntax, same semantics.

### 3. Dependency Injection (manual)

```typescript
// Service is injected in constructor
class HelloCommand extends BaseCommand {
    constructor(messageService: IMessageService) {
        super('demo.hello', messageService);
    }
}

// In extension.ts: Manually create and inject services
const messageService = new MessageService();
const command = new HelloCommand(messageService);
```

**Simplified:** No framework like Spring, but same principle.

### 4. Dispose Pattern

```typescript
class MessageService {
    public dispose(): void {
        // Cleanup logic
    }
}

// In extension.ts: Automatic cleanup
context.subscriptions.push({
    dispose: () => messageService.dispose()
});
```

**VSCode-specific:** Automatic cleanup when deactivating.

## 📊 Comparison: Functional vs. OOP

| Aspect | Functional | OOP |
|--------|------------|-----|
| Commands | Individual functions | Class hierarchy |
| Shared Logic | Code duplication | BaseCommand inheritance |  
| Services | Direct API calls | Injected dependencies |
| Testing | Hard to mock | Interface mocking |
