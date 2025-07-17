import * as vscode from 'vscode';

// CompletionItemProvider für Autovervollständigung
class DemoCompletionProvider implements vscode.CompletionItemProvider {
    
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        
        // Einfache Completion Items erstellen
        const helloWorldItem = new vscode.CompletionItem('Hello World', vscode.CompletionItemKind.Snippet);
        helloWorldItem.insertText = new vscode.SnippetString('Hello World from ${1:Demo}!');
        helloWorldItem.documentation = new vscode.MarkdownString('Fügt eine Hello World Nachricht ein');
        helloWorldItem.detail = 'Demo Extension Snippet';
        
        const consoleLogItem = new vscode.CompletionItem('demo.log', vscode.CompletionItemKind.Function);
        consoleLogItem.insertText = new vscode.SnippetString('console.log("${1:message}");');
        consoleLogItem.documentation = new vscode.MarkdownString('Erstellt einen console.log Aufruf');
        consoleLogItem.detail = 'Logging function';
        
        const functionItem = new vscode.CompletionItem('demo.function', vscode.CompletionItemKind.Function);
        functionItem.insertText = new vscode.SnippetString([
            'function ${1:functionName}(${2:params}) {',
            '\t${3:// Implementation}',
            '\treturn ${4:result};',
            '}'
        ].join('\n'));
        functionItem.documentation = new vscode.MarkdownString('Erstellt eine Funktionsvorlage');
        
        // Zusätzliche Completion Items für erweiterte Demo
        const classItem = new vscode.CompletionItem('demo.class', vscode.CompletionItemKind.Class);
        classItem.insertText = new vscode.SnippetString([
            'class ${1:ClassName} {',
            '\tconstructor(${2:params}) {',
            '\t\t${3:// Constructor implementation}',
            '\t}',
            '',
            '\t${4:methodName}() {',
            '\t\t${5:// Method implementation}',
            '\t}',
            '}'
        ].join('\n'));
        classItem.documentation = new vscode.MarkdownString('Erstellt eine TypeScript/JavaScript Klasse');
        
        const interfaceItem = new vscode.CompletionItem('demo.interface', vscode.CompletionItemKind.Interface);
        interfaceItem.insertText = new vscode.SnippetString([
            'interface ${1:InterfaceName} {',
            '\t${2:propertyName}: ${3:type};',
            '\t${4:methodName}(): ${5:returnType};',
            '}'
        ].join('\n'));
        interfaceItem.documentation = new vscode.MarkdownString('Erstellt ein TypeScript Interface');
        
        return [helloWorldItem, consoleLogItem, functionItem, classItem, interfaceItem];
    }
}

// HoverProvider für Mouseover-Informationen
class DemoHoverProvider implements vscode.HoverProvider {
    
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return;
        }
        
        const word = document.getText(range);
        
        // Verschiedene Hover-Informationen je nach Wort
        switch (word.toLowerCase()) {
            case 'hello':
                return new vscode.Hover(
                    new vscode.MarkdownString('**Hello** - Begrüßung\n\nTypische Verwendung in Demo-Anwendungen.'),
                    range
                );
            
            case 'world':
                return new vscode.Hover([
                    new vscode.MarkdownString('**World** - Welt'),
                    new vscode.MarkdownString('Häufig verwendeter Platzhalter in Programmierbeispielen.')
                ], range);
            
            case 'demo':
                const hoverContent = new vscode.MarkdownString();
                hoverContent.appendMarkdown('**Demo Extension**\n\n');
                hoverContent.appendMarkdown('Diese Extension demonstriert Language Features:\n');
                hoverContent.appendMarkdown('- Autovervollständigung\n');
                hoverContent.appendMarkdown('- Hover-Informationen\n');
                hoverContent.appendCodeblock('typescript', 'vscode.languages.registerCompletionItemProvider()');
                
                return new vscode.Hover(hoverContent, range);
            
            case 'function':
                return new vscode.Hover(
                    new vscode.MarkdownString('**Function** - JavaScript/TypeScript Funktionsdeklaration\n\n```typescript\nfunction name(params) { return value; }\n```'),
                    range
                );
            
            case 'class':
                return new vscode.Hover(
                    new vscode.MarkdownString('**Class** - TypeScript/JavaScript Klassendeklaration\n\n```typescript\nclass ClassName {\n  constructor() {}\n}\n```'),
                    range
                );
            
            case 'interface':
                return new vscode.Hover(
                    new vscode.MarkdownString('**Interface** - TypeScript Interface Definition\n\n```typescript\ninterface IName {\n  property: type;\n}\n```'),
                    range
                );
            
            case 'vscode':
                const vscodeInfo = new vscode.MarkdownString();
                vscodeInfo.appendMarkdown('**Visual Studio Code**\n\n');
                vscodeInfo.appendMarkdown('Moderner, erweiterbarer Code-Editor mit umfangreicher Extension-API.\n\n');
                vscodeInfo.appendMarkdown('**Extension API Hauptbereiche:**\n');
                vscodeInfo.appendMarkdown('- `vscode.languages` - Language Features\n');
                vscodeInfo.appendMarkdown('- `vscode.window` - UI Interaktion\n');
                vscodeInfo.appendMarkdown('- `vscode.workspace` - Workspace Management\n');
                vscodeInfo.appendMarkdown('- `vscode.commands` - Command Registration\n');
                
                return new vscode.Hover(vscodeInfo, range);
                
            default:
                // Generische Information für andere Wörter
                if (word.length > 3) {
                    return new vscode.Hover(
                        new vscode.MarkdownString(`Wort: **${word}** (${word.length} Zeichen)`),
                        range
                    );
                }
        }
        
        return undefined;
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Demo Extension mit Language Features wird aktiviert');

    // Ursprüngliches Hello World Kommando
    const helloWorldCommand = vscode.commands.registerCommand('demo.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from demo!');
    });

    // Document Selector für TypeScript und JavaScript Dateien
    const documentSelector: vscode.DocumentSelector = [
        { scheme: 'file', language: 'typescript' },
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', language: 'plaintext' }
    ];

    // CompletionItemProvider registrieren
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        documentSelector,
        new DemoCompletionProvider(),
        '.' // Trigger-Zeichen für Completion
    );

    // HoverProvider registrieren
    const hoverProvider = vscode.languages.registerHoverProvider(
        documentSelector,
        new DemoHoverProvider()
    );

    // Zusätzliches Kommando für Demo-Zwecke
    const showInfoCommand = vscode.commands.registerCommand('demo.showLanguageInfo', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const position = editor.selection.active;
            const word = document.getText(document.getWordRangeAtPosition(position));
            
            vscode.window.showInformationMessage(
                `Aktives Wort: "${word}" in ${document.languageId}-Datei`
            );
        } else {
            vscode.window.showWarningMessage('Keine aktive Datei geöffnet');
        }
    });

    // Alle Disposables zur Subscription hinzufügen
    context.subscriptions.push(
        helloWorldCommand,
        completionProvider,
        hoverProvider,
        showInfoCommand
    );
}

export function deactivate() {
    // Cleanup wird automatisch durch VSCode verwaltet
}