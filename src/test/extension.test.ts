import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Insert Comment Extension Tests', () => {
    
    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('insert-comment-example'));
    });

    test('Command should be registered', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('insertComment.insert'), 'Command insertComment.insert should be registered');
    });

    test('Insert comment command execution', async () => {
        // Erstelle ein neues Textdokument für den Test
        const document = await vscode.workspace.openTextDocument({
            content: 'function test() {\n    console.log("hello");\n}',
            language: 'typescript'
        });
        
        const editor = await vscode.window.showTextDocument(document);
        
        // Setze Cursor auf Zeile 1 (console.log Zeile)
        const position = new vscode.Position(1, 4);
        editor.selection = new vscode.Selection(position, position);
        
        // Führe den Command aus
        await vscode.commands.executeCommand('insertComment.insert');
        
        // Überprüfe, ob der Kommentar eingefügt wurde
        const updatedText = editor.document.getText();
        assert.ok(updatedText.includes('// TODO: Kommentieren Sie diesen Abschnitt'), 
                 'TODO comment should be inserted');
        
        // Überprüfe korrekte Positionierung (oberhalb der ursprünglichen Zeile)
        const lines = updatedText.split('\n');
        assert.strictEqual(lines[1].trim(), '// TODO: Kommentieren Sie diesen Abschnitt',
                          'Comment should be on line 1 (0-indexed)');
        assert.ok(lines[2].includes('console.log("hello")'),
                 'Original line should be moved down');
    });

    test('Insert comment with correct indentation', async () => {
        // Test mit eingerücktem Code
        const document = await vscode.workspace.openTextDocument({
            content: 'function test() {\n        const x = 5;\n}',
            language: 'typescript'
        });
        
        const editor = await vscode.window.showTextDocument(document);
        
        // Setze Cursor auf die eingerückte Zeile
        const position = new vscode.Position(1, 8);
        editor.selection = new vscode.Selection(position, position);
        
        await vscode.commands.executeCommand('insertComment.insert');
        
        const updatedText = editor.document.getText();
        const lines = updatedText.split('\n');
        
        // Überprüfe, dass der Kommentar die gleiche Einrückung hat
        assert.ok(lines[1].startsWith('        // TODO:'), 
                 'Comment should have same indentation as target line');
    });

    test('Handle no active editor gracefully', async () => {
        // Schließe alle Editoren
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        
        // Versuche Command auszuführen ohne aktiven Editor
        await vscode.commands.executeCommand('insertComment.insert');
        
        // Der Test ist erfolgreich, wenn keine Exception geworfen wird
        // Das Warning-Message wird von der Extension selbst behandelt
        assert.ok(true, 'Command should handle missing editor gracefully');
    });
});