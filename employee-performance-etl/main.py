"""
Entry point. Runs the full pipeline:

  1. Create tables       (schema/create_database.py)
  2. Read Excel           (etl/reader.py)
  3. Clean data            (etl/cleaner.py)
  4. Transform + Load      (etl/transformer.py, etl/loader.py)
  5. Seed system accounts  (etl/accounts.py)
  6. Create SQL views      (schema/create_views.py)
"""
from config.database import SessionLocal
from config.logger import logger

from schema.create_database import create_all_tables
from schema.create_views import create_all_views

from etl.reader import read_excel
from etl.cleaner import clean
from etl.transformer import transform_row
from etl.loader import load_dataframe
from etl.accounts import seed_system_accounts


def run():
    logger.info("🚀 Starting Employee Performance ETL pipeline")

    # 1. Schema
    create_all_tables()

    # 2 & 3. Extract + Clean
    df = read_excel()
    df = clean(df)

    # 4. Transform + Load
    session = SessionLocal()
    try:
        load_dataframe(session, df, transform_row)
        # 5. System accounts (CEO / Managers / Tester)
        seed_system_accounts(session)
    except Exception:
        session.rollback()
        logger.exception("Pipeline failed — rolled back transaction")
        raise
    finally:
        session.close()

    # 6. Views
    create_all_views()

    logger.info("🎉 Pipeline finished successfully!")


if __name__ == "__main__":
    run()
