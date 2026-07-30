from sqlalchemy import String, Text, Integer, JSON, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    difficulty: Mapped[int] = mapped_column(Integer, default=1)  # 1-5
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=15)
    setting: Mapped[str] = mapped_column(String(200))

    # JSON blobs for portability — game engine reads these
    victim: Mapped[dict] = mapped_column(JSON)           # {name, age, occupation, cause_of_death, clues_on_body}
    murderer_id: Mapped[int] = mapped_column(Integer)    # index into suspects array
    suspects: Mapped[list] = mapped_column(JSON)         # [{id, name, role, alibi, personality, guilty}]
    rooms: Mapped[list] = mapped_column(JSON)            # [{id, name, description, clue_ids}]
    clues: Mapped[list] = mapped_column(JSON)            # [{id, name, description, hidden, room_id}]
    timeline: Mapped[list] = mapped_column(JSON)         # [{time, event, suspect_id|null}]
    opening_scene: Mapped[str] = mapped_column(Text)

    games: Mapped[list["Game"]] = relationship(back_populates="case")  # noqa: F821


class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    case_id: Mapped[int] = mapped_column(ForeignKey("cases.id"))

    status: Mapped[str] = mapped_column(String(20), default="active")  # active | won | lost
    found_clue_ids: Mapped[list] = mapped_column(JSON, default=list)
    visited_room_ids: Mapped[list] = mapped_column(JSON, default=list)
    inventory: Mapped[list] = mapped_column(JSON, default=list)
    action_count: Mapped[int] = mapped_column(Integer, default=0)
    wrong_accusations: Mapped[int] = mapped_column(Integer, default=0)
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    user: Mapped["User"] = relationship(back_populates="games")  # noqa: F821
    case: Mapped["Case"] = relationship(back_populates="games")
    messages: Mapped[list["Message"]] = relationship(back_populates="game", order_by="Message.id")


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id"))
    role: Mapped[str] = mapped_column(String(20))  # user | assistant
    content: Mapped[str] = mapped_column(Text)

    game: Mapped["Game"] = relationship(back_populates="messages")
