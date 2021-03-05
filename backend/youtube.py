import youtube_dl
from urllib.parse import urlparse
import urllib.request
import os

import re

"""
youtube_dl is used for get all details of a video
urllib.request.urlretrieve is used for download along with url and formats
"""


class youtube:
    def __init__(self, url, data=None):
        self.url = url
        self.data = data
        if data is None:
            ydl = youtube_dl.YoutubeDL({'outtmpl': '%(id)s.%(ext)s'})
            with ydl:
                self.data = ydl.extract_info(url, download=False) # get the all details from url and store in self.data

    def Get_Data_Details(self):
        """Get the all detail of a video 
        In the following :
        "title": title,
        "thumbnail": thumbnail,
        "list_Of_formats": list_Of_formats,
        "formats": formats,
        "filesize": filesize,
        "videourl": videourl
        """
        title = self.data["title"]
        thumbnail = self.data['thumbnail']
        formats = self.data["formats"]

        #  example : ['144p', '240p', '360p', '480p', '720p', 'tiny']
        list_Of_formats = self.Get_Detail_Quality_Available()

        videourl, filesize = self.Get_Url_Video_Quality_and_Filesize()

        return {
            "url": self.url,
            "title": title,
            "thumbnail": thumbnail,
            "list_Of_formats": list_Of_formats,
            "formats": formats,
            "filesize": filesize,
            "videourl": videourl,
            "downloadPercent": "",
        }

    def Get_Detail_Quality_Available(self):
        """get list of video quality
        return ['144p', '240p', '360p', '480p', '720p', 'tiny']"""
        def atoi(text):
            return int(text) if text.isdigit() else text

        def natural_keys(text):
            return [atoi(c) for c in re.split('(\d+)', text)]

        list_of_format = []
        for format in self.data["formats"]:
            list_of_format.append(format["format_note"])
        return sorted(list(set(list_of_format)), key=natural_keys)



    def Get_Url_Video_Quality_and_Filesize(self):
        """Get the video link along with quality"""
        for format in self.data["formats"]:
            if self.Get_Detail_Quality_Available()[0] == format["format_note"]:
                filesize = format["filesize"]
                videourl = format["url"]
                break

        return videourl, filesize







def Check_Url(url):
    """check url is vaild or not"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False
