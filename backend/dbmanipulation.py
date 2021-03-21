from .database import session
from .models.video import Video
""" This file will have all function that make any direct query or manipulation in the database. So we can use this funtions as interface of the database. With this we have a single place to edit when some database code should change. 
"""


def Add_New_Video_In_Db(url, title, thumbnail, downloadPercent, videoquality):
    """ This function insert video object in database
    """
    newVideoDetails = Video(
        url=url,
        title=title,
        thumbnail=thumbnail,
        downloadPercent=downloadPercent,
        videoquality=str(videoquality)
    )
    session.add(newVideoDetails)
    session.commit()


def Add_Playlist_In_Db(listOfVideo):
    for video in listOfVideo:
        Add_New_Video_In_Db(**video)


def Url_In_Database(url):
    return (session.query(session.query(Video).filter(Video.url == url).exists()).scalar())


