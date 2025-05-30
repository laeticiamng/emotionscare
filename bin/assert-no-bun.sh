#!/usr/bin/env bash
if command -v bun > /dev/null; then
  echo "❌  Bun still present – aborting pipeline"
  exit 1
fi
