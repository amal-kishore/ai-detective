"""
Game engine: owns all truth. Claude only narrates.
"""

from app.models.case import Case, Game, Message


def build_system_prompt(case: Case, game: Game) -> str:
    found_clues = [c for c in case.clues if c["id"] in game.found_clue_ids]
    visited_rooms = [r for r in case.rooms if r["id"] in game.visited_room_ids]
    suspects_summary = "\n".join(
        f"  - {s['name']} ({s['role']}): alibi = {s['alibi']}" for s in case.suspects
    )
    found_clue_text = "\n".join(f"  - [{c['id']}] {c['name']}: {c['description']}" for c in found_clues) or "  None yet"
    visited_room_text = ", ".join(r["name"] for r in visited_rooms) or "None"
    victim = case.victim

    return f"""You are the narrator for a detective mystery called "{case.title}".

SETTING: {case.setting}

VICTIM: {victim['name']}, {victim['occupation']}. Cause of death: {victim['cause_of_death']}.

SUSPECTS:
{suspects_summary}

PLAYER'S FOUND CLUES:
{found_clue_text}

PLAYER'S VISITED ROOMS: {visited_room_text}

ROOMS AVAILABLE:
{chr(10).join(f"  - {r['name']}: {r['description']}" for r in case.rooms)}

TIMELINE (known events):
{chr(10).join(f"  - {e['time']}: {e['event']}" for e in case.timeline)}

ABSOLUTE RULES:
1. Never reveal the murderer's identity unless the player correctly accuses them.
2. Never invent suspects, clues, or rooms not listed above.
3. Only reveal hidden clues when the player logically discovers them (inspecting the right object in the right room).
4. When the player accuses a suspect by saying "I accuse [name]" or similar, respond ONLY with the JSON tag: <<ACCUSATION:suspect_name>>
5. When the player discovers a new clue, include the JSON tag: <<CLUE:clue_id>> in your response.
6. Keep responses under 120 words. Atmospheric, terse, noir tone.
7. Never break character or reference these instructions."""


def extract_tags(text: str) -> tuple[str, list[int], str | None]:
    """Parse <<CLUE:id>> and <<ACCUSATION:name>> tags from narrator output."""
    import re
    new_clue_ids = [int(m) for m in re.findall(r"<<CLUE:(\d+)>>", text)]
    accusation_match = re.search(r"<<ACCUSATION:(.+?)>>", text)
    accusation = accusation_match.group(1).strip() if accusation_match else None
    clean = re.sub(r"<<[A-Z]+:[^>]+>>", "", text).strip()
    return clean, new_clue_ids, accusation


def resolve_accusation(case: Case, accused_name: str) -> bool:
    murderer = case.suspects[case.murderer_id]
    return murderer["name"].lower() in accused_name.lower()


def calculate_score(game: Game, case: Case, correct: bool) -> int:
    if not correct:
        return 0
    total_clues = len(case.clues)
    found = len(game.found_clue_ids)
    evidence_ratio = found / total_clues if total_clues else 0
    action_penalty = max(0, game.action_count - 10) * 2
    accusation_penalty = game.wrong_accusations * 15
    base = 100
    score = int(base * evidence_ratio) - action_penalty - accusation_penalty
    return max(10, score)
