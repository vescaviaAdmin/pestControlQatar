#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT_DIR}/dist-static"

rm -rf "${OUT_DIR}"
mkdir -p "${OUT_DIR}/service-detail"

cp "${ROOT_DIR}"/html/*.html "${OUT_DIR}/"
cp -R "${ROOT_DIR}/css" "${OUT_DIR}/css"
cp -R "${ROOT_DIR}/js" "${OUT_DIR}/js"
cp -R "${ROOT_DIR}/public" "${OUT_DIR}/public"
sed '/<title>Service Details | Qatar Pest Control<\/title>/a\    <base href="../" />' \
  "${ROOT_DIR}/html/service-detail.html" > "${OUT_DIR}/service-detail/index.html"
touch "${OUT_DIR}/.nojekyll"
