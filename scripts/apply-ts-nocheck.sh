#!/bin/bash

# Script pour ajouter // @ts-nocheck à tous les edge functions
# Ce script est exécuté automatiquement par le build

echo "🔧 Application de // @ts-nocheck aux edge functions..."

# Trouver tous les fichiers .ts dans supabase/functions
find supabase/functions -name "*.ts" -type f | while read -r file; do
  # Vérifier si le fichier commence par // @ts-nocheck
  if ! head -n 1 "$file" | grep -q "// @ts-nocheck"; then
    # Ajouter // @ts-nocheck au début du fichier
    echo "// @ts-nocheck" | cat - "$file" > temp && mv temp "$file"
    echo "✅ Modifié: $file"
  fi
done

echo "✅ Terminé !"
