import os
import requests
import subprocess

import eel

from .function import format_filename  
from .dbmanipulation import Update_savefile_In_Db


def Concatenate_Video_And_Audio(
        videopath,
        audiopath,
        finalpath,
        videocodec='copy',
        audiocodec='copy'):
    ffmpeg_command = ['ffmpeg.exe',  '-y', '-i', videopath, '-i', audiopath, 
        '-c:v', videocodec, '-c:a', audiocodec, finalpath]
    subprocess.call(ffmpeg_command)


def Download_Video(data):
    send_proceess = eel.Set_Download_Percent
    url =data['url']
    file_path = data['path']
    file_ext = '.mp4'
    file_name = format_filename(data['title']) + file_ext
    response = requests.get(data['urlvideo'], stream=True)
    if response.status_code == 200:
        videopath = start_download_video(
            url=url,
            filename=f'video.{data["ext"]}',
            urlvideo=data['urlvideo'],
            path=file_path,
            send_proceess=send_proceess
        )

        audiopath  = start_download_video(
            url=url,
            filename='audio.m4a',
            urlvideo=data['audiourl'],
            path=file_path,
            send_proceess=send_proceess
        )

        fullpath = os.path.sep.join([file_path, file_name])
        send_proceess({"text":"combining video and audio", "url": url,  "percent": 100 })
        Concatenate_Video_And_Audio(videopath, audiopath, fullpath)

        # save fullpath in db
        Update_savefile_In_Db(path=fullpath, url=url)
        
        # send fullpath to js lead to set savefile in Alldetails
        eel.Set_Savefile({"text": fullpath, "url": url })

        send_proceess({"text":"Successfull", "url": url,  "percent": 100 })

        try: 
            os.remove(audiopath)
            os.remove(videopath)
        except:
            pass
    else:
        send_proceess({"text":"This Url already expired please try add again", "url": url,  "percent": 100 })


def send_percentage(percent, media_type, url, send_proceess):
    description = "Downloding " + media_type + " " + str(percent) + "%"
    send_proceess({"text":description, "url": url, "percent": percent })


def start_download_video(path, filename, urlvideo, url, send_proceess, chunk=4096):
    fullpath = os.path.sep.join([path, filename])
    media = 'audio' if 'audio' in filename else 'video'
    media_file = open(fullpath, "wb")

    chunk_count = 0
    response = requests.get(urlvideo, stream=True)
    total_length = int(response.headers.get('content-length'))

    for data in response.iter_content(chunk_size=chunk):
        media_file.write(data)
        percent_fraction = (chunk_count * chunk) / total_length 
        percent= int(percent_fraction * 100)
        chunk_count += 1
        send_percentage(percent, media, url, send_proceess)

    media_file.close()
    send_proceess({"text":"Sucessfull", "url": url, "percent": 100})
    return  fullpath


