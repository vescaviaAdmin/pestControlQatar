#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${ROOT_DIR}/distStatic"

rm -rf "${OUT_DIR}"
mkdir -p "${OUT_DIR}/service-detail"

cp "${ROOT_DIR}/html/index.html" "${OUT_DIR}/index.html"
cp "${ROOT_DIR}/html/404.html" "${OUT_DIR}/404.html"
cp "${ROOT_DIR}/html/serviceDetail.html" "${OUT_DIR}/service-detail.html"
cp -R "${ROOT_DIR}/css" "${OUT_DIR}/css"
cp -R "${ROOT_DIR}/js" "${OUT_DIR}/js"
cp -R "${ROOT_DIR}/public" "${OUT_DIR}/public"
sed '/<title>Service Details | Qatar Pest Control<\/title>/a\    <base href="../" />' \
  "${ROOT_DIR}/html/serviceDetail.html" > "${OUT_DIR}/service-detail/index.html"
touch "${OUT_DIR}/.nojekyll"
