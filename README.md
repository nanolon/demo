# Hello World Highlighter - VSCode Extension

## Overview

This VSCode extension recognizes the phrases "Hello World" and "Hallo Welt" in text files (`.txt`) and highlights them with syntax highlighting. The extension demonstrates the fundamentals of language extension development in VSCode.

## What does this extension do?

The extension extends VSCode with the following features:

1. **Language Recognition**: All `.txt` files are recognized as "Hello Text" files
2. **Syntax Highlighting**: The terms "Hello World" and "Hallo Welt" are highlighted in color
3. **Case Sensitivity**: Recognition works regardless of case (e.g., "HELLO WORLD", "hello world", "Hallo Welt")

## Recognized Patterns

The extension recognizes the following variants:
- `Hello World` (English)
- `Hallo Welt` (German)
- All combinations of uppercase and lowercase letters
- With any whitespace between words

### Examples:
```
Hello World          ← will be highlighted
HELLO WORLD          ← will be highlighted  
hello world          ← will be highlighted
Hello    World       ← will be highlighted
Hallo Welt           ← will be highlighted
HALLO WELT           ← will be highlighted
hallo welt           ← will be highlighted
```

## Technical Fundamentals

### What is Syntax Highlighting?

Syntax highlighting is the color-coded display of text elements in an editor. It helps to:
- Better understand code or text
- Quickly recognize important terms
- Visually grasp structures

VSCode uses **TextMate Grammars** for this - a system for defining language rules.

### TextMate Grammar

A TextMate Grammar defines:
- **Patterns**: Which text patterns should be recognized
- **Scopes**: How the recognized patterns are categorized
- **Highlighting**: Which colors are used for which categories

### Scope System

Each recognized pattern is assigned a **scope**. In our extension:
- `keyword.control.hello`: Main scope for Hello World/Hallo Welt
- `keyword.control.hello.greeting`: For "Hello"/"Hallo"  
- `keyword.control.hello.target`: For "World"/"Welt"

## Project Structure

```
hello-world-highlighter/
├── package.json                          # Extension manifest
├── language-configuration.json           # Language configuration
├── syntaxes/
│   └── hello-text.tmGrammar.json         # TextMate Grammar
├── src/
│   └── extension.ts                      # Extension code
└── README.md                             # This documentation
```

### Important Files Explained

#### package.json
The extension **manifest**. Defines:
- Metadata (name, version, description)
- **Contributions**: What the extension contributes to VSCode
- **Languages**: New language support
- **Grammars**: Links to grammar files

#### syntaxes/hello-text.tmGrammar.json
The **TextMate Grammar** with:
- **Patterns**: Regex patterns for "Hello World" and "Hallo Welt"
- **Scopes**: Assignment of patterns to categories
- **Repository**: Structured collection of recognition rules

#### language-configuration.json
**Language configuration** for basic editor features:
- Comment syntax
- Bracket pairs
- Auto-completion

## Installation and Testing

### 1. Compile Project
```bash
# Install dependencies
yarn install

# Compile TypeScript
yarn run compile
```

### 2. Test Extension
1. Press `F5` in VSCode
2. A new VSCode window opens
3. Create a new `.txt` file
4. Type "Hello World" or "Hallo Welt"
5. The terms should be highlighted in color

### 3. Create Test File
Create a file `test.txt` with the following content:
```
Hello World
HELLO WORLD
hello world
Hallo Welt
HALLO WELT
hallo welt
Hello    World
Normal text without highlighting
```

## How does the Grammar work?

### Regex Pattern Explanation

```json
"match": "(?i)\\b(hello)\\s+(world)\\b"
```

- `(?i)`: Case-insensitive matching (ignore case)
- `\\b`: Word boundary (ensures "hello" is a complete word)
- `(hello)`: Capturing group for "hello"
- `\\s+`: One or more whitespace characters
- `(world)`: Capturing group for "world"
- `\\b`: Word boundary at the end

### Scope Assignment

```json
"captures": {
  "1": { "name": "keyword.control.hello.greeting" },
  "2": { "name": "keyword.control.hello.target" }
}
```

- Group 1 ("hello"): Gets scope `keyword.control.hello.greeting`
- Group 2 ("world"): Gets scope `keyword.control.hello.target`

## Extension Activation

### When is the extension activated?

The extension is automatically activated when:
1. VSCode starts (since `activationEvents` is empty)
2. A `.txt` file is opened

### Language Association

```json
"languages": [{
  "id": "hello-text",
  "extensions": [".txt"]
}]
```

This tells VSCode:
- All `.txt` files belong to the "hello-text" language
- The grammar should be applied to this language

## Customization and Extension

### Adding New Languages

To support additional variants (e.g., "Bonjour Monde"), extend the grammar:

```json
"hello-world-fr": {
  "patterns": [{
    "name": "keyword.control.hello",
    "match": "(?i)\\b(bonjour)\\s+(monde)\\b"
  }]
}
```

### Supporting Other File Types

Change in `package.json`:
```json
"extensions": [".txt", ".md", ".log"]
```

### Customizing Colors

The actual colors are determined by the VSCode theme. The scope `keyword.control.hello` is formatted as a keyword by default.

## Common Issues

### Extension not activating
- Check the VSCode Developer Console (`Help > Toggle Developer Tools`)
- Ensure that `yarn run compile` was successful

### Highlighting not working
- Check if the file is recognized as "hello-text" (bottom right in status bar)
- Test with exact terms "Hello World" or "Hallo Welt"

### Grammar changes not applied
- Reload the Extension Development Host window (`Ctrl+R` / `Cmd+R`)
- Or restart the debug process (`F5`)

## Advanced Concepts

### Theme Integration
VSCode themes can define specific colors for custom scopes:
```json
"textMateRules": [{
  "scope": "keyword.control.hello",
  "settings": {
    "foreground": "#ff6b6b",
    "fontStyle": "bold"
  }
}]
```

### Semantic Highlighting
For more complex languages, you can use Semantic Highlighting instead of TextMate, which enables context-dependent highlighting.

### Language Server Protocol (LSP)
For complete language support (IntelliSense, error checking, etc.), a Language Server is the right solution.

## Summary

This extension demonstrates the fundamentals of syntax highlighting in VSCode:
- **TextMate Grammars** for pattern-based highlighting
- **Scope System** for text categorization
- **Language Contributions** in VSCode extensions
- **Regex Patterns** for flexible text recognition

The example is intentionally kept simple but shows all important concepts for developing language extensions in VSCode.