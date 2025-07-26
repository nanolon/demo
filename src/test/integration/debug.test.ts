import * as assert from 'assert';
import * as vscode from 'vscode';

/**
 * Debug Test um Extension-Loading-Probleme zu diagnostizieren
 */
describe('Extension Debug', () => {

	it('should list all available extensions', () => {
		console.log('\n=== ALL EXTENSIONS ===');
		const allExtensions = vscode.extensions.all;
		console.log(`Total extensions found: ${allExtensions.length}`);
		
		allExtensions.forEach((ext, index) => {
			console.log(`${index + 1}. ID: "${ext.id}"`);
			console.log(`   Package name: "${ext.packageJSON?.name || 'undefined'}"`);
			console.log(`   Display name: "${ext.packageJSON?.displayName || 'undefined'}"`);
			console.log(`   Publisher: "${ext.packageJSON?.publisher || 'undefined'}"`);
			console.log(`   Path: "${ext.extensionPath}"`);
			console.log(`   Active: ${ext.isActive}`);
			console.log('   ---');
		});
		
		// Find our extension by different criteria
		console.log('\n=== SEARCHING FOR OUR EXTENSION ===');
		
		// Search by package name
		const byName = allExtensions.find(ext => ext.packageJSON?.name === 'demo');
		console.log(`Found by name 'demo': ${byName ? byName.id : 'NOT FOUND'}`);
		
		// Search by display name
		const byDisplayName = allExtensions.find(ext => ext.packageJSON?.displayName === 'demo');
		console.log(`Found by displayName 'demo': ${byDisplayName ? byDisplayName.id : 'NOT FOUND'}`);
		
		// Search by path (should contain our workspace)
		const byPath = allExtensions.find(ext => ext.extensionPath.includes('demo') || ext.extensionPath.includes('workspace'));
		console.log(`Found by path pattern: ${byPath ? `${byPath.id} (${byPath.extensionPath})` : 'NOT FOUND'}`);
		
		// This test always passes - it's just for debugging
		assert.ok(true, 'Debug information logged');
	});

	it('should check workspace configuration', () => {
		console.log('\n=== WORKSPACE INFO ===');
		
		const workspaceFolders = vscode.workspace.workspaceFolders;
		console.log(`Workspace folders: ${workspaceFolders ? workspaceFolders.length : 'undefined'}`);
		
		if (workspaceFolders) {
			workspaceFolders.forEach((folder, index) => {
				console.log(`  ${index + 1}. ${folder.name}: ${folder.uri.fsPath}`);
			});
		}
		
		const workspaceFile = vscode.workspace.workspaceFile;
		console.log(`Workspace file: ${workspaceFile ? workspaceFile.fsPath : 'undefined'}`);
		
		const name = vscode.workspace.name;
		console.log(`Workspace name: ${name || 'undefined'}`);
		
		assert.ok(true, 'Workspace info logged');
	});

	it('should test command availability', async () => {
		console.log('\n=== COMMAND AVAILABILITY ===');
		
		const allCommands = await vscode.commands.getCommands(true);
		const demoCommands = allCommands.filter(cmd => cmd.startsWith('demo.'));
		
		console.log(`Total commands available: ${allCommands.length}`);
		console.log(`Demo commands found: ${demoCommands.length}`);
		
		demoCommands.forEach(cmd => {
			console.log(`  - ${cmd}`);
		});
		
		// Also check for our specific commands
		const expectedCommands = ['demo.helloWorld', 'demo.countWords'];
		expectedCommands.forEach(cmd => {
			const found = allCommands.includes(cmd);
			console.log(`Command "${cmd}": ${found ? 'FOUND' : 'NOT FOUND'}`);
		});
		
		assert.ok(true, 'Command info logged');
	});
});