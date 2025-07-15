import * as assert from 'assert';
import * as vscode from 'vscode';
import { isValidFilename, createGreeting, countWords } from '../extension';

/**
 * Integration Tests für die VSCode Extension
 * Diese Tests laufen in einer echten VSCode-Umgebung
 */
suite('Integration Test Suite', () => {

	// Test setup - Extension sollte bereits aktiviert sein
	suiteSetup(async () => {
		// Warten bis VSCode vollständig geladen ist
		await new Promise(resolve => setTimeout(resolve, 1000));
	});

	test('Extension should be present and activated', async () => {
		// Prüfen ob unsere Extension geladen ist
		const extension = vscode.extensions.getExtension('demo');
		assert.ok(extension, 'Extension should be loaded');
		
		// Extension sollte automatisch aktiviert sein
		if (!extension.isActive) {
			await extension.activate();
		}
		assert.ok(extension.isActive, 'Extension should be active');
	});

	test('Hello World command should be registered', async () => {
		// Alle verfügbaren Kommandos abrufen
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('demo.helloWorld'), 'Hello World command should be registered');
	});

	test('Count Words command should be registered', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('demo.countWords'), 'Count Words command should be registered');
	});

	test('Hello World command execution', async () => {
		// Das Kommando ausführen
		// Hinweis: showInformationMessage wird nicht wirklich angezeigt im Test
		try {
			await vscode.commands.executeCommand('demo.helloWorld');
			// Wenn kein Fehler auftritt, war das Kommando erfolgreich
			assert.ok(true, 'Hello World command executed successfully');
		} catch (error) {
			assert.fail(`Hello World command failed: ${error}`);
		}
	});

	test('Count Words with test document', async () => {
		// Ein Test-Dokument erstellen
		const testContent = 'This is a test document with multiple words.';
		const document = await vscode.workspace.openTextDocument({
			content: testContent,
			language: 'plaintext'
		});

		// Dokument im Editor öffnen
		const editor = await vscode.window.showTextDocument(document);
		assert.ok(editor, 'Test document should be opened in editor');

		// Count Words Kommando ausführen
		try {
			await vscode.commands.executeCommand('demo.countWords');
			assert.ok(true, 'Count Words command executed successfully');
		} catch (error) {
			assert.fail(`Count Words command failed: ${error}`);
		}

		// Dokument wieder schließen
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Extension functions work correctly', () => {
		// Test der exportierten Funktionen (Unit Test Level)
		assert.strictEqual(isValidFilename('test.txt'), true);
		assert.strictEqual(isValidFilename(''), false);
		assert.strictEqual(isValidFilename('invalid|file.txt'), false);

		assert.strictEqual(createGreeting('World'), 'Hello World!');
		assert.strictEqual(createGreeting(''), 'Hello World!');

		assert.strictEqual(countWords('Hello world test'), 3);
		assert.strictEqual(countWords(''), 0);
	});

	test('VSCode workspace integration', () => {
		// Grundlegende Workspace-Funktionalität testen
		assert.ok(vscode.workspace, 'Workspace API should be available');
		assert.ok(vscode.window, 'Window API should be available');
		assert.ok(vscode.commands, 'Commands API should be available');
	});

});