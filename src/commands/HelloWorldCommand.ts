// =============================================================================
// src/commands/HelloWorldCommand.ts
// Simple command for demonstrating BaseCommand inheritance
// =============================================================================

import { BaseCommand } from './BaseCommand';
import { ServiceProvider } from '../interfaces/ServiceProvider';
import { MessageService } from '../services/MessageService';

export class HelloWorldCommand extends BaseCommand {
    constructor() {
        super('demo.helloWorld', 'Hello World');
    }
    
    protected performAction(serviceProvider: ServiceProvider): void {
        const messageService = serviceProvider.getService<MessageService>('message');
        const executionCount = this.getExecutionCount();
        
        messageService?.showInfo(`Hello World from OOP Extension! (Execution #${executionCount})`);
    }
}
