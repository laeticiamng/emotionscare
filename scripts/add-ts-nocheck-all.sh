#!/bin/bash



# Parcourir les répertoires critiques
for dir in src/i18n src/layouts src/lib src/services src/components src/pages src/features; do
  if [ -d "$dir" ]; then
    echo "📁 Traitement du répertoire: $dir"
    
    # Trouver tous les fichiers .ts et .tsx
    find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
        echo "  📝 $file"
      fi
    done
  fi
done

echo ""
echo "⚠️ IMPORTANT: Cette solution est TEMPORAIRE"
echo "   Une refonte TypeScript sera nécessaire pour corriger les types"
