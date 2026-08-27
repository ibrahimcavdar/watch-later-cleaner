#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="$(node -p "require('$ROOT/manifest.json').version")"
DIST="$ROOT/dist"
OUTPUT="$DIST/watch-later-cleaner-$VERSION.zip"
TEMP="$DIST/watch-later-cleaner-$VERSION.tmp.zip"

"$ROOT/scripts/validate-extension.sh"
mkdir -p "$DIST"
rm -f "$TEMP"

(
  cd "$ROOT"
  zip -q -r "$TEMP" manifest.json content.js page-bridge.js content.css icons
)

mv "$TEMP" "$OUTPUT"
printf 'Created %s\n' "$OUTPUT"
