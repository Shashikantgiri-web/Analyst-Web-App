import uuid
from datetime import datetime

from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class Work(Base):
    """Working hours, workload, project counts, overtime, and attendance-related fields."""
    __tablename__ = "work"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("employees.id"), unique=True, nullable=False, index=True)

    normal_work_hours: Mapped[float | None] = mapped_column(Numeric(6, 2))
    overall_hours: Mapped[float | None] = mapped_column(Numeric(6, 2))
    total_work_hours: Mapped[float | None] = mapped_column(Numeric(6, 2))
    work_hours_per_week: Mapped[float | None] = mapped_column(Numeric(6, 2))
    overtime_category: Mapped[str | None] = mapped_column(String(30))

    project_handled: Mapped[int | None] = mapped_column(Integer)
    remaining_projects: Mapped[int | None] = mapped_column(Integer)

    workload: Mapped[str | None] = mapped_column(String(30))
    work_life_balance: Mapped[str | None] = mapped_column(String(30))

    sick_days: Mapped[int | None] = mapped_column(Integer)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    employee = relationship("Employee", back_populates="work")

    def __repr__(self) -> str:
        return f"<Work employee_id={self.employee_id}>"
