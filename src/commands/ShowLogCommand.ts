// =============================================================================
// src/commands/ShowLogCommand.ts
// Command für direkten Zugriff auf Logging-Output
// =============================================================================

import { BaseCommand } from './BaseCommand';
import { ServiceProvider } from '../interfaces/ServiceProvider';
import { LoggingService } from '../services/LoggingService';

export class ShowLogCommand extends BaseCommand {
    constructor() {
        super('demo.showLog', 'Show Extension Log');
    }
    
    protected performAction(serviceProvider: ServiceProvider): void {
        const logger = serviceProvider.getService<LoggingService>('logging');
        logger?.showOutput();
        logger?.log('Log output opened by user', 'debug');
    }
}