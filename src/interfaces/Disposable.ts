// =============================================================================
// src/interfaces/Disposable.ts  
// Erweitert VSCode Disposable für Extension-spezifische Cleanup-Logik
// =============================================================================

import * as vscode from 'vscode';

export interface Disposable extends vscode.Disposable {
    dispose(): void;
}