import { execSync } from 'child_process';
import * as fs from 'fs';

// Get all TS6133 errors
const output = execSync('npx tsc --noEmit --noUnusedLocals --noUnusedParameters 2>&1 || true', {
  encoding: 'utf-8',
  maxBuffer: 50 * 1024 * 1024
});

interface ErrorInfo {
  file: string;
  line: number;
  column: number;
  name: string;
}

const errors: ErrorInfo[] = [];
const lines = output.split('\n');

for (const line of lines) {
  const match = line.match(/^(.+?)\((\d+),(\d+)\): error TS6133: '([^']+)' is declared but/);
  if (match) {
    errors.push({
      file: match[1],
      line: parseInt(match[2]),
      column: parseInt(match[3]),
      name: match[4]
    });
  }
  // Also match TS6196 (types)
  const typeMatch = line.match(/^(.+?)\((\d+),(\d+)\): error TS6196: '([^']+)' is declared but never used/);
  if (typeMatch) {
    errors.push({
      file: typeMatch[1],
      line: parseInt(typeMatch[2]),
      column: parseInt(typeMatch[3]),
      name: typeMatch[4]
    });
  }
}

// Group errors by file
const errorsByFile = new Map<string, ErrorInfo[]>();
for (const error of errors) {
  if (!errorsByFile.has(error.file)) {
    errorsByFile.set(error.file, []);
  }
  errorsByFile.get(error.file)!.push(error);
}

console.log(`Found ${errors.length} unused variable errors in ${errorsByFile.size} files`);

let fixedCount = 0;

for (const [filePath, fileErrors] of errorsByFile) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const fileLines = content.split('\n');

    // Sort errors by line number descending to avoid offset issues
    const sortedErrors = [...fileErrors].sort((a, b) => b.line - a.line);

    for (const error of sortedErrors) {
      const lineIndex = error.line - 1;
      if (lineIndex < 0 || lineIndex >= fileLines.length) continue;

      const line = fileLines[lineIndex];
      const name = error.name;

      // Skip if already prefixed with _
      if (name.startsWith('_')) continue;

      // Pattern 1: Simple import removal - import { X } from 'y'
      if (line.match(new RegExp(`^\\s*import\\s*\\{\\s*${name}\\s*\\}\\s*from`))) {
        fileLines[lineIndex] = '// REMOVE_LINE';
        continue;
      }

      // Pattern 2: import X from 'y' (default import)
      if (line.match(new RegExp(`^\\s*import\\s+${name}\\s+from`))) {
        fileLines[lineIndex] = '// REMOVE_LINE';
        continue;
      }

      // Pattern 3: Named import in a list - be more careful
      if (line.includes('import') && line.includes('{') && line.includes(name)) {
        // Check if it's a type import
        const isTypeImport = line.includes('type ' + name) || line.includes('type  ' + name);

        // Build regex to match the import item
        let newLine = line;

        if (isTypeImport) {
          // Remove type import
          newLine = newLine.replace(new RegExp(`type\\s+${name}\\s*,\\s*`), '');
          if (newLine === line) newLine = newLine.replace(new RegExp(`,\\s*type\\s+${name}`), '');
          if (newLine === line) newLine = newLine.replace(new RegExp(`type\\s+${name}`), '');
        } else {
          // Remove regular import - be careful not to match partial names
          newLine = newLine.replace(new RegExp(`\\b${name}\\b\\s*,\\s*`), '');
          if (newLine === line) newLine = newLine.replace(new RegExp(`,\\s*\\b${name}\\b(?!\\s*:)`), '');
          if (newLine === line) newLine = newLine.replace(new RegExp(`\\{\\s*\\b${name}\\b\\s*\\}`), '{}');
        }

        // Clean up
        newLine = newLine.replace(/\{\s*,\s*/g, '{ ');
        newLine = newLine.replace(/,\s*\}/g, ' }');
        newLine = newLine.replace(/,\s*,/g, ',');
        newLine = newLine.replace(/\{\s*\}/g, '{}');

        // If import becomes empty, remove it
        if (newLine.match(/import\s*\{\s*\}\s*from/) || newLine.match(/import\s*\{\}\s*from/)) {
          fileLines[lineIndex] = '// REMOVE_LINE';
        } else if (newLine !== line) {
          fileLines[lineIndex] = newLine;
        }
        continue;
      }

      // Pattern 4: Unused const/let declaration - only for simple cases
      const simpleConstMatch = line.match(new RegExp(`^(\\s*)(const|let)\\s+${name}\\s*=\\s*[^{]`));
      if (simpleConstMatch && !line.includes('useCallback') && !line.includes('useMemo') && !line.includes('useState')) {
        // Skip - don't modify variable declarations that might be used later
        continue;
      }

      // Pattern 5: Destructuring in function parameters - use proper renaming syntax
      // e.g., ({ foo, bar }) => -> ({ foo: _foo, bar }) =>
      // Only do this for props/params in function definitions
      const funcParamDestructMatch = line.match(/(\([^)]*)\{\s*([^}]*)\b${name}\b([^}]*)\}([^)]*\))\s*=>/);
      if (funcParamDestructMatch) {
        const newLine = line.replace(
          new RegExp(`\\b${name}\\b(?!\\s*:)`),
          `${name}: _${name}`
        );
        if (newLine !== line) {
          fileLines[lineIndex] = newLine;
          continue;
        }
      }

      // Pattern 6: React component props destructuring
      // e.g., const MyComp = ({ prop1, prop2 }) => -> const MyComp = ({ prop1, prop2: _prop2 }) =>
      if (line.includes('=>') && line.includes('({') && line.includes(name)) {
        const newLine = line.replace(
          new RegExp(`\\b${name}\\b(?!\\s*:)(?=\\s*[,}])`),
          `${name}: _${name}`
        );
        if (newLine !== line) {
          fileLines[lineIndex] = newLine;
          continue;
        }
      }

      // Pattern 7: Callback parameters in .map, .filter, etc
      // e.g., .map((item, index) => -> .map((item, _index) =>
      const callbackMatch = line.match(/\.(map|filter|forEach|reduce|find|some|every|flatMap)\s*\(\s*\(/);
      if (callbackMatch) {
        // Only rename if it's a simple parameter
        const newLine = line.replace(
          new RegExp(`\\b${name}\\b(?=\\s*[,)])`),
          `_${name}`
        );
        if (newLine !== line) {
          fileLines[lineIndex] = newLine;
          continue;
        }
      }

      // Pattern 8: Destructuring assignment in const/let
      // e.g., const { foo, bar } = obj -> const { foo, bar: _bar } = obj
      const destructAssignMatch = line.match(new RegExp(`(const|let|var)\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*=`));
      if (destructAssignMatch && !line.includes('import')) {
        const newLine = line.replace(
          new RegExp(`\\b${name}\\b(?!\\s*:)(?=\\s*[,}])`),
          `${name}: _${name}`
        );
        if (newLine !== line) {
          fileLines[lineIndex] = newLine;
          continue;
        }
      }
    }

    // Remove marked lines
    const newLines = fileLines.filter(l => l !== '// REMOVE_LINE');
    const newContent = newLines.join('\n');

    if (newContent !== originalContent) {
      fs.writeFileSync(filePath, newContent);
      fixedCount++;
      console.log(`Fixed: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

console.log(`\nFixed ${fixedCount} files`);
