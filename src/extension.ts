// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from 'vscode';
import { ExtensionManager } from './ExtensionManager';
import { BaseCommand } from './commands/BaseCommand';
import { HelloWorldCommand } from './commands/HelloWorldCommand';
import { FileInfoCommand } from './commands/FileInfoCommand';
import { ShowLogCommand } from './commands/ShowLogCommand';
import { ConfigTestCommand } from './commands/ConfigTestCommand';
import { LoggingService } from './services/LoggingService';

// Globaler Extension-Manager (Singleton Pattern)
let extensionManager: ExtensionManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "demo" is activating...');
    
    // Extension-Manager mit Services initialisieren
    extensionManager = new ExtensionManager(context);
    
    // Commands mit automatischer Service-Injection registrieren
    const commands: BaseCommand[] = [
        new HelloWorldCommand(),
        new FileInfoCommand(),
        new ShowLogCommand(),
        new ConfigTestCommand()
    ];
    
    // Alle Commands registrieren (Dependency Injection erfolgt automatisch)
    commands.forEach(command => {
        extensionManager.registerCommand(command);
    });
    
    // Manager für automatisches Cleanup registrieren
    context.subscriptions.push(extensionManager);
    
    // Extension-Statistiken bei Aktivierung loggen
    const logger = extensionManager.getService<LoggingService>('logging');
    logger?.log('Extension activated with OOP architecture', 'info');
    logger?.log(`Registered commands: ${extensionManager.getRegisteredCommands().join(', ')}`, 'debug');
    
    // Welcome message
    vscode.window.showInformationMessage('Demo Extension (OOP) activated!');
}

export function deactivate() {
    console.log('Extension "demo" is deactivating...');
    
    // Command-Statistiken vor Deaktivierung loggen
    if (extensionManager) {
        const logger = extensionManager.getService<LoggingService>('logging');
        const stats = extensionManager.getCommandStatistics();
        logger?.log(`Extension deactivating. Command statistics: ${JSON.stringify(stats)}`, 'info');
    }
    
    // Automatisches Cleanup durch Dispose-Pattern erfolgt über context.subscriptions
}