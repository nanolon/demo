import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Interface für QuickPick-Items mit Dateipfad-Informationen
 */
interface FileQuickPickItem extends vscode.QuickPickItem {
    /** Vollständiger URI der Datei */
    uri: vscode.Uri;
    /** Relativer Pfad vom Workspace-Root */
    relativePath: string;
}

/**
 * Aktivierungsfunktion der Extension
 * Wird beim ersten Aufruf eines Commands automatisch aufgerufen
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Workspace File Picker Extension aktiviert');

    // Command registrieren: workspaceFilePicker.pick
    const disposable = vscode.commands.registerCommand('workspaceFilePicker.pick', async () => {
        try {
            await pickAndOpenWorkspaceFile();
        } catch (error) {
            vscode.window.showErrorMessage(`Fehler beim Öffnen der Datei: ${error}`);
        }
    });

    // Command zur automatischen Deaktivierung registrieren
    context.subscriptions.push(disposable);
}

/**
 * Hauptfunktion: Dateien im Workspace finden, auflisten und zur Auswahl anbieten
 */
async function pickAndOpenWorkspaceFile(): Promise<void> {
    // 1. Workspace-Verfügbarkeit prüfen
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('Kein Workspace geöffnet. Bitte öffnen Sie einen Ordner oder Workspace.');
        return;
    }

    // 2. Ladeindikator anzeigen während Dateien gesucht werden
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
        title: "Dateien werden gesucht...",
        cancellable: true
    }, async (progress, token) => {
        
        // 3. Alle Dateien im Workspace finden
        const files = await findAllWorkspaceFiles(token);
        
        if (files.length === 0) {
            vscode.window.showInformationMessage('Keine Dateien im Workspace gefunden.');
            return;
        }

        // 4. Dateien für QuickPick aufbereiten
        const quickPickItems = await createQuickPickItems(files);
        
        // 5. QuickPick-Dialog anzeigen
        const selectedItem = await showFileQuickPick(quickPickItems);
        
        // 6. Ausgewählte Datei öffnen
        if (selectedItem) {
            await openFileInEditor(selectedItem.uri);
        }
    });
}

/**
 * Sucht alle Dateien in allen Workspace-Ordnern
 * Schließt häufige Build- und Cache-Verzeichnisse aus
 */
async function findAllWorkspaceFiles(cancellationToken: vscode.CancellationToken): Promise<vscode.Uri[]> {
    const excludePattern = '{**/node_modules/**,**/out/**,**/dist/**,**/.git/**,**/.vscode-test/**}';
    
    // findFiles() durchsucht alle Workspace-Ordner
    // '**/*' = alle Dateien rekursiv
    const files = await vscode.workspace.findFiles(
        '**/*',           // Include-Pattern: alle Dateien
        excludePattern,   // Exclude-Pattern: Build-Ordner etc.
        undefined,        // Limit: unbegrenzt
        cancellationToken
    );
    
    return files;
}

/**
 * Konvertiert URI-Liste zu QuickPick-Items mit benutzerfreundlicher Darstellung
 */
async function createQuickPickItems(files: vscode.Uri[]): Promise<FileQuickPickItem[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders![0].uri;
    
    const items: FileQuickPickItem[] = files.map(fileUri => {
        // Relativen Pfad berechnen für bessere Lesbarkeit
        const relativePath = path.relative(workspaceRoot.fsPath, fileUri.fsPath);
        const fileName = path.basename(fileUri.fsPath);
        const directory = path.dirname(relativePath);
        
        return {
            label: fileName,                                    // Hauptanzeige: Dateiname
            description: directory === '.' ? '' : directory,   // Unterzeile: Verzeichnis
            detail: relativePath,                              // Zusatzinfo: vollständiger Pfad
            uri: fileUri,
            relativePath: relativePath
        };
    });
    
    // Alphabetisch nach Dateiname sortieren
    items.sort((a, b) => a.label.localeCompare(b.label));
    
    return items;
}

/**
 * Zeigt QuickPick-Dialog mit Suchfunktion an
 */
async function showFileQuickPick(items: FileQuickPickItem[]): Promise<FileQuickPickItem | undefined> {
    const quickPick = vscode.window.createQuickPick<FileQuickPickItem>();
    
    // QuickPick konfigurieren
    quickPick.placeholder = 'Dateiname eingeben zum Filtern...';
    quickPick.items = items;
    quickPick.canSelectMany = false;
    quickPick.matchOnDescription = true;  // Suche auch in Verzeichnispfad
    quickPick.matchOnDetail = true;       // Suche auch in vollständigem Pfad
    
    // Promise für Benutzerinteraktion
    return new Promise<FileQuickPickItem | undefined>((resolve) => {
        quickPick.onDidAccept(() => {
            const selectedItem = quickPick.activeItems[0];
            quickPick.dispose();
            resolve(selectedItem);
        });
        
        quickPick.onDidHide(() => {
            quickPick.dispose();
            resolve(undefined);
        });
        
        quickPick.show();
    });
}

/**
 * Öffnet die ausgewählte Datei im Editor
 * Fokussiert automatisch den neuen Tab
 */
async function openFileInEditor(fileUri: vscode.Uri): Promise<void> {
    try {
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document, {
            preview: false,  // Neuen Tab öffnen (nicht nur Preview)
            preserveFocus: false  // Editor fokussieren
        });
        
        console.log(`Datei geöffnet: ${fileUri.fsPath}`);
    } catch (error) {
        throw new Error(`Datei konnte nicht geöffnet werden: ${error}`);
    }
}

/**
 * Deaktivierungsfunktion der Extension
 * Wird beim Herunterfahren von VSCode oder Deaktivierung der Extension aufgerufen
 */
export function deactivate() {
    console.log('Workspace File Picker Extension deaktiviert');
}