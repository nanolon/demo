// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// =============================================================================
// SECTION 1: Structural Typing in Practice
// =============================================================================

// Interface for Extension Commands
interface CommandDefinition {
    id: string;
    title: string;
    category?: string;
}

// Structurally compatible objects - no explicit implementation needed
const helloCommand: CommandDefinition = { 
    id: 'demo.helloWorld', 
    title: 'Hello World' 
};

const advancedCommand = { 
    id: 'demo.analyze', 
    title: 'Analyze File', 
    category: 'Analysis',
    description: 'Extra property allowed' // Additional properties are allowed
};

// Helper function uses structural compatibility
function registerCommand(cmd: CommandDefinition, handler: () => void): vscode.Disposable {
    return vscode.commands.registerCommand(cmd.id, handler);
}

// =============================================================================
// SECTION 2: Union Types and Type Inference
// =============================================================================

// Union Type for Message Level
type MessageLevel = 'info' | 'warn' | 'error';

// Type inference with VSCode APIs
function showTypedMessage(message: string, level: MessageLevel = 'info'): Thenable<string | undefined> {
    switch (level) {
        case 'info': return vscode.window.showInformationMessage(message);
        case 'warn': return vscode.window.showWarningMessage(message);
        case 'error': return vscode.window.showErrorMessage(message);
    }
}

// Extension State with automatic type inference
const extensionState = {
    isActive: false,    // TypeScript infers: boolean
    commandCount: 0,    // TypeScript infers: number
    lastCommand: 'none' // Literal Type
};

// =============================================================================
// SECTION 3: Asynchronous Programming with async/await
// =============================================================================

// Asynchronous file operation with explicit Promise typing
async function saveAllOpenFiles(): Promise<number> {
    let savedCount = 0;
    
    for (const document of vscode.workspace.textDocuments) {
        if (document.isDirty && !document.isUntitled) {
            const success = await document.save(); // await replaces .then()
            if (success) savedCount++;
        }
    }
    return savedCount;
}

// Command handler with error handling
async function handleSaveAllCommand(): Promise<void> {
    try {
        const savedCount = await saveAllOpenFiles();
        await showTypedMessage(`${savedCount} files saved`, 'info');
        
        // Update extension state
        extensionState.commandCount++;
        extensionState.lastCommand = 'saveAll';
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        await showTypedMessage(`Save failed: ${message}`, 'error');
    }
}

// =============================================================================
// SECTION 4: Interface-based Configuration
// =============================================================================

// Extension configuration with optional properties
interface ExtensionConfig {
    readonly name: string;        // readonly prevents changes
    version: string;
    isEnabled: boolean;
    userSettings: {
        autoSave: boolean;
        logLevel: MessageLevel;
        maxFileSize: number;
    };
    features?: {                  // Optional section
        experimentalMode: boolean;
        debugOutput: boolean;
    };
}

// Workspace integration with defaults
function loadExtensionConfig(): ExtensionConfig {
    const config = vscode.workspace.getConfiguration('demo');
    
    return {
        name: 'demo',
        version: '1.0.0',
        isEnabled: true,
        userSettings: {
            autoSave: config.get('autoSave', true),                           // Default values
            logLevel: config.get('logLevel', 'info' as MessageLevel),
            maxFileSize: config.get('maxFileSize', 1024)
        },
        features: config.get('experimental') ? {                             // Conditional structure
            experimentalMode: config.get('experimental.mode', false),
            debugOutput: config.get('experimental.debug', false)
        } : undefined
    };
}

// Object destructuring for clean code
function handleConfigurationChange(): void {
    const { userSettings, features } = loadExtensionConfig();
    console.log(`AutoSave: ${userSettings.autoSave}, Debug: ${features?.debugOutput ?? 'off'}`);
    
    // Show configuration change as message
    showTypedMessage('Configuration updated', 'info');
}

// =============================================================================
// SECTION 5: Generic Helper Functions
// =============================================================================

// Generic workspace configuration function
function getWorkspaceConfig<T>(section: string, key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration(section);
    return config.get<T>(key, defaultValue);
}

// Type Guards for safe VSCode API usage
function isTextEditor(obj: any): obj is vscode.TextEditor {
    return obj && typeof obj.document === 'object' && typeof obj.selection === 'object';
}

