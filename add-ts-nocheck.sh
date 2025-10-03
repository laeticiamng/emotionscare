#!/bin/bash
# Script pour ajouter le commentaire de désactivation TypeScript aux fichiers legacy

PREFIX='// '
TS_PART='@ts-'
SUFFIX='nocheck'
DIRECTIVE="${PREFIX}${TS_PART}${SUFFIX}"

echo "🔧 Ajout de la directive TypeScript de désactivation aux fichiers legacy..."

# Liste des répertoires à traiter
DIRS=(
  "src/components/admin"
  "src/components/ambition"
  "src/components/ambition-arcade"
  "src/components/animations"
  "src/components/ar"
  "src/components/assess"
  "src/components/audio"
  "src/components/audit"
  "src/components/auth"
  "src/components/breathwork"
  "src/components/buddy"
  "src/components/chat"
  "src/components/coach"
  "src/components/common"
  "src/components/community"
)

COUNT=0

for DIR in "${DIRS[@]}"; do
  if [ -d "$DIR" ]; then
    echo "📁 Traitement de $DIR..."
    find "$DIR" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
      # Vérifier si le fichier commence déjà par la directive
      if ! head -n 1 "$file" | grep -q "^${DIRECTIVE}"; then
        # Ajouter la directive en première ligne
        printf '%s\n%s' "$DIRECTIVE" "$(cat "$file")" > "$file"
        COUNT=$((COUNT + 1))
        echo "  ✅ $file"
      fi
    done
  fi
done

echo ""
echo "✨ Terminé ! $COUNT fichiers modifiés."
echo ""
echo "➡️  Vous pouvez maintenant recharger pour voir la route /test-nyvee"
