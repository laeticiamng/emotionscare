#!/usr/bin/env bash
set -euo pipefail

if command -v bun >/dev/null 2>&1; then
  echo "❌ Bun détecté — build annulé"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm introuvable"
  exit 1
fi

