"""
Creates every table defined in models/ against the configured database.
Run this once (or after model changes) before running the ETL importer.
"""
from config.database import Base, engine
from config.logger import logger
import models  # noqa: F401  (imports register all model classes on Base.metadata)


def create_all_tables():
    logger.info("Creating all tables (if they do not already exist)...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ All tables created successfully.")


if __name__ == "__main__":
    create_all_tables()
