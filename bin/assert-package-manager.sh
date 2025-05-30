#!/usr/bin/env bash

# Fail if bun is installed
if command -v bun > /dev/null; then
  echo "❌ Bun détecté — build annulé"
  exit 1
fi

# Ensure npm is available
if ! command -v npm > /dev/null; then
  echo "❌ npm introuvable"
  exit 1
fi

exit 0
