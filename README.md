# VSCode Extension Development - Practical Guide for Testing and Debugging

This guide systematically walks you through developing and testing VSCode extensions. You will learn how to practically implement unit tests and integration tests, debug effectively, and work in both local and cloud environments.

## 🎯 What You Will Learn

After completing this tutorial, you will be able to develop VSCode extensions with professional testing practices, utilize various debug configurations effectively, and work seamlessly in both local and cloud development environments.

## 🚀 Setup: From Repository to Running Extension

### Step 1: Choose Your Development Environment

You have two options - choose the one that fits your situation best:

**Option A: GitHub Codespaces (Recommended for Workshops)**
1. Navigate to the GitHub repository
2. Click the green "Code" button  
3. Select the "Codespaces" tab
4. Click "Create codespace on main"
5. Wait 2-3 minutes while everything installs automatically

**Option B: Local Development with Devcontainer**

**Important Prerequisite: Docker Desktop must be installed and running!**

1. **Install and start Docker Desktop** 
   - Windows/Mac: Download from docker.com and install
   - Linux: `sudo apt-get install docker-ce docker-ce-cli containerd.io`
   - **Start Docker Desktop** and ensure it is running (Docker icon in taskbar)

2. **Prepare VSCode**
   - Open VSCode 
   - Install the "Dev Containers" extension
   - Clone the repository and open it in VSCode

3. **Start the container**
   - VSCode shows a notification: "Reopen in Container?" 
   - Click "Yes" or "Reopen in Container"
   - **Wait 3-5 minutes** while Docker downloads the container image and installs everything automatically

**What happens automatically?**
- Node.js and TypeScript are installed
- All required VSCode extensions are loaded
- Dependencies are installed via `yarn install`
- Code gets compiled automatically
- Port forwarding is configured

### Step 2: First Function Check with F5

The project is configured so you can immediately work with **F5** - this is the VSCode standard for extension development.

**Initial function check:**
1. **Press F5**
2. **Select "Run Extension"** from the dropdown list
3. **A new VSCode instance opens** - this is your "Extension Development Host"
4. **In the new instance:** Press `Ctrl+Shift+P` and type "Hello World"
5. **Execute the command** - you should see a message: "Hello VSCode Extension Developer!"

**If this works:** Perfect! Your setup is correct.

**If errors occur:** Run the compilation manually once:
```bash
yarn run compile
```

**Alternative: Run tests via F5**
1. **Press F5** 
2. **Select "Debug Unit Tests"** - all unit tests run in debug mode
3. **Results in Debug Console:** You see test output directly in VSCode

## 🎓 Understanding the Two Test Worlds

This project demonstrates two completely different types of tests - understand the difference before proceeding:

**Unit Tests (Green 🟢)**
- Test pure business logic functions
- Run in normal Node.js environment
- Very fast (1-2 seconds)
- No VSCode installation required
- For: Algorithms, validations, calculations

**Integration Tests (Blue 🔵)**
- Test VSCode API interactions
- Require complete VSCode Extension Host environment
- Slower (10-15 seconds)
- For: Commands, editor integration, workspace operations

This separation is crucial for efficient extension development.

## 🟢 Unit Tests with F5 - The VSCode Way

Forget the command line - VSCode offers a much more elegant approach through integrated launch configurations.

### Running Unit Tests: F5 → "Debug Unit Tests"

1. **Press F5** (or open Run and Debug panel)
2. **Select "Debug Unit Tests"** from the dropdown list
3. **Tests start automatically** in debug mode
4. **Results appear** in the Debug Console

**What you see in the Debug Console:**
```
Business Logic Unit Tests
  isValidFilename()
    ✓ should return true for valid filename (2ms)
    ✓ should return false for filename with invalid characters (1ms)
  createGreeting()
    ✓ should create personalized greeting
  countWords()
    ✓ should count words in simple text

16 passing (23ms)
```

**Advantages over command line:**
- Breakpoints work automatically
- Variables panel is immediately available  
- Debug Console for live interaction
- No terminal switching required

### Debug Single Test File: F5 → "Debug Single Unit Test File"

**For focused development:**
1. **Open a test file** (e.g., `src/test/unit/extension.test.ts`)
2. **Press F5**
3. **Select "Debug Single Unit Test File"**
4. **Only this file is tested** - significantly faster

**Command line as alternative:**
If you prefer the command line:
```bash
yarn run test:unit          # All unit tests
```

