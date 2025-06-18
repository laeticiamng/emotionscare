
#!/usr/bin/env bash

# Assert Bun is available
echo "🔍 Checking Bun installation..."
if ! command -v bun > /dev/null; then
  echo "❌ Bun non trouvé"
  exit 1
fi

echo "✅ Bun version: $(bun --version)"
exit 0
