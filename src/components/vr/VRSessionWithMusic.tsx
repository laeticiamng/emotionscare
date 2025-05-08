
// Find this line in the file:
// const currentTrack: MusicTrack = {
//   ...track,
//   audioUrl: track.url,
// };

// Replace with:
const currentTrack: MusicTrack = {
  ...track,
  audioUrl: track.url || track.audioUrl || '',
};
