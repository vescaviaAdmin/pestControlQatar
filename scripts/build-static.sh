#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT_DIR}/dist-static"

rm -rf "${OUT_DIR}"
mkdir -p "${OUT_DIR}/public"

for file in \
  index.html \
  404.html \
  service-detail.html \
  styles.css \
  scripts.js \
  service-detail.js \
  service-data.js
do
  cp "${ROOT_DIR}/${file}" "${OUT_DIR}/${file}"
done

cp -R "${ROOT_DIR}/public/." "${OUT_DIR}/public/"
touch "${OUT_DIR}/.nojekyll"
