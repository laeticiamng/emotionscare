-- Nettoyer les tracks en pending (jamais terminés)
DELETE FROM generated_music_tracks 
WHERE generation_status = 'pending';