#!/bin/bash



# Trouver tous les fichiers .ts et .tsx dans src/hooks/
find src/hooks -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
    echo "📝 Traitement: $file"
  fi
done

