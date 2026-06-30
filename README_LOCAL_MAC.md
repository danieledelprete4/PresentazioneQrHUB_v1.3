# QRHub × WINDTRE — Presentazione (avvio in locale su Mac)

Questa è una presentazione **solo frontend** (React). Non serve il backend né MongoDB.

## 1. Prerequisiti (una volta sola)
Apri il **Terminale** (Spotlight → "Terminale") e installa Node + Yarn:

```bash
# Installa Homebrew (se non ce l'hai)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installa Node e Yarn
brew install node
corepack enable        # abilita yarn
```

Verifica:
```bash
node -v
yarn -v
```

## 2. Avvio in modalità presentazione (consigliato)
Crea una build ottimizzata e servila in locale:

```bash
cd frontend
yarn install
yarn build
npx serve -s build
```

Apri il link che compare (di solito **http://localhost:3000**).

## 3. Avvio in modalità sviluppo (alternativa)
```bash
cd frontend
yarn install
yarn start
```
Si apre da solo su **http://localhost:3000** (con ricarica automatica).

## Scorciatoia: doppio click
In alternativa puoi fare **doppio click** sul file `start-mac.command` nella cartella
(potrebbe chiederti di autorizzarlo: tasto destro → Apri la prima volta).

## Comandi della presentazione
- **Play**: avvia l'intro animata (l'audio parte dopo il click).
- **← →** : naviga tra le slide.
- **F** : schermo intero (oppure il pulsante ⛶ in alto a destra).
- Puoi aprire una slide specifica via URL, es: `http://localhost:3000/?slide=2`

## Note
- La variabile `REACT_APP_BACKEND_URL` non è usata dalle slide: puoi ignorarla.
- L'audio dell'intro è in `frontend/public/assets/intro_audio.mp3`.
