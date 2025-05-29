
export const extractYoutubeID = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const formatDuration = (duration: number | string): string => {
  const numDuration = typeof duration === 'string' ? parseInt(duration) : duration;
  return `${numDuration} min`;
};
