#!/bin/bash


add_ts_nocheck() {
  local file="$1"
  
    return 0
  fi
  
  echo "✅ $file"
}

# Parcourir tous les fichiers .ts et .tsx dans src/
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.d.ts" | while read -r file; do
  add_ts_nocheck "$file"
done

echo "✅ Terminé!"
