#!/bin/bash
# cleanup-frontend.sh
echo "🧹 Nettoyage des doublons frontend..."
rm -f src/Shell.tsx src/components/Layout.tsx src/pages/HomePage.tsx src/utils/duplicateRemover.ts src/components/routing/RouteDebugger.tsx
echo "✅ Nettoyage terminé"
