import youtube_dl
import urllib.request
import os
from .function import natural_keys  
import json

"""
youtube_dl is used for get all details of a video
urllib.request.urlretrieve is used for download along with url and formats
"""


class youtube:
    def __init__(self, url, data=None):
        self.url = url
        self.data = data
        if data is None:
            ydl = youtube_dl.YoutubeDL({'outtmpl': '%(id)s.%(ext)s',})
            with ydl:
                # get the all details from url and store in self.data
                self.data = ydl.extract_info(url, download=False) 
        self.maps = {}
        self.subtitles = {}
        self.isPlaylist = 'entries' in self.data.keys()
        self.Raise_Error_If_Is_Invalid_Playlist()


    def Raise_Error_If_Is_Invalid_Playlist(self):
        if self.isPlaylist:
            if len(self.data['entries']) == 0:
                raise Exception(
                    'The playlist don\'t have videos or is wrong')


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
        self.Get_Detail_Quality_Available()

        return {
            "url": self.url,
            "title": title,
            "thumbnail": thumbnail, 
            "downloadPercent": "",
            "videoquality": self.maps
        }
    
    

    def Get_Detail_Quality_Available(self):
        """get list of video quality
        return ['144p', '240p', '360p', '480p', '720p', 'tiny']"""
        

        list_of_quality = ['144p60 HDR', '240p60 HDR', '360p60 HDR', '480p60 HDR', '720p60 HDR', '1080p60 HDR' , '1440p60' , '1440p60 HDR' , '2160p60' ,'2160p60 HDR']

        # for i in self.data['subtitles']:
        #     self.subtitles[isoLangs[i]] = data['subtitles'][i][4]['url']
            

        # for i in self.data['automatic_captions']:
        #     self.subtitles[isoLangs[i] + 'automatic caption'] = data['automatic_captions'][i][4]['url']


        for format in self.data["formats"]:
            format_note = format["format_note"]
            url = format["url"]
            filesize = format["filesize"]
            ext = format['ext']
            
            data = {
                "format_note":format_note,
                "Video_url":url,
                "filesize":filesize,
                'ext':ext
            }
                
            if format_note ==  'tiny' and ext == 'm4a':
                self.maps[format['ext']] = data
            elif ext == 'mp4':
                self.maps[format_note] = data
            elif format_note in list_of_quality:
                self.maps[format_note] = data


