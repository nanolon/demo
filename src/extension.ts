// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Import business logic from separate module (no VSCode dependencies)
import { isValidFilename, createGreeting, countWords } from './utils';

// Re-export functions for backwards compatibility if needed
export { isValidFilename, createGreeting, countWords };

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "demo" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('demo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const greeting = createGreeting("VSCode Extension Developer");
		vscode.window.showInformationMessage(greeting);
	});

	// Kommando für Wort-Zählung im aktiven Editor
	const wordCountDisposable = vscode.commands.registerCommand('demo.countWords', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const text = editor.document.getText();
			const wordCount = countWords(text);
			vscode.window.showInformationMessage(`Word count: ${wordCount}`);
		} else {
			vscode.window.showWarningMessage('No active editor found');
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(wordCountDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
