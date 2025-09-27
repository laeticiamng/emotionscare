BEGIN;
SELECT plan(6);

-- Echo-Crystal
INSERT INTO echo_crystal
  (user_id_hash, joy_idx, arousal_voice, laugh_db, laugh_pitch,
   crystal_type, color_hex, sparkle_level)
VALUES ('hashE', 0.8, 0.4, 65, 250, 'gem', '#FF88CC', 0.8);

SELECT ok((SELECT genuine_flag FROM echo_crystal WHERE user_id_hash='hashE'), 'genuine laugh flag set');
SELECT is((SELECT pos_affect FROM echo_crystal WHERE user_id_hash='hashE'), 0.8, 'PA proxy set');

-- Bubble-Beat depth
INSERT INTO bb_chain (user_id_hash) VALUES ('hashB') RETURNING id INTO STRICT _p;
INSERT INTO bb_chain (user_id_hash, parent_id) VALUES ('hashB', _p);

SELECT is((SELECT depth FROM bb_chain ORDER BY ts DESC LIMIT 1), 1, 'depth +1');

-- Neon-Challenge mvpa + streak
INSERT INTO neon_challenge (user_id_hash, steps, km) VALUES ('hashN', 3000, 2.4);
SELECT ok((SELECT mvpa_min > 0 FROM neon_challenge WHERE user_id_hash='hashN'), 'mvpa filled');

SELECT finish();
ROLLBACK;
