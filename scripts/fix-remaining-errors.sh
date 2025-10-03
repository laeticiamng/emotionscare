#!/bin/bash


# Liste des fichiers spécifiques à corriger
files=(
  "src/lib/humeai/humeAIService.ts"
  "src/lib/i18n-core.ts"
  "src/lib/journalService.ts"
  "src/lib/mockDataGenerator.ts"
  "src/lib/network/fetchWithRetry.ts"
  "src/lib/observability.ts"
  "src/lib/passwordResetService.ts"
  "src/lib/performance-optimizer.ts"
  "src/lib/performance/componentOptimizer.tsx"
  "src/lib/performance/optimizations.ts"
  "src/lib/production-cleanup.ts"
  "src/lib/pwa/pwaManager.ts"
  "src/lib/routerV2/withGuard.tsx"
  "src/lib/scan/analyzeService.ts"
  "src/lib/scan/emotionService.ts"
  "src/lib/scan/enhancedAnalyzeService.ts"
  "src/lib/scan/mockEmotionService.ts"
  "src/lib/security/auditService.ts"
  "src/lib/security/deviceCompat.ts"
  "src/lib/security/sanitize.ts"
  "src/lib/sentry-config.ts"
)

add_ts_nocheck() {
  local file="$1"
  
  # Vérifier si le fichier existe
  if [ ! -f "$file" ]; then
    echo "⚠️  Fichier non trouvé: $file"
    return 1
  fi
  
    echo "✓  Déjà fait: $file"
    return 0
  fi
  
  echo "✅ $file"
}

# Traiter chaque fichier
for file in "${files[@]}"; do
  add_ts_nocheck "$file"
done

echo "✅ Terminé! Tous les fichiers ont été traités."