**Where to find the tests?**
Open `src/test/unit/extension.test.ts` - here you see tests that examine the `isValidFilename` function from `src/utils.ts`. Look at this file as well. These functions deliberately have no VSCode dependencies so they can be tested in a normal Node.js environment.

### Working with the VSCode Test Runner

1. Open the Test panel in VSCode (Activity Bar → Test icon)
2. You see a tree structure of your tests
3. Click individual tests and run them
4. Green checkmarks mean passed, red X means failed

**Practical Exercise:**
1. Open `src/utils.ts`
2. Change the `countWords` function - replace `split(/\s+/)` with `split(' ')`
3. Run the unit tests again
4. Observe which tests now fail
5. Look at the error messages
6. Undo the change

### Debugging Unit Tests - Your Most Important Tool

Debugging is the key to understanding. Here's how:

1. **Set breakpoint:** Open `src/test/unit/extension.test.ts` and click to the left of a line number - a red dot appears
2. **Start debug:** Press F5 or go to "Run and Debug" → "Debug Unit Tests"
3. **When breakpoint is reached:** VSCode stops and you can inspect

**What you see in debug mode:**
- **Variables Panel:** All local variables with their values
- **Call Stack:** How you got to this point
- **Debug Console:** Here you can execute code live

**Practical Debug Exercise:**
1. Set a breakpoint in the test for `countWords('Hello    world     test')`
2. Start the debugger
3. When it stops, type in the Debug Console: `text.split(/\s+/)`
4. You see the result: `["Hello", "world", "test"]`
5. Try: `text.split(' ')` - you see the difference!

### Watch Mode for Continuous Development

For test-driven development, use two terminals:

**Terminal 1 - Auto-Compile:**
```bash
yarn run watch
```
This monitors your TypeScript files and compiles automatically on changes.

**Terminal 2 - Tests as needed:**
```bash
yarn run test:unit
```

**Workflow:**
1. Change code in `src/utils.ts`
2. Terminal 1 compiles automatically
3. Run tests in Terminal 2
4. Repeat the cycle

## 🔵 Integration Tests with F5 - Testing VSCode APIs

Integration tests are more complex, but just as elegant to handle with F5 as unit tests.

### Running Integration Tests: F5 → "Debug Integration Tests"

1. **Press F5**
2. **Select "Debug Integration Tests"** from the dropdown list  
3. **VSCode starts an Extension Host instance** (takes 10-15 seconds)
4. **Your extension is tested in a real VSCode environment**

**What happens in detail:**
1. VSCode starts a special Extension Host instance
2. Your extension is automatically loaded and activated
3. A test workspace is opened (`test-workspace/`)
4. Tests are executed in this real VSCode environment
5. Results appear in the Debug Console

**Typical output in Debug Console:**
```
Extension Integration Tests
  Extension Lifecycle
    ✓ should be present in VSCode extensions (45ms)
    ✓ should activate successfully (123ms)
  Command Registration
    ✓ should register helloWorld command (89ms)
    ✓ should execute helloWorld command without error (156ms)

8 passing (12s)
```

**Command line as alternative:**
```bash
yarn run test:integration
```

### What Integration Tests Verify

Open `src/test/integration/extension.test.ts` - here you see tests for:

**Extension Loading:**
Tests verify that your extension can be found and loaded by VSCode's extension system.

**Command Registration:**
Tests check that all commands defined in your package.json are properly registered and available in the Command Palette.

**Real VSCode Operations:**
Tests perform actual document operations, editor interactions, and workspace manipulations to ensure your extension works in real scenarios.

### Debug Helper for Integration Tests

When integration tests fail, use the debug test:

```bash
yarn run test:integration --grep "Extension Debug"
```

This special test shows you all available extensions and helps with troubleshooting when your extension cannot be found.

## 🐛 Mastering the Four F5 Modes - Your Most Important Tool

The project comes equipped with four specialized launch configurations. Each serves a different purpose, and understanding this is crucial for efficient extension development.

**Why F5 instead of command line?** F5 seamlessly integrates debugging into VSCode. You set breakpoints, see variables, and can step through code live - this is not possible with the command line.

### 1. "Run Extension" - F5 → Experience Your Extension Live

**When to use:** Test your extension as an end user would

**How to do it:**
1. **Press F5**
2. **Select "Run Extension"** (usually pre-selected automatically)
3. **A new VSCode instance opens** - this is the "Extension Development Host"

