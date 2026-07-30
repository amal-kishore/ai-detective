from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.case import Case, Game, Message
from app.models.user import User
from app.schemas.game import GameStart, GameOut, PlayerAction, NarratorResponse
from app.api.deps import current_user
from app.services.narrator import call_narrator
from app.game.engine import extract_tags, resolve_accusation, calculate_score

router = APIRouter(prefix="/games", tags=["games"])


@router.post("", response_model=GameOut, status_code=201)
async def start_game(body: GameStart, db: AsyncSession = Depends(get_db), user: User = Depends(current_user)):
    result = await db.execute(select(Case).where(Case.slug == body.case_slug))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")

    game = Game(user_id=user.id, case_id=case.id)
    db.add(game)
    await db.commit()
    await db.refresh(game)
    return game


@router.get("/{game_id}", response_model=GameOut)
async def get_game(game_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(current_user)):
    game = await db.get(Game, game_id)
    if not game or game.user_id != user.id:
        raise HTTPException(404, "Game not found")
    return game


@router.post("/{game_id}/action", response_model=NarratorResponse)
async def player_action(
    game_id: int,
    body: PlayerAction,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(current_user),
):
    game = await db.get(Game, game_id, options=[selectinload(Game.messages)])
    if not game or game.user_id != user.id:
        raise HTTPException(404, "Game not found")
    if game.status != "active":
        raise HTTPException(400, "Game is already over")

    case = await db.get(Case, game.case_id)

    raw = call_narrator(case, game, game.messages, body.text)
    narrative, new_clue_ids, accusation = extract_tags(raw)

    # Persist player message
    db.add(Message(game_id=game.id, role="user", content=body.text))
    db.add(Message(game_id=game.id, role="assistant", content=narrative))

    # Update state
    game.action_count += 1
    found = list(game.found_clue_ids)
    for cid in new_clue_ids:
        if cid not in found:
            found.append(cid)
    game.found_clue_ids = found

    new_clues_detail = [c for c in case.clues if c["id"] in new_clue_ids]

    # Handle accusation
    if accusation:
        correct = resolve_accusation(case, accusation)
        if correct:
            game.status = "won"
            game.score = calculate_score(game, case, correct=True)
        else:
            game.wrong_accusations += 1
            if game.wrong_accusations >= 3:
                game.status = "lost"
                game.score = 0

    await db.commit()
    await db.refresh(game)

    return NarratorResponse(
        narrative=narrative,
        new_clues=new_clues_detail,
        game_status=game.status,
        score=game.score,
    )


@router.get("/{game_id}/messages")
async def get_messages(game_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(current_user)):
    game = await db.get(Game, game_id, options=[selectinload(Game.messages)])
    if not game or game.user_id != user.id:
        raise HTTPException(404, "Game not found")
    return [{"role": m.role, "content": m.content} for m in game.messages]
