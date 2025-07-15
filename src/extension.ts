// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// =============================================================================
// ABSCHNITT 1: Strukturelle Typisierung in der Praxis
// =============================================================================

// Interface für Extension-Commands
interface CommandDefinition {
    id: string;
    title: string;
    category?: string;
}

// Strukturell kompatible Objekte - keine explizite Implementierung nötig
const helloCommand: CommandDefinition = { 
    id: 'demo.helloWorld', 
    title: 'Hello World' 
};

const advancedCommand = { 
    id: 'demo.analyze', 
    title: 'Analyze File', 
    category: 'Analysis',
    description: 'Extra property allowed' // Zusätzliche Eigenschaften sind erlaubt
};

// Hilfsfunktion nutzt strukturelle Kompatibilität
function registerCommand(cmd: CommandDefinition, handler: () => void): vscode.Disposable {
    return vscode.commands.registerCommand(cmd.id, handler);
}

// =============================================================================
// ABSCHNITT 2: Union Types und Typinferenz
// =============================================================================

// Union Type für Message-Level
type MessageLevel = 'info' | 'warn' | 'error';

// Typinferenz mit VSCode-APIs
function showTypedMessage(message: string, level: MessageLevel = 'info'): Thenable<string | undefined> {
    switch (level) {
        case 'info': return vscode.window.showInformationMessage(message);
        case 'warn': return vscode.window.showWarningMessage(message);
        case 'error': return vscode.window.showErrorMessage(message);
    }
}

// Extension State mit automatischer Typinferenz
const extensionState = {
    isActive: false,    // TypeScript inferiert: boolean
    commandCount: 0,    // TypeScript inferiert: number
    lastCommand: 'none' // Literal Type
};

// =============================================================================
// ABSCHNITT 3: Asynchrone Programmierung mit async/await
// =============================================================================

// Asynchrone Dateioperation mit expliziter Promise-Typisierung
async function saveAllOpenFiles(): Promise<number> {
    let savedCount = 0;
    
    for (const document of vscode.workspace.textDocuments) {
        if (document.isDirty && !document.isUntitled) {
            const success = await document.save(); // await ersetzt .then()
            if (success) savedCount++;
        }
    }
    return savedCount;
}

// Command-Handler mit Fehlerbehandlung
async function handleSaveAllCommand(): Promise<void> {
    try {
        const savedCount = await saveAllOpenFiles();
        await showTypedMessage(`${savedCount} files saved`, 'info');
        
        // Extension State aktualisieren
        extensionState.commandCount++;
        extensionState.lastCommand = 'saveAll';
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        await showTypedMessage(`Save failed: ${message}`, 'error');
    }
}

// =============================================================================
// ABSCHNITT 4: Interface-basierte Konfiguration
// =============================================================================

// Extension-Konfiguration mit optionalen Properties
interface ExtensionConfig {
    readonly name: string;        // readonly verhindert Änderungen
    version: string;
    isEnabled: boolean;
    userSettings: {
        autoSave: boolean;
        logLevel: MessageLevel;
        maxFileSize: number;
    };
    features?: {                  // Optionale Sektion
        experimentalMode: boolean;
        debugOutput: boolean;
    };
}

// Workspace-Integration mit Defaults
function loadExtensionConfig(): ExtensionConfig {
    const config = vscode.workspace.getConfiguration('demo');
    
    return {
        name: 'demo',
        version: '1.0.0',
        isEnabled: true,
        userSettings: {
            autoSave: config.get('autoSave', true),                           // Default-Werte
            logLevel: config.get('logLevel', 'info' as MessageLevel),
            maxFileSize: config.get('maxFileSize', 1024)
        },
        features: config.get('experimental') ? {                             // Bedingte Struktur
            experimentalMode: config.get('experimental.mode', false),
            debugOutput: config.get('experimental.debug', false)
        } : undefined
    };
}