**In the new VSCode instance you can:**
- Press `Ctrl+Shift+P` → execute "Hello World"
- Open a text file → `Ctrl+Shift+P` → execute "Count Words"  
- Use your extension like a normal user would

**Debugging during this:** Set breakpoints in `src/extension.ts`. When you execute commands in the new instance, the debugger stops in the original instance.

**Practical tip:** Keep watch compilation running (`yarn run watch` in terminal), then code changes are automatically transferred to the new instance.

### 2. "Debug Unit Tests" - F5 → Understand Business Logic

**When to use:** A unit test fails or you are developing new functions

**How to do it:**
1. **Set breakpoints** in `src/test/unit/extension.test.ts` or `src/utils.ts`
2. **Press F5**
3. **Select "Debug Unit Tests"**
4. **All unit tests run in debug mode**

**What you immediately see:**
- Tests run and stop at breakpoints
- Variables Panel shows all variable values
- Debug Console for live experiments

**Why this is better than command line:** You can inspect variables, step through code line by line, and experiment live in the Debug Console.

### 3. "Debug Single Unit Test File" - F5 → Focused Development

**When to use:** You are working on specific tests and want no waiting time

**How to do it:**
1. **Open a test file** (e.g., `src/test/unit/extension.test.ts`)
2. **Press F5**
3. **Select "Debug Single Unit Test File"**
4. **Only this file is tested** - much faster

**Development workflow:**
- Change a function in `src/utils.ts`
- Switch to the corresponding test file
- F5 → "Debug Single Unit Test File"
- Immediate feedback on your changes

### 4. "Debug Integration Tests" - F5 → Understand VSCode APIs

**When to use:** Debug extension lifecycle or command registration

**How to do it:**
1. **Press F5**
2. **Select "Debug Integration Tests"**
3. **Wait 10-15 seconds** - complete VSCode environment is loaded
4. **Breakpoints in integration tests work**

**What happens:** A real VSCode instance starts, loads your extension, and runs tests. You can watch how commands are registered and the VSCode API is used.

## 🔧 Practical Debugging Scenarios with F5

The real strength lies in debugging actual problems. Here you learn typical scenarios and their solution via F5.

### Scenario 1: A Unit Test Fails - F5 Shows You Why

**Problem:** The test `should handle mixed whitespace correctly` shows this error:
```
AssertionError: Expected 3 but got 4
```

**Solution with F5:**
1. **Open** `src/test/unit/extension.test.ts`
2. **Set a breakpoint** before the `assert.strictEqual` line (click left of line number)
3. **F5 → "Debug Unit Tests"**
4. **When breakpoint is reached:** VSCode stops automatically
5. **Look at Variables Panel:** You see `text`, `result`, `expected` with their current values
6. **Use Debug Console:** Type `text.split(/\s+/)` and see the array
7. **Identify problem:** The array has 4 instead of 3 elements

**What you learn:** F5 makes invisible variable values immediately visible. Without debugging, you would be guessing.

### Scenario 2: Extension Command Doesn't Work - F5 Shows the Flow

**Problem:** The "Count Words" command shows an incorrect number.

**Solution with F5:**
1. **Open** `src/extension.ts`
2. **Set a breakpoint** in the `countWords` command implementation
3. **F5 → "Run Extension"** - new VSCode instance opens
4. **In the new instance:** Open a text file with known content
5. **Execute "Count Words"** (`Ctrl+Shift+P` → "Count Words")
6. **Debugger stops automatically** in the original instance
7. **Variables Panel:** You see the exact `text` content and `wordCount` value
8. **Debug Console:** Test `text.trim().split(/\s+/).length` live

**What you learn:** F5 shows you the exact data flow from VSCode API to your function.

### Scenario 3: Extension Not Found - F5 Helps with Diagnosis

**Problem:** Integration tests show "Extension not found".

**Solution with F5:**
1. **F5 → "Debug Integration Tests"**
2. **Look at the Debug Console** during startup
3. **You see messages like:**
   ```
   Loading extension from: /workspaces/vscode-extension-demo
   Extension "demo" activation failed: [Error details]
   ```
4. **Set a breakpoint** in the debug test (`debug.test.ts`)
5. **F5 → "Debug Integration Tests" with --grep "should list all available extensions"**
6. **Variables Panel:** You see all available extension IDs
7. **Identify problem:** Extension ID doesn't match `package.json`

