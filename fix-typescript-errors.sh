#!/bin/bash

echo "🔧 Correction automatique des erreurs TypeScript..."

count=0
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.d.ts" | while read -r file; do
    mv "$file.tmp" "$file"
    echo "✅ $file"
    count=$((count + 1))
  fi
done

echo ""
echo "✅ Terminé! Tous les fichiers TypeScript ont été corrigés."
echo "📊 Fichiers TypeScript dans src/:"
find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.d.ts" | wc -l
