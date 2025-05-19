# Audit des corrections Scan/Audio/Emotion

Ce document liste les ajustements réalisés sur les types et propriétés des composants liés aux scans d'émotion et à l'audio.

## Corrections principales

- Extension du type `EmotionSource` pour couvrir `live-voice`, `voice-analyzer` et `audio-processor`.
- Ajout des interfaces `VoiceEmotionScannerProps` et `VoiceEmotionAnalyzerProps`.
- Harmonisation des signatures des callbacks avec `React.Dispatch<React.SetStateAction<boolean>>` lorsque nécessaire.
- Mise à jour des props de `AudioProcessor` pour refléter les options réelles (durée, mode, etc.).
- Suppression des définitions locales de props au profit des types centralisés.

Ces changements assurent une cohérence entre les différents modules (scanner vocal, analyseur vocal, processeur audio) et facilitent leur réutilisation.
