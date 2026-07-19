import uuid
from datetime import datetime, date

from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from config.database import Base


class Employee(Base):
    """
    Core employee identity table.
    Deliberately holds ONLY identity/demographic fields — salary, performance,
    training, promotion, satisfaction, etc. live in their own related tables.
    """
    __tablename__ = "employees"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)  # e.g. EMP1001

    department_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False, index=True)

    education_level: Mapped[str | None] = mapped_column(String(50))
    experience_level: Mapped[str | None] = mapped_column(String(50))
    gender: Mapped[str | None] = mapped_column(String(20))
    current_age: Mapped[int | None] = mapped_column(Integer)

    hire_date: Mapped[date | None] = mapped_column(Date)
    hire_time: Mapped[str | None] = mapped_column(String(20))
    years_at_company: Mapped[int | None] = mapped_column(Integer)

    emp_status: Mapped[str | None] = mapped_column(String(30))  # active / inactive / terminated

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    department = relationship("Department", back_populates="employees")
    salary = relationship("Salary", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    performance = relationship("Performance", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    satisfaction = relationship("Satisfaction", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    training = relationship("Training", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    work = relationship("Work", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    promotion = relationship("Promotion", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    retirement = relationship("Retirement", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    remote_work = relationship("RemoteWork", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    account = relationship("EmployeeAccount", back_populates="employee", uselist=False, cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Employee {self.employee_code}>"
