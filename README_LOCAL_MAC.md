# QRHub × WINDTRE — Presentazione (avvio in locale su Mac con Homebrew)

Questa è una presentazione **solo frontend** (React). Non serve il backend né MongoDB.

## 1. Prerequisiti (una volta sola, con Homebrew)
Apri il **Terminale** (Spotlight → "Terminale"):

```bash
# Installa Homebrew (se non ce l'hai gia')
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installa Node e Yarn con brew
brew install node yarn
```

Verifica:
```bash
node -v
yarn -v
```

## 2. Avvio in modalità sviluppo (più semplice)
```bash
cd frontend
yarn install
yarn start
```
Si apre da solo su **http://localhost:3000** (con ricarica automatica).

## 3. Avvio in modalità presentazione (build ottimizzata)
```bash
cd frontend
yarn install
yarn build
yarn global add serve     # una volta sola
serve -s build
```
Apri il link che compare (di solito **http://localhost:3000**).

## Scorciatoia: doppio click
Doppio click sul file `start-mac.command` nella cartella
(la prima volta: tasto destro → **Apri** per autorizzarlo).

## Comandi della presentazione
- **Play**: avvia l'intro animata (l'audio parte dopo il click).
- **← →** : naviga tra le slide.
- **F** o pulsante **⛶** in alto a destra: schermo intero.
- Slide specifica via URL, es: `http://localhost:3000/?slide=2`

## Note
- Usa **sempre `yarn`** (installato con brew), non npm: è la stessa toolchain usata in sviluppo.
- La variabile `REACT_APP_BACKEND_URL` non è usata dalle slide: puoi ignorarla.
- L'audio dell'intro è in `frontend/public/assets/intro_audio.mp3`.
