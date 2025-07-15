import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "demo" is now active!');

    // Statusbar-Item erstellen und konfigurieren
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Left, 
        100 // Priorität für Positionierung
    );
    
    statusBarItem.text = "Show Panel";
    statusBarItem.command = 'demo.showWebview';
    statusBarItem.tooltip = 'Öffnet das Webview-Panel';
    statusBarItem.show();

    // Command für das Öffnen des Webview-Panels registrieren
    const disposableWebview = vscode.commands.registerCommand('demo.showWebview', () => {
        createWebviewPanel(context);
    });

    // Ursprünglicher Hello World Command (optional beibehalten)
    const disposableHello = vscode.commands.registerCommand('demo.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from demo!');
    });

    // Ressourcen für automatische Bereinigung registrieren
    context.subscriptions.push(
        statusBarItem,
        disposableWebview,
        disposableHello
    );
}

function createWebviewPanel(context: vscode.ExtensionContext): void {
    // Webview-Panel erstellen
    const panel = vscode.window.createWebviewPanel(
        'demoWebview',           // Eindeutige ID
        'Mein Webview',          // Titel des Panels
        vscode.ViewColumn.One,   // Spalte für die Anzeige
        {
            enableScripts: true,  // JavaScript in Webview erlauben
            retainContextWhenHidden: true // Panel-Zustand bei Ausblendung behalten
        }
    );

    // HTML-Inhalt des Webviews setzen
    panel.webview.html = getWebviewContent();

    // Optional: Event-Handler für Panel-Schließung
    panel.onDidDispose(
        () => {
            console.log('Webview-Panel wurde geschlossen');
        },
        null,
        context.subscriptions
    );
}

function getWebviewContent(): string {
    return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mein Webview</title>
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
        <h1>Hallo aus der Webview!</h1>
        <p>Dieses Panel wurde über das Statusbar-Item geöffnet.</p>
    </body>
    </html>`;
}

export function deactivate() {
    // Automatische Bereinigung durch context.subscriptions
}