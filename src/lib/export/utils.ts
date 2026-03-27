// @ts-nocheck
export function triggerDownload(fileName: string, dataUrl: string) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function sanitizeFileName(value: string): string {
  return value.replace(/[^a-z0-9-_]/gi, '-');
}

