import * as vscode from 'vscode';

// CompletionItemProvider for auto-completion
class DemoCompletionProvider implements vscode.CompletionItemProvider {
    
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        
        // Create simple completion items
        const helloWorldItem = new vscode.CompletionItem('Hello World', vscode.CompletionItemKind.Snippet);
        helloWorldItem.insertText = new vscode.SnippetString('Hello World from ${1:Demo}!');
        helloWorldItem.documentation = new vscode.MarkdownString('Inserts a Hello World message');
        helloWorldItem.detail = 'Demo Extension Snippet';
        
        const consoleLogItem = new vscode.CompletionItem('demo.log', vscode.CompletionItemKind.Function);
        consoleLogItem.insertText = new vscode.SnippetString('console.log("${1:message}");');
        consoleLogItem.documentation = new vscode.MarkdownString('Creates a console.log call');
        consoleLogItem.detail = 'Logging function';
        
        const functionItem = new vscode.CompletionItem('demo.function', vscode.CompletionItemKind.Function);
        functionItem.insertText = new vscode.SnippetString([
            'function ${1:functionName}(${2:params}) {',
            '\t${3:// Implementation}',
            '\treturn ${4:result};',
            '}'
        ].join('\n'));
        functionItem.documentation = new vscode.MarkdownString('Creates a function template');
        
        // Additional completion items for extended demo
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
        classItem.documentation = new vscode.MarkdownString('Creates a TypeScript/JavaScript class');
        
        const interfaceItem = new vscode.CompletionItem('demo.interface', vscode.CompletionItemKind.Interface);
        interfaceItem.insertText = new vscode.SnippetString([
            'interface ${1:InterfaceName} {',
            '\t${2:propertyName}: ${3:type};',
            '\t${4:methodName}(): ${5:returnType};',
            '}'
        ].join('\n'));
        interfaceItem.documentation = new vscode.MarkdownString('Creates a TypeScript interface');
        
        return [helloWorldItem, consoleLogItem, functionItem, classItem, interfaceItem];
    }
}

// HoverProvider for mouseover information
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
        
        // Different hover information depending on word
        switch (word.toLowerCase()) {
            case 'hello':
                return new vscode.Hover(
                    new vscode.MarkdownString('**Hello** - Greeting\n\nTypical usage in demo applications.'),
                    range
                );
            
            case 'world':
                return new vscode.Hover([
                    new vscode.MarkdownString('**World** - World'),
                    new vscode.MarkdownString('Commonly used placeholder in programming examples.')
                ], range);
            
            case 'demo':
                const hoverContent = new vscode.MarkdownString();
                hoverContent.appendMarkdown('**Demo Extension**\n\n');
                hoverContent.appendMarkdown('This extension demonstrates Language Features:\n');
                hoverContent.appendMarkdown('- Auto-completion\n');
                hoverContent.appendMarkdown('- Hover information\n');
                hoverContent.appendCodeblock('typescript', 'vscode.languages.registerCompletionItemProvider()');
                
                return new vscode.Hover(hoverContent, range);
            
            case 'function':
                return new vscode.Hover(
                    new vscode.MarkdownString('**Function** - JavaScript/TypeScript function declaration\n\n```typescript\nfunction name(params) { return value; }\n```'),
                    range
                );
            
            case 'class':
                return new vscode.Hover(
                    new vscode.MarkdownString('**Class** - TypeScript/JavaScript class declaration\n\n```typescript\nclass ClassName {\n  constructor() {}\n}\n```'),
                    range
                );
            
            case 'interface':
                return new vscode.Hover(
                    new vscode.MarkdownString('**Interface** - TypeScript interface definition\n\n```typescript\ninterface IName {\n  property: type;\n}\n```'),
                    range
                );
            
            case 'vscode':
                const vscodeInfo = new vscode.MarkdownString();
                vscodeInfo.appendMarkdown('**Visual Studio Code**\n\n');
                vscodeInfo.appendMarkdown('Modern, extensible code editor with comprehensive extension API.\n\n');
                vscodeInfo.appendMarkdown('**Extension API Main Areas:**\n');
                vscodeInfo.appendMarkdown('- `vscode.languages` - Language Features\n');
                vscodeInfo.appendMarkdown('- `vscode.window` - UI Interaction\n');
                vscodeInfo.appendMarkdown('- `vscode.workspace` - Workspace Management\n');
                vscodeInfo.appendMarkdown('- `vscode.commands` - Command Registration\n');
                
                return new vscode.Hover(vscodeInfo, range);
                
            default:
                // Generic information for other words
                if (word.length > 3) {
                    return new vscode.Hover(
                        new vscode.MarkdownString(`Word: **${word}** (${word.length} characters)`),
                        range
                    );
                }
        }
        
        return undefined;
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Demo Extension with Language Features is being activated');

    // Original Hello World command
    const helloWorldCommand = vscode.commands.registerCommand('demo.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from demo!');
    });

    // Document Selector for TypeScript and JavaScript files
    const documentSelector: vscode.DocumentSelector = [
        { scheme: 'file', language: 'typescript' },
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', language: 'plaintext' }
    ];

    // Register CompletionItemProvider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        documentSelector,
        new DemoCompletionProvider(),
        '.' // Trigger character for completion
    );

    // Register HoverProvider
    const hoverProvider = vscode.languages.registerHoverProvider(
        documentSelector,
        new DemoHoverProvider()
    );

    // Additional command for demo purposes
    const showInfoCommand = vscode.commands.registerCommand('demo.showLanguageInfo', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const position = editor.selection.active;
            const word = document.getText(document.getWordRangeAtPosition(position));
            
            vscode.window.showInformationMessage(
                `Active word: "${word}" in ${document.languageId} file`
            );
        } else {
            vscode.window.showWarningMessage('No active file opened');
        }
    });

    // Add all disposables to subscription
    context.subscriptions.push(
        helloWorldCommand,
        completionProvider,
        hoverProvider,
        showInfoCommand
    );
}

export function deactivate() {
    // Cleanup is automatically managed by VSCode
}