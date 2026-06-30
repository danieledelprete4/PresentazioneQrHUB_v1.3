#!/bin/bash
# Doppio click per avviare la presentazione QRHub in locale sul Mac.
cd "$(dirname "$0")/frontend" || exit 1

if ! command -v yarn >/dev/null 2>&1; then
  echo "Yarn non trovato. Installa con: brew install node && corepack enable"
  echo "Premi un tasto per chiudere..."
  read -n 1
  exit 1
fi

echo "==> Installazione dipendenze (solo la prima volta puo' richiedere qualche minuto)..."
yarn install

echo "==> Avvio della presentazione su http://localhost:3000 ..."
yarn start
