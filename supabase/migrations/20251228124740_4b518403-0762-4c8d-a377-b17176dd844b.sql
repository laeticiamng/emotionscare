-- Mise à jour des URLs audio dans music_history vers des URLs Pixabay CDN fiables
UPDATE music_history
SET track_url = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
WHERE track_url LIKE '%archive.org%Waltz%' OR track_url LIKE '%archive.org%' AND track_id = 'vinyl-1';

UPDATE music_history
SET track_url = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3'
WHERE track_url LIKE '%archive.org%Gymnopedie%' OR (track_url LIKE '%archive.org%' AND track_id = 'vinyl-2');

UPDATE music_history
SET track_url = 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3'
WHERE track_url LIKE '%archive.org%Canon%' OR (track_url LIKE '%archive.org%' AND track_id = 'vinyl-3');

UPDATE music_history
SET track_url = 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3'
WHERE track_url LIKE '%archive.org%Serenade%' OR (track_url LIKE '%archive.org%' AND track_id = 'vinyl-4');

-- Nettoyer toutes les URLs archive.org restantes
UPDATE music_history
SET track_url = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
WHERE track_url LIKE '%archive.org%';