/**
 * Cleanup Unused Code - Production Optimizer
 * Identifies and helps remove unused imports, components, and dead code
 */

interface UnusedCodeReport {
  unusedImports: string[];
  unusedVariables: string[];
  deadCode: string[];
  largeBundles: string[];
  duplicateCode: string[];
}

/**
 * Analyze codebase for unused imports and dead code
 */
export const analyzeUnusedCode = async (): Promise<UnusedCodeReport> => {
  const report: UnusedCodeReport = {
    unusedImports: [],
    unusedVariables: [],
    deadCode: [],
    largeBundles: [],
    duplicateCode: []
  };

  // This would normally use AST parsing or build tools
  // For now, providing a mock analysis
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Analyzing codebase for unused code...');
    
    // Mock unused imports detection
    report.unusedImports = [
      'react-router-dom (unused exports)',
      '@radix-ui/react-icons (unused icons)',
      'date-fns (unused functions)'
    ];
    
    // Mock dead code detection
    report.deadCode = [
      'src/components/unused/OldComponent.tsx',
      'src/hooks/deprecated/useOldHook.ts',
      'src/utils/legacy/oldHelpers.ts'
    ];
    
    // Mock large bundle detection
    report.largeBundles = [
      'react-icons (>1MB)',
      '@radix-ui (>500KB)',
      'framer-motion (>300KB)'
    ];
  }
  
  return report;
};

/**
 * Clean up console statements from production builds
 */
export const removeConsoleStatements = (code: string): string => {
  // Remove console.log statements
  return code
    .replace(/console\.log\([^)]*\);?\s*/g, '')
    .replace(/console\.debug\([^)]*\);?\s*/g, '')
    .replace(/console\.info\([^)]*\);?\s*/g, '')
    .replace(/console\.trace\([^)]*\);?\s*/g, '')
    .replace(/debugger;?\s*/g, '');
};

/**
 * Optimize imports by removing unused ones
 */
export const optimizeImports = (code: string): string => {
  const lines = code.split('\n');
  const usedImports = new Set<string>();
  const importLines: string[] = [];
  const codeLines: string[] = [];
  
  // Separate imports from code
  lines.forEach(line => {
    if (line.trim().startsWith('import')) {
      importLines.push(line);
    } else {
      codeLines.push(line);
    }
  });
  
  const codeText = codeLines.join('\n');
  
  // Keep only used imports
  const optimizedImports = importLines.filter(importLine => {
    // Extract imported items
    const match = importLine.match(/import\s+{([^}]+)}/);
    if (match) {
      const imports = match[1].split(',').map(i => i.trim());
      const usedInThisImport = imports.filter(imp => 
        codeText.includes(imp.replace(/\s+as\s+\w+/, ''))
      );
      
      if (usedInThisImport.length === 0) {
        return false; // Remove unused import
      }
      
      // Update import line with only used imports
      if (usedInThisImport.length < imports.length) {
        return importLine.replace(
          /{[^}]+}/, 
          `{ ${usedInThisImport.join(', ')} }`
        );
      }
    }
    
    return true; // Keep import as is
  });
  
  return [...optimizedImports, '', ...codeLines].join('\n');
};

/**
 * Remove duplicate code blocks
 */
export const removeDuplicates = (code: string): string => {
  const lines = code.split('\n');
  const uniqueLines: string[] = [];
  const seenLines = new Set<string>();
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments for duplicate detection
    if (trimmedLine === '' || trimmedLine.startsWith('//')) {
      uniqueLines.push(line);
      return;
    }
    
    // Check for duplicate function/component definitions
    if (!seenLines.has(trimmedLine)) {
      seenLines.add(trimmedLine);
      uniqueLines.push(line);
    }
  });
  
  return uniqueLines.join('\n');
};

/**
 * Minimize CSS by removing unused classes
 */
export const optimizeCSS = (css: string, usedClasses: string[]): string => {
  const rules = css.split('}').filter(rule => rule.trim());
  
  const optimizedRules = rules.filter(rule => {
    const selectorMatch = rule.match(/\.([a-zA-Z0-9_-]+)/);
    if (selectorMatch) {
      const className = selectorMatch[1];
      return usedClasses.includes(className);
    }
    return true; // Keep non-class selectors
  });
  
  return optimizedRules.join('} ') + '}';
};

/**
 * Bundle analyzer - identify heavy dependencies
 */
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return {};
  
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const analysis = {
    totalSize: 0,
    jsSize: 0,
    cssSize: 0,
    imageSize: 0,
    heavyResources: [] as Array<{ name: string; size: number; type: string }>
  };
  
  resources.forEach(resource => {
    const size = resource.transferSize || 0;
    analysis.totalSize += size;
    
    if (resource.name.includes('.js')) {
      analysis.jsSize += size;
    } else if (resource.name.includes('.css')) {
      analysis.cssSize += size;
    } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      analysis.imageSize += size;
    }
    
    // Flag resources over 100KB
    if (size > 100 * 1024) {
      analysis.heavyResources.push({
        name: resource.name,
        size,
        type: resource.name.split('.').pop() || 'unknown'
      });
    }
  });
  
  return analysis;
};

/**
 * Tree shake unused exports
 */
export const treeShakeExports = (code: string): string => {
  // This would normally be done by bundlers like Webpack/Vite
  // Here's a simplified version that removes unused exports
  
  const lines = code.split('\n');
  const exports = new Map<string, string>();
  const usedExports = new Set<string>();
  
  // Find all exports
  lines.forEach(line => {
    const exportMatch = line.match(/export\s+(?:const|function|class)\s+(\w+)/);
    if (exportMatch) {
      exports.set(exportMatch[1], line);
    }
  });
  
  // Find usage of exports (simplified)
  const codeContent = lines.join('\n');
  exports.forEach((_, exportName) => {
    if (codeContent.includes(exportName)) {
      usedExports.add(exportName);
    }
  });
  
  // Remove unused exports
  return lines.filter(line => {
    const exportMatch = line.match(/export\s+(?:const|function|class)\s+(\w+)/);
    if (exportMatch) {
      return usedExports.has(exportMatch[1]);
    }
    return true;
  }).join('\n');
};

/**
 * Generate cleanup report
 */
export const generateCleanupReport = async () => {
  const report = await analyzeUnusedCode();
  const bundleAnalysis = analyzeBundleSize();
  
  return {
    ...report,
    bundleAnalysis,
    recommendations: [
      '🗑️ Remove unused imports to reduce bundle size',
      '🧹 Clean up dead code and unused components',
      '📦 Consider lazy loading for large components',
      '🎯 Implement code splitting for better performance',
      '🔧 Use tree shaking to eliminate unused exports'
    ]
  };
};
