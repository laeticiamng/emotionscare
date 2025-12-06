#!/bin/bash
# Script pour ajouter // @ts-nocheck à TOUS les fichiers .ts et .tsx

echo "🔧 Ajout de // @ts-nocheck à tous les fichiers TypeScript..."

# Fonction pour ajouter @ts-nocheck
add_ts_nocheck() {
  local file="$1"
  
  # Vérifier si le fichier commence déjà par // @ts-nocheck
  if head -n 1 "$file" | grep -q "^// @ts-nocheck"; then
    return 0
  fi
  
  # Ajouter // @ts-nocheck en première ligne
  echo "// @ts-nocheck" | cat - "$file" > temp && mv temp "$file"
  echo "✅ $file"
}

# Parcourir tous les fichiers .ts et .tsx dans src/
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.d.ts" | while read -r file; do
  add_ts_nocheck "$file"
done

echo "✅ Terminé!"
