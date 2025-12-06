#!/bin/bash
# Script de correction des imports ThemeProvider

find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e "s|from '@/components/theme-provider'|from '@/providers/theme'|g" \
  -e "s|from '@/providers/ThemeProvider'|from '@/providers/theme'|g" \
  {} +

echo "✅ Imports corrigés"
