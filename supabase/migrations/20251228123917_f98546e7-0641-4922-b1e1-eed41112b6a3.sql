-- Mettre à jour les URLs soundhelix dans music_history vers des URLs archive.org fonctionnelles
UPDATE music_history 
SET track_url = 'https://ia800905.us.archive.org/19/items/FREE_background_music_dridge/Kevin_MacLeod_-_Waltz_of_the_Flowers_-_Tchaikovsky.mp3'
WHERE track_url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

UPDATE music_history 
SET track_url = 'https://ia800905.us.archive.org/19/items/FREE_background_music_dridge/Kevin_MacLeod_-_Gymnopedie_No_1.mp3'
WHERE track_url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3';

UPDATE music_history 
SET track_url = 'https://ia800905.us.archive.org/19/items/FREE_background_music_dridge/Kevin_MacLeod_-_Canon_in_D.mp3'
WHERE track_url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3';

UPDATE music_history 
SET track_url = 'https://ia800905.us.archive.org/19/items/FREE_background_music_dridge/Kevin_MacLeod_-_Serenade.mp3'
WHERE track_url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3';

-- Mettre à jour toutes les autres URLs soundhelix restantes
UPDATE music_history 
SET track_url = 'https://ia800905.us.archive.org/19/items/FREE_background_music_dridge/Kevin_MacLeod_-_Waltz_of_the_Flowers_-_Tchaikovsky.mp3'
WHERE track_url LIKE '%soundhelix%';