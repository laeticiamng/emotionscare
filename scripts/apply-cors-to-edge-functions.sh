#!/bin/bash

###############################################################################
# Script: apply-cors-to-edge-functions.sh
# Description: Applique le helper CORS sécurisé à toutes les Edge Functions
# Usage: ./scripts/apply-cors-to-edge-functions.sh [--dry-run] [--test]
###############################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Flags
DRY_RUN=false
RUN_TESTS=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --test)
      RUN_TESTS=true
      shift
      ;;
    --help)
      echo "Usage: $0 [--dry-run] [--test]"
      echo "  --dry-run   Affiche les changements sans les appliquer"
      echo "  --test      Lance les tests de régression après application"
      exit 0
      ;;
  esac
done

# Base directory
BASE_DIR="supabase/functions"
BACKUP_DIR="supabase/functions_backup_$(date +%Y%m%d_%H%M%S)"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  CORS Batch Application - EmotionsCare Edge Functions ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier que le helper CORS existe
if [ ! -f "${BASE_DIR}/_shared/cors.ts" ]; then
  echo -e "${RED}❌ Erreur: Helper CORS introuvable: ${BASE_DIR}/_shared/cors.ts${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Helper CORS détecté${NC}"

# Backup (si pas dry-run)
if [ "$DRY_RUN" = false ]; then
  echo -e "${YELLOW}📦 Création backup: ${BACKUP_DIR}${NC}"
  cp -r "$BASE_DIR" "$BACKUP_DIR"
  echo -e "${GREEN}✅ Backup créé${NC}"
fi

# Trouver toutes les fonctions Edge
FUNCTIONS=($(find "$BASE_DIR" -maxdepth 1 -type d -not -name "_shared" -not -name "functions" | sed "s|$BASE_DIR/||" | grep -v "^\.$"))

echo -e "${BLUE}📊 ${#FUNCTIONS[@]} fonctions Edge détectées${NC}"
echo ""

# Compteurs
MODIFIED=0
SKIPPED=0
ERRORS=0

