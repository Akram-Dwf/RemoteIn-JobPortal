import os
import sqlalchemy
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def migrate():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE external_jobs ADD COLUMN company_logo VARCHAR(1000) DEFAULT NULL;"))
            print("Successfully added company_logo column to external_jobs table.")
        except sqlalchemy.exc.OperationalError as e:
            if "Duplicate column name" in str(e):
                print("Column company_logo already exists.")
            else:
                raise e
        conn.commit()

if __name__ == "__main__":
    migrate()
