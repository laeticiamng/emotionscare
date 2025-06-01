
#!/usr/bin/env bash

# Remove any remaining Bun installations
echo "🧹 Checking for Bun installations..."
if command -v bun > /dev/null; then
  echo "❌ Bun détecté — suppression en cours..."
  sudo rm -f $(which bun) 2>/dev/null || rm -f $(which bun) 2>/dev/null || true
  rm -rf ~/.bun ~/.cache/bun 2>/dev/null || true
fi

# Final check - fail if bun is still installed
if command -v bun > /dev/null; then
  echo "❌ Bun encore détecté — build annulé"
  exit 1
fi

# Ensure npm is available
if ! command -v npm > /dev/null; then
  echo "❌ npm introuvable"
  exit 1
fi

echo "✅ npm configuré, Bun supprimé"
exit 0
