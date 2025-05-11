
export function safeOpen(url: string, target: string = '_blank') {
  // Safely open a URL in a new tab/window
  const safeUrl = url.startsWith('http') ? url : `https://${url}`;
  window.open(safeUrl, target, 'noopener,noreferrer');
}