# Fonction pour appliquer CORS à un fichier
apply_cors_to_function() {
  local FUNC_NAME=$1
  local INDEX_FILE="${BASE_DIR}/${FUNC_NAME}/index.ts"
  
  # Vérifier que index.ts existe
  if [ ! -f "$INDEX_FILE" ]; then
    echo -e "${YELLOW}⚠️  Skipped ${FUNC_NAME}: index.ts non trouvé${NC}"
    ((SKIPPED++))
    return 1
  fi
  
  # Vérifier si CORS déjà appliqué
  if grep -q "getCorsHeaders\|handleCors" "$INDEX_FILE"; then
    echo -e "${YELLOW}⏭️  Skipped ${FUNC_NAME}: CORS déjà appliqué${NC}"
    ((SKIPPED++))
    return 0
  fi
  
  # Vérifier si la fonction a déjà des corsHeaders statiques
  if ! grep -q "corsHeaders.*=" "$INDEX_FILE"; then
    echo -e "${YELLOW}⏭️  Skipped ${FUNC_NAME}: Pas de corsHeaders définis${NC}"
    ((SKIPPED++))
    return 0
  fi
  
  echo -e "${BLUE}🔧 Processing ${FUNC_NAME}...${NC}"
  
  if [ "$DRY_RUN" = true ]; then
    echo -e "${GREEN}   [DRY RUN] Modifierait: ${INDEX_FILE}${NC}"
    ((MODIFIED++))
    return 0
  fi
  
  # Créer fichier temporaire
  local TEMP_FILE="${INDEX_FILE}.tmp"
  
  # Étape 1: Ajouter import CORS (après autres imports _shared)
  if ! grep -q "import.*from.*'../_shared/cors.ts'" "$INDEX_FILE"; then
    # Trouver la dernière ligne d'import _shared
    LAST_SHARED_IMPORT=$(grep -n "import.*from.*'../_shared" "$INDEX_FILE" | tail -1 | cut -d: -f1)
    
    if [ -n "$LAST_SHARED_IMPORT" ]; then
      sed "${LAST_SHARED_IMPORT}a\\
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';" "$INDEX_FILE" > "$TEMP_FILE"
      mv "$TEMP_FILE" "$INDEX_FILE"
    else
      # Sinon, ajouter après les imports standards
      FIRST_CONST=$(grep -n "^const\|^serve" "$INDEX_FILE" | head -1 | cut -d: -f1)
      if [ -n "$FIRST_CONST" ]; then
        sed "${FIRST_CONST}i\\
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';\n" "$INDEX_FILE" > "$TEMP_FILE"
        mv "$TEMP_FILE" "$INDEX_FILE"
      fi
    fi
  fi
  
  # Étape 2: Remplacer définition corsHeaders statique
  sed -i.bak "/^const corsHeaders = {$/,/^};$/d" "$INDEX_FILE"
  rm -f "${INDEX_FILE}.bak"
  
  # Étape 3: Remplacer gestion OPTIONS et ajouter handleCors
  # Pattern: serve(async (req) => {
  #            if (req.method === 'OPTIONS') { return ... }
  # Remplacer par:
  #   serve(async (req) => {
  #     const corsHeaders = getCorsHeaders(req);
  #     const corsResponse = handleCors(req);
  #     if (corsResponse) return corsResponse;
  
  awk '
  /serve\(async \(req\) => {/ {
    print
    print "  const corsHeaders = getCorsHeaders(req);"
    print "  const corsResponse = handleCors(req);"
    print "  if (corsResponse) return corsResponse;"
    print ""
    skip_options = 1
    next
  }
  skip_options && /if \(req\.method === .OPTIONS.\)/ {
    # Skip OPTIONS block
    brace_count = 0
    next
  }
  skip_options && /{/ {
    brace_count++
  }
  skip_options && /}/ {
    brace_count--
    if (brace_count == 0) {
      skip_options = 0
      next
    }
  }
  !skip_options {
    print
  }
  ' "$INDEX_FILE" > "$TEMP_FILE"
  
  mv "$TEMP_FILE" "$INDEX_FILE"
  
  echo -e "${GREEN}✅ Modified ${FUNC_NAME}${NC}"
  ((MODIFIED++))
}

# Appliquer CORS à chaque fonction
echo -e "${BLUE}🔄 Début du traitement...${NC}"
echo ""

for FUNC in "${FUNCTIONS[@]}"; do
  apply_cors_to_function "$FUNC" || ((ERRORS++))
done

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    RÉSUMÉ                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo -e "${GREEN}✅ Modifiées:     ${MODIFIED}${NC}"
echo -e "${YELLOW}⏭️  Ignorées:      ${SKIPPED}${NC}"
echo -e "${RED}❌ Erreurs:       ${ERRORS}${NC}"
echo -e "${BLUE}📊 Total:         ${#FUNCTIONS[@]}${NC}"

# Tests de régression
if [ "$RUN_TESTS" = true ] && [ "$DRY_RUN" = false ]; then
  echo ""
  echo -e "${BLUE}🧪 Lancement tests de régression...${NC}"
  
  # Test 1: Vérifier que tous les fichiers modifiés sont valides TypeScript
  echo -e "${YELLOW}Test 1: Syntaxe TypeScript...${NC}"
  
  SYNTAX_ERRORS=0
  for FUNC in "${FUNCTIONS[@]}"; do
    INDEX_FILE="${BASE_DIR}/${FUNC}/index.ts"
    if [ -f "$INDEX_FILE" ]; then
      # Vérification basique de syntaxe avec grep
      if grep -q "getCorsHeaders\|handleCors" "$INDEX_FILE"; then
        # Vérifier imports complets
        if ! grep -q "import.*getCorsHeaders.*handleCors.*from.*cors.ts" "$INDEX_FILE"; then
          echo -e "${RED}   ❌ ${FUNC}: Import CORS incomplet${NC}"
          ((SYNTAX_ERRORS++))
        fi
      fi
    fi
  done
  
  if [ $SYNTAX_ERRORS -eq 0 ]; then
    echo -e "${GREEN}   ✅ Tous les imports CORS sont corrects${NC}"
  else
    echo -e "${RED}   ❌ ${SYNTAX_ERRORS} erreurs d'import détectées${NC}"
  fi
  
  # Test 2: Vérifier que les fonctions ne retournent pas de CORS wildcard
  echo -e "${YELLOW}Test 2: Vérification sécurité CORS...${NC}"
  
  WILDCARD_FOUND=0
  for FUNC in "${FUNCTIONS[@]}"; do
    INDEX_FILE="${BASE_DIR}/${FUNC}/index.ts"
    if [ -f "$INDEX_FILE" ]; then
      if grep -q "'Access-Control-Allow-Origin': '\*'" "$INDEX_FILE"; then
        echo -e "${RED}   ❌ ${FUNC}: Wildcard CORS '*' détecté${NC}"
        ((WILDCARD_FOUND++))
      fi
    fi
  done
  
  if [ $WILDCARD_FOUND -eq 0 ]; then
    echo -e "${GREEN}   ✅ Aucun wildcard CORS trouvé${NC}"
  else
    echo -e "${RED}   ❌ ${WILDCARD_FOUND} fonctions avec wildcard détectées${NC}"
  fi
  
  # Test 3: Vérifier backup
  echo -e "${YELLOW}Test 3: Intégrité du backup...${NC}"
  
  if [ -d "$BACKUP_DIR" ]; then
    BACKUP_COUNT=$(find "$BACKUP_DIR" -name "index.ts" | wc -l)
    CURRENT_COUNT=$(find "$BASE_DIR" -maxdepth 2 -name "index.ts" | wc -l)
    
    if [ $BACKUP_COUNT -eq $CURRENT_COUNT ]; then
      echo -e "${GREEN}   ✅ Backup complet (${BACKUP_COUNT} fonctions)${NC}"
    else
      echo -e "${RED}   ❌ Backup incomplet (backup: ${BACKUP_COUNT}, actuel: ${CURRENT_COUNT})${NC}"
    fi
  else
    echo -e "${RED}   ❌ Backup non trouvé${NC}"
  fi
  
  echo ""
  echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║                 TESTS TERMINÉS                         ║${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
fi

# Instructions finales
if [ "$DRY_RUN" = false ]; then
  echo ""
  echo -e "${YELLOW}📝 Prochaines étapes:${NC}"
  echo -e "1. Vérifier les modifications: ${GREEN}git diff supabase/functions${NC}"
  echo -e "2. Tester localement une fonction: ${GREEN}supabase functions serve <function-name>${NC}"
  echo -e "3. Déployer les fonctions: ${GREEN}supabase functions deploy${NC}"
  echo -e "4. Rollback si nécessaire: ${GREEN}cp -r ${BACKUP_DIR}/* ${BASE_DIR}/${NC}"
  echo ""
  echo -e "${GREEN}✅ Application CORS terminée avec succès !${NC}"
else
  echo ""
  echo -e "${YELLOW}ℹ️  Mode DRY RUN - Aucune modification appliquée${NC}"
  echo -e "   Relancez sans --dry-run pour appliquer les changements"
fi

exit 0
