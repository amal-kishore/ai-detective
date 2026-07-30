# AI Detective

Interactive offline detective mystery game.

Explore crime scenes, interrogate suspects, collect evidence, and accuse the killer — before you run out of chances.

## Play

**Web:** https://amal-kishore.github.io/ai-detective/

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Zustand
- Framer Motion
- Capacitor (Android)

## How it works

The game engine runs entirely on-device — no internet required, no server.

- Cases are bundled as TypeScript data files
- The engine parses player input, matches actions to rooms/suspects/objects, and returns narrative responses
- Progress is saved automatically to local storage

## Adding Cases

Add a new file to `frontend/src/game/cases/` following the structure in `midnightMurder.ts`, then register it in `frontend/src/game/cases/index.ts`.

## Android Build

```bash
cd frontend
npm run android:sync   # build + sync into Android project
npm run android:open   # open in Android Studio
```
