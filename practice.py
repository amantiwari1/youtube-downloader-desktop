from backend.models.video import Video
from backend.database import session

session.query(session.query(Video).filter(Video.url == 1).exists()).scalar()

