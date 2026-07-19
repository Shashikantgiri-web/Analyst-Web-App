"""
Application settings loaded from environment variables (.env).
Single source of truth for configuration — every other module imports from here.
"""
import os
from dotenv import load_dotenv

load_dotenv()


def _require(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise EnvironmentError(f"Missing required environment variable: {name}")
    return value


class Settings:
    # Database
    DB_HOST = _require("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT", "5432"))
    DB_NAME = os.getenv("DB_NAME", "postgres")
    DB_USER = _require("DB_USER")
    DB_PASSWORD = _require("DB_PASSWORD")

    # Excel source
    EXCEL_FILE_PATH = os.getenv(
        "EXCEL_FILE_PATH", "data/Employee_performance_dataset.xlsx"
    )

    # Account generation
    DEFAULT_PASSWORD_PREFIX = os.getenv("DEFAULT_PASSWORD_PREFIX", "XYZ")
    CEO_PASSWORD = os.getenv("CEO_PASSWORD", "CEO@12345")


settings = Settings()