// Safe editor processing
function analyzeCurrentFile(): void {
    const editor = vscode.window.activeTextEditor;
    
    if (isTextEditor(editor)) {
        const { document, selection } = editor;  // Destructuring after Type Guard
        const fileName = document.fileName.split('/').pop() || document.fileName;
        const selectedText = selection.isEmpty ? 'no selection' : `${selection.end.line - selection.start.line + 1} lines selected`;
        const info = `${fileName}: ${document.lineCount} lines, ${selectedText}`;
        
        showTypedMessage(info, 'info');
        
        // Update extension state
        extensionState.commandCount++;
        extensionState.lastCommand = 'analyze';
    } else {
        showTypedMessage('No active editor found', 'warn');
    }
}

// Demonstration of generic configuration function
function demonstrateGenericConfig(): void {
    // Type-safe usage without explicit type annotations
    const maxFiles = getWorkspaceConfig('demo', 'maxFiles', 100);        // number (inferred)
    const enableLogging = getWorkspaceConfig('demo', 'logging', false);   // boolean (inferred)
    const extensions = getWorkspaceConfig('demo', 'extensions', ['ts']);  // string[] (inferred)
    
    const configInfo = `Config: maxFiles=${maxFiles}, logging=${enableLogging}, extensions=[${extensions.join(', ')}]`;
    showTypedMessage(configInfo, 'info');
}

// =============================================================================
// SECTION 6: Complete Extension Integration
// =============================================================================

// Extended command definition with handler
interface ExtendedCommandDefinition {
    id: string;
    title: string;
    handler: () => void | Promise<void>;
}

// Command registry with all implemented commands
const commands: ExtendedCommandDefinition[] = [
    {
        id: 'demo.helloWorld',
        title: 'Hello World',
        handler: () => {
            extensionState.commandCount++;
            extensionState.lastCommand = 'hello';
            return showTypedMessage('Hello World from demo!', 'info');
        }
    },
    {
        id: 'demo.saveAll',
        title: 'Save All Files', 
        handler: handleSaveAllCommand
    },
    {
        id: 'demo.analyzeFile',
        title: 'Analyze Current File',
        handler: analyzeCurrentFile
    },
    {
        id: 'demo.showConfig',
        title: 'Show Configuration',
        handler: demonstrateGenericConfig
    },
    {
        id: 'demo.showStats',
        title: 'Show Extension Stats',
        handler: () => {
            const statsMessage = `Extension Stats: ${extensionState.commandCount} commands executed, last: ${extensionState.lastCommand}`;
            return showTypedMessage(statsMessage, 'info');
        }
    }
];

// =============================================================================
// Extension Lifecycle (Main Functions)
// =============================================================================

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "demo" is now active!');
    
    // Initialize extension state
    extensionState.isActive = true;
    
    // Load and display configuration on startup
    const config = loadExtensionConfig();
    console.log(`Loaded config for ${config.name} v${config.version}`);
    
    // Register commands with error handling (from Section 6)
    const disposables = commands.map(cmd => 
        vscode.commands.registerCommand(cmd.id, async () => {
            try {
                await cmd.handler();
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                showTypedMessage(`Command failed: ${message}`, 'error');
            }
        })
    );
    
    // Configuration change listener (from Section 4)
    const configListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('demo')) {
            handleConfigurationChange();
        }
    });
    
    // Example for structural typing - separate command (from Section 1)
    // Note: helloCommand is already registered via the commands array
    const structuralExample = registerCommand(advancedCommand, () => {
        showTypedMessage('Structural typing example with advanced command!', 'info');
        extensionState.commandCount++;
        extensionState.lastCommand = 'structural';
    });
    
    // Add all event listeners to subscriptions
    context.subscriptions.push(...disposables, configListener, structuralExample);
    
    // Welcome message with TypeScript features
    showTypedMessage(`Extension activated! Configuration loaded: ${config.userSettings.logLevel} level`, 'info');
}

// This method is called when your extension is deactivated
export function deactivate(): void {
    console.log('Extension "demo" deactivated');
    
    // Extension state cleanup
    extensionState.isActive = false;
    
    // Farewell message
    showTypedMessage(`Extension deactivated after ${extensionState.commandCount} commands`, 'info');
}