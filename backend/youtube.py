import youtube_dl
from urllib.parse import urlparse
import urllib.request
import os



# get the all detail of a video
def Get_Data_Details(url):
    ydl = youtube_dl.YoutubeDL({'outtmpl': '%(id)s.%(ext)s'})

    with ydl:
        result = ydl.extract_info(url,download=False )

    return result

# get list of video quality
def Get_Detail_Quality_Available(getDataFormat):
    list_of_format = []
    for format in getDataFormat:
        list_of_format.append(format["format_note"])
    return set(list_of_format)





# check url is vaild or not
def Check_Url(url):
    """check url is vaild or not"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False

# get the video link along with quality
def Get_Url_Video_Quality_and_Filesize(getDataFormat, quality):
    for i in getDataFormat:
        if i["format_note"] == "360p":
            urlvideo = i["url"]
            filesize = i["filesize"]
            break
    return urlvideo, filesize


# get the video url to download along with rename
def Download_Video(urlvideo, filename, send_progress):
    path = "video"
    if not os.path.isdir(path):
        os.mkdir(path)

    try:
        urllib.request.urlretrieve(urlvideo, f'video\{filename}.mp4', send_progress)
    except ValueError:
        return False

    return True





