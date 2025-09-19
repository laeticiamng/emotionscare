-- ===========================================
-- VALIDATIONS COUVERTURE & INTÉGRITÉ (D.1)
-- Retourne des lignes SEULEMENT si anomalie
-- ===========================================

-- A. Comptage items (attendu : 367)
WITH total AS (
  SELECT COUNT(*) AS n FROM public.items
)
SELECT 'A_TOTAL_ITEMS_NOT_367' AS code, n AS observed, 367 AS expected
FROM total WHERE n <> 367;

-- B. Items sans AUCUNE compétence
SELECT 'B_ITEM_WITHOUT_ANY_COMPETENCE' AS code, i.id AS item_id, i.slug
FROM public.items i
LEFT JOIN public.item_competences c ON c.item_id = i.id
GROUP BY i.id, i.slug
HAVING COUNT(c.id) = 0;

-- C. Items sans Rang A OU sans Rang B (signale les trous de couverture)
SELECT 'C_ITEM_MISSING_A_OR_B' AS code, i.id AS item_id, i.slug,
  SUM((c.rang='A')::int) AS a_count,
  SUM((c.rang='B')::int) AS b_count
FROM public.items i
LEFT JOIN public.item_competences c ON c.item_id = i.id
GROUP BY i.id, i.slug
HAVING SUM((c.rang='A')::int)=0 OR SUM((c.rang='B')::int)=0;

-- D. Duplicats de slug (doit être unique)
SELECT 'D_DUPLICATE_ITEM_SLUG' AS code, slug, COUNT(*) AS cnt
FROM public.items
GROUP BY slug
HAVING COUNT(*) > 1;

-- E. Tracks incomplets (owner_id / item_id / mode / style manquants)
SELECT 'E_INCOMPLETE_TRACK_FIELDS' AS code, id AS track_id, owner_id, item_id, mode, style
FROM public.generated_music_tracks
WHERE owner_id IS NULL OR item_id IS NULL OR mode IS NULL OR style IS NULL;

-- F. Tracks orphelins (item_id qui ne correspond à aucun item)
SELECT 'F_ORPHAN_TRACK_ITEM' AS code, t.id AS track_id, t.item_id
FROM public.generated_music_tracks t
LEFT JOIN public.items i ON i.id = t.item_id
WHERE i.id IS NULL;

-- G. Segments invalides (timecode non croissant)
SELECT 'G_INVALID_SEG_TIMECODE' AS code, id AS segment_id, track_id, idx, start_ms, end_ms
FROM public.lyrics_segments
WHERE end_ms <= start_ms;

-- H. Duplicats d’index `(track_id, idx)`
SELECT 'H_DUP_SEG_IDX' AS code, track_id, idx, COUNT(*) AS cnt
FROM public.lyrics_segments
GROUP BY track_id, idx
HAVING COUNT(*) > 1;

-- I. Segments orphelins (track_id inconnu)
SELECT 'I_ORPHAN_SEG_TRACK' AS code, s.id AS segment_id, s.track_id
FROM public.lyrics_segments s
LEFT JOIN public.generated_music_tracks t ON t.id = s.track_id
WHERE t.id IS NULL;

-- J. Segments vs item (cohérence item_id)
SELECT 'J_SEG_ITEM_MISMATCH' AS code, s.id AS segment_id, s.track_id, s.item_id AS seg_item_id, t.item_id AS track_item_id
FROM public.lyrics_segments s
JOIN public.generated_music_tracks t ON t.id = s.track_id
WHERE s.item_id <> t.item_id;

-- K. Statut de track invalide (si check pas déjà en contrainte)
SELECT 'K_TRACK_STATUS_INVALID' AS code, id AS track_id, status
FROM public.generated_music_tracks
WHERE status NOT IN ('pending','processing','ready','failed');

-- L. Mode invalide (si la colonne n’utilise pas l’enum 'music_mode')
SELECT 'L_TRACK_MODE_INVALID' AS code, id AS track_id, mode::text
FROM public.generated_music_tracks
WHERE mode::text NOT IN ('A','B','AB');

-- M. Segments vides (text manquant ou vide)
SELECT 'M_EMPTY_SEG_TEXT' AS code, id AS segment_id, track_id, idx
FROM public.lyrics_segments
WHERE text IS NULL OR length(trim(text)) = 0;

-- N. Résumé utile (ne fait pas échouer, juste info si besoin)
-- SELECT 'N_INFO_COUNTS' AS code,
--   (SELECT COUNT(*) FROM public.items) AS items,
--   (SELECT COUNT(*) FROM public.item_competences) AS competences,
--   (SELECT COUNT(*) FROM public.generated_music_tracks) AS tracks,
--   (SELECT COUNT(*) FROM public.lyrics_segments) AS segments;

-- Interprétation : SI la requête ne retourne AUCUNE ligne, c’est “tout bon”.
-- Toute ligne retournée est une anomalie à corriger (code en première colonne).
