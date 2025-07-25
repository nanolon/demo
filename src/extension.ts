import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "demo" is now active!');

    // Create and configure statusbar item
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left, 
        100 // Priority for positioning
    );
    
    statusBarItem.text = "Show Panel";
    statusBarItem.command = 'demo.showWebview';
    statusBarItem.tooltip = 'Opens the webview panel';
    statusBarItem.show();

    // Register command for opening the webview panel
    const disposableWebview = vscode.commands.registerCommand('demo.showWebview', () => {
        createWebviewPanel(context);
    });

    // Original Hello World command (optionally kept)
    const disposableHello = vscode.commands.registerCommand('demo.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from demo!');
    });

    // Register resources for automatic cleanup
    context.subscriptions.push(
        statusBarItem,
        disposableWebview,
        disposableHello
    );
}

function createWebviewPanel(context: vscode.ExtensionContext): void {
    // Create webview panel
    const panel = vscode.window.createWebviewPanel(
        'demoWebview',           // Unique ID
        'My Webview',            // Panel title
        vscode.ViewColumn.One,   // Column for display
        {
            enableScripts: true,  // Allow JavaScript in webview
            retainContextWhenHidden: true // Retain panel state when hidden
        }
    );

    // Set HTML content of the webview
    panel.webview.html = getWebviewContent();

    // Optional: Event handler for panel closure
    panel.onDidDispose(
        () => {
            console.log('Webview panel was closed');
        },
        null,
        context.subscriptions
    );
}

function getWebviewContent(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Webview</title>
        <style>
            body {
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                padding: 20px;
                margin: 0;
            }
            h1 {
                color: var(--vscode-textLink-foreground);
                border-bottom: 1px solid var(--vscode-textSeparator-foreground);
                padding-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <h1>Hello from the Webview!</h1>
        <p>This panel was opened via the statusbar item.</p>
    </body>
    </html>`;
}

export function deactivate() {
    // Automatic cleanup through context.subscriptions
}
