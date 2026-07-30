from pydantic import BaseModel
from typing import Any


class CaseListItem(BaseModel):
    id: int
    slug: str
    title: str
    description: str
    difficulty: int
    estimated_minutes: int
    setting: str

    model_config = {"from_attributes": True}


class GameOut(BaseModel):
    id: int
    case_id: int
    status: str
    found_clue_ids: list[int]
    visited_room_ids: list[int]
    inventory: list[Any]
    action_count: int
    wrong_accusations: int
    score: int | None

    model_config = {"from_attributes": True}


class GameStart(BaseModel):
    case_slug: str


class PlayerAction(BaseModel):
    text: str


class NarratorResponse(BaseModel):
    narrative: str
    new_clues: list[dict]
    game_status: str  # active | won | lost
    score: int | None
