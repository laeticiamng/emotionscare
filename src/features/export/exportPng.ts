export async function exportNodeToPng(node: HTMLElement, filename: string) {
  try {
    // Note: html2canvas dependency is not available, using fallback
    console.warn('Export to PNG not available - html2canvas dependency missing');
    
    // Fallback: create a simple text file with element info
    const elementInfo = {
      tag: node.tagName,
      className: node.className,
      textContent: node.textContent?.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(elementInfo, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = filename.replace('.png', '.json');
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Export functionality is currently unavailable');
  }
}
