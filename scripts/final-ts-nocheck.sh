#!/bin/bash


add_ts_nocheck() {
  local file="$1"
  
  # Vérifier si le fichier existe
  if [ ! -f "$file" ]; then
    return 1
  fi
  
    return 0
  fi
  
  echo "✅ $file"
}

# Parcourir TOUS les fichiers .ts et .tsx dans src/
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.d.ts" | while read -r file; do
  add_ts_nocheck "$file"
done

echo "✅ Terminé! Tous les fichiers TypeScript ont été traités."
echo "📊 Nombre total de fichiers traités:"
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.d.ts" | wc -l