**What you learn:** F5 gives you detailed insights into the extension loading process.

## 📊 Understanding Test Output

### Unit Test Output

**Successful tests:**
```
  Business Logic Unit Tests
    isValidFilename()
      ✓ should return true for valid filename (2ms)
      ✓ should return false for empty filename (1ms)
    
  16 passing (23ms)
```

**Failed tests:**
```
  1) should count words with punctuation correctly
  
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual: 6
  - expected: 5
```

**Interpretation:** `actual` is what your function returned, `expected` is what the test expected.

### Integration Test Output

**VSCode Extension Host startup:**
```
Starting extension host with workspace folder: ./test-workspace
Loading extension from: /workspaces/vscode-extension-demo
```

**Extension loading:**
```
Extension "demo" activated successfully
Registered commands: demo.helloWorld, demo.countWords
```

**Test results:**
```
Extension Integration Tests
  Extension Lifecycle
    ✓ should be present in VSCode extensions (45ms)
  Command Registration  
    ✓ should register helloWorld command (123ms)
```

## 🎯 Development Workflows in Practice

### Workflow 1: Develop New Function (TDD)

1. **Write the test first:**
   ```typescript
   it('should validate email addresses', () => {
       assert.strictEqual(isValidEmail('test@example.com'), true);
       assert.strictEqual(isValidEmail('invalid-email'), false);
   });
   ```

2. **Test fails** (function doesn't exist yet)

3. **Implement the function:**
   ```typescript
   export function isValidEmail(email: string): boolean {
       return email.includes('@') && email.includes('.');
   }
   ```

4. **Test passes**

5. **Refactor the implementation** (with test safety net)

### Workflow 2: Bug Fixing

1. **Reproduce the bug in a test**
2. **Test fails** (bug confirmed)
3. **Debug with breakpoints**
4. **Fix the code**
5. **Test passes** (bug fixed)

### Workflow 3: Develop Extension Feature

1. **Write unit tests for business logic**
2. **Implement business logic**
3. **Write integration tests for VSCode integration**
4. **Implement VSCode commands/APIs**
5. **Test manually in Extension Development Host**

## 🔍 Advanced Debug Techniques

### Using Debug Console Effectively

During a debug session, you can execute live code in the Debug Console:

```javascript
// Inspect variable
> filename
"test<.txt"

// Test functions  
> isValidFilename("valid.txt")
true

// Understand regular expressions
> /[<>:"/\\|?*]/.test("test<.txt")
true

// Analyze arrays
> text.split(/\s+/)
["Hello", "world", "test"]
```

### Conditional Breakpoints

For complex debugging scenarios:

1. **Right-click on breakpoint**
2. **Select "Edit Breakpoint"**
3. **Enter condition:** `filename.includes('<')`
4. **Breakpoint stops only when condition is met**

### Watch Expressions

1. **Open Watch panel**
2. **Click "+"**
3. **Enter expression:** `text.length`
4. **Value is continuously monitored**

## 🎓 Common Learning Pitfalls and How to Avoid Them

### Learning Pitfall 1: Unit Tests with VSCode Dependencies

**Wrong:**
```typescript
// In unit test
import { someFunction } from '../extension';  // ❌ Contains VSCode import
```

**Right:**
```typescript
// In unit test  
import { someFunction } from '../utils';      // ✅ Only pure functions
```

**Why important:** Unit tests should be fast and independent.

### Learning Pitfall 2: Integration Tests without Cleanup

**Wrong:**
```typescript
it('should work with editor', async () => {
    const doc = await vscode.workspace.openTextDocument({content: 'test'});
    await vscode.window.showTextDocument(doc);
    // ❌ Editor stays open for next test
});
```

**Right:**
```typescript
it('should work with editor', async () => {
    const doc = await vscode.workspace.openTextDocument({content: 'test'});
    await vscode.window.showTextDocument(doc);
    
    // Test logic here
    
    // ✅ Cleanup
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
});
```

### Learning Pitfall 3: Debugging without Source Maps

If breakpoints don't work, check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "sourceMap": true  // ✅ Must be activated
  }
}
```

## 🏆 Success Metrics: When Do You Master the System?

You master the system when you can:

1. **Switch between unit and integration tests without thinking**
2. **Deliberately choose the right debug configuration for your problem**
3. **Fluently use breakpoints, Variables Panel, and Debug Console**
4. **Practice test-driven development**
5. **Systematically debug extension problems**
