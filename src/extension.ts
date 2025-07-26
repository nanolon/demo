import * as vscode from 'vscode';

// Configuration data
const COMPLETION_ITEMS = [
    {
        label: 'Hello World',
        kind: vscode.CompletionItemKind.Snippet,
        insertText: 'Hello World from ${1:Demo}!',
        documentation: 'Inserts a Hello World message',
        detail: 'Demo Extension Snippet'
    },
    {
        label: 'demo.log',
        kind: vscode.CompletionItemKind.Function,
        insertText: 'console.log("${1:message}");',
        documentation: 'Creates a console.log call',
        detail: 'Logging function'
    },
    {
        label: 'demo.function',
        kind: vscode.CompletionItemKind.Function,
        insertText: [
            'function ${1:functionName}(${2:params}) {',
            '\t${3:// Implementation}',
            '\treturn ${4:result};',
            '}'
        ].join('\n'),
        documentation: 'Creates a function template'
    },
    {
        label: 'demo.class',
        kind: vscode.CompletionItemKind.Class,
        insertText: [
            'class ${1:ClassName} {',
            '\tconstructor(${2:params}) {',
            '\t\t${3:// Constructor implementation}',
            '\t}',
            '',
            '\t${4:methodName}() {',
            '\t\t${5:// Method implementation}',
            '\t}',
            '}'
        ].join('\n'),
        documentation: 'Creates a TypeScript/JavaScript class'
    },
    {
        label: 'demo.interface',
        kind: vscode.CompletionItemKind.Interface,
        insertText: [
            'interface ${1:InterfaceName} {',
            '\t${2:propertyName}: ${3:type};',
            '\t${4:methodName}(): ${5:returnType};',
            '}'
        ].join('\n'),
        documentation: 'Creates a TypeScript interface'
    }
];

const HOVER_INFO = {
    hello: '**Hello** - Greeting\n\nTypical usage in demo applications.',
    world: '**World** - World\n\nCommonly used placeholder in programming examples.',
    demo: '**Demo Extension**\n\nThis extension demonstrates Language Features:\n- Auto-completion\n- Hover information',
    function: '**Function** - JavaScript/TypeScript function declaration\n\n```typescript\nfunction name(params) { return value; }\n```',
    class: '**Class** - TypeScript/JavaScript class declaration\n\n```typescript\nclass ClassName {\n  constructor() {}\n}\n```',
    interface: '**Interface** - TypeScript interface definition\n\n```typescript\ninterface IName {\n  property: type;\n}\n```',
    vscode: '**Visual Studio Code**\n\nModern, extensible code editor with comprehensive extension API.\n\n**Extension API Main Areas:**\n- `vscode.languages` - Language Features\n- `vscode.window` - UI Interaction\n- `vscode.workspace` - Workspace Management\n- `vscode.commands` - Command Registration'
};

// CompletionItemProvider for auto-completion
class DemoCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(): vscode.CompletionItem[] {
        return COMPLETION_ITEMS.map(item => {
            const completionItem = new vscode.CompletionItem(item.label, item.kind);
            completionItem.insertText = new vscode.SnippetString(item.insertText);
            completionItem.documentation = new vscode.MarkdownString(item.documentation);
            if (item.detail) completionItem.detail = item.detail;
            return completionItem;
        });
    }
}

// HoverProvider for mouseover information
class DemoHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
        const range = document.getWordRangeAtPosition(position);
        if (!range) return;

        const word = document.getText(range).toLowerCase();
        const hoverText = HOVER_INFO[word as keyof typeof HOVER_INFO];
        
        if (hoverText) {
            return new vscode.Hover(new vscode.MarkdownString(hoverText), range);
        }
        
        // Generic information for longer words
        if (word.length > 3) {
            return new vscode.Hover(
                new vscode.MarkdownString(`Word: **${word}** (${word.length} characters)`),
                range
            );
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Demo Extension with Language Features is being activated');

    const documentSelector: vscode.DocumentSelector = [
        { scheme: 'file', language: 'typescript' },
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', language: 'plaintext' }
    ];

    // Register providers and commands
    context.subscriptions.push(
        vscode.commands.registerCommand('demo.helloWorld', () => {
            vscode.window.showInformationMessage('Hello World from demo!');
        }),
        
        vscode.commands.registerCommand('demo.showLanguageInfo', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const position = editor.selection.active;
                const word = document.getText(document.getWordRangeAtPosition(position));
                vscode.window.showInformationMessage(`Active word: "${word}" in ${document.languageId} file`);
            } else {
                vscode.window.showWarningMessage('No active file opened');
            }
        }),
        
        vscode.languages.registerCompletionItemProvider(
            documentSelector,
            new DemoCompletionProvider(),
            '.'
        ),
        
        vscode.languages.registerHoverProvider(
            documentSelector,
            new DemoHoverProvider()
        )
    );
}

export function deactivate() {
    // Cleanup is automatically managed by VSCode
}