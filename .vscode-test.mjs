import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/integration/**/*.test.js',
	workspaceFolder: './test-workspace',
	extensionDevelopmentPath: './',  // Wichtig: Extension-Pfad definieren
	mocha: {
		ui: 'bdd',
		timeout: 20000,
		color: true
	},
	coverage: {
		enabled: false  // Deaktiviert für Debugging
	}
});