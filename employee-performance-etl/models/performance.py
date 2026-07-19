import uuid
from datetime import datetime

from sqlalchemy import String, Numeric, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class Performance(Base):
    __tablename__ = "performance"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("employees.id"), unique=True, nullable=False, index=True)

    performance_score: Mapped[float | None] = mapped_column(Numeric(6, 2))
    performance_rating: Mapped[str | None] = mapped_column(String(30))
    overall_rating: Mapped[str | None] = mapped_column(String(30))
    overall_performance_index: Mapped[float | None] = mapped_column(Numeric(6, 2))
    percentage_pe: Mapped[float | None] = mapped_column(Numeric(6, 2))
    min_ps: Mapped[float | None] = mapped_column(Numeric(6, 2))
    max_ps: Mapped[float | None] = mapped_column(Numeric(6, 2))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    employee = relationship("Employee", back_populates="performance")

    def __repr__(self) -> str:
        return f"<Performance employee_id={self.employee_id} score={self.performance_score}>"
