// =============================================================================
// src/ExtensionManager.ts
// Central extension manager with service registry (Dependency Injection Container)
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
    
    // Service Provider Implementation (Dependency Injection Pattern)
    public getService<T>(serviceType: string): T | undefined {
        return this.services.get(serviceType);
    }
    
    public registerService<T>(serviceType: string, service: T): void {
        this.services.set(serviceType, service);
        console.log(`Service registered: ${serviceType}`);
        
        // Automatic dispose registration for services
        if (service && typeof (service as any).dispose === 'function') {
            this.disposables.push(service as any);
        }
    }
    
    // Command management with automatic service injection
    public registerCommand(command: BaseCommand): void {
        const commandId = command.getId();
        this.commands.set(commandId, command);
        
        // Register command with VSCode with service provider injection
        const disposable = vscode.commands.registerCommand(commandId, async () => {
            await command.execute(this);
        });
        
        this.disposables.push(disposable);
        this.context.subscriptions.push(disposable);
        
        const logger = this.getService<LoggingService>('logging');
        logger?.log(`Command registered: ${commandId}`, 'debug');
    }
    
    // Utility methods for extension management
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
    
    // Dispose pattern for automatic cleanup
    public dispose(): void {
        console.log('ExtensionManager disposing...');
        
        // Commands cleanup
        this.commands.forEach(command => command.dispose());
        this.commands.clear();
        
        // Disposables cleanup
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
        
        // Services cleanup (already included in disposables, but explicit for clarity)
        this.services.clear();
        
        console.log('ExtensionManager disposed');
    }
    
    private initializeDefaultServices(): void {
        // Register standard services (Service Registry Pattern)
        this.registerService('logging', new LoggingService('Demo Extension'));
        this.registerService('config', new ConfigurationService('demo'));
        this.registerService('message', new MessageService());
        
        // Configuration change listener for log level updates
        const configService = this.getService<ConfigurationService>('config');
        const logger = this.getService<LoggingService>('logging');
        
        configService?.onConfigurationChange(() => {
            const newLogLevel = configService.get('logLevel', 'info');
            logger?.setLogLevel(newLogLevel);
        });
        
        logger?.log('Default services initialized', 'info');
    }
}
