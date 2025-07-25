// =============================================================================
// src/commands/BaseCommand.ts
// Abstract base class for all extension commands (Template Method Pattern)
// =============================================================================

import { ServiceProvider } from '../interfaces/ServiceProvider';
import { Disposable } from '../interfaces/Disposable';
import { LoggingService } from '../services/LoggingService';
import { MessageService } from '../services/MessageService';

export abstract class BaseCommand implements Disposable {
    protected readonly commandId: string;
    protected readonly title: string;
    private executionCount: number = 0;
    
    constructor(commandId: string, title: string) {
        this.commandId = commandId;
        this.title = title;
        console.log(`BaseCommand created: ${commandId} - ${title}`);
    }
    
    // Template Method - defines uniform execution flow
    public async execute(serviceProvider: ServiceProvider): Promise<void> {
        this.executionCount++;
        this.logExecution(serviceProvider);
        
        try {
            await this.performAction(serviceProvider);
        } catch (error) {
            this.handleError(error, serviceProvider);
        }
    }
    
    // Abstract method - must be implemented by subclasses
    protected abstract performAction(serviceProvider: ServiceProvider): Promise<void> | void;
    
    public getId(): string {
        return this.commandId;
    }
    
    public getTitle(): string {
        return this.title;
    }
    
    public getExecutionCount(): number {
        return this.executionCount;
    }
    
    public dispose(): void {
        console.log(`BaseCommand disposed: ${this.commandId}`);
        // Standard cleanup, can be extended by subclasses
    }
    
    private logExecution(serviceProvider: ServiceProvider): void {
        const logger = serviceProvider.getService<LoggingService>('logging');
        logger?.log(`Command ${this.commandId} executed (${this.executionCount} times)`, 'debug');
    }
    
    private handleError(error: unknown, serviceProvider: ServiceProvider): void {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const logger = serviceProvider.getService<LoggingService>('logging');
        const messageService = serviceProvider.getService<MessageService>('message');
        
        logger?.log(`Error in command ${this.commandId}: ${message}`, 'error');
        messageService?.showError(`Command failed: ${message}`);
    }
}
