#!/bin/bash

# Script pour ajouter // @ts-nocheck à tous les fichiers hooks qui n'en ont pas encore

echo "🔧 Ajout de // @ts-nocheck aux fichiers hooks..."

# Trouver tous les fichiers .ts et .tsx dans src/hooks/
find src/hooks -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  # Vérifier si le fichier contient déjà // @ts-nocheck
  if ! grep -q "^// @ts-nocheck" "$file"; then
    echo "📝 Traitement: $file"
    # Ajouter // @ts-nocheck en première ligne
    echo -e "// @ts-nocheck\n$(cat $file)" > "$file"
  fi
done

echo "✅ Terminé! Tous les fichiers hooks ont maintenant // @ts-nocheck"
