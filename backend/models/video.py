from sqlalchemy import (
    Column, 
    Integer,
    String,
)
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    url = Column(String, nullable=False)
    title = Column(String, nullable=False )
    thumbnail = Column(String, nullable=False)
    downloadPercent = Column(String, nullable=False)
    videoquality = Column(String, nullable=False )
    