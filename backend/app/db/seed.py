"""Seed the database with the first case: The Midnight Murder."""

import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal, engine
from app.db.base import Base
from app.models import User, Case, Game, Message  # noqa: F401 — registers all models


MIDNIGHT_MURDER = {
    "slug": "midnight-murder",
    "title": "The Midnight Murder",
    "description": "A wealthy art collector is found dead in his locked library. Five guests were in the mansion. One of them is lying.",
    "difficulty": 3,
    "estimated_minutes": 15,
    "setting": "A gothic mansion on a rainy English moor, 1952.",
    "victim": {
        "name": "Lord Edmund Ashworth",
        "age": 67,
        "occupation": "Art collector and antiquarian",
        "cause_of_death": "Poisoned with cyanide hidden in a glass of brandy",
        "clues_on_body": ["ash on left sleeve", "ink stain on right index finger", "crumpled note in breast pocket"],
    },
    "murderer_id": 2,  # index into suspects — Margaret Hale
    "suspects": [
        {
            "id": 0,
            "name": "Dr. Victor Crane",
            "role": "Family physician",
            "alibi": "Claims he was in the billiard room until midnight",
            "personality": "Nervous, overexplains everything, keeps adjusting his glasses",
            "guilty": False,
        },
        {
            "id": 1,
            "name": "James Ashworth",
            "role": "Lord Ashworth's estranged son",
            "alibi": "Says he was in the garden smoking",
            "personality": "Arrogant, evasive about money, visibly relieved his father is dead",
            "guilty": False,
        },
        {
            "id": 2,
            "name": "Margaret Hale",
            "role": "Lord Ashworth's personal secretary",
            "alibi": "Claims she retired to her room at 11pm after serving brandy",
            "personality": "Ice-cold composure, always precise, never wastes words",
            "guilty": True,
        },
        {
            "id": 3,
            "name": "Reverend Thomas Doyle",
            "role": "Old friend and priest",
            "alibi": "Was reading in the sitting room, heard the piano",
            "personality": "Soft-spoken, deeply troubled by something, avoids eye contact",
            "guilty": False,
        },
        {
            "id": 4,
            "name": "Clara Webb",
            "role": "Visiting art appraiser",
            "alibi": "She was cataloguing paintings in the east wing",
            "personality": "Sharp, curious, slightly too eager to be helpful",
            "guilty": False,
        },
    ],
    "rooms": [
        {"id": 1, "name": "Library", "description": "Where the body was found. Bookshelves floor to ceiling. A cold fireplace. A desk covered in papers. The brandy decanter sits on the sideboard."},
        {"id": 2, "name": "Kitchen", "description": "Stone floor. A large hearth. The cook's domain. A small door leads to the cellar."},
        {"id": 3, "name": "Garden", "description": "Rain-soaked lawn. A stone bench near the rose bushes. Cigarette butts visible near the east wall."},
        {"id": 4, "name": "East Wing", "description": "Long corridor lined with paintings. Dust on most surfaces. One painting has been recently moved."},
        {"id": 5, "name": "Sitting Room", "description": "Comfortable chairs. A piano. Sheet music is open. A half-finished cup of tea on the side table."},
        {"id": 6, "name": "Margaret's Room", "description": "Neat and minimal. A leather briefcase under the bed. A chemistry textbook on the nightstand."},
    ],
    "clues": [
        {"id": 1, "name": "Brandy decanter", "description": "Residue of potassium cyanide on the inner rim. Only one glass was poured.", "hidden": False, "room_id": 1},
        {"id": 2, "name": "Ash on victim's sleeve", "description": "Fine white ash, not from a fireplace. Consistent with burned documents.", "hidden": False, "room_id": 1},
        {"id": 3, "name": "Crumpled note", "description": "The note reads: 'I know what you did in Vienna. Meet me in the library at midnight. — E.A.'", "hidden": True, "room_id": 1},
        {"id": 4, "name": "Cigarette butts", "description": "Three stubs. Same brand as the box in James's coat pocket.", "hidden": False, "room_id": 3},
        {"id": 5, "name": "Moved painting", "description": "A landscape painting has been rehung slightly crooked. Behind it: a hidden wall safe, now empty.", "hidden": True, "room_id": 4},
        {"id": 6, "name": "Chemistry textbook", "description": "Margaret's textbook. Chapter on cyanide compounds is heavily annotated in her handwriting.", "hidden": True, "room_id": 6},
        {"id": 7, "name": "Leather briefcase", "description": "Contains forged provenance documents for three paintings. Margaret's fingerprints are on them.", "hidden": True, "room_id": 6},
        {"id": 8, "name": "Sheet music", "description": "The piano was played—but Reverend Doyle cannot play piano. He was covering for someone.", "hidden": True, "room_id": 5},
        {"id": 9, "name": "Empty cyanide vial", "description": "Tiny glass vial hidden behind the brandy decanter. Traces of cyanide inside.", "hidden": True, "room_id": 1},
        {"id": 10, "name": "Cellar door", "description": "The cellar lock is broken from the inside. Someone hid something here before the police arrived.", "hidden": False, "room_id": 2},
        {"id": 11, "name": "Cook's testimony", "description": "The cook says Margaret was in the kitchen at 11:45pm, not her room — asking which brandy Lord Ashworth preferred.", "hidden": False, "room_id": 2},
    ],
    "timeline": [
        {"time": "10:00pm", "event": "Dinner ends. Lord Ashworth retires to the library.", "suspect_id": None},
        {"time": "11:00pm", "event": "Margaret serves brandy to Lord Ashworth in the library.", "suspect_id": 2},
        {"time": "11:15pm", "event": "Piano is heard in the sitting room.", "suspect_id": None},
        {"time": "11:45pm", "event": "Margaret seen in the kitchen asking about brandy preferences.", "suspect_id": 2},
        {"time": "12:00am", "event": "Lord Ashworth found dead. Library door locked from inside.", "suspect_id": None},
        {"time": "12:05am", "event": "Dr. Crane forces the door open.", "suspect_id": 0},
    ],
    "opening_scene": (
        "Rain hammers the windows of Ashworth Manor.\n\n"
        "You have been called in as an independent investigator — no badge, just a sharp mind.\n\n"
        "Lord Edmund Ashworth, 67, art collector and antiquarian, was found dead in his locked library at midnight. "
        "A glass of brandy sits beside him. Five guests remain in the house. Nobody has left.\n\n"
        "The local constable is useless. You have until dawn.\n\n"
        "Where would you like to begin?"
    ),
}


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        from sqlalchemy import select
        existing = await db.execute(select(Case).where(Case.slug == "midnight-murder"))
        if existing.scalar_one_or_none():
            print("Seed data already present. Skipping.")
            return

        case = Case(**MIDNIGHT_MURDER)
        db.add(case)
        await db.commit()
        print("Seeded: The Midnight Murder")


if __name__ == "__main__":
    asyncio.run(seed())
