#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node --check "$ROOT/content.js"
node --check "$ROOT/page-bridge.js"

node - "$ROOT" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));

if (manifest.manifest_version !== 3) throw new Error("Manifest V3 is required.");
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error("Use an x.y.z version.");
if (!manifest.description || manifest.description.length > 132) {
  throw new Error("Manifest description must be between 1 and 132 characters.");
}
if (manifest.permissions?.length || manifest.host_permissions?.length) {
  throw new Error("Unexpected extension permissions found.");
}
if (manifest.content_scripts?.[0]?.world !== "MAIN") {
  throw new Error("The page bridge must run in the MAIN world.");
}

for (const file of [
  "content.js",
  "page-bridge.js",
  "content.css",
  "icons/icon16.png",
  "icons/icon32.png",
  "icons/icon48.png",
  "icons/icon128.png",
]) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing ${file}.`);
}

console.log(`Validated Watch Later Cleaner ${manifest.version}.`);
NODE
