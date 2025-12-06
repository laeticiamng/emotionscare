-- Activer le realtime pour la table music_generation_queue
-- Ceci permet aux utilisateurs de recevoir des notifications en temps réel
-- quand leur génération musicale est terminée

-- 1. Activer REPLICA IDENTITY FULL pour capturer les anciennes valeurs
ALTER TABLE public.music_generation_queue REPLICA IDENTITY FULL;

-- 2. Ajouter la table à la publication supabase_realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.music_generation_queue;

-- Vérification
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'music_generation_queue';