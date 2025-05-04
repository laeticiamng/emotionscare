
// Helper function to extract YouTube video ID from URL
export const extractYoutubeID = (url: string): string => {
  // Handle URLs like https://www.youtube.com/embed/BHACKCNDMW8
  if (url.includes('/embed/')) {
    return url.split('/embed/')[1];
  }
  
  // Handle standard YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : '';
};
