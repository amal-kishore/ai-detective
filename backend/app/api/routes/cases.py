from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.case import Case
from app.models.user import User
from app.schemas.game import CaseListItem
from app.api.deps import current_user

router = APIRouter(prefix="/cases", tags=["cases"])


@router.get("", response_model=list[CaseListItem])
async def list_cases(db: AsyncSession = Depends(get_db), _: User = Depends(current_user)):
    result = await db.execute(select(Case))
    return result.scalars().all()


@router.get("/{slug}", response_model=CaseListItem)
async def get_case(slug: str, db: AsyncSession = Depends(get_db), _: User = Depends(current_user)):
    result = await db.execute(select(Case).where(Case.slug == slug))
    case = result.scalar_one_or_none()
    if not case:
        from fastapi import HTTPException
        raise HTTPException(404, "Case not found")
    return case
