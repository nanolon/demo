// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * Represents a single item in the tree view
 */
class ExampleTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
	) {
		super(label, collapsibleState);
		
		// Optional: Add an icon
		this.iconPath = new vscode.ThemeIcon('symbol-file');
		
		// Optional: Add a tooltip
		this.tooltip = `TreeView-Eintrag: ${this.label}`;
	}
}

/**
 * Data provider for the example tree view
 * Implements the TreeDataProvider interface required by VSCode
 */
class ExampleTreeDataProvider implements vscode.TreeDataProvider<ExampleTreeItem> {

	// Event emitter for refresh functionality
	private _onDidChangeTreeData: vscode.EventEmitter<ExampleTreeItem | undefined | null | void> = new vscode.EventEmitter<ExampleTreeItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<ExampleTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

	/**
	 * Returns the tree item representation of the element
	 */
	getTreeItem(element: ExampleTreeItem): vscode.TreeItem {
		return element;
	}

	/**
	 * Returns the children of the given element or root if no element is passed
	 */
	getChildren(element?: ExampleTreeItem): Thenable<ExampleTreeItem[]> {
		// Since we have a flat list, we only return items for the root level
		if (!element) {
			return Promise.resolve([
				new ExampleTreeItem('Item A'),
				new ExampleTreeItem('Item B'),
				new ExampleTreeItem('Item C')
			]);
		}
		
		// No children for leaf nodes
		return Promise.resolve([]);
	}

	/**
	 * Refresh the tree view
	 */
	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "demo" is now active!');

	// Register the existing Hello World command
	const helloWorldDisposable = vscode.commands.registerCommand('demo.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from demo!');
	});

	// Create and register the tree data provider
	const treeDataProvider = new ExampleTreeDataProvider();
	
	// Register the tree view with VSCode
	const treeView = vscode.window.createTreeView('exampleView', {
		treeDataProvider: treeDataProvider,
		showCollapseAll: false // Optional: Hide collapse all button since we have no nested items
	});

	// Optional: Add context to the tree view for programmatic access
	context.subscriptions.push(
		helloWorldDisposable,
		treeView
	);

	// Optional: Add refresh command for the tree view
	const refreshCommand = vscode.commands.registerCommand('exampleView.refresh', () => {
		treeDataProvider.refresh();
	});

	context.subscriptions.push(refreshCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}