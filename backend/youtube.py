import youtube_dl
from urllib.parse import urlparse
import urllib.request
import os
import string
import re



# get the all detail of a video
def Get_Data_Details(url):
    ydl = youtube_dl.YoutubeDL({'outtmpl': '%(id)s.%(ext)s'})

    with ydl:
        result = ydl.extract_info(url,download=False )

    return result

# get list of video quality
def Get_Detail_Quality_Available(getDataFormat):
    def atoi(text):
        return int(text) if text.isdigit() else text

    def natural_keys(text):
        return [ atoi(c) for c in re.split('(\d+)',text) ]
        
    list_of_format = []
    for format in getDataFormat:
        list_of_format.append(format["format_note"])
    return sorted(list(set(list_of_format)), key=natural_keys)






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
        urllib.request.urlretrieve(urlvideo, f'video\{format_filename(filename)}.mp4', send_progress)
    except ValueError:
        return False

    return True


def format_filename(s):
    """Take a string and return a valid filename constructed from the string.
Uses a whitelist approach: any characters not present in valid_chars are
removed. Also spaces are replaced with underscores.
 
Note: this method may produce invalid filenames such as ``, `.` or `..`
When I use this method I prepend a date string like '2009_01_15_19_46_32_'
and append a file extension like '.txt', so I avoid the potential of using
an invalid filename.
 
"""
    valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    filename = ''.join(c for c in s if c in valid_chars)
    filename = filename.replace(' ','_') # I don't like spaces in filenames.
    return filename



