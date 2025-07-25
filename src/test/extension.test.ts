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
        // Create a new text document for the test
        const document = await vscode.workspace.openTextDocument({
            content: 'function test() {\n    console.log("hello");\n}',
            language: 'typescript'
        });
        
        const editor = await vscode.window.showTextDocument(document);
        
        // Set cursor on line 1 (console.log line)
        const position = new vscode.Position(1, 4);
        editor.selection = new vscode.Selection(position, position);
        
        // Execute the command
        await vscode.commands.executeCommand('insertComment.insert');
        
        // Check if the comment was inserted
        const updatedText = editor.document.getText();
        assert.ok(updatedText.includes('// TODO: Comment this section'), 
                 'TODO comment should be inserted');
        
        // Check correct positioning (above the original line)
        const lines = updatedText.split('\n');
        assert.strictEqual(lines[1].trim(), '// TODO: Comment this section',
                          'Comment should be on line 1 (0-indexed)');
        assert.ok(lines[2].includes('console.log("hello")'),
                 'Original line should be moved down');
    });

    test('Insert comment with correct indentation', async () => {
        // Test with indented code
        const document = await vscode.workspace.openTextDocument({
            content: 'function test() {\n        const x = 5;\n}',
            language: 'typescript'
        });
        
        const editor = await vscode.window.showTextDocument(document);
        
        // Set cursor on the indented line
        const position = new vscode.Position(1, 8);
        editor.selection = new vscode.Selection(position, position);
        
        await vscode.commands.executeCommand('insertComment.insert');
        
        const updatedText = editor.document.getText();
        const lines = updatedText.split('\n');
        
        // Check that the comment has the same indentation
        assert.ok(lines[1].startsWith('        // TODO:'), 
                 'Comment should have same indentation as target line');
    });

    test('Handle no active editor gracefully', async () => {
        // Close all editors
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        
        // Try to execute command without active editor
        await vscode.commands.executeCommand('insertComment.insert');
        
        // The test is successful if no exception is thrown
        // The warning message is handled by the extension itself
        assert.ok(true, 'Command should handle missing editor gracefully');
    });
});