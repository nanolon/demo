// =============================================================================
// src/ExtensionManager.ts
// Zentraler Extension-Manager mit Service-Registry (Dependency Injection Container)
// =============================================================================

import * as vscode from 'vscode';
import { ServiceProvider } from './interfaces/ServiceProvider';
import { Disposable } from './interfaces/Disposable';
import { BaseCommand } from './commands/BaseCommand';
import { LoggingService } from './services/LoggingService';
import { MessageService } from './services/MessageService';
import { ConfigurationService } from './services/ConfigurationService';

export class ExtensionManager implements ServiceProvider, Disposable {
    private services: Map<string, any> = new Map();
    private commands: Map<string, BaseCommand> = new Map();
    private disposables: vscode.Disposable[] = [];
    
    constructor(private context: vscode.ExtensionContext) {
        console.log('ExtensionManager created');
        this.initializeDefaultServices();
    }
    
    // Service-Provider Implementation (Dependency Injection Pattern)
    public getService<T>(serviceType: string): T | undefined {
        return this.services.get(serviceType);
    }
    
    public registerService<T>(serviceType: string, service: T): void {
        this.services.set(serviceType, service);
        console.log(`Service registered: ${serviceType}`);
        
        // Automatische Dispose-Registrierung für Services
        if (service && typeof (service as any).dispose === 'function') {
            this.disposables.push(service as any);
        }
    }
    
    // Command-Management mit automatischer Service-Injection
    public registerCommand(command: BaseCommand): void {
        const commandId = command.getId();
        this.commands.set(commandId, command);
        
        // Command bei VSCode registrieren mit Service-Provider-Injection
        const disposable = vscode.commands.registerCommand(commandId, async () => {
            await command.execute(this);
        });
        
        this.disposables.push(disposable);
        this.context.subscriptions.push(disposable);
        
        const logger = this.getService<LoggingService>('logging');
        logger?.log(`Command registered: ${commandId}`, 'debug');
    }
    
    // Utility-Methoden für Extension-Management
    public getRegisteredCommands(): string[] {
        return Array.from(this.commands.keys());
    }
    
    public getCommandStatistics(): { [commandId: string]: number } {
        const stats: { [commandId: string]: number } = {};
        this.commands.forEach((command, id) => {
            stats[id] = command.getExecutionCount();
        });
        return stats;
    }
    
    // Dispose-Pattern für automatisches Cleanup
    public dispose(): void {
        console.log('ExtensionManager disposing...');
        
        // Commands cleanup
        this.commands.forEach(command => command.dispose());
        this.commands.clear();
        
        // Disposables cleanup
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
        
        // Services cleanup (bereits in disposables enthalten, aber explizit für Klarheit)
        this.services.clear();
        
        console.log('ExtensionManager disposed');
    }
    
    private initializeDefaultServices(): void {
        // Standard-Services registrieren (Service Registry Pattern)
        this.registerService('logging', new LoggingService('Demo Extension'));
        this.registerService('config', new ConfigurationService('demo'));
        this.registerService('message', new MessageService());
        
        // Configuration Change Listener für Log-Level Updates
        const configService = this.getService<ConfigurationService>('config');
        const logger = this.getService<LoggingService>('logging');
        
        configService?.onConfigurationChange(() => {
            const newLogLevel = configService.get('logLevel', 'info');
            logger?.setLogLevel(newLogLevel);
        });
        
        logger?.log('Default services initialized', 'info');
    }
}