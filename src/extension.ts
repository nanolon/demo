// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Hello World Highlighter Extension is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('demo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Hello World Highlighter! 🎉\n\nÖffnen Sie eine .txt-Datei und schreiben Sie "Hello World" oder "Hallo Welt" - die Begriffe werden automatisch hervorgehoben!');
	});

	context.subscriptions.push(disposable);

	// Optional: Register a command to show information about the extension
	const infoCommand = vscode.commands.registerCommand('helloWorldHighlighter.showInfo', () => {
		const panel = vscode.window.createWebviewPanel(
			'helloWorldInfo',
			'Hello World Highlighter Info',
			vscode.ViewColumn.One,
			{}
		);

		panel.webview.html = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Hello World Highlighter</title>
				<style>
					body { font-family: var(--vscode-font-family); padding: 20px; }
					.highlight { background: var(--vscode-editor-findMatchHighlightBackground); padding: 2px 4px; border-radius: 3px; }
					code { background: var(--vscode-textCodeBlock-background); padding: 2px 4px; border-radius: 3px; }
				</style>
			</head>
			<body>
				<h1>Hello World Highlighter</h1>
				<p>Diese Extension hebt folgende Begriffe in .txt-Dateien hervor:</p>
				<ul>
					<li><span class="highlight">Hello World</span> (englisch)</li>
					<li><span class="highlight">Hallo Welt</span> (deutsch)</li>
				</ul>
				<h2>Funktionen:</h2>
				<ul>
					<li>✅ Groß-/Kleinschreibung wird ignoriert</li>
					<li>✅ Funktioniert in allen .txt-Dateien</li>
					<li>✅ Automatische Aktivierung</li>
				</ul>
				<h2>Testen:</h2>
				<p>Erstellen Sie eine neue .txt-Datei und schreiben Sie:</p>
				<pre><code>Hello World
HELLO WORLD
hello world
Hallo Welt
HALLO WELT
hallo welt</code></pre>
			</body>
			</html>
		`;
	});

	context.subscriptions.push(infoCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Hello World Highlighter Extension has been deactivated.');
}