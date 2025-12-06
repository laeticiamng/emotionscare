#!/bin/bash
# Script de validation de la distribution des pages

echo "=== VALIDATION DES CRITÈRES ==="
echo ""

# 1. Vérification du nombre total de pages
echo "1. Vérification du nombre total de pages:"
TOTAL_FOUND=$(find src -type f \( -name '*Page.tsx' -o -name '*page.tsx' \) \
  ! -name '*.test.tsx' \
  ! -name '*.e2e.test.tsx' \
  ! -name '*.spec.tsx' | wc -l)
echo "   Pages trouvées: $TOTAL_FOUND"

# 2. Vérification des doublons dans le JSON
echo ""
echo "2. Vérification des doublons:"
DUPLICATES=$(cat pages-distribution.json | grep -o '"src/[^"]*"' | sort | uniq -d | wc -l)
if [ "$DUPLICATES" -eq 0 ]; then
  echo "   ✓ Aucun doublon trouvé"
else
  echo "   ✗ $DUPLICATES doublons trouvés"
fi

# 3. Vérification du nombre total dans les groupes
echo ""
echo "3. Vérification du nombre total dans les groupes:"
TOTAL_IN_GROUPS=$(cat pages-distribution.json | grep -o '"src/[^"]*"' | wc -l)
echo "   Pages dans les groupes: $TOTAL_IN_GROUPS"
if [ "$TOTAL_FOUND" -eq "$TOTAL_IN_GROUPS" ]; then
  echo "   ✓ Toutes les pages sont incluses"
else
  echo "   ✗ Différence de $((TOTAL_FOUND - TOTAL_IN_GROUPS)) pages"
fi

# 4. Taille des groupes
echo ""
echo "4. Taille des groupes:"
GROUP_SIZES=""
for i in {1..10}; do
  SIZE=$(cat pages-distribution.json | jq ".groups[$((i-1))].totalPages // 0")
  echo "   Groupe $i: $SIZE pages"
  GROUP_SIZES="$GROUP_SIZES $SIZE"
done

# Vérifier l'équilibre
MAX_SIZE=$(echo $GROUP_SIZES | tr ' ' '\n' | sort -rn | head -1)
MIN_SIZE=$(echo $GROUP_SIZES | tr ' ' '\n' | grep -v '^0$' | sort -n | head -1)
DIFF=$((MAX_SIZE - MIN_SIZE))
echo ""
if [ "$DIFF" -le 5 ]; then
  echo "   ✓ Groupes équilibrés (différence max: $DIFF pages)"
else
  echo "   ⚠ Groupes déséquilibrés (différence: $DIFF pages)"
fi

# 5. Validation JSON
echo ""
echo "5. Validation JSON:"
if cat pages-distribution.json | jq -e '.verification' > /dev/null 2>&1; then
  echo "   ✓ JSON valide et vérification présente"
  ALL_INCLUDED=$(cat pages-distribution.json | jq -r '.verification.allPagesIncluded')
  NO_DUPLICATES=$(cat pages-distribution.json | jq -r '.verification.noDuplicates')
  BALANCED=$(cat pages-distribution.json | jq -r '.verification.groupSizesBalanced')

  echo "   - Toutes les pages incluses: $ALL_INCLUDED"
  echo "   - Aucun doublon: $NO_DUPLICATES"
  echo "   - Groupes équilibrés: $BALANCED"
else
  echo "   ✗ Erreur de validation JSON"
fi

echo ""
echo "=== RÉSULTAT FINAL ==="
if [ "$TOTAL_FOUND" -eq "$TOTAL_IN_GROUPS" ] && [ "$DUPLICATES" -eq 0 ] && [ "$DIFF" -le 5 ]; then
  echo "✅ Tous les critères sont remplis !"
  exit 0
else
  echo "❌ Certains critères ne sont pas remplis"
  exit 1
fi
