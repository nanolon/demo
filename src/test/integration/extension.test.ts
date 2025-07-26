import * as assert from 'assert';
import * as vscode from 'vscode';

/**
 * Integration Tests für VSCode Extension APIs
 * Diese Tests benötigen eine vollständige VSCode Extension Host-Umgebung
 */
describe('Extension Integration Tests', () => {

	// Test-Timeout für VSCode-API-Aufrufe erhöhen
	beforeEach(function() {
		this.timeout(10000);
	});

	describe('Extension Lifecycle', () => {

		it('should be present in VSCode extensions', () => {
			// Arrange
			const extensionId = 'demo'; // Muss package.json "name" entsprechen
			
			// Act
			const extension = vscode.extensions.getExtension(extensionId);
			
			// Assert
			assert.ok(extension, 'Extension should be found');
			assert.strictEqual(extension.id, extensionId);
		});

		it('should activate successfully', async () => {
			// Arrange
			const extensionId = 'demo';
			const extension = vscode.extensions.getExtension(extensionId);
			assert.ok(extension, 'Extension must exist for activation test');
			
			// Act
			await extension.activate();
			
			// Assert
			assert.strictEqual(extension.isActive, true, 'Extension should be active');
		});

		it('should have correct package.json metadata', () => {
			// Arrange
			const extension = vscode.extensions.getExtension('demo');
			assert.ok(extension, 'Extension must exist');
			
			// Act
			const manifest = extension.packageJSON;
			
			// Assert
			assert.strictEqual(manifest.name, 'demo');
			assert.strictEqual(manifest.displayName, 'demo');
			assert.ok(manifest.version, 'Version should be defined');
			assert.ok(Array.isArray(manifest.contributes.commands), 'Commands should be array');
		});
	});

	describe('Command Registration', () => {

		it('should register helloWorld command', async () => {
			// Arrange
			const commandId = 'demo.helloWorld';
			
			// Act
			const commands = await vscode.commands.getCommands(true);
			
			// Assert
			assert.ok(commands.includes(commandId), `Command ${commandId} should be registered`);
		});

		it('should register countWords command', async () => {
			// Arrange
			const commandId = 'demo.countWords';
			
			// Act
			const commands = await vscode.commands.getCommands(true);
			
			// Assert
			assert.ok(commands.includes(commandId), `Command ${commandId} should be registered`);
		});

		it('should have all contributed commands registered', async () => {
			// Arrange
			const extension = vscode.extensions.getExtension('demo');
			assert.ok(extension, 'Extension must exist');
			const contributedCommands = extension.packageJSON.contributes.commands.map((cmd: any) => cmd.command);
			
			// Act
			const registeredCommands = await vscode.commands.getCommands(true);
			
			// Assert
			contributedCommands.forEach((commandId: string) => {
				assert.ok(registeredCommands.includes(commandId), 
					`Contributed command ${commandId} should be registered`);
			});
		});
	});

	describe('Command Execution', () => {

		it('should execute helloWorld command without error', async () => {
			// Arrange
			const commandId = 'demo.helloWorld';
			
			// Act & Assert
			try {
				await vscode.commands.executeCommand(commandId);
				// Command executed successfully if no exception thrown
				assert.ok(true, 'Command executed successfully');
			} catch (error) {
				assert.fail(`Command execution failed: ${error}`);
			}
		});

		it('should execute countWords command without error when no editor is active', async () => {
			// Arrange
			const commandId = 'demo.countWords';
			
			// Ensure no editor is active
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
			assert.strictEqual(vscode.window.activeTextEditor, undefined, 'No editor should be active');
			
			// Act & Assert
			try {
				await vscode.commands.executeCommand(commandId);
				assert.ok(true, 'Command handled missing editor gracefully');
			} catch (error) {
				assert.fail(`Command should handle missing editor: ${error}`);
			}
		});

		it('should execute countWords command with active text editor', async () => {
			// Arrange
			const commandId = 'demo.countWords';
			const testContent = 'Hello world test content';
			
			// Create a new text document
			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'plaintext'
			});
			
			// Open the document in an editor
			await vscode.window.showTextDocument(document);
			
			// Verify editor is active
			assert.ok(vscode.window.activeTextEditor, 'Editor should be active');
			assert.strictEqual(vscode.window.activeTextEditor.document, document, 'Correct document should be active');
			
			// Act & Assert
			try {
				await vscode.commands.executeCommand(commandId);
				assert.ok(true, 'Command executed successfully with active editor');
			} catch (error) {
				assert.fail(`Command execution with editor failed: ${error}`);
			} finally {
				// Cleanup
				await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
			}
		});
	});

	describe('Workspace Integration', () => {

		it('should work with VSCode workspace APIs', async () => {
			// Arrange & Act
			const workspaceFolders = vscode.workspace.workspaceFolders;
			const configuration = vscode.workspace.getConfiguration();
			
			// Assert
			// In test environment, workspace might be undefined or have test workspace
			assert.ok(configuration, 'Configuration should be available');
			assert.ok(typeof configuration.get === 'function', 'Configuration should have get method');
		});

		it('should handle document operations', async () => {
			// Arrange
			const testContent = 'Line 1\nLine 2\nLine 3';
			
			// Act
			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'plaintext'
			});
			
			// Assert
			assert.strictEqual(document.lineCount, 3, 'Document should have 3 lines');
			assert.strictEqual(document.languageId, 'plaintext', 'Language should be plaintext');
			assert.strictEqual(document.getText(), testContent, 'Content should match');
			
			// Test line access
			const firstLine = document.lineAt(0);
			assert.strictEqual(firstLine.text, 'Line 1', 'First line should be correct');
		});
	});

	describe('Editor Integration', () => {

		it('should handle text editor selection', async () => {
			// Arrange
			const testContent = 'Hello world test selection';
			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'plaintext'
			});
			
			const editor = await vscode.window.showTextDocument(document);
			
			// Act - Select first word
			const selection = new vscode.Selection(0, 0, 0, 5); // "Hello"
			editor.selection = selection;
			
			// Assert
			assert.strictEqual(editor.document.getText(selection), 'Hello', 'Selection should contain "Hello"');
			assert.ok(!selection.isEmpty, 'Selection should not be empty');
			
			// Cleanup
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		});

		it('should handle text editor edits', async () => {
			// Arrange
			const initialContent = 'Initial text';
			const document = await vscode.workspace.openTextDocument({
				content: initialContent,
				language: 'plaintext'
			});
			
			const editor = await vscode.window.showTextDocument(document);
			
			// Act - Edit the document
			const success = await editor.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), 'Added: ');
			});
			
			// Assert
			assert.ok(success, 'Edit should succeed');
			assert.strictEqual(editor.document.getText(), 'Added: Initial text', 'Content should be updated');
			
			// Cleanup
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		});
	});

	describe('Extension Communication', () => {

		it('should handle extension context properly', async () => {
			// Arrange
			const extension = vscode.extensions.getExtension('demo');
			assert.ok(extension, 'Extension must exist');
			
			// Ensure extension is activated
			await extension.activate();
			
			// Act - Extension should have registered its commands during activation
			const commands = await vscode.commands.getCommands(true);
			
			// Assert
			assert.ok(commands.includes('demo.helloWorld'), 'Extension should register helloWorld command');
			assert.ok(commands.includes('demo.countWords'), 'Extension should register countWords command');
		});

		it('should be able to access extension exports', async () => {
			// Arrange
			const extension = vscode.extensions.getExtension('demo');
			assert.ok(extension, 'Extension must exist');
			
			// Act
			await extension.activate();
			const exports = extension.exports;
			
			// Assert
			// Note: Extension exports depend on what the extension.ts exports
			// In our case, we export the utility functions for backwards compatibility
			if (exports) {
				assert.ok(typeof exports === 'object', 'Exports should be an object if present');
			}
		});
	});
});