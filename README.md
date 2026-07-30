# Case Zero

Interactive detective mysteries powered by Claude AI.

## Architecture

```
Frontend (React + Vite)  →  FastAPI Backend  →  Postgres
                                    ↓
                             Game Engine (source of truth)
                                    ↓
                             Claude (narrator only)
```

**Key principle**: Claude never invents facts. The backend owns murderer, suspects, rooms, clues, and timeline. Claude only narrates player-discoverable information.

## Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Framer Motion
- **Backend**: FastAPI, SQLAlchemy 2 (async), PostgreSQL, Alembic
- **AI**: Anthropic Claude (claude-sonnet-4-6)
- **Auth**: JWT (python-jose + passlib/bcrypt)

## Setup

### 1. Postgres

```bash
createdb casezero
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# fill in DATABASE_URL, SECRET_KEY, ANTHROPIC_API_KEY
pip install -r requirements.txt
pip install "pydantic[email]"

# Create tables + seed first case
bash seed.sh

# Start server
bash start.sh
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/cases` | List all cases |
| POST | `/api/games` | Start a new game |
| POST | `/api/games/{id}/action` | Send player action → narrator response |
| GET | `/api/games/{id}/messages` | Full message history |

## Game Engine

`backend/app/game/engine.py` builds a system prompt from live game state — what rooms the player has visited, which clues they've found, the suspect list, and the timeline. Claude narrates within those constraints.

Special tags Claude embeds in responses:
- `<<CLUE:id>>` — player has discovered clue with this ID
- `<<ACCUSATION:name>>` — player is accusing a suspect

The engine strips tags before sending text to the frontend, updates game state, and calculates the score.

## Adding Cases

Edit `backend/app/db/seed.py` and add another dict to the seed list. Each case needs:
- `victim`, `suspects`, `rooms`, `clues`, `timeline`, `opening_scene`
- `murderer_id`: index into the `suspects` array

## Week 2 Plan

- Room navigation UI (sidebar with room list)
- Inventory display
- NPC portraits
- Daily case (same mystery for all players, leaderboard)
