
// Fix the convertMusicPlaylistToPlaylist function
export const convertPlaylistToMusicPlaylist = (playlist: Playlist): MusicPlaylist => ({
  id: playlist.id,
  name: playlist.name,
  description: '', // Add required description
  coverUrl: '',
  emotion: playlist.emotion,
  tracks: playlist.tracks.map(convertTrackToMusicTrack)
});
