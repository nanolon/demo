import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Interface for QuickPick items with file path information
 */
interface FileQuickPickItem extends vscode.QuickPickItem {
    /** Full URI of the file */
    uri: vscode.Uri;
    /** Relative path from workspace root */
    relativePath: string;
}

/**
 * Extension activation function
 * Called automatically on first command invocation
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Workspace File Picker Extension activated');

    // Register command: workspaceFilePicker.pick
    const disposable = vscode.commands.registerCommand('workspaceFilePicker.pick', async () => {
        try {
            await pickAndOpenWorkspaceFile();
        } catch (error) {
            vscode.window.showErrorMessage(`Error opening file: ${error}`);
        }
    });

    // Register command for automatic deactivation
    context.subscriptions.push(disposable);
}

/**
 * Main function: Find files in workspace, list them, and offer for selection
 */
async function pickAndOpenWorkspaceFile(): Promise<void> {
    // 1. Check workspace availability
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showWarningMessage('No workspace opened. Please open a folder or workspace.');
        return;
    }

    // 2. Show loading indicator while searching for files
    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
        title: "Searching for files...",
        cancellable: true
    }, async (progress, token) => {
        
        // 3. Find all files in workspace
        const files = await findAllWorkspaceFiles(token);
        
        if (files.length === 0) {
            vscode.window.showInformationMessage('No files found in workspace.');
            return;
        }

        // 4. Prepare files for QuickPick
        const quickPickItems = await createQuickPickItems(files);
        
        // 5. Show QuickPick dialog
        const selectedItem = await showFileQuickPick(quickPickItems);
        
        // 6. Open selected file
        if (selectedItem) {
            await openFileInEditor(selectedItem.uri);
        }
    });
}

/**
 * Searches for all files in all workspace folders
 * Excludes common build and cache directories
 */
async function findAllWorkspaceFiles(cancellationToken: vscode.CancellationToken): Promise<vscode.Uri[]> {
    const excludePattern = '{**/node_modules/**,**/out/**,**/dist/**,**/.git/**,**/.vscode-test/**}';
    
    // findFiles() searches all workspace folders
    // '**/*' = all files recursively
    const files = await vscode.workspace.findFiles(
        '**/*',           // Include pattern: all files
        excludePattern,   // Exclude pattern: build folders etc.
        undefined,        // Limit: unlimited
        cancellationToken
    );
    
    return files;
}

/**
 * Converts URI list to QuickPick items with user-friendly display
 */
async function createQuickPickItems(files: vscode.Uri[]): Promise<FileQuickPickItem[]> {
    const workspaceRoot = vscode.workspace.workspaceFolders![0].uri;
    
    const items: FileQuickPickItem[] = files.map(fileUri => {
        // Calculate relative path for better readability
        const relativePath = path.relative(workspaceRoot.fsPath, fileUri.fsPath);
        const fileName = path.basename(fileUri.fsPath);
        const directory = path.dirname(relativePath);
        
        return {
            label: fileName,                                    // Main display: filename
            description: directory === '.' ? '' : directory,   // Subtitle: directory
            detail: directory === '.' ? '' : directory,        // Additional info: full path
            uri: fileUri,
            relativePath: relativePath
        };
    });
    
    // Sort alphabetically by filename
    items.sort((a, b) => a.label.localeCompare(b.label));
    
    return items;
}

/**
 * Shows QuickPick dialog with search functionality
 */
async function showFileQuickPick(items: FileQuickPickItem[]): Promise<FileQuickPickItem | undefined> {
    const quickPick = vscode.window.createQuickPick<FileQuickPickItem>();
    
    // Configure QuickPick
    quickPick.placeholder = 'Type filename to filter...';
    quickPick.items = items;
    quickPick.canSelectMany = false;
    quickPick.matchOnDescription = true;  // Search also in directory path
    quickPick.matchOnDetail = true;       // Search also in full path
    
    // Promise for user interaction
    return new Promise<FileQuickPickItem | undefined>((resolve) => {
        quickPick.onDidAccept(() => {
            const selectedItem = quickPick.activeItems[0];
            resolve(selectedItem);
            quickPick.dispose();
        });
        
        quickPick.onDidHide(() => {
            resolve(undefined);
            quickPick.dispose();
        });
        
        quickPick.show();
    });
}

/**
 * Opens the selected file in the editor
 * Automatically focuses the new tab
 */
async function openFileInEditor(fileUri: vscode.Uri): Promise<void> {
    try {
        const document = await vscode.workspace.openTextDocument(fileUri);
        await vscode.window.showTextDocument(document, {
            preview: false,  // Open new tab (not just preview)
            preserveFocus: false  // Focus editor
        });
        
        console.log(`File opened: ${fileUri.fsPath}`);
    } catch (error) {
        throw new Error(`File could not be opened: ${error}`);
    }
}

/**
 * Extension deactivation function
 * Called on VSCode shutdown or extension deactivation
 */
export function deactivate() {
    console.log('Workspace File Picker Extension deactivated');
}