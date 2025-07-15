// =============================================================================
// src/services/LoggingService.ts
// Logging-Service mit Output-Channel und konfigurierbarem Log-Level
// =============================================================================

import * as vscode from 'vscode';
import { Disposable } from '../interfaces/Disposable';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export class LoggingService implements Disposable {
    private outputChannel: vscode.OutputChannel;
    private logLevel: LogLevel = 'info';
    
    constructor(channelName: string) {
        this.outputChannel = vscode.window.createOutputChannel(channelName);
        console.log(`LoggingService created with channel: ${channelName}`);
    }
    
    public log(message: string, level: LogLevel = 'info'): void {
        if (this.shouldLog(level)) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            this.outputChannel.appendLine(logMessage);
            
            // Auch in Debug Console für Development
            console.log(logMessage);
        }
    }
    
    public showOutput(): void {
        this.outputChannel.show();
    }
    
    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
        this.log(`Log level changed to: ${level}`, 'info');
    }
    
    public dispose(): void {
        this.log('LoggingService shutting down', 'info');
        this.outputChannel.dispose();
    }
    
    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }
}