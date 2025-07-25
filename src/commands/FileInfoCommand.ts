// =============================================================================
// src/commands/FileInfoCommand.ts
// More complex command with document analysis and service dependencies
// =============================================================================

import * as vscode from 'vscode';
import { BaseCommand } from './BaseCommand';
import { ServiceProvider } from '../interfaces/ServiceProvider';
import { MessageService } from '../services/MessageService';
import { LoggingService } from '../services/LoggingService';

interface FileInfo {
    fileName: string;
    language: string;
    lineCount: number;
    sizeKB: number;
    isDirty: boolean;
    characterCount: number;
    wordCount: number;
}

export class FileInfoCommand extends BaseCommand {
    constructor() {
        super('demo.fileInfo', 'Show File Information');
    }
    
    protected performAction(serviceProvider: ServiceProvider): void {
        const messageService = serviceProvider.getService<MessageService>('message');
        const logger = serviceProvider.getService<LoggingService>('logging');
        
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            messageService?.showWarning('No active editor found');
            return;
        }
        
        const document = editor.document;
        const fileInfo = this.analyzeDocument(document);
        
        logger?.log(`File analysis completed for ${fileInfo.fileName}`, 'info');
        messageService?.showInfo(this.formatFileInfo(fileInfo));
    }
    
    private analyzeDocument(document: vscode.TextDocument): FileInfo {
        const text = document.getText();
        const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
        
        return {
            fileName: document.fileName.split('/').pop() || 'Unknown',
            language: document.languageId,
            lineCount: document.lineCount,
            sizeKB: Math.round(Buffer.byteLength(text, 'utf8') / 1024),
            isDirty: document.isDirty,
            characterCount: text.length,
            wordCount: wordCount
        };
    }
    
    private formatFileInfo(info: FileInfo): string {
        const status = info.isDirty ? ' (UNSAVED)' : '';
        return `${info.fileName} (${info.language}): ${info.lineCount} lines, ${info.wordCount} words, ${info.characterCount} chars, ${info.sizeKB} KB${status}`;
    }
}
