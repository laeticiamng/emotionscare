#!/usr/bin/env bash
set -e
DIST="${1:-dist}"
MISSING=0
check() {
  local path="$DIST/$1"
  local files=( $path )
  if [ ${#files[@]} -eq 0 ] || [ ! -f "${files[0]}" ]; then
    echo "❌ Missing $1"
    MISSING=1
    return
  fi
  for f in "${files[@]}"; do
    size=$(stat -c %s "$f")
    if [ "$size" -le 100 ]; then
      echo "❌ $(basename "$f") too small ($size bytes)"
      MISSING=1
    fi
  done
}
check index.html
check assets/index-*.js
check assets/index-*.css
check sw.js
if [ "$MISSING" -eq 1 ]; then
  echo "❌ Asset verification failed"
  exit 1
fi
echo "✅ Assets verified"

