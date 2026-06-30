#!/bin/bash
# Doppio click per avviare la presentazione QRHub in locale sul Mac (Homebrew + Yarn).
cd "$(dirname "$0")/frontend" || exit 1

# Assicura che brew sia nel PATH (Apple Silicon e Intel)
[ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"
[ -x /usr/local/bin/brew ] && eval "$(/usr/local/bin/brew shellenv)"

if ! command -v yarn >/dev/null 2>&1; then
  echo "Yarn non trovato."
  if command -v brew >/dev/null 2>&1; then
    echo "==> Installo Node e Yarn con Homebrew..."
    brew install node yarn
  else
    echo "Installa prima Homebrew, poi: brew install node yarn"
    echo "Premi un tasto per chiudere..."
    read -n 1
    exit 1
  fi
fi

echo "==> Installazione dipendenze (la prima volta puo' richiedere qualche minuto)..."
yarn install

echo "==> Avvio della presentazione su http://localhost:3000 ..."
yarn start
