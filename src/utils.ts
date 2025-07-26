/**
 * Geschäftslogik-Funktionen ohne VSCode-Dependencies
 * Diese Datei enthält nur reine Funktionen und kann direkt in Unit Tests verwendet werden.
 */

/**
 * Validiert einen Dateinamen
 * @param filename Der zu validierende Dateiname
 * @returns true wenn der Dateiname gültig ist
 */
export function isValidFilename(filename: string): boolean {
	if (!filename || filename.trim().length === 0) {
		return false;
	}
	
	// Ungültige Zeichen für Dateinamen
	const invalidChars = /[<>:"/\\|?*]/;
	return !invalidChars.test(filename);
}

/**
 * Erstellt eine Begrüßungsnachricht
 * @param name Der Name für die Begrüßung
 * @returns Formatierte Begrüßungsnachricht
 */
export function createGreeting(name: string): string {
	if (!name || name.trim().length === 0) {
		return "Hello World!";
	}
	return `Hello ${name.trim()}!`;
}

/**
 * Zählt Wörter in einem Text
 * @param text Der zu analysierende Text
 * @returns Anzahl der Wörter
 */
export function countWords(text: string): number {
	if (!text || text.trim().length === 0) {
		return 0;
	}
	
	return text.trim().split(/\s+/).length;
}