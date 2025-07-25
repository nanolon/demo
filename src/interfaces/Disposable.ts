// =============================================================================
// src/interfaces/Disposable.ts  
// Extends VSCode Disposable for extension-specific cleanup logic
// =============================================================================

import * as vscode from 'vscode';

export interface Disposable extends vscode.Disposable {
    dispose(): void;
}
