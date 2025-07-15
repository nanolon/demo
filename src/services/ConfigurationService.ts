// =============================================================================
// src/services/ConfigurationService.ts
// Configuration-Service für typisierte Settings mit Change-Monitoring
// =============================================================================

import * as vscode from 'vscode';
import { Disposable } from '../interfaces/Disposable';

export class ConfigurationService implements Disposable {
    private watchers: vscode.Disposable[] = [];
    private changeListeners: ((key: string) => void)[] = [];
    
    constructor(private configSection: string) {
        this.setupConfigurationWatcher();
        console.log(`ConfigurationService created for section: ${configSection}`);
    }
    
    public get<T>(key: string, defaultValue: T): T {
        const config = vscode.workspace.getConfiguration(this.configSection);
        return config.get<T>(key, defaultValue);
    }
    
    public async set<T>(key: string, value: T): Promise<void> {
        const config = vscode.workspace.getConfiguration(this.configSection);
        await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
    
    public onConfigurationChange(listener: (key: string) => void): void {
        this.changeListeners.push(listener);
    }
    
    public dispose(): void {
        this.watchers.forEach(watcher => watcher.dispose());
        this.watchers = [];
        this.changeListeners = [];
        console.log('ConfigurationService disposed');
    }
    
    private setupConfigurationWatcher(): void {
        const watcher = vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(this.configSection)) {
                // Alle Listener über Konfigurationsänderung informieren
                this.changeListeners.forEach(listener => {
                    try {
                        listener('configChanged');
                    } catch (error) {
                        console.error('Error in configuration change listener:', error);
                    }
                });
            }
        });
        this.watchers.push(watcher);
    }
}