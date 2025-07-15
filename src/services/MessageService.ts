// =============================================================================
// src/services/MessageService.ts
// Service für einheitliche User-Messages (Cross-Cutting Concern)
// =============================================================================

import * as vscode from 'vscode';
import { Disposable } from '../interfaces/Disposable';

export class MessageService implements Disposable {
    public showInfo(message: string): void {
        vscode.window.showInformationMessage(message);
    }
    
    public showWarning(message: string): void {
        vscode.window.showWarningMessage(message);
    }
    
    public showError(message: string): void {
        vscode.window.showErrorMessage(message);
    }
    
    public async askUser(question: string, ...options: string[]): Promise<string | undefined> {
        return vscode.window.showQuickPick(options, { placeHolder: question });
    }
    
    public dispose(): void {
        // Cleanup falls erforderlich
        console.log('MessageService disposed');
    }
}