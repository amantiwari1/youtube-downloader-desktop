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
            try:
                ydl = youtube_dl.YoutubeDL({'outtmpl': '%(id)s.%(ext)s',})
                with ydl:
                    self.data = ydl.extract_info(url, download=False) # get the all details from url and store in self.data
            except:
                print("errorrrrrr")
                eel.isErrorDownload()
        
        out_file = open("myfile.json", "w")  
        json.dump(self.data, out_file, indent = 6)   
        out_file.close()

        self.maps = {}


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

        
        self.Get_Detail_Quality_Available()


        return {
            "url": self.url,
            "title": title,
            "thumbnail": thumbnail,
            "formats": formats,
            "downloadPercent": "",
            "videoquality": self.maps
        }
    
    

    def Get_Detail_Quality_Available(self):
        """get list of video quality
        return ['144p', '240p', '360p', '480p', '720p', 'tiny']"""
        

        for format in self.data["formats"]:
            format_note = format["format_note"] 

            if  not format_note  in self.maps:
                self.maps[format_note] = {
                    "format_note":format_note,
                    "Video_url":format["url"],
                    "filesize":format["filesize"]
                }
        

            




   





