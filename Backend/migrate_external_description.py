import os
import sqlalchemy
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def migrate():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE external_jobs ADD COLUMN description LONGTEXT DEFAULT NULL;"))
            print("Successfully added description column to external_jobs table.")
        except sqlalchemy.exc.OperationalError as e:
            if "Duplicate column name" in str(e):
                print("Column description already exists.")
            else:
                raise e
        conn.commit()

if __name__ == "__main__":
    migrate()
