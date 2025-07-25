import * as vscode from 'vscode';

/**
 * Extension activation function.
 * Called once when the command is first invoked.
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "insert-comment-example" was activated');

    // Register the command for inserting TODO comments
    const disposable = vscode.commands.registerCommand('insertComment.insert', () => {
        insertTodoComment();
    });

    context.subscriptions.push(disposable);
}

/**
 * Inserts a TODO comment above the current cursor position.
 * 
 * Functionality:
 * 1. Determine the active editor
 * 2. Get the current cursor position
 * 3. Insert a new line above the cursor position
 * 4. Add the TODO comment with correct indentation
 */
async function insertTodoComment(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showWarningMessage('No active editor found');
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    const currentLine = selection.active.line;
    
    // Determine the indentation of the current line
    const currentLineText = document.lineAt(currentLine).text;
    const indentation = getIndentation(currentLineText);
    
    // TODO comment with corresponding indentation
    const todoComment = `${indentation}// TODO: Comment this section\n`;
    
    // Position at the beginning of the current line
    const insertPosition = new vscode.Position(currentLine, 0);
    
    try {
        // Insert the comment
        await editor.edit(editBuilder => {
            editBuilder.insert(insertPosition, todoComment);
        });
        
        // Set cursor one line down (to the originally current line)
        const newCursorPosition = new vscode.Position(currentLine + 1, selection.active.character);
        editor.selection = new vscode.Selection(newCursorPosition, newCursorPosition);
        
        vscode.window.showInformationMessage('TODO comment inserted');
        
    } catch (error) {
        vscode.window.showErrorMessage(`Error inserting comment: ${error}`);
    }
}

/**
 * Extracts the indentation (spaces/tabs) at the beginning of a line.
 * 
 * @param lineText The text of the line
 * @returns The indentation as a string (spaces or tabs)
 */
function getIndentation(lineText: string): string {
    const match = lineText.match(/^(\s*)/);
    return match ? match[1] : '';
}

/**
 * Extension deactivation function.
 * Called when VSCode shuts down or when the extension is deactivated.
 */
export function deactivate() {
    console.log('Extension "insert-comment-example" was deactivated');
}