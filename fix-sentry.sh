#!/bin/bash

# Script pour remplacer tous les appels Sentry par ai-monitoring

# Liste des fichiers à corriger
files=(
  "src/modules/ai-coach/aiCoachService.ts"
  "src/modules/ambition-arcade/ambitionArcadeService.ts"
  "src/modules/bounce-back/bounceBackService.ts"
  "src/modules/breath-constellation/BreathConstellationPage.tsx"
  "src/modules/bubble-beat/bubbleBeatService.ts"
  "src/modules/coach/CoachView.tsx"
  "src/modules/flash-glow/useFlashGlowMachine.ts"
  "src/modules/meditation/meditationService.ts"
  "src/modules/mood-mixer/MoodMixerView.tsx"
  "src/modules/nyvee/nyveeService.ts"
  "src/modules/screen-silk/ScreenSilkPage.tsx"
  "src/modules/screen-silk/screenSilkServiceUnified.ts"
  "src/modules/story-synth/storySynthService.ts"
  "src/modules/vr-nebula/vrNebulaService.ts"
  "src/pages/B2CAICoachPage.tsx"
  "src/pages/B2CScanPage.tsx"
  "src/pages/VoiceScanPage.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Remplacer Sentry.captureException par captureException
    sed -i 's/Sentry\.captureException(/captureException(/g' "$file"
    
    # Remplacer Sentry.addBreadcrumb par logger.info
    sed -i 's/Sentry\.addBreadcrumb/\/\/ logger.info/g' "$file"
    
    # Remplacer Sentry.getCurrentHub().getClient() par true
    sed -i 's/Sentry\.getCurrentHub()\.getClient()/true/g' "$file"
    
    # Remplacer Sentry.configureScope par commentaire
    sed -i 's/Sentry\.configureScope/\/\/ configureScope/g' "$file"
    
    # Remplacer Sentry.setTag par commentaire
    sed -i 's/Sentry\.setTag/\/\/ setTag/g' "$file"
    
    # Remplacer Sentry.withScope par commentaire
    sed -i 's/Sentry\.withScope/\/\/ withScope/g' "$file"
    
    echo "✓ Fixed $file"
  else
    echo "✗ File not found: $file"
  fi
done

echo ""
echo "All files processed!"
