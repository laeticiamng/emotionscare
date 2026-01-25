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
    const lines = content.split('\n');

    // Sort errors by line number descending to avoid offset issues
    const sortedErrors = [...fileErrors].sort((a, b) => b.line - a.line);

    for (const error of sortedErrors) {
      const lineIndex = error.line - 1;
      if (lineIndex < 0 || lineIndex >= lines.length) continue;

      const line = lines[lineIndex];
      const name = error.name;

      // Handle different patterns

      // Pattern 1: Simple import removal - import { X } from 'y'
      if (line.match(new RegExp(`^\\s*import\\s*\\{\\s*${name}\\s*\\}\\s*from`))) {
        lines[lineIndex] = '// REMOVE_LINE';
        continue;
      }

      // Pattern 2: Named import in a list - import { A, X, B } or import { A, X } or import { X, B }
      const namedImportRegex = new RegExp(`\\{([^}]*?)\\b${name}\\b([^}]*?)\\}`);
      const namedMatch = line.match(namedImportRegex);
      if (namedMatch && line.includes('import')) {
        // Remove the name from the import list
        let newLine = line.replace(new RegExp(`\\b${name}\\b\\s*,\\s*`), '');
        if (newLine === line) {
          newLine = line.replace(new RegExp(`\\s*,\\s*\\b${name}\\b`), '');
        }
        if (newLine === line) {
          newLine = line.replace(new RegExp(`\\b${name}\\b`), '');
        }
        // Clean up empty braces or double commas
        newLine = newLine.replace(/\{\s*,/, '{');
        newLine = newLine.replace(/,\s*\}/, '}');
        newLine = newLine.replace(/,\s*,/g, ',');
        newLine = newLine.replace(/\{\s*\}/, '{}');

        // If import becomes empty, remove it
        if (newLine.match(/import\s*\{\s*\}\s*from/)) {
          lines[lineIndex] = '// REMOVE_LINE';
        } else {
          lines[lineIndex] = newLine;
        }
        continue;
      }

      // Pattern 3: Default import - import X from 'y'
      if (line.match(new RegExp(`^\\s*import\\s+${name}\\s+from`))) {
        lines[lineIndex] = '// REMOVE_LINE';
        continue;
      }

      // Pattern 4: Unused variable in destructuring - const { x, y } = ... -> const { y } = ...
      const destructRegex = new RegExp(`(const|let|var)\\s*\\{([^}]*?)\\b${name}\\b([^}]*?)\\}\\s*=`);
      const destructMatch = line.match(destructRegex);
      if (destructMatch) {
        let newLine = line.replace(new RegExp(`\\b${name}\\b\\s*,\\s*`), '');
        if (newLine === line) {
          newLine = line.replace(new RegExp(`\\s*,\\s*\\b${name}\\b`), '');
        }
        if (newLine === line) {
          newLine = line.replace(new RegExp(`\\b${name}\\b`), '');
        }
        newLine = newLine.replace(/\{\s*,/, '{');
        newLine = newLine.replace(/,\s*\}/, '}');
        newLine = newLine.replace(/,\s*,/g, ',');
        lines[lineIndex] = newLine;
        continue;
      }

      // Pattern 5: Unused function parameter - prefix with _
      const funcParamRegex = new RegExp(`\\(([^)]*?)\\b${name}\\b([^)]*?)\\)`);
      if (line.match(funcParamRegex) && !line.includes('import')) {
        const newLine = line.replace(new RegExp(`\\b${name}\\b`), `_${name}`);
        lines[lineIndex] = newLine;
        continue;
      }

      // Pattern 6: Unused const/let/var declaration on its own line
      const varDeclRegex = new RegExp(`^\\s*(const|let|var)\\s+${name}\\s*=`);
      if (line.match(varDeclRegex)) {
        // Check if it's a simple declaration we can remove
        // For now, prefix with _ to mark as intentionally unused
        const newLine = line.replace(new RegExp(`\\b${name}\\b`), `_${name}`);
        lines[lineIndex] = newLine;
        continue;
      }

      // Pattern 7: Arrow function parameter
      const arrowParamRegex = new RegExp(`\\(\\s*${name}\\s*\\)\\s*=>`);
      if (line.match(arrowParamRegex)) {
        const newLine = line.replace(new RegExp(`\\b${name}\\b`), `_${name}`);
        lines[lineIndex] = newLine;
        continue;
      }

      // Pattern 8: Callback parameter like .map((x) => ...) or .map((x, i) => ...)
      const callbackRegex = new RegExp(`\\.(map|filter|forEach|reduce|find|some|every|flatMap)\\s*\\(`);
      if (line.match(callbackRegex)) {
        const newLine = line.replace(new RegExp(`\\b${name}\\b(?=\\s*[,\\)])`), `_${name}`);
        if (newLine !== line) {
          lines[lineIndex] = newLine;
          continue;
        }
      }
    }

    // Remove marked lines
    const newLines = lines.filter(l => l !== '// REMOVE_LINE');
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
