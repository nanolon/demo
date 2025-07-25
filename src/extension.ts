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

// Global extension manager (Singleton Pattern)
let extensionManager: ExtensionManager;

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "demo" is activating...');
    
    // Initialize extension manager with services
    extensionManager = new ExtensionManager(context);
    
    // Register commands with automatic service injection
    const commands: BaseCommand[] = [
        new HelloWorldCommand(),
        new FileInfoCommand(),
        new ShowLogCommand(),
        new ConfigTestCommand()
    ];
    
    // Register all commands (Dependency Injection happens automatically)
    commands.forEach(command => {
        extensionManager.registerCommand(command);
    });
    
    // Register manager for automatic cleanup
    context.subscriptions.push(extensionManager);
    
    // Log extension statistics on activation
    const logger = extensionManager.getService<LoggingService>('logging');
    logger?.log('Extension activated with OOP architecture', 'info');
    logger?.log(`Registered commands: ${extensionManager.getRegisteredCommands().join(', ')}`, 'debug');
    
    // Welcome message
    vscode.window.showInformationMessage('Demo Extension (OOP) activated!');
}

export function deactivate() {
    console.log('Extension "demo" is deactivating...');
    
    // Log command statistics before deactivation
    if (extensionManager) {
        const logger = extensionManager.getService<LoggingService>('logging');
        const stats = extensionManager.getCommandStatistics();
        logger?.log(`Extension deactivating. Command statistics: ${JSON.stringify(stats)}`, 'info');
    }
    
    // Automatic cleanup through Dispose pattern happens via context.subscriptions
}
