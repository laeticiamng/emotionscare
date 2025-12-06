// @ts-nocheck

// Presets EmotionsCare - 80 humeurs optimisées
export interface EmotionsCarePreset {
  tag: string;
  style: string;
  prompt: string;
}

export const EMOTIONSCARE_PRESETS: EmotionsCarePreset[] = [
  // Émotions positives
  { tag: "happy upbeat", style: "pop-funk 120 BPM", prompt: "happy upbeat pop-funk with energetic drums and funky bass" },
  { tag: "joyful cheerful", style: "indie-pop 110 BPM", prompt: "joyful cheerful indie-pop with bright melodies and uplifting vocals" },
  { tag: "excited energetic", style: "electronic dance 128 BPM", prompt: "excited energetic electronic dance with pulsing beats" },
  { tag: "optimistic bright", style: "acoustic folk 100 BPM", prompt: "optimistic bright acoustic folk with warm guitar and harmony" },
  { tag: "euphoric blissful", style: "trance 132 BPM", prompt: "euphoric blissful trance with soaring synths and emotional build-ups" },
  
  // Émotions calmes
  { tag: "calm peaceful", style: "ambient 70 BPM", prompt: "calm peaceful ambient with soft pads and gentle textures" },
  { tag: "relaxed serene", style: "lo-fi 80 BPM", prompt: "relaxed serene lo-fi with mellow beats and nostalgic vinyl warmth" },
  { tag: "meditative zen", style: "new age 60 BPM", prompt: "meditative zen new age with flowing water sounds and soft flutes" },
  { tag: "tranquil soothing", style: "classical 65 BPM", prompt: "tranquil soothing classical with gentle strings and piano" },
  { tag: "sleepy drowsy", style: "ambient drone 50 BPM", prompt: "sleepy drowsy ambient drone with deep slow waves" },
  
  // Émotions mélancoliques
  { tag: "sad melancholic", style: "piano ballad 70 BPM", prompt: "sad melancholic piano ballad with emotional vocals and minor keys" },
  { tag: "nostalgic wistful", style: "indie folk 85 BPM", prompt: "nostalgic wistful indie folk with acoustic guitar and soft strings" },
  { tag: "lonely solitude", style: "minimal piano 60 BPM", prompt: "lonely solitude minimal piano with sparse notes and reverb" },
  { tag: "heartbroken sorrowful", style: "blues 75 BPM", prompt: "heartbroken sorrowful blues with crying guitar and deep vocals" },
  { tag: "grief mourning", style: "requiem 55 BPM", prompt: "grief mourning requiem with choir and somber orchestration" },
  
  // Émotions intenses
  { tag: "angry furious", style: "metal 140 BPM", prompt: "angry furious metal with heavy guitars and aggressive drums" },
  { tag: "frustrated annoyed", style: "grunge 95 BPM", prompt: "frustrated annoyed grunge with distorted vocals and raw energy" },
  { tag: "passionate intense", style: "rock 115 BPM", prompt: "passionate intense rock with driving rhythm and powerful vocals" },
  { tag: "determined strong", style: "epic orchestral 100 BPM", prompt: "determined strong epic orchestral with heroic themes" },
  { tag: "rebellious defiant", style: "punk 150 BPM", prompt: "rebellious defiant punk with fast drums and shouted vocals" },
  
  // Émotions complexes
  { tag: "anxious worried", style: "dark ambient 90 BPM", prompt: "anxious worried dark ambient with tension and unresolved harmonies" },
  { tag: "hopeful inspiring", style: "cinematic 85 BPM", prompt: "hopeful inspiring cinematic with rising strings and emotional peaks" },
  { tag: "confused uncertain", style: "experimental 75 BPM", prompt: "confused uncertain experimental with irregular rhythms and dissonance" },
  { tag: "contemplative thoughtful", style: "jazz 90 BPM", prompt: "contemplative thoughtful jazz with soft saxophone and walking bass" },
  { tag: "bittersweet mixed", style: "indie rock 95 BPM", prompt: "bittersweet mixed indie rock with major-minor progressions" },
  
  // Émotions sociales
  { tag: "love romantic", style: "soul 80 BPM", prompt: "love romantic soul with warm vocals and smooth arrangements" },
  { tag: "friendship companionship", style: "folk rock 105 BPM", prompt: "friendship companionship folk rock with group vocals and acoustic guitars" },
  { tag: "empathy compassion", style: "gospel 90 BPM", prompt: "empathy compassion gospel with choir and emotional delivery" },
  { tag: "gratitude thankful", style: "acoustic 95 BPM", prompt: "gratitude thankful acoustic with fingerpicked guitar and soft vocals" },
  { tag: "pride confident", style: "hip-hop 100 BPM", prompt: "pride confident hip-hop with strong beats and assertive vocals" },
  
  // Émotions créatives
  { tag: "creative inspired", style: "art rock 110 BPM", prompt: "creative inspired art rock with experimental sounds and complex arrangements" },
  { tag: "playful whimsical", style: "indie pop 115 BPM", prompt: "playful whimsical indie pop with quirky instruments and bouncy rhythms" },
  { tag: "curious exploring", style: "world fusion 105 BPM", prompt: "curious exploring world fusion with ethnic instruments and global rhythms" },
  { tag: "wonder amazed", style: "dream pop 85 BPM", prompt: "wonder amazed dream pop with ethereal vocals and shimmering guitars" },
  { tag: "mysterious enigmatic", style: "darkwave 95 BPM", prompt: "mysterious enigmatic darkwave with haunting synths and deep bass" },
  
  // Émotions énergétiques
  { tag: "motivated driven", style: "workout 125 BPM", prompt: "motivated driven workout music with pumping beats and energizing synths" },
  { tag: "competitive fierce", style: "trap 140 BPM", prompt: "competitive fierce trap with hard-hitting drums and aggressive synths" },
  { tag: "victorious triumphant", style: "orchestral epic 110 BPM", prompt: "victorious triumphant orchestral epic with brass fanfares and timpani" },
  { tag: "adventurous bold", style: "celtic rock 120 BPM", prompt: "adventurous bold celtic rock with fiddles, pipes, and driving drums" },
  { tag: "wild free", style: "garage rock 130 BPM", prompt: "wild free garage rock with raw guitars and primal energy" },
  
  // Émotions de guérison
  { tag: "healing therapeutic", style: "sound healing 55 BPM", prompt: "healing therapeutic sound healing with crystal bowls and gentle drones" },
  { tag: "recovery renewal", style: "new age 70 BPM", prompt: "recovery renewal new age with uplifting pads and nature sounds" },
  { tag: "acceptance peace", style: "meditation 60 BPM", prompt: "acceptance peace meditation music with soft bells and flowing melodies" },
  { tag: "strength resilience", style: "post-rock 90 BPM", prompt: "strength resilience post-rock with building dynamics and emotional crescendos" },
  { tag: "transformation growth", style: "progressive 85 BPM", prompt: "transformation growth progressive with evolving themes and complex structures" },
  
  // Émotions spirituelles
  { tag: "spiritual divine", style: "sacred 75 BPM", prompt: "spiritual divine sacred music with choir and organ" },
  { tag: "transcendent elevated", style: "ambient trance 80 BPM", prompt: "transcendent elevated ambient trance with celestial pads" },
  { tag: "enlightened wise", style: "eastern 70 BPM", prompt: "enlightened wise eastern music with sitar and tabla" },
  { tag: "mystical magical", style: "fantasy 65 BPM", prompt: "mystical magical fantasy music with ethereal voices and ancient instruments" },
  { tag: "connected unity", style: "world chant 85 BPM", prompt: "connected unity world chant with group vocals and rhythm" },
  
  // Émotions de mouvement
  { tag: "dancing groove", style: "funk 115 BPM", prompt: "dancing groove funk with tight rhythm section and horn stabs" },
  { tag: "flowing graceful", style: "waltz 90 BPM", prompt: "flowing graceful waltz with strings and elegant melodies" },
  { tag: "marching steady", style: "military 100 BPM", prompt: "marching steady military with snare drums and brass" },
  { tag: "floating weightless", style: "ambient house 120 BPM", prompt: "floating weightless ambient house with soft four-on-the-floor beats" },
  { tag: "running rushing", style: "drum and bass 175 BPM", prompt: "running rushing drum and bass with fast breakbeats and deep sub-bass" },
  
  // Émotions temporelles
  { tag: "morning awakening", style: "acoustic sunrise 95 BPM", prompt: "morning awakening acoustic sunrise with bird sounds and gentle guitar" },
  { tag: "midday bright", style: "pop rock 110 BPM", prompt: "midday bright pop rock with sunny melodies and upbeat rhythm" },
  { tag: "evening calm", style: "jazz lounge 85 BPM", prompt: "evening calm jazz lounge with soft piano and brushed drums" },
  { tag: "night dreamy", style: "synthwave 80 BPM", prompt: "night dreamy synthwave with nostalgic synths and neon atmosphere" },
  { tag: "dawn hopeful", style: "folk 90 BPM", prompt: "dawn hopeful folk with acoustic guitar and optimistic vocals" },
  
  // Émotions saisonnières
  { tag: "spring renewal", style: "indie folk 100 BPM", prompt: "spring renewal indie folk with fresh melodies and nature imagery" },
  { tag: "summer vibrant", style: "reggae 95 BPM", prompt: "summer vibrant reggae with tropical rhythms and steel drums" },
  { tag: "autumn nostalgic", style: "alternative 90 BPM", prompt: "autumn nostalgic alternative with mellow guitars and contemplative lyrics" },
  { tag: "winter cozy", style: "acoustic ballad 70 BPM", prompt: "winter cozy acoustic ballad with warm tones and intimate vocals" },
  { tag: "rainy melancholic", style: "shoegaze 85 BPM", prompt: "rainy melancholic shoegaze with reverb-drenched guitars and dreamy vocals" },
  
  // Émotions de travail
  { tag: "focused productive", style: "minimal techno 125 BPM", prompt: "focused productive minimal techno with steady pulse and subtle progression" },
  { tag: "creative flow", style: "ambient electronica 90 BPM", prompt: "creative flow ambient electronica with inspiring pads and gentle beats" },
  { tag: "stressed overwhelmed", style: "industrial 110 BPM", prompt: "stressed overwhelmed industrial with mechanical sounds and tense atmosphere" },
  { tag: "accomplished satisfied", style: "uplifting house 122 BPM", prompt: "accomplished satisfied uplifting house with positive energy and driving beat" },
  { tag: "break relaxation", style: "chill out 75 BPM", prompt: "break relaxation chill out with smooth grooves and laid-back vibes" },
  
  // Émotions par défaut
  { tag: "neutral balanced", style: "ambient pop 100 BPM", prompt: "neutral balanced ambient pop with moderate energy and pleasant melodies" },
  { tag: "unknown mixed", style: "experimental 85 BPM", prompt: "unknown mixed experimental with diverse elements and open interpretation" },
  { tag: "default calm", style: "soft rock 95 BPM", prompt: "default calm soft rock with gentle dynamics and accessible melodies" },
  { tag: "generic pleasant", style: "easy listening 90 BPM", prompt: "generic pleasant easy listening with smooth arrangements and comfortable tempo" },
  { tag: "adaptive flexible", style: "neo-soul 95 BPM", prompt: "adaptive flexible neo-soul with rich harmonies and expressive vocals" },
  
  // Émotions supplémentaires pour compléter les 80
  { tag: "surprised shocked", style: "glitch 120 BPM", prompt: "surprised shocked glitch with unexpected breaks and electronic stutters" },
  { tag: "disgusted repulsed", style: "noise 100 BPM", prompt: "disgusted repulsed noise with harsh textures and dissonant elements" },
  { tag: "fearful scared", style: "horror ambient 60 BPM", prompt: "fearful scared horror ambient with dark drones and unsettling sounds" },
  { tag: "ashamed guilty", style: "minor blues 70 BPM", prompt: "ashamed guilty minor blues with remorseful vocals and sad harmonies" },
  { tag: "envious jealous", style: "dark pop 105 BPM", prompt: "envious jealous dark pop with moody synths and conflicted emotions" },
  { tag: "bored indifferent", style: "monotone 80 BPM", prompt: "bored indifferent monotone with repetitive patterns and flat delivery" },
  { tag: "embarrassed awkward", style: "quirky indie 95 BPM", prompt: "embarrassed awkward quirky indie with off-kilter rhythms and shy vocals" },
  { tag: "overwhelmed stressed", style: "chaotic 130 BPM", prompt: "overwhelmed stressed chaotic with complex polyrhythms and dense textures" },
  { tag: "relieved liberated", style: "gospel soul 85 BPM", prompt: "relieved liberated gospel soul with uplifting choir and emotional release" },
  { tag: "anticipation eager", style: "building cinematic 95 BPM", prompt: "anticipation eager building cinematic with rising tension and expectant melodies" }
];
