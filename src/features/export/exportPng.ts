export async function exportNodeToPng(node: HTMLElement, filename: string) {
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(node, {
    backgroundColor: '#ffffff',
    scale: window.devicePixelRatio || 1,
    useCORS: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
