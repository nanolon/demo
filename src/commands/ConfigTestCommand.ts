// =============================================================================
// src/commands/ConfigTestCommand.ts
// Command for demonstrating configuration service integration
// =============================================================================

import { BaseCommand } from './BaseCommand';
import { ServiceProvider } from '../interfaces/ServiceProvider';
import { MessageService } from '../services/MessageService';
import { ConfigurationService } from '../services/ConfigurationService';
import { LoggingService, LogLevel } from '../services/LoggingService';

export class ConfigTestCommand extends BaseCommand {
    constructor() {
        super('demo.configTest', 'Test Configuration');
    }
    
    protected async performAction(serviceProvider: ServiceProvider): Promise<void> {
        const messageService = serviceProvider.getService<MessageService>('message');
        const configService = serviceProvider.getService<ConfigurationService>('config');
        const logger = serviceProvider.getService<LoggingService>('logging');
        
        if (!configService || !messageService) {
            return;
        }
        
        // Read current configuration
        const currentLogLevel = configService.get<LogLevel>('logLevel', 'info');
        const autoSave = configService.get<boolean>('autoSave', true);
        
        // Set log level via service
        logger?.setLogLevel(currentLogLevel);
        
        const configInfo = `Current Config: LogLevel=${currentLogLevel}, AutoSave=${autoSave}`;
        logger?.log(configInfo, 'info');
        messageService.showInfo(configInfo);
        
        // Interactive configuration change
        const newLogLevel = await messageService.askUser(
            'Choose new log level:', 
            'debug', 'info', 'warn', 'error'
        );
        
        if (newLogLevel) {
            await configService.set('logLevel', newLogLevel);
            logger?.setLogLevel(newLogLevel as LogLevel);
            messageService.showInfo(`Log level changed to: ${newLogLevel}`);
        }
    }
}
