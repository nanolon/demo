import * as vscode from 'vscode';

/**
 * Aktivierungsfunktion der Extension.
 * Wird einmalig beim ersten Aufruf des Commands aufgerufen.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "insert-comment-example" wurde aktiviert');

    // Registrierung des Commands zum Einfügen von TODO-Kommentaren
    const disposable = vscode.commands.registerCommand('insertComment.insert', () => {
        insertTodoComment();
    });

    context.subscriptions.push(disposable);
}

/**
 * Fügt einen TODO-Kommentar oberhalb der aktuellen Cursor-Position ein.
 * 
 * Funktionsweise:
 * 1. Ermittlung des aktiven Editors
 * 2. Bestimmung der aktuellen Cursor-Position
 * 3. Einfügung einer neuen Zeile oberhalb der Cursor-Position
 * 4. Hinzufügung des TODO-Kommentars mit korrekter Einrückung
 */
async function insertTodoComment(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showWarningMessage('Kein aktiver Editor gefunden');
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const currentLine = selection.active.line;
    
    // Ermittlung der Einrückung der aktuellen Zeile
    const currentLineText = document.lineAt(currentLine).text;
    const indentation = getIndentation(currentLineText);
    
    // TODO-Kommentar mit entsprechender Einrückung
    const todoComment = `${indentation}// TODO: Kommentieren Sie diesen Abschnitt\n`;
    
    // Position am Anfang der aktuellen Zeile
    const insertPosition = new vscode.Position(currentLine, 0);
    
    try {
        // Einfügung des Kommentars
        await editor.edit(editBuilder => {
            editBuilder.insert(insertPosition, todoComment);
        });
        
        // Cursor eine Zeile nach unten setzen (auf die ursprünglich aktuelle Zeile)
        const newCursorPosition = new vscode.Position(currentLine + 1, selection.active.character);
        editor.selection = new vscode.Selection(newCursorPosition, newCursorPosition);
        
        vscode.window.showInformationMessage('TODO-Kommentar eingefügt');
        
    } catch (error) {
        vscode.window.showErrorMessage(`Fehler beim Einfügen des Kommentars: ${error}`);
    }
}

/**
 * Extrahiert die Einrückung (Leerzeichen/Tabs) am Anfang einer Zeile.
 * 
 * @param lineText Der Text der Zeile
 * @returns Die Einrückung als String (Leerzeichen oder Tabs)
 */
function getIndentation(lineText: string): string {
    const match = lineText.match(/^(\s*)/);
    return match ? match[1] : '';
}

/**
 * Deaktivierungsfunktion der Extension.
 * Wird beim Herunterfahren von VSCode oder beim Deaktivieren der Extension aufgerufen.
 */
export function deactivate() {
    console.log('Extension "insert-comment-example" wurde deaktiviert');
}