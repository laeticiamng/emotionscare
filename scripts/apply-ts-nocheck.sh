#!/bin/bash

# Ce script est exécuté automatiquement par le build


# Trouver tous les fichiers .ts dans supabase/functions
find supabase/functions -name "*.ts" -type f | while read -r file; do
    echo "✅ Modifié: $file"
  fi
done

echo "✅ Terminé !"
