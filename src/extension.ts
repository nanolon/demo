import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('sketchnote.showWebview', () => {
    const panel = vscode.window.createWebviewPanel(
      'sketchnoteWebview',
      'Sketchnote Preview',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'media'))
        ]
      }
    );

    const htmlPath = path.join(context.extensionPath, 'media', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    const mediaUri = panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(context.extensionPath, 'media'))
    );

    // Fix relative URLs (z. B. <link>, <img>, <script>)
    html = html.replace(/(href|src)="([^"]+)"/g, (match, p1, p2) => {
      const resolved = vscode.Uri.file(path.join(context.extensionPath, 'media', p2));
      return `${p1}="${panel.webview.asWebviewUri(resolved)}"`;
    });

    panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
