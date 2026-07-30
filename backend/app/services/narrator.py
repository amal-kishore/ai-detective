import anthropic
from app.core.config import settings
from app.models.case import Case, Game, Message
from app.game.engine import build_system_prompt, extract_tags

_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def call_narrator(case: Case, game: Game, messages: list[Message], player_input: str) -> str:
    system = build_system_prompt(case, game)
    history = [{"role": m.role, "content": m.content} for m in messages]
    history.append({"role": "user", "content": player_input})

    response = _client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        system=system,
        messages=history,
    )
    return response.content[0].text