// Objektdestruktion für cleanen Code
function handleConfigurationChange(): void {
    const { userSettings, features } = loadExtensionConfig();
    console.log(`AutoSave: ${userSettings.autoSave}, Debug: ${features?.debugOutput ?? 'off'}`);
    
    // Konfigurationsänderung als Message anzeigen
    showTypedMessage('Configuration updated', 'info');
}

// =============================================================================
// ABSCHNITT 5: Generische Hilfsfunktionen
// =============================================================================

// Generische Workspace-Konfigurationsfunktion
function getWorkspaceConfig<T>(section: string, key: string, defaultValue: T): T {
    const config = vscode.workspace.getConfiguration(section);
    return config.get<T>(key, defaultValue);
}

// Type Guards für sichere VSCode-API-Verwendung
function isTextEditor(obj: any): obj is vscode.TextEditor {
    return obj && typeof obj.document === 'object' && typeof obj.selection === 'object';
}

// Sichere Editor-Verarbeitung
function analyzeCurrentFile(): void {
    const editor = vscode.window.activeTextEditor;
    
    if (isTextEditor(editor)) {
        const { document, selection } = editor;  // Destructuring nach Type Guard
        const fileName = document.fileName.split('/').pop() || document.fileName;
        const selectedText = selection.isEmpty ? 'no selection' : `${selection.end.line - selection.start.line + 1} lines selected`;
        const info = `${fileName}: ${document.lineCount} lines, ${selectedText}`;
        
        showTypedMessage(info, 'info');
        
        // Extension State aktualisieren
        extensionState.commandCount++;
        extensionState.lastCommand = 'analyze';
    } else {
        showTypedMessage('No active editor found', 'warn');
    }
}

// Demonstration der generischen Konfigurationsfunktion
function demonstrateGenericConfig(): void {
    // Typsichere Verwendung ohne explizite Typangaben
    const maxFiles = getWorkspaceConfig('demo', 'maxFiles', 100);        // number (inferiert)
    const enableLogging = getWorkspaceConfig('demo', 'logging', false);   // boolean (inferiert)
    const extensions = getWorkspaceConfig('demo', 'extensions', ['ts']);  // string[] (inferiert)
    
    const configInfo = `Config: maxFiles=${maxFiles}, logging=${enableLogging}, extensions=[${extensions.join(', ')}]`;
    showTypedMessage(configInfo, 'info');
}

// =============================================================================
// ABSCHNITT 6: Vollständige Extension-Integration
// =============================================================================

// Erweiterte Command-Definition mit Handler
interface ExtendedCommandDefinition {
    id: string;
    title: string;
    handler: () => void | Promise<void>;
}

// Command Registry mit allen implementierten Commands
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
    
    // Extension State initialisieren
    extensionState.isActive = true;
    
    // Konfiguration beim Start laden und anzeigen
    const config = loadExtensionConfig();
    console.log(`Loaded config for ${config.name} v${config.version}`);
    
    // Register commands with error handling (aus Abschnitt 6)
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
    
    // Configuration change listener (aus Abschnitt 4)
    const configListener = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('demo')) {
            handleConfigurationChange();
        }
    });
    
    // Beispiel für strukturelle Typisierung - separater Command (aus Abschnitt 1)
    // Hinweis: helloCommand wird bereits über das commands Array registriert
    const structuralExample = registerCommand(advancedCommand, () => {
        showTypedMessage('Structural typing example with advanced command!', 'info');
        extensionState.commandCount++;
        extensionState.lastCommand = 'structural';
    });
    
    // Alle Event-Listener zu subscriptions hinzufügen
    context.subscriptions.push(...disposables, configListener, structuralExample);
    
    // Willkommensnachricht mit TypeScript-Features
    showTypedMessage(`Extension activated! Configuration loaded: ${config.userSettings.logLevel} level`, 'info');
}

// This method is called when your extension is deactivated
export function deactivate(): void {
    console.log('Extension "demo" deactivated');
    
    // Extension State cleanup
    extensionState.isActive = false;
    
    // Abschiedsnachricht
    showTypedMessage(`Extension deactivated after ${extensionState.commandCount} commands`, 'info');
}