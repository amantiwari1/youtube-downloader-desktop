"""Main Python application file for the EEL-CRA demo."""
import os
import platform
import random
import sys
import youtube_dl
from urllib.parse import urlparse
import eel
import json
import time
import urllib.request

def is_url(url):
  try:
    result = urlparse(url)
    return all([result.scheme, result.netloc])
  except ValueError:
    return False

percent = None

def show_progress(block_num, block_size, total_size):
    video_size = total_size/block_size 
    percent = int((block_num / video_size) * 100)
    eel.say_hello_js(f"Downloding ... {percent} %") 




@eel.expose
def Downloader(url):
    if not is_url(url):
        return ["Wrong link" , ""]

    ydl = youtube_dl.YoutubeDL({'outtmpl': '%(id)s.%(ext)s'})
    with ydl:
        result = ydl.extract_info(url,download=False )
    if 'entries' in result:
        video = result['entries'][0]
    else:
        video = result

    video_title = video['title']
    thumbnail = video['thumbnail']

    for i in video["formats"]:
        if i["format_note"] == "360p":
            print(i["format_note"])
            urlvideo = i["url"]
            filesize = i["filesize"]
            break

    urllib.request.urlretrieve(urlvideo, f'{video_title}.mp4', show_progress) 
    
    eel.say_hello_js("Sucesssful 100%")
    
    return [video_title, thumbnail, f"Sucesssful 100% and Saved '{video_title}.mp4'"]


  




def start_eel(develop):
    """Start Eel with either production or development configuration."""

    if develop:
        directory = 'src'
        app = None
        page = {'port': 3000}
    else:
        directory = 'build'
        app = 'chrome'
        page = 'index.html'

    eel.init(directory, ['.tsx', '.ts', '.jsx', '.js', '.html'])



        

    eel_kwargs = dict(
        host='localhost',
        port=8080,
        size=(1280, 800),
    )
    try:
        eel.start(page, mode="chrome", **eel_kwargs)
    except EnvironmentError:
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
            eel.start(page, **eel_kwargs)
        else:
            raise


if __name__ == '__main__':
    import sys

    # Pass any second argument to enable debugging
    start_eel(develop=len(sys.argv) == 2)
