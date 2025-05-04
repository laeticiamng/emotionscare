
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

// Function to build YouTube embed URL with parameters
export const buildYoutubeEmbedUrl = (
  videoId: string, 
  options: {
    autoplay?: boolean;
    controls?: boolean;
    mute?: boolean;
    loop?: boolean;
    showInfo?: boolean;
    rel?: boolean;
  } = {}
): string => {
  if (!videoId) return '';
  
  const defaultOptions = {
    autoplay: false,
    controls: true,
    mute: false,
    loop: false,
    showInfo: true,
    rel: false, // Don't show related videos
  };
  
  const params = { ...defaultOptions, ...options };
  
  const queryParams = [
    params.autoplay ? 'autoplay=1' : '',
    params.controls ? '' : 'controls=0',
    params.mute ? 'mute=1' : '',
    params.loop ? 'loop=1' : '',
    params.showInfo ? '' : 'showinfo=0',
    params.rel ? '' : 'rel=0',
    'enablejsapi=1', // Enable JavaScript API
  ].filter(Boolean).join('&');
  
  return `https://www.youtube.com/embed/${videoId}${queryParams ? '?' + queryParams : ''}`;
};
